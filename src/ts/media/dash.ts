import { HTML5Tech } from "./html5";
import type { Controller } from "../core/controller";
import type { BaseTechConfig } from ".";
import type { CtlrMedia } from "../types/contract";
import type { REvent } from "sia-reactor";
import { isSameURL, loadResource } from "../utils";

export class DashTech extends HTML5Tech {
  public static readonly techName = "dash";
  private dash: any = null; // Typed as any to keep dash.js an optional runtime dependency

  public static override canPlaySource(src: string): boolean {
    // Check for standard DASH manifest extensions
    return /\.mpd/i.test(src?.split("?")[0] || "");
  }

  constructor(ctlr: Controller, config: BaseTechConfig) {
    super(ctlr, config);
    // Auto-wire ABR and Quality level controls via BaseTech
    this.features.levels = true;
    this.features.autoLevel = true;
  }

  // ===========================================================================
  // WIRING OVERRIDES
  // ===========================================================================

  protected override wireSrc() {
    this.el.addEventListener("loadstart", this.setLoadStartState, this.eOpts.EL);
    this.config.on("intent.src", this.handleSrcIntent, this.eOpts.REACTOR);
  }

  protected override wireCurrentAudioTrack() {
    this.config.on(
      "intent.currentAudioTrack",
      (e: REvent<CtlrMedia, "intent.currentAudioTrack">) => {
        if (e.resolved) return;
        if (this.dash) {
          const audioTracks = this.dash.getTracksFor("audio");
          const track = audioTracks[e.value as number];
          if (track) this.dash.setCurrentTrack(track);
          e.resolve(DashTech.techName);
        } else {
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

    await this.initDash(src);
    e.resolve(DashTech.techName);
  };

  private async initDash(src: string) {
    this.destroyDash();

    // Dynamically load dash.js if it's not on the window
    const dashjs = window.dashjs || (await loadResource(window.TMG_DASH_JS_SRC || "https://cdn.dashjs.org/latest/dash.all.min.js", "script"), window.dashjs);

    if (!dashjs || !dashjs.supportsMediaSource()) {
      return this.ctlr.log("DASH is not supported in this browser", "error");
    }

    this.dash = dashjs.MediaPlayer().create();

    // Bind Dash.js events to TVP Reactive State
    this.dash.on(dashjs.MediaPlayer.events.STREAM_INITIALIZED, () => {
      // Hydrate Quality Levels (Bitrates)
      const bitrates = this.dash.getBitrateInfoListFor("video");
      this.config.status.levels = bitrates;

      // Hydrate Audio Tracks
      const audioTracks = this.dash.getTracksFor("audio");
      if (audioTracks?.length) this.config.status.audioTracks = audioTracks;

      // Initial ABR State
      const settings = this.dash.getSettings();
      this.config.state.autoLevel = settings.streaming.abr.autoSwitchBitrate.video;
    });

    this.dash.on(dashjs.MediaPlayer.events.QUALITY_CHANGE_RENDERED, (ev: any) => {
      if (ev.mediaType === "video") {
        this.config.state.currentLevel = ev.newQuality;
      }
    });

    this.dash.on(dashjs.MediaPlayer.events.ERROR, (ev: any) => {
      if (ev.error === "download") {
        this.ctlr.log(`DASH Download Error: ${ev.event?.url}`, "warn");
      }
    });

    // Initialize playback!
    // We pass null for autoplay so Dash doesn't fight our internal state.autoplay logic
    this.dash.initialize(this.el, src, null);
  }

  protected handleLevelIntent(e: REvent<CtlrMedia, "intent.currentLevel">) {
    if (e.resolved || !this.dash) return;

    // 1. Turn off Auto Switch (ABR)
    this.dash.updateSettings({ streaming: { abr: { autoSwitchBitrate: { video: false } } } });
    this.config.state.autoLevel = false;

    // 2. Hard-set the quality level index
    this.dash.setQualityFor("video", e.value as number);

    e.resolve(DashTech.techName);
  }

  protected handleAutoLevelIntent(e: REvent<CtlrMedia, "intent.autoLevel">) {
    if (e.resolved || !this.dash) return;

    if (e.value) {
      // Re-enable ABR for video
      this.dash.updateSettings({ streaming: { abr: { autoSwitchBitrate: { video: true } } } });
      this.config.state.autoLevel = true;
    }

    e.resolve(DashTech.techName);
  }

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================

  private destroyDash() {
    if (this.dash) {
      this.dash.reset();
      this.dash = null;
    }
  }

  protected override onDestroy() {
    this.destroyDash();
    super.onDestroy(); // Wipes native HTML5 listeners
  }
}
