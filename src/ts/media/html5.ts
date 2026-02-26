import { BaseTech, BaseTechConfig } from ".";
import type { Event, ListenerOptions } from "../types/reactor";
import type { Controller } from "../core/controller";
import type { CMedia, MediaIntent, MediaFeatures } from "../types/contract";
import type { WCPaths } from "../types/obj";
import { type TrackType, createEl, enterFullscreen, exitFullscreen, getSources, getTracks, isSameURL, queryFullscreenEl, supportsFullscreen, supportsPictureInPicture, observeMutation, removeSources, addSources, isSameSources, isSameTracks, removeTracks, addTracks, getTrackIdx, setCurrentTrack } from "../utils";

export class HTML5Tech extends BaseTech<BaseTechConfig, HTMLVideoElement> {
  public static readonly techName: string = "html5";
  // prettier-ignore
  public static readonly features: MediaFeatures = {
    // Kinda Core
    volume: HTML5Tech.canControlVolume(),
    muted: HTML5Tech.canMuteVolume(),
    playbackRate: HTML5Tech.canControlRate(),
    // Modes
    pictureInPicture: supportsPictureInPicture(),
    fullscreen: supportsFullscreen(),
    // Attributes
    poster: true, autoplay: true, loop: true, playsInline: true,
    crossOrigin: true, controls: true, controlsList: true,
    disablePictureInPicture: true, preload: true,
    // Lists
    textTracks: HTML5Tech.supportsTextTracks(),
    videoTracks: HTML5Tech.supportsVideoTracks(),
    audioTracks: HTML5Tech.supportsAudioTracks(),
    activeCue: HTML5Tech.supportsTextTracks(),
    // Infos
    readyState: true, networkState: true, error: true, waiting: true,
    stalled: true, seeking: true, buffered: true, seekable: true,
    videoWidth: true, videoHeight: true, loadedMetadata: true,
    canPlay: true, canPlayThrough: true,
    // Settings
    defaultMuted: true, defaultPlaybackRate: true,
  };
  private static readonly DUMMY = createEl("video");
  protected readonly eOpts: { EL: AddEventListenerOptions; REACTOR: ListenerOptions };
  static canPlaySource(src: string): boolean {
    return true;
  }
  constructor(ctlr: Controller, config: BaseTechConfig) {
    super(ctlr, config);
    this.eOpts = { EL: { signal: this.signal }, REACTOR: { capture: true, signal: this.signal, immediate: this.ctlr.payload.initialized } }; // Cached Event Options
  }
  // ===========================================================================
  // WIRING (Connections Only)
  // ===========================================================================
  // --- Core Wiring ---
  protected wireSrc() {
    this.el.addEventListener("loadstart", this.handleLoadStartState, this.eOpts.EL);
    this.config.on("intent.src", this.handleSrcIntent, this.eOpts.REACTOR);
  }
  protected wireCurrentTime() {
    this.el.addEventListener("timeupdate", this.handleTimeUpdateState, this.eOpts.EL);
    this.el.addEventListener("seeking", this.handleSeekingState, this.eOpts.EL);
    this.el.addEventListener("seeked", this.handleSeekedState, this.eOpts.EL);
    this.config.on("intent.currentTime", this.handleCurrentTimeIntent, this.eOpts.REACTOR);
  }
  protected wireDuration() {
    this.el.addEventListener("durationchange", this.handleDurationChangeState, this.eOpts.EL);
  }
  protected wirePaused() {
    this.el.addEventListener("play", this.handlePlayState, this.eOpts.EL);
    this.el.addEventListener("pause", this.handlePauseState, this.eOpts.EL);
    this.config.on("intent.paused", this.handlePausedIntent, this.eOpts.REACTOR);
  }
  protected wireEnded() {
    this.el.addEventListener("ended", this.handleEndedState, this.eOpts.EL);
  }
  // --- Features Wiring ---
  protected override wireFeatures() {
    super.wireFeatures(); // Calls individual feature wires (volume, etc.) above
    this.wireHTMLState(); // Attributes Reverse-Sync (Mutation Observer)
    // Status (Bulk wiring)
    const loadEvents = ["loadstart", "progress", "suspend", "abort", "emptied", "stalled"];
    loadEvents.forEach((e) => this.el.addEventListener(e, this.handleLoadStatus, this.eOpts.REACTOR));
    this.el.addEventListener("error", this.handleErrorStatus, this.eOpts.REACTOR);
    this.el.addEventListener("waiting", this.handleWaitingStatus, this.eOpts.REACTOR);
    this.el.addEventListener("playing", this.handlePlayingStatus, this.eOpts.REACTOR);
    this.el.addEventListener("stalled", this.handleStalledStatus, this.eOpts.REACTOR);
    this.el.addEventListener("loadedmetadata", this.handleLoadedMetadataStatus, this.eOpts.REACTOR);
    this.el.addEventListener("loadeddata", this.handleLoadedDataStatus, this.eOpts.REACTOR);
    this.el.addEventListener("canplay", this.handleCanPlayStatus, this.eOpts.REACTOR);
    this.el.addEventListener("canplaythrough", this.handleCanPlayThroughStatus, this.eOpts.REACTOR);
    // Tracks
    this.features.textTracks && this.wireTracksStatus("textTracks");
    this.features.videoTracks && this.wireTracksStatus("videoTracks");
    this.features.audioTracks && this.wireTracksStatus("audioTracks");
    this.features.activeCue && this.wireActiveCueStatus?.();
  }
  // --- Engine Inputs Wiring ---
  protected wireVolume() {
    this.el.addEventListener("volumechange", this.handleVolumeChangeState, this.eOpts.EL);
    this.config.on("intent.volume", this.handleVolumeIntent, this.eOpts.REACTOR);
  }
  protected wireMuted() {
    // Native 'volumechange' handles state update
    this.config.on("intent.muted", this.handleMutedIntent, this.eOpts.REACTOR);
  }
  protected wirePlaybackRate() {
    this.el.addEventListener("ratechange", this.handleRateChangeState, this.eOpts.EL);
    this.config.on("intent.playbackRate", this.handlePlaybackRateIntent, this.eOpts.REACTOR);
  }
  // --- Presentation Modes Wiring ---
  protected wirePictureInPicture() {
    this.el.addEventListener("enterpictureinpicture", this.handleEnterPiPState, this.eOpts.EL);
    this.el.addEventListener("leavepictureinpicture", this.handleLeavePiPState, this.eOpts.EL);
    this.config.on("intent.pictureInPicture", this.handlePiPIntent, this.eOpts.REACTOR);
  }
  protected wireFullscreen() {
    this.ctlr.state.watch("docInFullscreen", this.handleFullscreenChangeState, this.eOpts.REACTOR);
    this.el.addEventListener("webkitbeginfullscreen", this.handleWebkitBeginFullscreenState, this.eOpts.REACTOR);
    this.el.addEventListener("webkitendfullscreen", this.handleWebkitEndFullscreenState, this.eOpts.REACTOR);
    this.config.on("intent.fullscreen", this.handleFullscreenIntent, this.eOpts.REACTOR);
  }
  // --- Track Switching Wiring ---
  protected wireCurrentTrack(type: TrackType) {
    this.config.set(`intent.current${type}Track`, (term) => getTrackIdx(this.el, type, term), { signal: this.signal }); // pass `any` term, the track will surely be found if available
    const list = (this.el as any)[`${type.toLowerCase()}Tracks`];
    list?.addEventListener("change", () => this.handleCurrentTrackState(type, list), this.eOpts.REACTOR);
    this.config.on(`intent.current${type}Track`, (e: Event<CMedia, `intent.current${typeof type}Track`>) => this.handleCurrentTrackIntent(e, type), this.eOpts.REACTOR);
  }
  protected wireCurrentAudioTrack() {
    this.wireCurrentTrack("Audio");
  }
  protected wireCurrentVideoTrack() {
    this.wireCurrentTrack("Video");
  }
  protected wireCurrentTextTrack() {
    this.wireCurrentTrack("Text");
  }
  // --- HTML (Bulk Wiring) ---
  protected wireHTMLState() {
    this.signal.addEventListener("abort", observeMutation(this.el, this.handleHTMLState, { attributes: true, childList: true, subtree: false }), { once: true });
  }
  // --- Attribute Wiring ---
  protected bindAttr<K extends keyof MediaIntent>(key: K, isBool = false) {
    this.config.on(`intent.${key}`, (e: Event<CMedia, `intent.${K}`>) => this.handleAttributeIntent(e, key, isBool), this.eOpts.REACTOR);
  }
  protected wirePoster() {
    this.bindAttr("poster");
  }
  protected wireAutoplay() {
    this.bindAttr("autoplay", true);
  }
  protected wireLoop() {
    this.bindAttr("loop", true);
  }
  protected wirePreload() {
    this.bindAttr("preload");
  }
  protected wirePlaysInline() {
    this.bindAttr("playsInline", true);
  }
  protected wireCrossOrigin() {
    this.bindAttr("crossOrigin");
  }
  protected wireControls() {
    this.bindAttr("controls", true);
  }
  protected wireControlsList() {
    this.bindAttr("controlsList");
  }
  protected wireDisablePictureInPicture() {
    this.bindAttr("disablePictureInPicture", true);
  }
  // --- Lists Wiring ---
  protected wireSources() {
    this.config.on("intent.sources", this.handleSourcesIntent, this.eOpts.REACTOR);
  }
  protected wireTracks() {
    this.config.on("intent.tracks", this.handleTracksIntent, this.eOpts.REACTOR);
  }
  // --- Status Tracks Wiring ---
  protected wireTracksStatus(type: "textTracks" | "videoTracks" | "audioTracks") {
    const list = (this.el as any)[type];
    list && ["addtrack", "removetrack"].forEach((e) => list.addEventListener(e, () => this.handleTracksStatus(type, list), this.eOpts.REACTOR));
  }
  // --- Active Cue Wiring ---
  protected wireActiveCueStatus() {
    this.config.on(
      "state.currentTextTrack",
      ({ value: curr, oldValue: prev }: Event<CMedia, "state.currentTextTrack">) => {
        if (prev !== -1) this.el.textTracks[prev!]?.removeEventListener("cuechange", this.handleActiveCueStatus, this.eOpts.EL);
        this.el.textTracks[curr!]?.addEventListener("cuechange", this.handleActiveCueStatus, this.eOpts.EL);
        this.handleActiveCueStatus({ target: this.el.textTracks[curr!] });
      },
      this.eOpts.REACTOR
    );
  }
  // --- Settings Wiring ---
  protected wireDefaultMuted() {
    this.config.on("settings.defaultMuted", this.handleDefaultMutedSetting, this.eOpts.REACTOR);
  }
  protected wireDefaultPlaybackRate() {
    this.config.on("settings.defaultPlaybackRate", this.handleDefaultPlaybackRateSetting, this.eOpts.REACTOR);
  }
  // ===========================================================================
  // HANDLERS (The Logic - Auto-Guarded by Controllable)
  // ===========================================================================
  // --- Core States ---
  protected handleLoadStartState() {
    const { state: s, status: st } = this.config;
    st.error = st.activeCue = null;
    st.waiting = true;
    st.ended = st.stalled = st.loadedData = st.loadedMetadata = st.canPlay = st.canPlayThrough = false;
    st.duration = NaN;
    st.buffered = this.el.buffered;
    st.seekable = this.el.seekable;
    if (!isSameURL(this.el.src, s.src)) s.src = this.el.src;
    this.config.state.paused = this.el.paused;
  }
  protected handleTimeUpdateState() {
    this.config.state.currentTime = this.el.currentTime;
  }
  protected handleSeekingState() {
    this.config.status.seeking = true;
  }
  protected handleSeekedState() {
    this.config.status.seeking = false;
  }
  protected handleDurationChangeState() {
    this.config.status.duration = this.el.duration;
  }
  protected handlePlayState() {
    this.config.state.paused = false;
  }
  protected handlePauseState() {
    this.config.state.paused = true;
  }
  protected handleEndedState() {
    this.config.status.ended = this.config.state.paused = true;
  }
  // --- Core Intents ---
  protected handleSrcIntent(e: Event<CMedia, "intent.src">) {
    if (e.resolved || isSameURL(this.el.src, e.value)) return;
    this.el.src = e.value ?? "";
    this.el.load();
    e.resolve(HTML5Tech.techName);
  }
  protected handleCurrentTimeIntent(e: Event<CMedia, "intent.currentTime">) {
    if (e.resolved) return;
    this.el.currentTime = e.value!;
    e.resolve(HTML5Tech.techName);
  }
  protected handlePausedIntent(e: Event<CMedia, "intent.paused">) {
    if (e.resolved) return;
    const p = e.value ? this.el.pause() : this.el.play();
    if (p?.then) p.then(() => e.resolve(HTML5Tech.techName)).catch((err: any) => e.reject(err.message));
    else e.resolve(HTML5Tech.techName);
  }
  // --- Feature States ---
  protected handleVolumeChangeState() {
    this.config.state.volume = this.el.volume;
    this.config.state.muted = this.el.muted;
  }
  protected handleRateChangeState() {
    this.config.state.playbackRate = this.el.playbackRate;
  }
  protected handleEnterPiPState() {
    this.config.state.pictureInPicture = true;
  }
  protected handleLeavePiPState() {
    this.config.state.pictureInPicture = false;
  }
  protected handleFullscreenChangeState(docInFs?: boolean) {
    this.config.state.fullscreen = docInFs ? queryFullscreenEl() === this.el : false;
  }
  protected handleWebkitBeginFullscreenState() {
    this.config.state.fullscreen = true;
  }
  protected handleWebkitEndFullscreenState() {
    this.config.state.fullscreen = false;
  }
  protected handleCurrentTrackState(type: TrackType, list: any) {
    this.config.state[`current${type}Track`] = getTrackIdx(this.el, type, "active");
  }
  protected handleHTMLState(mutations: MutationRecord[]) {
    for (const m of mutations) {
      const { state, settings } = this.config; // Reverse Bind: DOM -> State
      if (m.type === "childList") {
        const nodes = [...m.addedNodes, ...m.removedNodes];
        if (nodes.some(({ nodeName: nm }) => nm === "SOURCE")) state.sources = getSources(this.el);
        if (nodes.some(({ nodeName: nm }) => nm === "TRACK")) state.tracks = getTracks(this.el);
      } else if (m.type !== "attributes" || !m.attributeName) return;
      switch (m.attributeName) {
        case "poster":
          return (state.poster = this.el.poster);
        case "autoplay":
          return (state.autoplay = this.el.autoplay);
        case "loop":
          return (state.loop = this.el.loop);
        case "preload":
          return (state.preload = this.el.preload);
        case "crossorigin":
          return (state.crossOrigin = this.el.crossOrigin);
        case "controls":
          return (state.controls = this.el.controls);
        case "playsinline":
        case "webkit-playsinline":
          return (state.playsInline = this.el.playsInline);
        case "controlslist":
          return (state.controlsList = this.el.controlsList ?? this.el.getAttribute(m.attributeName));
        case "disablepictureinpicture":
          return (state.disablePictureInPicture = this.el.disablePictureInPicture ?? this.el.hasAttribute(m.attributeName));
        case "muted":
          return ((state.muted = this.el.muted), (settings.defaultMuted = this.el.defaultMuted)); // Mutations report before Queued MicroTasks so double "state.*" sets is safely batched for `on` listeners.
      }
    }
  }
  // --- Feature Intents ---
  protected handleVolumeIntent(e: Event<CMedia, "intent.volume">) {
    if (e.resolved) return;
    this.el.volume = e.value!;
    e.resolve(HTML5Tech.techName);
  }
  protected handleMutedIntent(e: Event<CMedia, "intent.muted">) {
    if (e.resolved) return;
    this.el.muted = e.value!;
    e.resolve(HTML5Tech.techName);
  }
  protected handlePlaybackRateIntent(e: Event<CMedia, "intent.playbackRate">) {
    if (e.resolved) return;
    this.el.playbackRate = e.value!;
    e.resolve(HTML5Tech.techName);
  }
  protected handlePiPIntent(e: Event<CMedia, "intent.pictureInPicture">) {
    if (e.resolved) return;
    e.value ? this.el.requestPictureInPicture() : document.exitPictureInPicture();
    e.resolve(HTML5Tech.techName);
  }
  protected handleFullscreenIntent(e: Event<CMedia, "intent.fullscreen">) {
    if (e.resolved) return;
    e.value ? enterFullscreen(this.el) : exitFullscreen(this.el);
    e.resolve(HTML5Tech.techName);
  }
  protected handleCurrentTrackIntent(e: Event<CMedia, `intent.current${TrackType}Track`>, type: TrackType) {
    if (e.resolved) return;
    setCurrentTrack(this.el, type, e.value, false); // (el), (type), (idx), (no flush: `hidden` & !`disabled`)
    e.resolve(HTML5Tech.techName);
  }
  protected handleAttributeIntent(e: Event<CMedia, WCPaths<CMedia>>, key: string, isBool: boolean) {
    if (e.resolved) return;
    (this.el as any)[key] = isBool ? !!e.value : (e.value ?? ""); // Generic handler for simple attributes
    if (key === "playsInline") this.el.toggleAttribute("webkit-playsinline", e.value);
    e.resolve(HTML5Tech.techName);
  }
  protected handleSourcesIntent(e: Event<CMedia, "intent.sources">) {
    if (e.resolved) return;
    if (!isSameSources(this.config.state.sources, e.value)) (removeSources(this.el), addSources(e.value, this.el));
    e.resolve(HTML5Tech.techName);
  }
  protected handleTracksIntent(e: Event<CMedia, "intent.tracks">) {
    if (e.resolved) return;
    if (!isSameTracks(this.config.state.tracks, e.value)) (removeTracks(this.el), addTracks(e.value, this.el));
    e.resolve(HTML5Tech.techName);
  }
  // --- Status (Bulk) ---
  protected handleLoadStatus() {
    this.config.status.readyState = this.el.readyState;
    this.config.status.networkState = this.el.networkState;
    this.config.status.buffered = this.el.buffered;
    this.config.status.seekable = this.el.seekable;
  }
  protected handleLoadedMetadataStatus() {
    this.config.status.loadedMetadata = true;
    this.config.status.videoWidth = this.el.videoWidth;
    this.config.status.videoHeight = this.el.videoHeight;
    this.config.status.duration = this.el.duration;
    this.handleLoadStatus(); // Update buffers too
  }
  protected handleLoadedDataStatus() {
    this.config.status.loadedData = true;
  }
  protected handleCanPlayStatus() {
    this.config.status.canPlay = true;
  }
  protected handleCanPlayThroughStatus() {
    this.config.status.canPlayThrough = true;
  }
  protected handleStalledStatus() {
    this.config.status.stalled = true;
  }
  protected handleWaitingStatus() {
    this.config.status.waiting = true;
  }
  protected handlePlayingStatus() {
    this.config.status.waiting = this.config.status.stalled = false;
  }
  protected handleErrorStatus() {
    this.config.status.error = this.el.error;
    this.config.status.waiting = false;
  }
  protected handleTracksStatus(type: "textTracks" | "videoTracks" | "audioTracks", list: any) {
    this.config.status[type] = list;
  }
  protected handleActiveCueStatus(e?: globalThis.Event | { target?: TextTrack }) {
    const track = e?.target as TextTrack | null;
    // if (getTrackIdx(this.el, "Text", track) !== this.config.state.currentTextTrack) return; // multiple tracks `cuechange`?
    this.config.status.activeCue = track?.activeCues?.[0] || null;
  }
  // --- Settings ---
  protected handleDefaultMutedSetting(e: Event<CMedia, "settings.defaultMuted">) {
    this.el.defaultMuted = e.value!;
  }
  protected handleDefaultPlaybackRateSetting(e: Event<CMedia, "settings.defaultPlaybackRate">) {
    this.el.defaultPlaybackRate = e.value!;
  }
  // --- Capabilities ---
  protected static canControlVolume(): boolean {
    if (!this.DUMMY) return false;
    try {
      const prev = this.DUMMY.volume;
      this.DUMMY.volume = 0.5;
      const works = this.DUMMY.volume === 0.5;
      return ((this.DUMMY.volume = prev), works);
    } catch {
      return false;
    }
  }
  protected static canMuteVolume(): boolean {
    return !!this.DUMMY && "muted" in this.DUMMY;
  }
  protected static canControlRate(): boolean {
    if (!this.DUMMY) return false;
    try {
      const prev = this.DUMMY.playbackRate;
      this.DUMMY.playbackRate = 0.5;
      const works = this.DUMMY.playbackRate === 0.5;
      return ((this.DUMMY.playbackRate = prev), works);
    } catch {
      return false;
    }
  }
  protected static supportsTextTracks(): boolean {
    return !!this.DUMMY && "textTracks" in this.DUMMY;
  }
  protected static supportsVideoTracks(): boolean {
    return !!this.DUMMY && "videoTracks" in this.DUMMY;
  }
  protected static supportsAudioTracks(): boolean {
    return !!this.DUMMY && "audioTracks" in this.DUMMY;
  }
}
