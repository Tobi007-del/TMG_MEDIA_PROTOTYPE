import { BaseTech } from "./base-tech";
import { MEDIA_INTENTS } from "../consts/contract";
import type { MediaTechFeatures } from "../types/contract";
import { createEl, enterFullscreen, exitFullscreen, getSources, isSameURL, queryFullscreenEl, safeNum, supportsFullscreen, supportsPictureInPicture } from "../utils";

// Helper for feature detection
const TEST_VID = createEl("video");

export class HTML5Tech extends BaseTech {
  public readonly name = "html5";

  public readonly features: MediaTechFeatures = {
    // Intents (Capabilities)
    volume: this.canControlVolume(),
    muted: this.canMuteVolume(),
    playbackRate: this.canControlRate(),
    pictureInPicture: supportsPictureInPicture(),
    fullscreen: supportsFullscreen(),
    // Lists & Tracks
    sources: true,
    textTracks: this.supportsTextTracks(),
    videoTracks: this.supportsVideoTracks(),
    audioTracks: this.supportsAudioTracks(),
    // Infos
    readyState: true,
    networkState: true,
    error: true,
    waiting: true,
    stalled: true,
    seeking: true,
    buffered: true,
    seekable: true,
    videoWidth: true,
    videoHeight: true,
    loadedMetadata: true,
    canPlay: true,
    canPlayThrough: true,
    // Settings
    poster: true,
    autoplay: true,
    loop: true,
    playsInline: true,
    crossOrigin: true,
    controls: true,
    defaultMuted: true,
    defaultPlaybackRate: true,
  };

  private get v() {
    return this.element as HTMLVideoElement;
  }

  static canPlaySource(src: string): boolean {
    return true;
  }

  // --- THE MANDATORY CORE 5 ---
  protected wireSrc() {
    this.v.addEventListener("loadstart", () => {
      // Clear Facts
      const { state: s, status: st } = this.ctl.media.status;
      st.error = null;
      st.waiting = true; // Usually waiting for data immediately
      st.ended = st.stalled = st.loadedData = st.loadedMetadata = st.canPlay = st.canPlayThrough = false;
      st.duration = NaN;
      st.buffered = this.v.buffered; // Likely empty
      st.seekable = this.v.seekable;
      st.sources = getSources(this.v);
      if (!isSameURL(this.v.src, s.src)) s.src = this.v.src; // Update src if changed externally
      // Clear Transient State
      this.ctl.media.state.paused = this.v.paused;
    });
    this.ctl.media.intent.on(
      "src",
      (e) => {
        if (e.resolved || isSameURL(this.v.src, e.value)) return;
        this.v.src = e.value ?? "";
        this.v.load();
        e.resolve(this.name);
      },
      true
    );
  }

  protected wireCurrentTime() {
    this.v.addEventListener("timeupdate", () => (this.ctl.media.state.currentTime = this.v.currentTime));
    this.v.addEventListener("seeking", () => (this.ctl.media.status.seeking = true));
    this.v.addEventListener("seeked", () => (this.ctl.media.status.seeking = false));
    this.ctl.media.intent.on(
      "currentTime",
      (e) => {
        if (e.resolved) return;
        this.v.currentTime = safeNum(e.value);
        e.resolve(this.name);
      },
      true
    );
  }

  protected wireDuration() {
    this.v.addEventListener("durationchange", () => (this.ctl.media.status.duration = this.v.duration));
  }

  protected wirePaused() {
    this.v.addEventListener("play", () => (this.ctl.media.state.paused = false));
    this.v.addEventListener("pause", () => (this.ctl.media.state.paused = true));
    this.ctl.media.intent.on(
      "paused",
      (e) => {
        if (e.resolved) return;
        const p = e.value ? this.v.pause() : this.v.play();
        if (p !== undefined && typeof p.then === "function") p.then(() => e.resolve(this.name)).catch((err) => e.reject(err.message));
        else e.resolve(this.name);
      },
      true
    );
  }

  protected wireEnded() {
    this.v.addEventListener("ended", () => {
      this.ctl.media.status.ended = true; // Fact
      this.ctl.media.state.paused = true; // State Mirror (it actually paused)
    });
  }

  // --- THE EXTENSIONS ---
  protected override wireFeatures() {
    const { intent, state, status } = this.ctl.media;
    // 1. Wire Intents (Wishes)
    MEDIA_INTENTS.forEach((key) => {
      if (!this.features[key]) return;
      intent.on(
        key,
        (e) => {
          if (e.resolved) return;
          switch (key) {
            case "volume":
              return (this.v.volume = safeNum(e.value));
            case "muted":
              return (this.v.muted = Boolean(e.value));
            case "playbackRate":
              return (this.v.playbackRate = safeNum(e.value, 1));
            case "pictureInPicture":
              return e.value ? this.v.requestPictureInPicture() : document.exitPictureInPicture();
            case "fullscreen":
              return e.value ? enterFullscreen(this.v) : exitFullscreen(this.v);
          }
          e.resolve(this.name);
        },
        true
      );
    });
    // 2. Wire Reality (Events)
    if (this.features.volume) {
      this.v.addEventListener("volumechange", () => {
        state.volume = this.v.volume;
        state.muted = this.v.muted;
      });
    }
    if (this.features.playbackRate) this.v.addEventListener("ratechange", () => (state.playbackRate = this.v.playbackRate));
    if (this.features.pictureInPicture) {
      this.v.addEventListener("enterpictureinpicture", () => (state.pictureInPicture = true));
      this.v.addEventListener("leavepictureinpicture", () => (state.pictureInPicture = false));
    }
    if (this.features.fullscreen) {
      this.ctl.runtime.watch("docInFullscreen", (inFs) => (inFs ? queryFullscreenEl() === this.v && (state.fullscreen = true) : (state.fullscreen = false)));
      this.v.addEventListener("webkitbeginfullscreen", () => (state.fullscreen = true));
      this.v.addEventListener("webkitendfullscreen", () => (state.fullscreen = false));
    }
    if (this.features.readyState) {
      const updateLoad = () => {
        status.readyState = this.v.readyState;
        status.networkState = this.v.networkState;
        status.buffered = this.v.buffered;
        status.seekable = this.v.seekable;
      };
      ["loadstart", "progress", "suspend", "abort", "emptied", "stalled"].forEach((evt) => this.v.addEventListener(evt, updateLoad));
      this.v.addEventListener("stalled", () => (status.stalled = true));
      this.v.addEventListener("loadedmetadata", () => {
        status.loadedMetadata = true;
        status.videoWidth = this.v.videoWidth;
        status.videoHeight = this.v.videoHeight;
        status.duration = this.v.duration; // often available here
        updateLoad();
      });
      this.v.addEventListener("loadeddata", () => (status.loadedData = true));
    }
    if (this.features.waiting) {
      this.v.addEventListener("waiting", () => (status.waiting = true));
      this.v.addEventListener("playing", () => (status.waiting = status.stalled = false)); // If playing, we aren't stalled
      this.v.addEventListener("canplay", () => (status.canPlay = true));
      this.v.addEventListener("canplaythrough", () => (status.canPlayThrough = true));
    }
    if (this.features.error) {
      this.v.addEventListener("error", () => {
        status.error = this.v.error;
        status.waiting = false; // Stop spinner if error
      });
    }
    if (this.features.textTracks) this.wireTrackEvents("textTracks");
    if (this.features.videoTracks) this.wireTrackEvents("videoTracks");
    if (this.features.audioTracks) this.wireTrackEvents("audioTracks");
  }

  // --- TRACK EVENT WIRING ---
  private wireTrackEvents(type: "textTracks" | "videoTracks" | "audioTracks") {
    const list = (this.v as any)[type];
    const update = () => (this.ctl.media.status[type] = list);
    list && update();
    ["change", "addtrack", "removetrack"].forEach((e) => list?.addEventListener(e, update));
  }

  // --- CAPABILITY CHECKS ---
  private canControlVolume(): boolean {
    if (!TEST_VID) return false;
    try {
      const prev = TEST_VID.volume;
      TEST_VID.volume = prev / 2 + 0.1;
      const works = TEST_VID.volume !== prev;
      TEST_VID.volume = prev;
      return works;
    } catch {
      return false;
    }
  }
  private canMuteVolume(): boolean {
    return !!TEST_VID && "muted" in TEST_VID;
  }
  private canControlRate(): boolean {
    if (!TEST_VID) return false;
    try {
      const prev = TEST_VID.playbackRate;
      TEST_VID.playbackRate = prev / 2 + 0.1;
      const works = TEST_VID.playbackRate !== prev;
      TEST_VID.playbackRate = prev;
      return works;
    } catch {
      return false;
    }
  }
  private supportsTextTracks(): boolean {
    return !!TEST_VID && "textTracks" in TEST_VID;
  }
  private supportsVideoTracks(): boolean {
    return !!TEST_VID && "videoTracks" in TEST_VID;
  }
  private supportsAudioTracks(): boolean {
    return !!TEST_VID && "audioTracks" in TEST_VID;
  }
}
