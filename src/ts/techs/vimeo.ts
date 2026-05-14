import { BaseTech, type BaseTechConfig } from ".";
import type { Controller } from "../core/controller";
import type { CtlrMedia } from "../types/contract";
import type { REvent } from "sia-reactor";
import { createEl, createTimeRanges, enterFullscreen, exitFullscreen, isSameURL, loadResource, queryFullscreenEl, supportsFullscreen } from "../utils";
import { MATCH_URL_VIMEO } from "../utils/matcher";
import type Player from "@vimeo/player";

export class VimeoTech extends BaseTech<BaseTechConfig, HTMLElement> {
  public static readonly techName = "vimeo";
  protected vimeo: Player | null = null;
  protected vimeoReady = false;
  public static override canPlaySource(src: string): boolean {
    return MATCH_URL_VIMEO.test(src);
  }
  constructor(ctlr: Controller, config: BaseTechConfig) {
    // prettier-ignore
    super(ctlr, config, {
      // Engine Inputs
      volume: true, muted: true, playbackRate: true,
      // Modes
      fullscreen: supportsFullscreen(),
      // Attributes 
      autoplay: true, loop: true, playsInline: true, controls: true, crossOrigin: true,
      // Infos
      readyState: true, error: true, waiting: true, seeking: true, buffered: true, seekable: true,
      loadedMetadata: true, loadedData: true, canPlay: true, canPlayThrough: true
    });
  }
  // --- API Injection ---
  protected async initVimeo(url: string) {
    this.destroyVimeo(); // Vimeo prefers a fresh iframe for new URLs to ensure clean state
    if (!(window as any).Vimeo) await loadResource(window.TMG_VIMEO_API_SRC!, "script");
    if (this.signal.aborted) return; // src may have changed during the `await`
    return new Promise<void>(async (resolve) => {
      this.el.replaceWith((this.element = createEl("div", { className: "vimeo-placeholder" })));
      this.vimeo = new (window as any).Vimeo.Player(this.el, {
        url,
        autoplay: this.config.intent.autoplay,
        controls: this.config.intent.controls,
        loop: this.config.intent.loop,
        muted: this.config.intent.muted,
        playsinline: this.config.intent.playsInline,
        dnt: this.config.intent.crossOrigin === "use-credentials" ? false : true, // Do Not Track = Privacy Mode
        transparent: true,
      });
      await this.vimeo!.ready();
      this.el.replaceWith((this.element = this.el.querySelector("iframe")!)), this.el.classList.add(...this.config.element.classList); // Ensure we're controlling the iframe
      this.vimeoReady = true;
      resolve();
      (["loaded", "play", "pause", "ended", "timeupdate", "progress", "seeking", "seeked", "error", "bufferstart", "bufferend"] as const).forEach((evt) => this.vimeo!.on(evt, (data) => this.handleVimeoStateChange(evt, data))); // Bind all native Vimeo events directly to our router
    });
  }
  // ===========================================================================
  // WIRING (Connections Only)
  // ===========================================================================
  protected override wireSrc(): void {
    this.config.on("intent.src", this.handleSrcIntent, this.eOpts.REACTOR);
  }
  protected override wireCurrentTime(): void {
    this.config.on("intent.currentTime", this.handleCurrentTimeIntent, this.eOpts.REACTOR);
  }
  protected override wireDuration(): void {}
  protected override wirePaused(): void {
    this.config.on("intent.paused", this.handlePausedIntent, this.eOpts.REACTOR);
  }
  protected override wireEnded(): void {}

  protected wireVolume(): void {
    this.config.on("intent.volume", this.handleVolumeIntent, this.eOpts.REACTOR);
  }
  protected wireMuted(): void {
    this.config.on("intent.muted", this.handleMutedIntent, this.eOpts.REACTOR);
  }
  protected wirePlaybackRate(): void {
    this.config.on("intent.playbackRate", this.handlePlaybackRateIntent, this.eOpts.REACTOR);
  }
  protected wireFullscreen(): void {
    this.ctlr.state.watch("docInFullscreen", this.setFullscreenChangeState, this.eOpts.REACTOR);
    this.config.on("intent.fullscreen", this.handleFullscreenIntent, this.eOpts.REACTOR);
  }
  protected wireLoop(): void {
    this.config.on("intent.loop", this.handleLoopIntent, this.eOpts.REACTOR);
  }
  // ===========================================================================
  // HANDLERS (The Logic - Auto-Guarded by Controllable)
  // ===========================================================================
  // --- Core States ---
  protected setLoadStartInfo(): void {
    const { state: s, status: st } = this.config;
    st.readyState = 0; // HAVE NOTHING
    st.error = st.activeCue = null;
    st.waiting = true;
    st.ended = st.stalled = st.loadedData = st.loadedMetadata = st.canPlay = st.canPlayThrough = false;
    st.buffered = createTimeRanges([]);
    st.seekable = createTimeRanges([]);
    st.duration = NaN;
    s.paused = true;
  }
  // --- Core Intents ---
  protected handleSrcIntent = (e: REvent<CtlrMedia, "intent.src">): void => {
    if (e.resolved || isSameURL(this.config.state.src, e.value)) return;
    this.setLoadStartInfo();
    this.initVimeo(e.value ?? "").catch((err) => this.ctlr.log(err, "error"));
    this.config.state.src = e.value ?? "";
    e.resolve(VimeoTech.techName);
  };
  protected handleCurrentTimeIntent = (e: REvent<CtlrMedia, "intent.currentTime">): void => {
    if (e.resolved || !this.vimeoReady) return void (!this.vimeoReady && e.reject("Vimeo unavailable"));
    this.vimeo!.setCurrentTime(e.value).catch((err) => this.ctlr.log(err, "error"));
    e.resolve(VimeoTech.techName);
  };
  protected handlePausedIntent = (e: REvent<CtlrMedia, "intent.paused">): void => {
    if (e.resolved || !this.vimeoReady) return void (!this.vimeoReady && e.reject("Vimeo unavailable"));
    (e.value ? this.vimeo!.pause() : this.vimeo!.play()).catch((err) => this.ctlr.log(err, "error"));
    e.resolve(VimeoTech.techName);
  };
  // --- Feature States ---
  protected setFullscreenChangeState = (docInFs?: boolean): void => {
    this.config.state.fullscreen = docInFs ? queryFullscreenEl() === this.element : false;
  };
  // --- Feature Intents ---
  protected handleVolumeIntent = (e: REvent<CtlrMedia, "intent.volume">): void => {
    if (e.resolved || !this.vimeoReady) return void (!this.vimeoReady && e.reject("Vimeo unavailable"));
    this.vimeo!.setVolume(e.value / 100).catch((err) => this.ctlr.log(err, "error"));
    this.config.state.volume = e.value;
    e.resolve(VimeoTech.techName);
  };
  protected handleMutedIntent = (e: REvent<CtlrMedia, "intent.muted">): void => {
    if (e.resolved || !this.vimeoReady) return void (!this.vimeoReady && e.reject("Vimeo unavailable"));
    this.vimeo!.setMuted(e.value).catch((err) => this.ctlr.log(err, "error"));
    this.config.state.muted = e.value;
    e.resolve(VimeoTech.techName);
  };
  protected handlePlaybackRateIntent = (e: REvent<CtlrMedia, "intent.playbackRate">): void => {
    if (e.resolved || !this.vimeoReady) return void (!this.vimeoReady && e.reject("Vimeo unavailable"));
    this.vimeo!.setPlaybackRate(e.value).catch((err) => this.ctlr.log(err, "error"));
    this.config.state.playbackRate = e.value;
    e.resolve(VimeoTech.techName);
  };
  protected handleFullscreenIntent = (e: REvent<CtlrMedia, "intent.fullscreen">): void => {
    if (e.resolved) return;
    (e.value ? enterFullscreen(this.element) : exitFullscreen(this.element))?.catch((err) => this.ctlr.log(err, "error"));
    e.resolve(VimeoTech.techName);
  };
  protected handleLoopIntent = (e: REvent<CtlrMedia, "intent.loop">): void => {
    if (e.resolved || !this.vimeoReady) return void (!this.vimeoReady && e.reject("Vimeo unavailable"));
    this.vimeo!.setLoop(e.value).catch((err) => this.ctlr.log(err, "error"));
    this.config.state.loop = e.value;
    e.resolve(VimeoTech.techName);
  };
  // --- API Logic ---
  protected handleVimeoStateChange(evt: string, data: any): void {
    const { state: s, status: st } = this.config;
    switch (evt) {
      case "loaded":
        st.readyState = 1; // HAVE_METADATA
        st.duration = data.duration;
        st.seekable = createTimeRanges([[0, data.duration]]);
        st.loadedMetadata = true;
        break;
      case "play":
        s.paused = st.ended = false;
        st.readyState = 4; // HAVE_ENOUGH_DATA
        st.canPlay = st.canPlayThrough = st.loadedData = true;
        st.waiting = false;
        break;
      case "pause":
        return void (s.paused = true);
      case "ended":
        return void (s.paused = st.ended = true);
      case "timeupdate":
        return void (s.currentTime = data.seconds);
      case "progress":
        return void (st.buffered = createTimeRanges([[0, data.percent * st.duration]]));
      case "seeking":
        return void (st.seeking = true);
      case "seeked":
        return void (st.seeking = false);
      case "bufferstart":
        st.waiting = true;
        st.readyState = 2; // HAVE_CURRENT_DATA
        break;
      case "bufferend":
        st.waiting = false;
        st.readyState = 4; // HAVE_ENOUGH_DATA
        break;
      case "error":
        st.waiting = false;
        st.error = { code: 4, message: data.message || "Vimeo API Error" } as MediaError;
        break;
    }
  }
  // --- Lifecycle ---
  protected destroyVimeo(): void {
    if (!this.vimeo) return;
    this.vimeo.destroy(), (this.vimeo = null);
    this.vimeoReady = false;
  }
  protected override onDestroy(): void {
    this.destroyVimeo(), super.onDestroy();
  }
}
