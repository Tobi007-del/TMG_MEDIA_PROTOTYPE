import { BaseTech, type BaseTechConfig } from ".";
import type { Controller } from "../core/controller";
import type { CtlrMedia } from "../types/contract";
import type { REvent } from "sia-reactor";
import { createEl, isSameURL, loadResource } from "../utils";

export class YouTubeTech extends BaseTech<BaseTechConfig, HTMLElement> {
  public static readonly techName = "youtube";
  private ytPlayer: any = null;
  private ytReady = false;
  private readonly rafKey: string;

  public static override canPlaySource(src: string): boolean {
    // Matches youtube.com/watch?v=ID, youtu.be/ID, and youtube.com/embed/ID
    return /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i.test(src);
  }

  constructor(ctlr: Controller, config: BaseTechConfig) {
    super(ctlr, config);
    // Tell BaseTech to automatically wire these features
    this.features.volume = true;
    this.features.muted = true;
    this.features.playbackRate = true;

    this.rafKey = `yt-time-${this.ctlr.id}`;
    // Create a temporary container. The YT API will replace this with an <iframe>
    this.element = createEl("div", { className: "tmg-youtube-container" });
  }

  // ===========================================================================
  // WIRING OVERRIDES (The Core 5)
  // ===========================================================================

  protected override wireSrc() {
    this.config.on("intent.src", this.handleSrcIntent, { signal: this.signal });
  }

  protected override wireCurrentTime() {
    this.config.on(
      "intent.currentTime",
      (e: REvent<CtlrMedia, "intent.currentTime">) => {
        if (e.resolved || !this.ytReady) return;
        this.ytPlayer.seekTo(e.value, true);
        e.resolve(YouTubeTech.techName);
      },
      { signal: this.signal }
    );
  }

  protected override wireDuration() {
    // Duration is polled inside syncTime() and handleYTStateChange since YT doesn't emit a specific event
  }

  protected override wirePaused() {
    this.config.on(
      "intent.paused",
      (e: REvent<CtlrMedia, "intent.paused">) => {
        if (e.resolved || !this.ytReady) return;
        e.value ? this.ytPlayer.pauseVideo() : this.ytPlayer.playVideo();
        e.resolve(YouTubeTech.techName);
      },
      { signal: this.signal }
    );
  }

  protected override wireEnded() {
    // Handled natively inside handleYTStateChange (State 0)
  }

  // ===========================================================================
  // FEATURE WIRING
  // ===========================================================================

  protected wireVolume() {
    this.config.on(
      "intent.volume",
      (e: REvent<CtlrMedia, "intent.volume">) => {
        if (e.resolved || !this.ytReady) return;
        this.ytPlayer.setVolume(e.value);
        this.config.state.volume = e.value;
        e.resolve(YouTubeTech.techName);
      },
      { signal: this.signal }
    );
  }

  protected wireMuted() {
    this.config.on(
      "intent.muted",
      (e: REvent<CtlrMedia, "intent.muted">) => {
        if (e.resolved || !this.ytReady) return;
        e.value ? this.ytPlayer.mute() : this.ytPlayer.unMute();
        this.config.state.muted = e.value;
        e.resolve(YouTubeTech.techName);
      },
      { signal: this.signal }
    );
  }

  protected wirePlaybackRate() {
    this.config.on(
      "intent.playbackRate",
      (e: REvent<CtlrMedia, "intent.playbackRate">) => {
        if (e.resolved || !this.ytReady) return;
        this.ytPlayer.setPlaybackRate(e.value);
        this.config.state.playbackRate = e.value;
        e.resolve(YouTubeTech.techName);
      },
      { signal: this.signal }
    );
  }

  // ===========================================================================
  // HANDLERS & LOGIC
  // ===========================================================================

  private extractVideoId(url: string) {
    return url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)?.[1];
  }

  protected handleSrcIntent = async (e: REvent<CtlrMedia, "intent.src">) => {
    if (e.resolved || isSameURL(this.config.state.src, e.value)) return;
    const src = e.value ?? "";
    const vidId = this.extractVideoId(src);
    if (!vidId) return;

    this.config.status.waiting = true;
    await this.initYT(vidId);

    this.config.state.src = src;
    e.resolve(YouTubeTech.techName);
  };

  private async initYT(videoId: string) {
    if (this.ytPlayer) {
      this.ytPlayer.loadVideoById(videoId);
      return;
    }

    // Ensure the API is loaded and the global Promise wrapper resolves
    if (!(window as any).YT) {
      await loadResource(window.TMG_YT_API_SRC || "https://www.youtube.com/iframe_api", "script");
      await new Promise<void>((res) => {
        if ((window as any).YT?.Player) return res();
        const prev = (window as any).onYouTubeIframeAPIReady;
        (window as any).onYouTubeIframeAPIReady = () => {
          prev?.();
          res();
        };
      });
    }

    return new Promise<void>((resolve) => {
      this.ytPlayer = new (window as any).YT.Player(this.element, {
        videoId,
        playerVars: {
          autoplay: this.config.state.autoplay ? 1 : 0,
          controls: this.config.state.controls ? 1 : 0,
          playsinline: this.config.state.playsInline ? 1 : 0,
          rel: 0,
          modestbranding: 1,
          disablekb: 1, // Let your TVP hooks handle keyboard shortcuts
          fs: 0, // Let your TVP handle fullscreen
        },
        events: {
          onReady: () => {
            this.ytReady = true;
            // CRITICAL: The YT API replaces the <div> with an <iframe>.
            // We must update our internal ref so BaseTech.unmount() cleans up the correct element!
            this.element = this.ytPlayer.getIframe();
            this.syncStaticState();
            resolve();
          },
          onStateChange: (e: any) => this.handleYTStateChange(e),
        },
      });
    });
  }

  private handleYTStateChange(e: any) {
    const { state, status } = this.config;
    const YTState = (window as any).YT.PlayerState;

    status.waiting = e.data === YTState.BUFFERING;

    switch (e.data) {
      case YTState.UNSTARTED:
        break;
      case YTState.ENDED:
        state.paused = status.ended = true;
        this.ctlr.cancelRAFLoop(this.rafKey);
        this.syncTime(); // Final flush
        break;
      case YTState.PLAYING:
        state.paused = status.ended = false;
        status.canPlay = status.loadedMetadata = status.canPlayThrough = true;
        status.duration = this.ytPlayer.getDuration();
        this.syncTime();
        this.ctlr.RAFLoop(this.rafKey, this.syncTime); // Start the 60fps playhead sync
        break;
      case YTState.PAUSED:
        state.paused = true;
        this.ctlr.cancelRAFLoop(this.rafKey);
        this.syncTime();
        break;
    }
  }

  private syncTime = () => {
    if (!this.ytReady) return;
    this.config.state.currentTime = this.ytPlayer.getCurrentTime();
    this.config.status.duration = this.ytPlayer.getDuration() || 0; // Backup sync
  };

  private syncStaticState() {
    if (!this.ytReady) return;
    this.config.state.volume = this.ytPlayer.getVolume();
    this.config.state.muted = this.ytPlayer.isMuted();
    this.config.state.playbackRate = this.ytPlayer.getPlaybackRate();
    this.config.status.duration = this.ytPlayer.getDuration();
  }

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================

  protected override onDestroy() {
    this.ctlr.cancelRAFLoop(this.rafKey);
    if (this.ytPlayer) this.ytPlayer.destroy();
    super.onDestroy();
  }
}
