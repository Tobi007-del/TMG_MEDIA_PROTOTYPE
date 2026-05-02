import { HTML5Tech } from "./html5";
import type { Controller } from "../core/controller";
import type { BaseTechConfig } from ".";
import type { CtlrMedia } from "../types/contract";
import type { REvent } from "sia-reactor";
import { isSameURL, loadResource } from "../utils";

export class HLSTech extends HTML5Tech {
  public static readonly techName = "hls";
  private hls: any = null; // Typing as any to avoid forcing 'hls.js' as a hard dependency in your core

  public static override canPlaySource(src: string): boolean {
    // Strips query parameters before checking the extension
    return /\.m3u8/i.test(src?.split("?")[0] || "");
  }

  constructor(ctlr: Controller, config: BaseTechConfig) {
    super(ctlr, config);
    // Tell BaseTech to automatically run wireLevels() and wireAutoLevel() during setup
    this.features.levels = true;
    this.features.autoLevel = true;
  }

  // ===========================================================================
  // WIRING OVERRIDES
  // ===========================================================================

  protected override wireSrc() {
    // Keep the native loadstart listener from HTML5Tech so buffers/states still wipe clean
    this.el.addEventListener("loadstart", this.setLoadStartState, this.eOpts.EL);
    // Intercept intent to route through HLS.js instead of native <video src="...">
    this.config.on("intent.src", this.handleSrcIntent, this.eOpts.REACTOR);
  }

  protected override wireCurrentAudioTrack() {
    // Hls.js completely overrides audio tracks, so we must intercept it before HTML5Tech does
    this.config.on(
      "intent.currentAudioTrack",
      (e: REvent<CtlrMedia, "intent.currentAudioTrack">) => {
        if (e.resolved) return;

        if (this.hls) {
          this.hls.audioTrack = e.value as number;
          e.resolve(HLSTech.techName);
        } else {
          // Fallback to HTML5 native if running on native Safari HLS
          super.handleCurrentTrackIntent(e as any, "Audio");
        }
      },
      this.eOpts.REACTOR
    );
  }

  protected wireLevels() {
    this.config.on("intent.currentLevel", this.handleLevelIntent, this.eOpts.REACTOR);
  }

  protected wireAutoLevel() {
    this.config.on("intent.autoLevel", this.handleAutoLevelIntent, this.eOpts.REACTOR);
  }

  // ===========================================================================
  // HANDLERS
  // ===========================================================================

  protected override handleSrcIntent = async (e: REvent<CtlrMedia, "intent.src">) => {
    if (e.resolved || isSameURL(this.config.state.src, e.value)) return;
    const src = e.value ?? "";

    // The Apple Edge-Case: Fallback to native HTML5 if the browser natively supports HLS (Safari)
    if (this.el.canPlayType("application/vnd.apple.mpegurl")) {
      this.destroyHls();
      this.el.src = src;
      this.el.load();
      return e.resolve(HLSTech.techName);
    }

    // Otherwise, boot the HLS.js engine
    await this.initHls(src);
    e.resolve(HLSTech.techName);
  };

  private async initHls(src: string) {
    this.destroyHls();

    // Dynamically load HLS.js if it isn't already globally available
    const Hls = window.Hls || (await loadResource(window.TMG_HLS_JS_SRC || "https://cdn.jsdelivr.net/npm/hls.js@1", "script"), window.Hls);

    if (!Hls || !Hls.isSupported()) return this.ctlr.log("HLS is not supported in this browser", "error");

    this.hls = new Hls({ autoStartLoad: true, startPosition: -1 });
    this.hls.attachMedia(this.el);

    this.hls.on(Hls.Events.MEDIA_ATTACHED, () => this.hls.loadSource(src));

    this.hls.on(Hls.Events.MANIFEST_PARSED, (ev: any, data: any) => {
      // Hydrate the reactive state with the stream's qualities and tracks
      this.config.status.levels = data.levels;
      this.config.state.autoLevel = this.hls.autoLevelEnabled;
      this.config.state.currentLevel = this.hls.currentLevel;

      if (data.audioTracks?.length) this.config.status.audioTracks = data.audioTracks;
    });

    this.hls.on(Hls.Events.LEVEL_SWITCHED, (ev: any, data: any) => {
      this.config.state.currentLevel = data.level;
    });

    this.hls.on(Hls.Events.AUDIO_TRACK_SWITCHED, (ev: any, data: any) => {
      this.config.state.currentAudioTrack = data.id;
    });

    this.hls.on(Hls.Events.ERROR, (ev: any, data: any) => {
      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            return this.hls.startLoad();
          case Hls.ErrorTypes.MEDIA_ERROR:
            return this.hls.recoverMediaError();
          default:
            this.destroyHls();
        }
      }
    });
  }

  protected handleLevelIntent(e: REvent<CtlrMedia, "intent.currentLevel">) {
    if (e.resolved || !this.hls) return;
    this.hls.currentLevel = e.value as number;
    this.config.state.autoLevel = false; // Hard-setting a manual level disables the ABR algorithm
    e.resolve(HLSTech.techName);
  }

  protected handleAutoLevelIntent(e: REvent<CtlrMedia, "intent.autoLevel">) {
    if (e.resolved || !this.hls) return;
    if (e.value) {
      this.hls.currentLevel = -1; // -1 returns control to the HLS.js ABR engine
      this.config.state.autoLevel = true;
    }
    e.resolve(HLSTech.techName);
  }

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================

  private destroyHls() {
    if (this.hls) {
      this.hls.destroy();
      this.hls = null;
    }
  }

  protected override onDestroy() {
    this.destroyHls();
    super.onDestroy(); // Teardown all the HTML5 native listeners
  }
}
