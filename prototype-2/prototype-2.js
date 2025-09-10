"use strict";
/* 
TODO: 
  editable settings
  video resolution
*/

typeof window !== "undefined" ? console.log("%cTMG Media Player Available", "color: green") : console.log("\x1b[38;2;139;69;19mTMG Media Player Unavailable\x1b[0m");

class T_M_G_Video_Player {
  constructor(videoOptions) {
    this.initialized = false;
    this.bindMethods();
    //merging the video build into the Video Player Instance
    Object.entries(videoOptions).forEach(([k, v]) => (this[k] = v));
    //adding some info before logging incase user had them burnt into the html
    const src = this.src,
      sources = this.sources,
      tracks = this.tracks;
    if (src) videoOptions.src = src;
    if (sources.length) videoOptions.sources = sources;
    if (tracks.length) videoOptions.tracks = tracks;
    this.log(videoOptions);
    //some general variables
    this.isMediaMobile = tmg.queryMediaMobile();
    this.audioSetup = this.loaded = this.locked = this.inFullScreen = this.isScrubbing = this.buffering = this.floatingPlayerActive = this.gestureTouchXCheck = this.gestureTouchYCheck = this.gestureWheelXCheck = this.gestureWheelYCheck = this.shouldSetLastVolume = this.shouldSetLastBrightness = this.speedPointerCheck = this.speedCheck = this.skipPersist = false;
    this.parentIntersecting = this.isIntersecting = this.gestureTouchCanCancel = this.canAutoMovePlaylist = true;
    this.skipDuration = this.textTrackIndex = this.playTriggerCounter = 0;
    this.pfps = 30; // pseudo fps: just for frame stepping, not accurate :(
    this.CSSCustomPropertiesCache = {};
    this.currentPlaylistIndex = this.playlist ? 0 : null;
    this.wasPaused = !this.video.autoplay;
    this.throttleMap = new Map();
    this.rafLoopMap = new Map();
    this.rafLoopFnMap = new Map();
    this.frameThrottleDelay = 1000 / this.pfps;
    this.keyDownThrottleDelay = 10;
    this.gestureTouchMoveThrottleDelay = 10;
    this.dragOverThrottleDelay = 20;
    this.timelineInputThrottleDelay = 50;
    this.speedPointerMoveThrottleDelay = 100;
    this.gestureTouchThreshold = 150;
    this.gestureTouchFingerXRatio = this.gestureTouchFingerYRatio = 3;
    this.gestureWheelTimeout = 2000;
    this.volumeSliderVolume = this.brightnessSliderBrightness = 5;
    this.fastPlayThreshold = 1000;
    this.miniPlayerMinWindowWidth = 240;
    this.floatingPlayerOptions = { width: 378, height: 199 };
    this.exportCanvas = document.createElement("canvas");
    this.exportContext = this.exportCanvas.getContext("2d");
    this.initCSSVariablesManager();
    this.mutatingDOMNodes = true;
    this.buildContainers();
    this.buildPlayerInterface();
    this.buildControllerStructure();
    setTimeout(() => (this.mutatingDOMNodes = false));
    this.initSettingsManager();
    this.initPlayer();
  }

  get playlist() {
    return this._playlistItems;
  }

  set playlist(value) {
    if (!tmg.isArray(value)) return;
    value.forEach((val) => {
      val.settings = val.settings ?? {};
      val.settings.time = { previewImages: val.settings.time?.previewImages ?? false, start: val.settings.time?.start ?? null, end: val.settings.time?.end ?? null };
    });
    this._playlistItems = value;
    if (this.currentPlaylistIndex == null) this.currentPlaylistIndex = 0;
    else if (this.initialized) {
      const nextIndex = this.playlist?.findIndex((vid) => vid.src === this.src);
      this.currentPlaylistIndex = nextIndex !== -1 ? nextIndex : 0;
      if (nextIndex === -1) this.movePlaylistTo(this.currentPlaylistIndex, !this.video.paused);
    }
    this.setBtnsState("playlist");
  }

  get src() {
    return this.video.src;
  }

  set src(value) {
    tmg.removeSources(this.video);
    this.video.src = value;
    this.video.load();
  }

  get sources() {
    return tmg.getSources(this.video);
  }

  set sources(value) {
    this.video.src = "";
    tmg.removeSources(this.video);
    tmg.addSources(value, this.video);
  }

  get tracks() {
    return tmg.getTracks(this.video);
  }

  set tracks(value) {
    tmg.removeTracks(this.video);
    tmg.addTracks(value, this.video);
  }

  log(message, type, action) {
    if (!this.debug) return;
    switch (type) {
      case "error":
        if (action === "swallow") console.warn(`TMG swallowed a rendering error:`, message);
        else throw message;
        break;
      case "warn":
        console.warn(message);
        break;
      default:
        console.log(message);
    }
  }

  bindMethods() {
    let proto = Object.getPrototypeOf(this);
    while (proto && proto !== Object.prototype) {
      for (const method of Object.getOwnPropertyNames(proto)) {
        const descriptor = Object.getOwnPropertyDescriptor(proto, method);
        if (method !== "constructor" && descriptor && typeof descriptor.value === "function") {
          const fn = this[method].bind(this);
          this[method] = (...args) => {
            try {
              const result = fn(...args);
              if (result instanceof Promise) return result.catch((e) => this.log(e, "error", "swallow"));
              return result;
            } catch (e) {
              this.log(e, "error", "swallow");
            }
          };
        }
      }
      proto = Object.getPrototypeOf(proto);
    }
  }

  fire(eventName, el = this.DOM.notifiersContainer, detail = null, bubbles = true, cancellable = true) {
    let evt = new CustomEvent(eventName, { detail, bubbles, cancellable });
    el?.dispatchEvent(evt);
  }

  throttle(key, fn, delay = 10) {
    if (this.throttleMap.has(key)) return;
    const id = setTimeout(() => this.throttleMap.delete(key), delay);
    fn();
    this.throttleMap.set(key, id);
  }

  cancelThrottle(key) {
    const id = this.throttleMap.get(key);
    if (id) {
      clearTimeout(id);
      this.throttleMap.delete(key);
    }
    this.throttleMap[key] = false;
  }

  RAFLoop(key, fn) {
    this.rafLoopFnMap.set(key, fn);
    if (this.rafLoopMap.has(key)) return;
    let id;
    const loop = () => {
      const fn = this.rafLoopFnMap.get(key);
      typeof fn === "function" && fn();
      id = requestAnimationFrame(loop);
      this.rafLoopMap.set(key, id);
    };
    id = requestAnimationFrame(loop);
    this.rafLoopMap.set(key, id);
  }

  cancelRAFLoop(key) {
    const id = this.rafLoopMap.get(key);
    if (!id) return;
    cancelAnimationFrame(id);
    this.rafLoopFnMap.delete(key);
    this.rafLoopMap.delete(key);
  }

  cancelAllThrottles() {
    this.throttleMap.keys().forEach(() => this.cancelThrottle(key));
    this.rafLoopMap.keys().forEach(() => this.cancelRAFLoop(key));
  }

  cleanUpDOM() {
    this.mutatingDOMNodes = true;
    this.video.classList.remove("T_M_G-video", "T_M_G-media");
    if (this.isModeActive("floatingPlayer")) {
      this.floatingPlayer?.addEventListener("pagehide", () => {
        // at this point, the video is left to fend off alone and handle it's own destruction cuz destroy can't be made asynchronous cuz of one event
        this.videoContainer.classList.remove("T_M_G-video-floating-player");
        if (tmg.isInDOM(this.video)) this.pseudoVideoContainer.parentElement?.insertBefore(this.video, this.pseudoVideoContainer);
        this.pseudoVideoContainer.remove();
        this.videoContainer.remove();
        this.replaceVideo();
        this.video.tmgcontrols = false;
        tmg.initMedia(this.video, true);
      });
      this.floatingPlayer?.removeEventListener("pagehide", this._handleFloatingPlayerClose);
      return this.floatingPlayer?.close();
    } else if (tmg.isInDOM(this.pseudoVideo)) {
      if (tmg.isInDOM(this.video)) this.pseudoVideoContainer.parentElement?.insertBefore(this.video, this.pseudoVideoContainer);
      this.pseudoVideoContainer.remove();
    } else if (tmg.isInDOM(this.video)) this.videoContainer.parentElement?.insertBefore(this.video, this.videoContainer);
    this.videoContainer.remove();
    // setTimeout(() => this.mutatingDOMNodes = false)
  }

  replaceVideo() {
    this.mutatingDOMNodes = true;
    if (this.isModeActive("floatingPlayer")) return;
    const clonedVideo = this.video.cloneNode(true);
    clonedVideo.tmgPlayer = this.video.tmgPlayer;
    this.video.parentElement?.replaceChild(clonedVideo, this.video);
    // Playback control
    if (this.video.currentTime) clonedVideo.currentTime = this.video.currentTime;
    if (this.video.playbackRate !== 1) clonedVideo.playbackRate = this.video.playbackRate;
    if (this.video.defaultPlaybackRate !== 1) clonedVideo.defaultPlaybackRate = this.video.defaultPlaybackRate;
    if (this.video.volume !== 1) clonedVideo.volume = this.video.volume;
    if (this.video.muted) clonedVideo.muted = true;
    if (this.video.defaultMuted) clonedVideo.defaultMuted = true;
    if (this.video.srcObject) clonedVideo.srcObject = this.video.srcObject;
    // Behavior flags
    if (this.video.autoplay) clonedVideo.autoplay = true;
    if (this.video.loop) clonedVideo.loop = true;
    if (this.video.controls) clonedVideo.controls = true;
    if (this.video.crossOrigin) clonedVideo.crossOrigin = this.video.crossOrigin;
    if (this.video.playsInline) clonedVideo.playsInline = true;
    if (this.video.controlsList && this.video.controlsList.length) clonedVideo.controlsList = this.video.controlsList;
    if (this.video.disablePictureInPicture) clonedVideo.disablePictureInPicture = true;
    if (!this.video.paused && tmg.isInDOM(clonedVideo)) clonedVideo.play();
    this.video = clonedVideo;
    // setTimeout(() => this.mutatingDOMNodes = false)
  }

  _destroy() {
    this.cancelAllThrottles();
    this.removeAudio();
    this.leaveSettingsView();
    this.unobserveResize();
    this.unobserveIntersection();
    this.removeKeyEventListeners();
    this.removeVideoEventListeners();
    this.cleanUpDOM();
    //had to do this to get rid of stateful issues and freezing
    this.replaceVideo();
    return this.video;
  }

  initCSSVariablesManager() {
    //fetching all css varibles from the stylesheet for easy accessibility
    for (const sheet of document.styleSheets) {
      try {
        for (const cssRule of sheet.cssRules) {
          if (!cssRule.selectorText?.replace(/\s/g, "")?.includes(":root,.T_M_G-media-container")) continue;
          for (const property of cssRule.style) {
            if (!property.startsWith("--T_M_G-video-")) continue;
            const value = cssRule.style.getPropertyValue(property);
            const field = tmg.camelize(property.replace("--T_M_G-", ""), "-");
            this.CSSCustomPropertiesCache[field] = value;

            Object.defineProperty(this, field, {
              get() {
                return getComputedStyle(this.videoContainer).getPropertyValue(property);
              },
              set(value) {
                this.videoContainer.style.setProperty(property, value);
                this.pseudoVideoContainer.style.setProperty(property, value);
              },
              enumerable: true,
              configurable: true,
            });
          }
        }
      } catch {
        continue;
      }
    }
  }

  initSettingsManager() {
    // this.log("TMG Video Settings Manager started")
  }

  getIcons() {}

  buildContainers() {
    this.setPosterState();
    if (!this.videoContainer) {
      this.videoContainer = document.createElement("div");
      this.video.parentElement?.insertBefore(this.videoContainer, this.video);
    }
    this.videoContainer.classList.add("T_M_G-video-container", "T_M_G-media-container");
    this.videoContainer.classList.toggle("T_M_G-video-mobile", this.isMediaMobile);
    this.videoContainer.classList.toggle("T_M_G-video-paused", this.video.paused);
    this.videoContainer.classList.toggle(`T_M_G-video-${tmg.uncamelize(this.initialMode, "-")}`, !!this.initialMode);
    this.videoContainer.classList.toggle("T_M_G-video-progress-bar", this.settings.time.progressBar);
    this.videoContainer.setAttribute("data-timeline-position", !!this.settings.time.linePosition);
    this.videoContainer.setAttribute("data-object-fit", this.videoObjectFit ?? "contain");
    this.videoContainer.setAttribute("data-volume-level", "muted");
    this.videoContainer.setAttribute("data-brightness-level", "dark");
    // pseudo els
    this.pseudoVideo = document.createElement("video");
    this.pseudoVideo.tmgPlayer = this.video.tmgPlayer;
    this.pseudoVideo.classList.add("T_M_G-pseudo-video", "T_M_G-media");
    this.pseudoVideoContainer = document.createElement("div");
    this.pseudoVideoContainer.classList.add("T_M_G-pseudo-video-container", "T_M_G-media-container");
    this.pseudoVideoContainer.append(this.pseudoVideo);
  }

  buildPlayerInterface() {
    this.videoContainer.insertAdjacentHTML(
      "beforeend",
      `
    <!-- Code injected by TMG -->
    <div class="T_M_G-video-container-content-wrapper">
      <div class="T_M_G-video-container-content">
        <div class="T_M_G-video-overlay-controls-container">
        </div>
        <div class="T_M_G-video-controls-container">
        </div>
      </div>
      <div class="T_M_G-video-settings">
        <div class="T_M_G-video-settings-content">
          <div class="T_M_G-video-settings-top-panel">
            <button type="button" title="Close settings" class="T_M_G-video-settings-close-btn" data-focusable-control="false" tabindex="-1">
              <span>
                <svg class="T_M_G-video-settings-close-btn-icon">
                  <path fill="currentColor" d="M1.307,5.988 L6.616,1.343 C7.027,0.933 7.507,0.864 7.918,1.275 L7.918,4.407 C8.014,4.406 8.098,4.406 8.147,4.406 C13.163,4.406 16.885,7.969 16.885,12.816 C16.885,14.504 16.111,13.889 15.788,13.3 C14.266,10.52 11.591,8.623 8.107,8.623 C8.066,8.623 7.996,8.624 7.917,8.624 L7.917,11.689 C7.506,12.099 6.976,12.05 6.615,11.757 L1.306,7.474 C0.897,7.064 0.897,6.399 1.307,5.988 L1.307,5.988 Z"></path>
                </svg>
              </span>
              <span>Close Settings</span>
            </button>                     
          </div>
          <div class="T_M_G-video-settings-bottom-panel">
            No Settings Available Yet!
          </div>
        </div>
      </div>         
    </div>
    <!-- Code injected by TMG ends -->
    `
    );
    this.queryDOM(".T_M_G-video-container-content").appendChild(this.video);
  }

  getPlayerHTML() {
    const keyShortcuts = this.fetchKeyShortcutsForDisplay();
    return {
      pictureinpicturewrapper: `
        <div class="T_M_G-video-picture-in-picture-wrapper">
          <span class="T_M_G-video-picture-in-picture-icon-wrapper">
            <svg class="T_M_G-video-picture-in-picture-icon" viewBox="0 0 73 73" data-no-resize="true">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g transform="translate(2.000000, 2.000000)" fill-rule="nonzero" stroke="#3E3D3D" stroke-width="2" fill="currentColor" class="T_M_G-video-pip-background">
                <rect x="-1" y="-1" width="71" height="71" rx="14"></rect>
              </g>
              <g transform="translate(15.000000, 15.000000)" fill-rule="nonzero">
              <g>
                <polygon class="T_M_G-video-pip-content-background" fill="#FF493B" points="0 0 0 36 36 36 36 0"></polygon>
                <rect class="T_M_G-video-pip-content-backdrop" fill="#DEECF1" x="4.2890625" y="4.2890625" width="27.421875" height="13.2679687"></rect>
                <g transform="translate(4.289063, 27.492187)" fill="#5A5A5A">
                  <rect x="0" y="0" width="3.1640625" height="2.109375" class="T_M_G-video-pip-timeline-progress"></rect>
                  <rect x="7.3828125" y="0" width="20.0390625" height="2.109375" class="T_M_G-video-pip-timeline-base"></rect>
                </g>
                <circle class="T_M_G-video-pip-thumb-indicator" fill="#DEECF1" cx="9.5625" cy="28.546875" r="3.1640625"></circle>
                <polygon fill="#5A5A5A" class="T_M_G-video-pip-content" points="31.7109375 17.5569609 31.7109375 23.2734375 4.2890625 23.2734375 4.2890625 17.5569609 13.78125 8.06477344 20.109375 14.3928984 24.328125 10.1741484"></polygon>
              </g>
              <g transform="translate(21.000000, 26.000000)">
                <polygon fill="#FF493B" class="T_M_G-video-pip-content-background" points="0 0 0 17.7727273 23 17.7727273 23 0"></polygon>
                <rect fill="#DEECF1" class="T_M_G-video-pip-content-backdrop" x="2.74023438" y="2.74023438" width="17.5195312" height="8.47675781"></rect>
                <polygon fill="#5A5A5A" class="T_M_G-video-pip-content"points="20.2597656 11.2169473 20.2597656 14.8691406 2.74023438 14.8691406 2.74023438 11.2169473 8.8046875 5.15249414 12.8476562 9.19546289 15.5429687 6.50015039"></polygon>
              </g>
              </g>
              </g>
            </svg>
          </span>
          <p>Playing in picture-in-picture</p>
        </div>      
      `,
      playlisttitle: `
        <div class="T_M_G-video-title-wrapper">
          <div class="T_M_G-video-title-content">
            <p class="T_M_G-video-title"></p>
          </div>
        </div>      
      `,
      videobuffer: `
        <div class="T_M_G-video-buffer">
          <div class="T_M_G-video-buffer-plain"></div>
          <div class="T_M_G-video-buffer-rotator">
          <div class="T_M_G-video-buffer-left">
            <div class="T_M_G-video-buffer-circle">
            </div>
          </div>
          <div class="T_M_G-video-buffer-right">
            <div class="T_M_G-video-buffer-circle"></div>
          </div>
          </div>
        </div>
      `,
      thumbnail: `
        <img class="T_M_G-video-thumbnail T_M_G-video-thumbnail-image" alt="movie-image" src="${tmg.ALT_IMG_SRC}">
        <canvas class="T_M_G-video-thumbnail T_M_G-video-thumbnail-canvas"></canvas>
      `,
      cueContainer: `
      <div class="T_M_G-video-cue-container"></div>
      `,
      playpausenotifier: this.settings.status.ui.notifiers
        ? `
        <div class="T_M_G-video-notifiers T_M_G-video-play-notifier">
          <svg class="T_M_G-video-play-notifier-icon">
            <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
          </svg>
        </div>
        <div class="T_M_G-video-notifiers T_M_G-video-pause-notifier">
          <svg class="T_M_G-video-pause-notifier-icon">
            <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
          </svg>
        </div>   
      `
        : null,
      captionsnotifier: this.settings.status.ui.notifiers
        ? `
        <div class="T_M_G-video-notifiers T_M_G-video-captions-notifier">
          <svg class="T_M_G-video-subtitles-icon">
            <path fill="currentColor" transform="scale(0.5)" d="M44,6H4A2,2,0,0,0,2,8V40a2,2,0,0,0,2,2H44a2,2,0,0,0,2-2V8A2,2,0,0,0,44,6ZM12,26h4a2,2,0,0,1,0,4H12a2,2,0,0,1,0-4ZM26,36H12a2,2,0,0,1,0-4H26a2,2,0,0,1,0,4Zm10,0H32a2,2,0,0,1,0-4h4a2,2,0,0,1,0,4Zm0-6H22a2,2,0,0,1,0-4H36a2,2,0,0,1,0,4Z" />
          </svg>
          <svg class="T_M_G-video-captions-icon" transform="scale(1.15)">
            <path fill="currentColor" d="M18,11H16.5V10.5H14.5V13.5H16.5V13H18V14A1,1 0 0,1 17,15H14A1,1 0 0,1 13,14V10A1,1 0 0,1 14,9H17A1,1 0 0,1 18,10M11,11H9.5V10.5H7.5V13.5H9.5V13H11V14A1,1 0 0,1 10,15H7A1,1 0 0,1 6,14V10A1,1 0 0,1 7,9H10A1,1 0 0,1 11,10M19,4H5C3.89,4 3,4.89 3,6V18A2,2 0 0,0 5,20H19A2,2 0 0,0 21,18V6C21,4.89 20.1,4 19,4Z"></path>
          <svg>
        </div>
      `
        : null,
      objectfitnotifier: this.settings.status.ui.notifiers
        ? `
        <div class="T_M_G-video-notifiers T_M_G-video-object-fit-notifier"></div>
      `
        : null,
      playbackratenotifier: this.settings.status.ui.notifiers
        ? `
        <div class="T_M_G-video-notifiers T_M_G-video-playback-rate-notifier">
          <svg viewBox="0 0 30 24" data-no-resize="true">
            <path fill="currentColor" d="M22,5.14V19.14L11,12.14L22,5.14Z" />
            <path fill="currentColor" d="M11,5.14V19.14L0,12.14L11,5.14Z" />
          </svg>
          <p class="T_M_G-video-playback-rate-notifier-text"></p>
          <svg viewBox="0 0 30 24" data-no-resize="true">
            <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
            <path fill="currentColor" d="M19,5.14V19.14L30,12.14L19,5.14Z" />
          </svg>
        </div>
        <div class="T_M_G-video-notifiers T_M_G-video-playback-rate-notifier-content"></div>
        <div class="T_M_G-video-notifiers T_M_G-video-playback-rate-up-notifier">
          <svg class="T_M_G-video-playback-rate-up-notifier-icon" viewBox="0 0 30 24" data-no-resize="true">
            <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" transform="translate(-2.5, 0)" />
            <path fill="currentColor" d="M19,5.14V19.14L30,12.14L19,5.14Z" transform="translate(-2.5, 0)" />
          </svg>  
        </div>
        <div class="T_M_G-video-notifiers T_M_G-video-playback-rate-down-notifier">
          <svg class="T_M_G-video-playback-rate-down-notifier-icon" viewBox="0 0 30 24" data-no-resize="true">
            <path fill="currentColor" d="M22,5.14V19.14L11,12.14L22,5.14Z" transform="translate(2.5, 0)" />
            <path fill="currentColor" d="M11,5.14V19.14L0,12.14L11,5.14Z" transform="translate(2.5, 0)" />
          </svg>
        </div>
      `
        : null,
      volumenotifier: this.settings.status.ui.notifiers
        ? `
        <div class="T_M_G-video-notifiers T_M_G-video-volume-notifier-content"></div>
        <div class="T_M_G-video-notifiers T_M_G-video-volume-up-notifier">
          <svg class="T_M_G-video-volume-up-notifier-icon" >
            <path fill="currentColor" d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
          </svg>  
        </div>
        <div class="T_M_G-video-notifiers T_M_G-video-volume-down-notifier">
          <svg class="T_M_G-video-volume-down-notifier-icon">
            <path fill="currentColor" d="M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z" />
          </svg>
        </div>
        <div class="T_M_G-video-notifiers T_M_G-video-volume-muted-notifier">
          <svg class="T_M_G-video-volume-muted-notifier-icon">
            <path fill="currentColor" d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z" />
          </svg>
        </div>
      `
        : null,
      brightnessnotifier: this.settings.status.ui.notifiers
        ? `
        <div class="T_M_G-video-notifiers T_M_G-video-brightness-notifier-content"></div>
        <div class="T_M_G-video-notifiers T_M_G-video-brightness-up-notifier">
          <svg class="T_M_G-video-brightness-up-icon">
            <path transform="scale(1.05) translate(1.5, 1.5)"  d="M10 14.858a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6-5h3a1 1 0 0 1 0 2h-3a1 1 0 0 1 0-2zm-6 6a1 1 0 0 1 1 1v3a1 1 0 0 1-2 0v-3a1 1 0 0 1 1-1zm0-15a1 1 0 0 1 1 1v3a1 1 0 0 1-2 0v-3a1 1 0 0 1 1-1zm-9 9h3a1 1 0 1 1 0 2H1a1 1 0 0 1 0-2zm13.95 4.535l2.121 2.122a1 1 0 0 1-1.414 1.414l-2.121-2.121a1 1 0 0 1 1.414-1.415zm-8.486 0a1 1 0 0 1 0 1.415l-2.12 2.12a1 1 0 1 1-1.415-1.413l2.121-2.122a1 1 0 0 1 1.414 0zM17.071 3.787a1 1 0 0 1 0 1.414L14.95 7.322a1 1 0 0 1-1.414-1.414l2.12-2.121a1 1 0 0 1 1.415 0zm-12.728 0l2.121 2.121A1 1 0 1 1 5.05 7.322L2.93 5.201a1 1 0 0 1 1.414-1.414z">
            </path>
          </svg>
        </div>
        <div class="T_M_G-video-notifiers T_M_G-video-brightness-down-notifier">
          <svg class="T_M_G-video-brightness-down-icon">
            <path transform="scale(1.05) translate(3.25, 3.25)" d="M8 12.858a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6-5h1a1 1 0 0 1 0 2h-1a1 1 0 0 1 0-2zm-6 6a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0v-1a1 1 0 0 1 1-1zm0-13a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1zm-7 7h1a1 1 0 1 1 0 2H1a1 1 0 1 1 0-2zm11.95 4.535l.707.708a1 1 0 1 1-1.414 1.414l-.707-.707a1 1 0 0 1 1.414-1.415zm-8.486 0a1 1 0 0 1 0 1.415l-.707.707A1 1 0 0 1 2.343 13.1l.707-.708a1 1 0 0 1 1.414 0zm9.193-9.192a1 1 0 0 1 0 1.414l-.707.707a1 1 0 0 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 0zm-9.9 0l.707.707A1 1 0 1 1 3.05 5.322l-.707-.707a1 1 0 0 1 1.414-1.414z">
            </path>
          </svg>
        </div>
        <div class="T_M_G-video-notifiers T_M_G-video-brightness-dark-notifier">
          <svg class="T_M_G-video-brightness-dark-icon">
            <path transform="scale(1.2) translate(2, 2.5)" d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8.5 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0 11a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm5-5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm-11 0a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9.743-4.036a.5.5 0 1 1-.707-.707.5.5 0 0 1 .707.707zm-7.779 7.779a.5.5 0 1 1-.707-.707.5.5 0 0 1 .707.707zm7.072 0a.5.5 0 1 1 .707-.707.5.5 0 0 1-.707.707zM3.757 4.464a.5.5 0 1 1 .707-.707.5.5 0 0 1-.707.707z">
            </path>
          </svg>
        </div>
      `
        : null,
      fwdnotifier: this.settings.status.ui.notifiers
        ? `
        <div class="T_M_G-video-notifiers T_M_G-video-fwd-notifier">
          <svg>
            <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
          </svg>
          <svg>
            <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
          </svg>
          <svg>
            <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
          </svg>            
        </div>
      `
        : null,
      bwdnotifier: this.settings.status.ui.notifiers
        ? `
        <div class="T_M_G-video-notifiers T_M_G-video-bwd-notifier">
          <svg>          
            <path fill="currentColor" d="M19,5.14V19.14L8,12.14L19,5.14Z" />
          </svg>
          <svg>          
            <path fill="currentColor" d="M19,5.14V19.14L8,12.14L19,5.14Z" />
          </svg>
          <svg>          
            <path fill="currentColor" d="M19,5.14V19.14L8,12.14L19,5.14Z" />
          </svg>            
        </div>   
      `
        : null,
      scrubnotifier: this.settings.status.ui.notifiers
        ? `
      <div class="T_M_G-video-notifiers T_M_G-video-scrub-notifier">
        <span>
          <svg>          
            <path fill="currentColor" d="M19,5.14V19.14L8,12.14L19,5.14Z" />
          </svg>
          <svg>          
            <path fill="currentColor" d="M19,5.14V19.14L8,12.14L19,5.14Z" />
          </svg>
          <svg>          
            <path fill="currentColor" d="M19,5.14V19.14L8,12.14L19,5.14Z" />
          </svg>
        </span>
        <div class="T_M_G-video-scrub-notifier-content">
          <p class="T_M_G-video-scrub-notifier-text">Double tap left or right to skip ${this.settings.time.skip} seconds</p>
        </div>
        <span>
          <svg>
            <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
          </svg>
          <svg>
            <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
          </svg>
          <svg>
            <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
          </svg>            
        </span>
      </div>
      `
        : null,
      touchtimelinenotifier: this.settings.status.ui.notifiers
        ? `
        <div class="T_M_G-video-notifiers T_M_G-video-touch-timeline-notifier T_M_G-video-touch-notifier"></div>
      `
        : null,
      touchvolumenotifier: this.settings.status.ui.notifiers
        ? `
        <div class="T_M_G-video-notifiers T_M_G-video-touch-volume-notifier T_M_G-video-touch-vb-notifier">
          <span class="T_M_G-video-touch-volume-content T_M_G-video-touch-vb-content">0</span>
          <div class="T_M_G-video-touch-volume-slider T_M_G-video-touch-vb-slider"></div>
          <span>
            <svg class="T_M_G-video-volume-high-icon">
              <path fill="currentColor" d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z">
              </path>
            </svg>
            <svg class="T_M_G-video-volume-low-icon">
              <path fill="currentColor" d="M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z"></path>
            </svg>
            <svg class="T_M_G-video-volume-muted-icon">
              <path fill="currentColor" d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z">
              </path>
            </svg>
          </span>
        </div>
      `
        : null,
      touchbrightnessnotifier: this.settings.status.ui.notifiers
        ? `
        <div class="T_M_G-video-notifiers T_M_G-video-touch-brightness-notifier T_M_G-video-touch-vb-notifier">
          <span class="T_M_G-video-touch-brightness-content T_M_G-video-touch-vb-content">0</span>
          <div class="T_M_G-video-touch-brightness-slider T_M_G-video-touch-vb-slider"></div>
          <span>
            <svg class="T_M_G-video-brightness-high-icon">
              <path transform="scale(1.05) translate(1.5, 1.5)"  d="M10 14.858a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6-5h3a1 1 0 0 1 0 2h-3a1 1 0 0 1 0-2zm-6 6a1 1 0 0 1 1 1v3a1 1 0 0 1-2 0v-3a1 1 0 0 1 1-1zm0-15a1 1 0 0 1 1 1v3a1 1 0 0 1-2 0v-3a1 1 0 0 1 1-1zm-9 9h3a1 1 0 1 1 0 2H1a1 1 0 0 1 0-2zm13.95 4.535l2.121 2.122a1 1 0 0 1-1.414 1.414l-2.121-2.121a1 1 0 0 1 1.414-1.415zm-8.486 0a1 1 0 0 1 0 1.415l-2.12 2.12a1 1 0 1 1-1.415-1.413l2.121-2.122a1 1 0 0 1 1.414 0zM17.071 3.787a1 1 0 0 1 0 1.414L14.95 7.322a1 1 0 0 1-1.414-1.414l2.12-2.121a1 1 0 0 1 1.415 0zm-12.728 0l2.121 2.121A1 1 0 1 1 5.05 7.322L2.93 5.201a1 1 0 0 1 1.414-1.414z">
              </path>
            </svg>
            <svg class="T_M_G-video-brightness-low-icon">
              <path transform="scale(1.05) translate(3.25, 3.25)" d="M8 12.858a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6-5h1a1 1 0 0 1 0 2h-1a1 1 0 0 1 0-2zm-6 6a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0v-1a1 1 0 0 1 1-1zm0-13a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1zm-7 7h1a1 1 0 1 1 0 2H1a1 1 0 1 1 0-2zm11.95 4.535l.707.708a1 1 0 1 1-1.414 1.414l-.707-.707a1 1 0 0 1 1.414-1.415zm-8.486 0a1 1 0 0 1 0 1.415l-.707.707A1 1 0 0 1 2.343 13.1l.707-.708a1 1 0 0 1 1.414 0zm9.193-9.192a1 1 0 0 1 0 1.414l-.707.707a1 1 0 0 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 0zm-9.9 0l.707.707A1 1 0 1 1 3.05 5.322l-.707-.707a1 1 0 0 1 1.414-1.414z">
              </path>
            </svg>
            <svg class="T_M_G-video-brightness-dark-icon">
              <path transform="scale(1.2) translate(2, 2.5)" d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8.5 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0 11a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm5-5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm-11 0a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9.743-4.036a.5.5 0 1 1-.707-.707.5.5 0 0 1 .707.707zm-7.779 7.779a.5.5 0 1 1-.707-.707.5.5 0 0 1 .707.707zm7.072 0a.5.5 0 1 1 .707-.707.5.5 0 0 1-.707.707zM3.757 4.464a.5.5 0 1 1 .707-.707.5.5 0 0 1-.707.707z">
              </path>
            </svg>
          </span>
        </div>      
      `
        : null,
      fullscreenorientation: this.settings.status.modes.fullScreen
        ? `
        <div class="T_M_G-video-full-screen-orientation-btn-wrapper">
          <button type="button" class="T_M_G-video-full-screen-orientation-btn T_M_G-video-control-hidden" data-focusable-control="false" tabindex="-1"> 
            <svg viewBox="0 0 512 512" class="T_M_G-video-full-screen-orientation-icon" data-control-title="Change orientation" data-no-resize="true">
              <path fill="currentColor" d="M446.81,275.82H236.18V65.19c0-20.78-16.91-37.69-37.69-37.69H65.19c-20.78,0-37.69,16.91-37.69,37.69v255.32   c0,20.78,16.91,37.68,37.69,37.68h88.62v88.62c0,20.78,16.9,37.69,37.68,37.69h255.32c20.78,0,37.69-16.91,37.69-37.69v-133.3   C484.5,292.73,467.59,275.82,446.81,275.82z M65.19,326.19c-3.14,0-5.69-2.55-5.69-5.68V65.19c0-3.14,2.55-5.69,5.69-5.69h133.3   c3.14,0,5.69,2.55,5.69,5.69v210.63h-12.69c-20.78,0-37.68,16.91-37.68,37.69v12.68H65.19z M452.5,446.81   c0,3.14-2.55,5.69-5.69,5.69H191.49c-3.13,0-5.68-2.55-5.68-5.69V342.19v-28.68c0-2.94,2.24-5.37,5.1-5.66   c0.19-0.02,0.38-0.03,0.58-0.03h28.69h226.63c3.14,0,5.69,2.55,5.69,5.69V446.81z"/>
              <path fill="currentColor" d="M369.92,181.53c-6.25-6.25-16.38-6.25-22.63,0c-6.25,6.25-6.25,16.38,0,22.63l44.39,44.39   c3.12,3.13,7.22,4.69,11.31,4.69c0.21,0,0.42-0.02,0.63-0.03c0.2,0.01,0.4,0.03,0.6,0.03c6.31,0,11.74-3.66,14.35-8.96   l37.86-37.86c6.25-6.25,6.25-16.38,0-22.63c-6.25-6.25-16.38-6.25-22.63,0l-13.59,13.59v-86.58c0-8.84-7.16-16-16-16h-86.29   l15.95-15.95c6.25-6.25,6.25-16.38,0-22.63c-6.25-6.25-16.38-6.25-22.63,0l-40.33,40.33c-5.19,2.65-8.75,8.03-8.75,14.25   c0,0.19,0.02,0.37,0.03,0.56c-0.01,0.19-0.03,0.38-0.03,0.57c0,4.24,1.69,8.31,4.69,11.31l42.14,42.14   c3.12,3.12,7.22,4.69,11.31,4.69s8.19-1.56,11.31-4.69c6.25-6.25,6.25-16.38,0-22.63l-15.95-15.95h72.54v73.05L369.92,181.53z"/>
            </svg>                        
          </button>
        </div>            
      `
        : null,
      expandminiplayer: this.settings.status.modes.miniPlayer
        ? `
        <div class="T_M_G-video-mini-player-expand-btn-wrapper">
          <button type="button" class="T_M_G-video-mini-player-expand-btn" data-focusable-control="false" tabindex="-1">
            <svg class="T_M_G-video-mini-player-expand-icon" viewBox="0 -960 960 960" data-control-title="Expand miniplayer${keyShortcuts["expandMiniPlayer"]}" data-no-resize="true">
              <path d="M120-120v-320h80v184l504-504H520v-80h320v320h-80v-184L256-200h184v80H120Z"/>
            </svg>
          </button>
        </div>   
      `
        : null,
      removeminiplayer: this.settings.status.modes.miniPlayer
        ? `
        <div class="T_M_G-video-mini-player-cancel-btn-wrapper">
          <button type="button" class="T_M_G-video-mini-player-cancel-btn" data-focusable-control="false" tabindex="-1">
            <svg class="T_M_G-video-mini-player-cancel-icon" viewBox="0 -960 960 960" data-control-title="Remove miniplayer${keyShortcuts["removeMiniPlayer"]}" data-no-resize="true">
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
            </svg>
          </button>
        </div>   
      `
        : null,
      mainprev: this.settings.status.ui.prev
        ? `
        <button type="button" class="T_M_G-video-main-prev-btn" tabindex="-1">
          <svg class="T_M_G-video-prev-icon" data-control-title="Previous video${keyShortcuts["prev"]}">
            <path fill="currentColor" d="M19,5.14V19.14L8,12.14L19,5.14Z" />
          </svg>
        </button>      
      `
        : null,
      mainplaypause: this.settings.status.ui.playPause
        ? `
        <button type="button" class="T_M_G-video-main-play-pause-btn" data-focusable-control="false" tabindex="${this.initialState ? "0" : "-1"}">
          <svg class="T_M_G-video-play-icon" data-control-title="Play${keyShortcuts["playPause"]}">
            <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
          </svg>
          <svg class="T_M_G-video-pause-icon" data-control-title="Pause${keyShortcuts["playPause"]}">
            <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
          </svg>
          <svg class="T_M_G-video-replay-icon" viewBox="0 -960 960 960" data-control-title="Replay${keyShortcuts["playPause"]}"  data-no-resize="true">
            <path d="M480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440h80q0 117 81.5 198.5T480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720h-6l62 62-56 58-160-160 160-160 56 58-62 62h6q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Z"/>
          </svg> 
        </button>         
      `
        : null,
      mainnext: this.settings.status.ui.next
        ? `
        <button type="button" class="T_M_G-video-main-next-btn" data-focusable-control="false" tabindex="-1">
          <svg class="T_M_G-video-next-icon" data-control-title="Next video${keyShortcuts["next"]}">
            <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
          </svg>
        </button>      
      `
        : null,
      timeline: this.settings.status.ui.timeline
        ? `
        <div class="T_M_G-video-timeline-container" data-focusable-control="false" tabindex="-1">
          <div class="T_M_G-video-timeline">
            <div class="T_M_G-video-loaded-timeline"></div>
            <div class="T_M_G-video-preview-container">
              <img class="T_M_G-video-preview T_M_G-video-preview-image" alt="Preview image" src="${tmg.ALT_IMG_SRC}">
              <canvas class="T_M_G-video-preview T_M_G-video-preview-canvas"></canvas>
            </div>
            <div class="T_M_G-video-thumb-indicator T_M_G-video-rippler"></div>
          </div>
        </div>
      `
        : null,
      prev: this.settings.status.ui.prev
        ? `
        <button type="button" class="T_M_G-video-prev-btn" data-draggable-control="${this.settings.status.ui.draggableControls}" data-control-id="prev" data-focusable-control="false" tabindex="-1">
          <svg class="T_M_G-video-prev-icon" data-control-title="Previous video${keyShortcuts["prev"]}">
            <path fill="currentColor" d="M19,5.14V19.14L8,12.14L19,5.14Z" />
          </svg>
        </button>      
      `
        : null,
      playpause: this.settings.status.ui.playPause
        ? `
        <button type="button" class="T_M_G-video-play-pause-btn" data-draggable-control="${this.settings.status.ui.draggableControls}" data-control-id="playpause" data-focusable-control="false" tabindex="-1">
          <svg class="T_M_G-video-play-icon" data-control-title="Play${keyShortcuts["playPause"]}">
            <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
          </svg>
          <svg class="T_M_G-video-pause-icon" data-control-title="Pause${keyShortcuts["playPause"]}">
            <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
          </svg>
          <svg class="T_M_G-video-replay-icon" viewBox="0 -960 960 960" data-control-title="Replay${keyShortcuts["playPause"]}" data-no-resize="true">
            <path d="M480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440h80q0 117 81.5 198.5T480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720h-6l62 62-56 58-160-160 160-160 56 58-62 62h6q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Z"/>
          </svg> 
        </button>   
      `
        : null,
      next: this.settings.status.ui.next
        ? `
        <button type="button" class="T_M_G-video-next-btn" data-draggable-control="${this.settings.status.ui.draggableControls}" data-control-id="next" data-focusable-control="false" tabindex="-1">
          <svg class="T_M_G-video-next-icon" data-control-title="Next video${keyShortcuts["next"]}">
            <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
          </svg>
        </button>   
      `
        : null,
      volume: this.settings.status.ui.volume
        ? `
        <div class="T_M_G-video-volume-container T_M_G-video-vb-container" data-control-id="volume">
          <button type="button" class="T_M_G-video-mute-btn data-draggable-control="${this.settings.status.ui.draggableControls}" data-focusable-control="false" tabindex="-1">
            <svg class="T_M_G-video-volume-high-icon" data-control-title="Mute${keyShortcuts["mute"]}">
              <path fill="currentColor" d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
            </svg>
            <svg class="T_M_G-video-volume-low-icon" data-control-title="Mute${keyShortcuts["mute"]}">
              <path fill="currentColor" d="M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z" />
            </svg>
            <svg class="T_M_G-video-volume-muted-icon" data-control-title="Unmute${keyShortcuts["mute"]}">
              <path fill="currentColor" d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z" />
            </svg>
          </button>
          <input class="T_M_G-video-volume-slider T_M_G-video-vb-slider" type="range" min="0" max="100" step="1" data-focusable-control="false" tabindex="-1">
        </div>
      `
        : null,
      brightness: this.settings.status.ui.brightness
        ? `
        <div class="T_M_G-video-brightness-container T_M_G-video-vb-container" data-control-id="brightness">
          <button type="button" class="T_M_G-video-dark-btn T_M_G-video-vb-btn" data-draggable-control="${this.settings.status.ui.draggableControls}" data-focusable-control="false" tabindex="-1">
            <svg class="T_M_G-video-brightness-high-icon" data-control-title="Darken${keyShortcuts["dark"]}">
              <path transform="scale(1.05) translate(1.5, 1.5)"  d="M10 14.858a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6-5h3a1 1 0 0 1 0 2h-3a1 1 0 0 1 0-2zm-6 6a1 1 0 0 1 1 1v3a1 1 0 0 1-2 0v-3a1 1 0 0 1 1-1zm0-15a1 1 0 0 1 1 1v3a1 1 0 0 1-2 0v-3a1 1 0 0 1 1-1zm-9 9h3a1 1 0 1 1 0 2H1a1 1 0 0 1 0-2zm13.95 4.535l2.121 2.122a1 1 0 0 1-1.414 1.414l-2.121-2.121a1 1 0 0 1 1.414-1.415zm-8.486 0a1 1 0 0 1 0 1.415l-2.12 2.12a1 1 0 1 1-1.415-1.413l2.121-2.122a1 1 0 0 1 1.414 0zM17.071 3.787a1 1 0 0 1 0 1.414L14.95 7.322a1 1 0 0 1-1.414-1.414l2.12-2.121a1 1 0 0 1 1.415 0zm-12.728 0l2.121 2.121A1 1 0 1 1 5.05 7.322L2.93 5.201a1 1 0 0 1 1.414-1.414z">
              </path>
            </svg>
            <svg class="T_M_G-video-brightness-low-icon" data-control-title="Brighten${keyShortcuts["dark"]}">
              <path transform="scale(1.05) translate(3.25, 3.25)" d="M8 12.858a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6-5h1a1 1 0 0 1 0 2h-1a1 1 0 0 1 0-2zm-6 6a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0v-1a1 1 0 0 1 1-1zm0-13a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1zm-7 7h1a1 1 0 1 1 0 2H1a1 1 0 1 1 0-2zm11.95 4.535l.707.708a1 1 0 1 1-1.414 1.414l-.707-.707a1 1 0 0 1 1.414-1.415zm-8.486 0a1 1 0 0 1 0 1.415l-.707.707A1 1 0 0 1 2.343 13.1l.707-.708a1 1 0 0 1 1.414 0zm9.193-9.192a1 1 0 0 1 0 1.414l-.707.707a1 1 0 0 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 0zm-9.9 0l.707.707A1 1 0 1 1 3.05 5.322l-.707-.707a1 1 0 0 1 1.414-1.414z">
              </path>
            </svg>
            <svg class="T_M_G-video-brightness-dark-icon" data-control-title="Brighten${keyShortcuts["dark"]}">
              <path transform="scale(1.2) translate(2, 2.5)" d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8.5 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0 11a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm5-5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm-11 0a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9.743-4.036a.5.5 0 1 1-.707-.707.5.5 0 0 1 .707.707zm-7.779 7.779a.5.5 0 1 1-.707-.707.5.5 0 0 1 .707.707zm7.072 0a.5.5 0 1 1 .707-.707.5.5 0 0 1-.707.707zM3.757 4.464a.5.5 0 1 1 .707-.707.5.5 0 0 1-.707.707z">
              </path>
            </svg>                  
          </button>
          <input class="T_M_G-video-brightness-slider T_M_G-video-vb-slider" type="range" min="0" max="100" step="1" data-focusable-control="false" tabindex="-1">
        </div>         
      `
        : null,
      duration: this.settings.status.ui.duration
        ? `
        <button class="T_M_G-video-duration-container" title="Time format${keyShortcuts["timeFormat"]}" data-draggable-control="${this.settings.status.ui.draggableControls}" data-focusable-control="false" tabindex="-1" data-control-id="duration">
          <div class="T_M_G-video-current-time">0:00</div>
          /
          <div class="T_M_G-video-total-time">-:--</div>
        </button>   
      `
        : null,
      playbackrate: this.settings.status.ui.playbackRate
        ? `
        <button type="button" class="T_M_G-video-playback-rate-btn" title="Playback rate${keyShortcuts["playbackRate"]}" data-draggable-control="${this.settings.status.ui.draggableControls}" data-focusable-control="false" tabindex="-1" data-control-id="playbackrate">${this.playbackRate}x</button>
      `
        : null,
      captions: this.settings.status.ui.captions
        ? `
        <button type="button" class="T_M_G-video-captions-btn" data-draggable-control="${this.settings.status.ui.draggableControls}" data-focusable-control="false" tabindex="-1" data-control-id="captions">
          <svg data-control-title="Subtitles${keyShortcuts["captions"]}" class="T_M_G-video-subtitles-icon">
            <path fill="currentColor" transform="scale(0.5)" d="M44,6H4A2,2,0,0,0,2,8V40a2,2,0,0,0,2,2H44a2,2,0,0,0,2-2V8A2,2,0,0,0,44,6ZM12,26h4a2,2,0,0,1,0,4H12a2,2,0,0,1,0-4ZM26,36H12a2,2,0,0,1,0-4H26a2,2,0,0,1,0,4Zm10,0H32a2,2,0,0,1,0-4h4a2,2,0,0,1,0,4Zm0-6H22a2,2,0,0,1,0-4H36a2,2,0,0,1,0,4Z" />
          </svg>
          <svg data-control-title="Closed captions${keyShortcuts["captions"]}" class="T_M_G-video-captions-icon" transform="scale(1.15)">
            <path fill="currentColor" d="M18,11H16.5V10.5H14.5V13.5H16.5V13H18V14A1,1 0 0,1 17,15H14A1,1 0 0,1 13,14V10A1,1 0 0,1 14,9H17A1,1 0 0,1 18,10M11,11H9.5V10.5H7.5V13.5H9.5V13H11V14A1,1 0 0,1 10,15H7A1,1 0 0,1 6,14V10A1,1 0 0,1 7,9H10A1,1 0 0,1 11,10M19,4H5C3.89,4 3,4.89 3,6V18A2,2 0 0,0 5,20H19A2,2 0 0,0 21,18V6C21,4.89 20.1,4 19,4Z"></path>
          <svg>
        </button>
      `
        : null,
      settings: this.settings.status.ui.settings
        ? `
        <button type="button" class="T_M_G-video-settings-btn" data-draggable-control="${this.settings.status.ui.draggableControls}" data-focusable-control="false" tabindex="-1" data-control-id="settings">
          <svg class="T_M_G-video-settings-icon" viewBox="0 -960 960 960" data-control-title="Settings${keyShortcuts["settings"]}" data-no-resize="true">
            <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/>
          </svg>
        </button>      
      `
        : null,
      objectfit: this.settings.status.ui.objectFit
        ? `
        <button type="button" class="T_M_G-video-object-fit-btn " data-draggable-control="${this.settings.status.ui.draggableControls}" data-control-id="objectfit" data-focusable-control="false" tabindex="-1">
          <svg class="T_M_G-video-object-fit-contain-icon" data-control-title="Fit to screen${keyShortcuts["objectFit"]}" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16" data-no-resize="true" transform="scale(0.78)">
            <rect width="16" height="16" rx="4" ry="4" fill="none" stroke-width="2.25" stroke="currentColor" class="T_M_G-video-no-fill" />
            <g stroke-width="1" stroke="currentColor" fill="currentColor" transform="translate(3,3) scale(0.6)">
              <path d="M521.667563,212.999001 L523.509521,212.999001 C523.784943,212.999001 524,213.222859 524,213.499001 C524,213.767068 523.780405,213.999001 523.509521,213.999001 L520.490479,213.999001 C520.354351,213.999001 520.232969,213.944316 520.145011,213.855661 C520.056625,213.763694 520,213.642369 520,213.508523 L520,210.48948 C520,210.214059 520.223858,209.999001 520.5,209.999001 C520.768066,209.999001 521,210.218596 521,210.48948 L521,212.252351 L525.779724,207.472627 C525.975228,207.277123 526.284966,207.283968 526.480228,207.47923 C526.66978,207.668781 526.678447,207.988118 526.486831,208.179734 L521.667563,212.999001 Z" transform="translate(-520 -198)"/>
              <path d="M534.330152,212.999001 L532.488194,212.999001 C532.212773,212.999001 531.997715,213.222859 531.997715,213.499001 C531.997715,213.767068 532.21731,213.999001 532.488194,213.999001 L535.507237,213.999001 C535.643364,213.999001 535.764746,213.944316 535.852704,213.855661 C535.94109,213.763694 535.997715,213.642369 535.997715,213.508523 L535.997715,210.48948 C535.997715,210.214059 535.773858,209.999001 535.497715,209.999001 C535.229649,209.999001 534.997715,210.218596 534.997715,210.48948 L534.997715,212.252351 L530.217991,207.472627 C530.022487,207.277123 529.712749,207.283968 529.517487,207.47923 C529.327935,207.668781 529.319269,207.988118 529.510884,208.179734 L534.330152,212.999001 Z" transform="translate(-520 -198)"/>
              <path d="M521.667563,199 L523.509521,199 C523.784943,199 524,198.776142 524,198.5 C524,198.231934 523.780405,198 523.509521,198 L520.490479,198 C520.354351,198 520.232969,198.054685 520.145011,198.14334 C520.056625,198.235308 520,198.356632 520,198.490479 L520,201.509521 C520,201.784943 520.223858,202 520.5,202 C520.768066,202 521,201.780405 521,201.509521 L521,199.74665 L525.779724,204.526374 C525.975228,204.721878 526.284966,204.715034 526.480228,204.519772 C526.66978,204.33022 526.678447,204.010883 526.486831,203.819268 L521.667563,199 Z" transform="translate(-520 -198)"/>
              <path d="M534.251065,199 L532.488194,199 C532.212773,199 531.997715,198.776142 531.997715,198.5 C531.997715,198.231934 532.21731,198 532.488194,198 L535.507237,198 C535.643364,198 535.764746,198.054685 535.852704,198.14334 C535.94109,198.235308 535.997715,198.356632 535.997715,198.490479 L535.997715,201.509521 C535.997715,201.784943 535.773858,202 535.497715,202 C535.229649,202 534.997715,201.780405 534.997715,201.509521 L534.997715,199.667563 L530.178448,204.486831 C529.982944,204.682335 529.673206,204.67549 529.477943,204.480228 C529.288392,204.290677 529.279725,203.97134 529.471341,203.779724 L534.251065,199 Z" transform="translate(-520 -198)"/>
            </g>
          </svg>
          <svg class="T_M_G-video-object-fit-cover-icon" data-control-title="Stretch${keyShortcuts["objectFit"]}" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16" data-no-resize="true" transform="scale(0.78)">
            <rect width="16" height="16" rx="4" ry="4" fill="none" stroke-width="2.25" stroke="currentColor" class="T_M_G-video-no-fill" />
            <g stroke-width="1" stroke="currentColor" fill="currentColor" transform="translate(3,3) scale(0.6)">
              <path d="M521.667563,212.999001 L523.509521,212.999001 C523.784943,212.999001 524,213.222859 524,213.499001 C524,213.767068 523.780405,213.999001 523.509521,213.999001 L520.490479,213.999001 C520.354351,213.999001 520.232969,213.944316 520.145011,213.855661 C520.056625,213.763694 520,213.642369 520,213.508523 L520,210.48948 C520,210.214059 520.223858,209.999001 520.5,209.999001 C520.768066,209.999001 521,210.218596 521,210.48948 L521,212.252351 L525.779724,207.472627 C525.975228,207.277123 526.284966,207.283968 526.480228,207.47923 C526.66978,207.668781 526.678447,207.988118 526.486831,208.179734 L521.667563,212.999001 Z" transform="translate(-520 -198)"/>
              <path d="M534.251065,199 L532.488194,199 C532.212773,199 531.997715,198.776142 531.997715,198.5 C531.997715,198.231934 532.21731,198 532.488194,198 L535.507237,198 C535.643364,198 535.764746,198.054685 535.852704,198.14334 C535.94109,198.235308 535.997715,198.356632 535.997715,198.490479 L535.997715,201.509521 C535.997715,201.784943 535.773858,202 535.497715,202 C535.229649,202 534.997715,201.780405 534.997715,201.509521 L534.997715,199.667563 L530.178448,204.486831 C529.982944,204.682335 529.673206,204.67549 529.477943,204.480228 C529.288392,204.290677 529.279725,203.97134 529.471341,203.779724 L534.251065,199 Z" transform="translate(-520 -198)"/>
            </g>
          </svg>
          <svg class="T_M_G-video-object-fit-fill-icon" data-control-title="Crop to fit${keyShortcuts["objectFit"]}" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16" data-no-resize="true" transform="scale(0.78)">
            <rect x="4" y="4" width="8" height="8" rx="1" ry="1" fill="none" stroke-width="1.5" stroke="currentColor" class="T_M_G-video-no-fill" />
            <g stroke-width="1" stroke="currentColor" fill="currentColor" transform="translate(3, 3) scale(0.65)">  
              <path d="M521.667563,212.999001 L523.509521,212.999001 C523.784943,212.999001 524,213.222859 524,213.499001 C524,213.767068 523.780405,213.999001 523.509521,213.999001 L520.490479,213.999001 C520.354351,213.999001 520.232969,213.944316 520.145011,213.855661 C520.056625,213.763694 520,213.642369 520,213.508523 L520,210.48948 C520,210.214059 520.223858,209.999001 520.5,209.999001 C520.768066,209.999001 521,210.218596 521,210.48948 L521,212.252351 L525.779724,207.472627 C525.975228,207.277123 526.284966,207.283968 526.480228,207.47923 C526.66978,207.668781 526.678447,207.988118 526.486831,208.179734 L521.667563,212.999001 Z" transform="translate(-520, -198) translate(-3.25, 2.75)" />  
              <path d="M534.251065,199 L532.488194,199 C532.212773,199 531.997715,198.776142 531.997715,198.5 C531.997715,198.231934 532.21731,198 532.488194,198 L535.507237,198 C535.643364,198 535.764746,198.054685 535.852704,198.14334 C535.94109,198.235308 535.997715,198.356632 535.997715,198.490479 L535.997715,201.509521 C535.997715,201.784943 535.773858,202 535.497715,202 C535.229649,202 534.997715,201.780405 534.997715,201.509521 L534.997715,199.667563 L530.178448,204.486831 C529.982944,204.682335 529.673206,204.67549 529.477943,204.480228 C529.288392,204.290677 529.279725,203.97134 529.471341,203.779724 L534.251065,199 Z" transform="translate(-520, -198) translate(2.5, -3.25)" />  
            </g> 
          </svg>               
        </button>            
      `
        : null,
      pictureinpicture: this.settings.status.ui.pictureInPicture
        ? `
        <button type="button" class="T_M_G-video-picture-in-picture-btn" data-draggable-control="${this.settings.status.ui.draggableControls}" data-focusable-control="false" tabindex="-1" data-control-id="pictureinpicture">
          <svg class="T_M_G-video-enter-picture-in-picture-icon" data-control-title="Picture-in-picture${keyShortcuts["pictureInPicture"]}">
            <path class="T_M_G-video-no-fill" fill="none" d="M0 0h24v24H0z" />
            <path fill="currentColor" fill-rule="nonzero" d="M21 3a1 1 0 0 1 1 1v7h-2V5H4v14h6v2H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18zm0 10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h8zM6.707 6.293l2.25 2.25L11 6.5V12H5.5l2.043-2.043-2.25-2.25 1.414-1.414z" />
          </svg>
          <svg class="T_M_G-video-leave-picture-in-picture-icon" data-control-title="Exit picture-in-picture${keyShortcuts["pictureInPicture"]}">
            <path class="T_M_G-video-no-fill" fill="none" d="M0 0h24v24H0z"></path>
            <path fill-rule="nonzero" d="M21 3a1 1 0 0 1 1 1v7h-2V5H4v14h6v2H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18zm0 10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h8zm-9.5-6L9.457 9.043l2.25 2.25-1.414 1.414-2.25-2.25L6 12.5V7h5.5z">
            </path>
          </svg>
        </button>   
      `
        : null,
      theater: this.settings.status.ui.theater
        ? `
        <button type="button" class="T_M_G-video-theater-btn" data-draggable-control="${this.settings.status.ui.draggableControls}" data-focusable-control="false" tabindex="-1" data-control-id="theater">
          <svg class="T_M_G-video-enter-theater-icon" data-control-title="Cinema mode${keyShortcuts["theater"]}">
            <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M23 7C23 5.34315 21.6569 4 20 4H4C2.34315 4 1 5.34315 1 7V17C1 18.6569 2.34315 20 4 20H20C21.6569 20 23 18.6569 23 17V7ZM21 7C21 6.44772 20.5523 6 20 6H4C3.44772 6 3 6.44771 3 7V17C3 17.5523 3.44772 18 4 18H20C20.5523 18 21 17.5523 21 17V7Z"/>
          </svg>
          <svg class="T_M_G-video-leave-theater-icon" data-control-title="Default view${keyShortcuts["theater"]}">
            <path fill="currentColor" d="M19 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H5V8h14v8z"></path>
          </svg>
        </button>
      `
        : null,
      fullscreen: this.settings.status.ui.fullScreen
        ? `
        <button type="button" class="T_M_G-video-full-screen-btn" data-draggable-control="${this.settings.status.ui.draggableControls}" data-focusable-control="false" tabindex="-1" data-control-id="fullscreen">
          <svg class="T_M_G-video-enter-full-screen-icon" data-control-title="Full screen${keyShortcuts["fullScreen"]}" transform="scale(.8)">
            <path d="M4 1.5C2.61929 1.5 1.5 2.61929 1.5 4V8.5C1.5 9.05228 1.94772 9.5 2.5 9.5H3.5C4.05228 9.5 4.5 9.05228 4.5 8.5V4.5H8.5C9.05228 4.5 9.5 4.05228 9.5 3.5V2.5C9.5 1.94772 9.05228 1.5 8.5 1.5H4Z" fill="currentColor" />
            <path d="M20 1.5C21.3807 1.5 22.5 2.61929 22.5 4V8.5C22.5 9.05228 22.0523 9.5 21.5 9.5H20.5C19.9477 9.5 19.5 9.05228 19.5 8.5V4.5H15.5C14.9477 4.5 14.5 4.05228 14.5 3.5V2.5C14.5 1.94772 14.9477 1.5 15.5 1.5H20Z" fill="currentColor" />
            <path d="M20 22.5C21.3807 22.5 22.5 21.3807 22.5 20V15.5C22.5 14.9477 22.0523 14.5 21.5 14.5H20.5C19.9477 14.5 19.5 14.9477 19.5 15.5V19.5H15.5C14.9477 19.5 14.5 19.9477 14.5 20.5V21.5C14.5 22.0523 14.9477 22.5 15.5 22.5H20Z" fill="currentColor" />
            <path d="M1.5 20C1.5 21.3807 2.61929 22.5 4 22.5H8.5C9.05228 22.5 9.5 22.0523 9.5 21.5V20.5C9.5 19.9477 9.05228 19.5 8.5 19.5H4.5V15.5C4.5 14.9477 4.05228 14.5 3.5 14.5H2.5C1.94772 14.5 1.5 14.9477 1.5 15.5V20Z" fill="currentColor" />
          </svg>
          <svg class="T_M_G-video-leave-full-screen-icon" data-control-title="Exit full screen${keyShortcuts["fullScreen"]}" transform="scale(.8)">
            <path d="M7 9.5C8.38071 9.5 9.5 8.38071 9.5 7V2.5C9.5 1.94772 9.05228 1.5 8.5 1.5H7.5C6.94772 1.5 6.5 1.94772 6.5 2.5V6.5H2.5C1.94772 6.5 1.5 6.94772 1.5 7.5V8.5C1.5 9.05228 1.94772 9.5 2.5 9.5H7Z" fill="currentColor" />
            <path d="M17 9.5C15.6193 9.5 14.5 8.38071 14.5 7V2.5C14.5 1.94772 14.9477 1.5 15.5 1.5H16.5C17.0523 1.5 17.5 1.94772 17.5 2.5V6.5H21.5C22.0523 6.5 22.5 6.94772 22.5 7.5V8.5C22.5 9.05228 22.0523 9.5 21.5 9.5H17Z" fill="currentColor" />
            <path d="M17 14.5C15.6193 14.5 14.5 15.6193 14.5 17V21.5C14.5 22.0523 14.9477 22.5 15.5 22.5H16.5C17.0523 22.5 17.5 22.0523 17.5 21.5V17.5H21.5C22.0523 17.5 22.5 17.0523 22.5 16.5V15.5C22.5 14.9477 22.0523 14.5 21.5 14.5H17Z" fill="currentColor" />
            <path d="M9.5 17C9.5 15.6193 8.38071 14.5 7 14.5H2.5C1.94772 14.5 1.5 14.9477 1.5 15.5V16.5C1.5 17.0523 1.94772 17.5 2.5 17.5H6.5V21.5C6.5 22.0523 6.94772 22.5 7.5 22.5H8.5C9.05228 22.5 9.5 22.0523 9.5 21.5V17Z" fill="currentColor" />
          </svg>
        </button>   
      `
        : null,
    };
  }

  buildControllerStructure() {
    const spacerIndex = this.settings.controllerStructure.indexOf("spacer"),
      leftSideControls = spacerIndex > -1 ? this.settings.controllerStructure.slice(0, spacerIndex) : null,
      rightSideControls = spacerIndex > -1 ? this.settings.controllerStructure.slice(spacerIndex + 1) : null,
      //breaking HTML into smaller units to use as building blocks
      overlayControlsContainerBuild = this.queryDOM(".T_M_G-video-overlay-controls-container"),
      controlsContainerBuild = this.queryDOM(".T_M_G-video-controls-container"),
      notifiersContainerBuild = this.settings.status.ui.notifiers ? document.createElement("div") : null,
      overlayMainControlsWrapperBuild = document.createElement("div"),
      controlsWrapperBuild = document.createElement("div"),
      leftSideControlsWrapperBuild = this.settings.status.ui.leftSideControls ? document.createElement("div") : null,
      rightSideControlsWrapperBuild = this.settings.status.ui.rightSideControls ? document.createElement("div") : null;
    const HTML = this.getPlayerHTML();
    //building and deploying video controls
    overlayControlsContainerBuild.innerHTML = ``;
    controlsContainerBuild.innerHTML = ``;
    //builiding overlay controls so order of insertioni matters because they are eall positioned absolutely
    overlayControlsContainerBuild.innerHTML += HTML.pictureinpicturewrapper;
    //builidng and deploying Notifiers HTML
    if (this.settings.status.ui.notifiers) {
      notifiersContainerBuild.classList = "T_M_G-video-notifiers-container";
      notifiersContainerBuild.setAttribute("data-current-notifier", "");
      notifiersContainerBuild.innerHTML += ``.concat(HTML.playpausenotifier ?? "", HTML.captionsnotifier ?? "", HTML.objectfitnotifier ?? "", HTML.playbackratenotifier ?? "", HTML.volumenotifier ?? "", HTML.brightnessnotifier ?? "", HTML.fwdnotifier ?? "", HTML.bwdnotifier ?? "", HTML.scrubnotifier ?? "", HTML.touchtimelinenotifier ?? "", HTML.touchvolumenotifier ?? "", HTML.touchbrightnessnotifier ?? "");
      overlayControlsContainerBuild.append(notifiersContainerBuild);
    }
    //building and deploying overlay general controls
    overlayControlsContainerBuild.innerHTML += ``.concat(HTML.thumbnail ?? "", HTML.videobuffer ?? "", HTML.cueContainer ?? "", HTML.playlisttitle ?? "", HTML.expandminiplayer ?? "", HTML.removeminiplayer ?? "", HTML.fullscreenorientation ?? "");
    //building and deploying overlay main controls wrapper
    overlayMainControlsWrapperBuild.innerHTML += ``.concat(HTML.mainprev ?? "", HTML.mainplaypause ?? "", HTML.mainnext ?? "");
    overlayMainControlsWrapperBuild.classList = "T_M_G-video-overlay-main-controls-wrapper";
    overlayControlsContainerBuild.append(overlayMainControlsWrapperBuild);
    //building and deploying controls wrapper
    if (this.settings.status.ui.leftSideControls) {
      leftSideControlsWrapperBuild.classList = "T_M_G-video-left-side-controls-wrapper-cover T_M_G-video-side-controls-wrapper-cover";
      const leftSideControlsWrapper = document.createElement("div");
      leftSideControlsWrapper.classList = "T_M_G-video-left-side-controls-wrapper T_M_G-video-side-controls-wrapper";
      leftSideControlsWrapper.setAttribute("data-dropzone", this.settings.status.ui.draggableControls);
      leftSideControlsWrapper.innerHTML += ``.concat(...Array.from(leftSideControls, (el) => HTML[el] || ""));
      leftSideControlsWrapperBuild.append(leftSideControlsWrapper);
      controlsWrapperBuild.append(leftSideControlsWrapperBuild);
    }
    if (this.settings.status.ui.rightSideControls) {
      rightSideControlsWrapperBuild.classList = "T_M_G-video-right-side-controls-wrapper-cover T_M_G-video-side-controls-wrapper-cover";
      const rightSideControlsWrapper = document.createElement("div");
      rightSideControlsWrapper.classList = "T_M_G-video-right-side-controls-wrapper T_M_G-video-side-controls-wrapper";
      rightSideControlsWrapper.setAttribute("data-dropzone", this.settings.status.ui.draggableControls);
      rightSideControlsWrapper.innerHTML += ``.concat(...Array.from(rightSideControls, (el) => HTML[el] || ""));
      rightSideControlsWrapperBuild.append(rightSideControlsWrapper);
      controlsWrapperBuild.append(rightSideControlsWrapperBuild);
    }
    // packing compiled build into controls container
    controlsContainerBuild.innerHTML += HTML.timeline ?? "";
    controlsWrapperBuild.classList = "T_M_G-video-controls-wrapper";
    controlsContainerBuild.append(controlsWrapperBuild);
  }

  queryDOM(query, isPseudo = false) {
    return (isPseudo ? this.pseudoVideoContainer : this.videoContainer).querySelector(query);
  }

  retrieveDOM() {
    const { ui, modes } = this.settings.status;
    this.DOM = {
      video: this.video,
      videoContainer: this.videoContainer,
      videoContainerContentWrapper: this.queryDOM(".T_M_G-video-container-content-wrapper"),
      videoContainerContent: this.queryDOM(".T_M_G-video-container-content"),
      videoTitleWrapper: this.queryDOM(".T_M_G-video-title-wrapper"),
      videoTitle: this.queryDOM(".T_M_G-video-title"),
      videoTitle: this.queryDOM(".T_M_G-video-title"),
      thumbnailImg: this.queryDOM(".T_M_G-video-thumbnail-image"),
      thumbnailCanvas: this.queryDOM(".T_M_G-video-thumbnail-canvas"),
      videoBuffer: this.queryDOM(".T_M_G-video-buffer"),
      notifiersContainer: ui.notifiers ? this.queryDOM(".T_M_G-video-notifiers-container") : null,
      playNotifier: ui.notifiers ? this.queryDOM(".T_M_G-video-play-notifier") : null,
      pauseNotifier: ui.notifiers ? this.queryDOM(".T_M_G-video-pause-notifier") : null,
      captionsNotifier: ui.notifiers ? this.queryDOM(".T_M_G-video-captions-notifier") : null,
      objectFitNotifier: ui.notifiers ? this.queryDOM(".T_M_G-video-object-fit-notifier") : null,
      playbackRateNotifier: ui.notifiers ? this.queryDOM(".T_M_G-video-playback-rate-notifier") : null,
      playbackRateNotifierText: ui.notifiers ? this.queryDOM(".T_M_G-video-playback-rate-notifier-text") : null,
      playbackRateNotifierContent: ui.notifiers ? this.queryDOM(".T_M_G-video-playback-rate-notifier-content") : null,
      playbackRateUpNotifier: ui.notifiers ? this.queryDOM(".T_M_G-video-playback-rate-up-notifier") : null,
      playbackRateDownNotifier: ui.notifiers ? this.queryDOM(".T_M_G-video-playback-rate-down-notifier") : null,
      volumeNotifierContent: ui.notifiers ? this.queryDOM(".T_M_G-video-volume-notifier-content") : null,
      volumeUpNotifier: ui.notifiers ? this.queryDOM(".T_M_G-video-volume-up-notifier") : null,
      volumeDownNotifier: ui.notifiers ? this.queryDOM(".T_M_G-video-volume-down-notifier") : null,
      volumeMutedNotifier: ui.notifiers ? this.queryDOM(".T_M_G-video-volume-muted-notifier") : null,
      brightnessNotifierContent: ui.notifiers ? this.queryDOM(".T_M_G-video-brightness-notifier-content") : null,
      brightnessUpNotifier: ui.notifiers ? this.queryDOM(".T_M_G-video-brightness-up-notifier") : null,
      brightnessDownNotifier: ui.notifiers ? this.queryDOM(".T_M_G-video-brightness-down-notifier") : null,
      brightnessDarkNotifier: ui.notifiers ? this.queryDOM(".T_M_G-video-brightness-dark-notifier") : null,
      fwdNotifier: ui.notifiers ? this.queryDOM(".T_M_G-video-fwd-notifier") : null,
      bwdNotifier: ui.notifiers ? this.queryDOM(".T_M_G-video-bwd-notifier") : null,
      scrubNotifierText: ui.notifiers ? this.queryDOM(".T_M_G-video-scrub-notifier-text") : null,
      scrubNotifier: ui.notifiers ? this.queryDOM(".T_M_G-video-scrub-notifier") : null,
      touchTimelineNotifier: ui.notifiers ? this.queryDOM(".T_M_G-video-touch-timeline-notifier") : null,
      touchVolumeContent: ui.notifiers ? this.queryDOM(".T_M_G-video-touch-volume-content") : null,
      touchVolumeNotifier: ui.notifiers ? this.queryDOM(".T_M_G-video-touch-volume-notifier") : null,
      touchVolumeSlider: ui.notifiers ? this.queryDOM(".T_M_G-video-touch-volume-slider") : null,
      touchBrightnessContent: ui.notifiers ? this.queryDOM(".T_M_G-video-touch-brightness-content") : null,
      touchBrightnessNotifier: ui.notifiers ? this.queryDOM(".T_M_G-video-touch-brightness-notifier") : null,
      touchBrightnessSlider: ui.notifiers ? this.queryDOM(".T_M_G-video-touch-brightness-slider") : null,
      videoOverlayControlsContainer: this.queryDOM(".T_M_G-video-overlay-controls-container"),
      videoOverlayMainControlsWrapper: this.queryDOM(".T_M_G-video-overlay-main-controls-wrapper"),
      videoControlsContainer: this.queryDOM(".T_M_G-video-controls-container"),
      videoControlsWrapper: ui.leftSideControls || ui.rightSideControls ? this.queryDOM(".T_M_G-video-controls-wrapper") : null,
      leftSideControlsWrapper: ui.leftSideControls ? this.queryDOM(".T_M_G-video-left-side-controls-wrapper") : null,
      rightSideControlsWrapper: ui.rightSideControls ? this.queryDOM(".T_M_G-video-right-side-controls-wrapper") : null,
      pictureInPictureWrapper: this.queryDOM(".T_M_G-video-picture-in-picture-wrapper"),
      pictureInPictureActiveIconWrapper: this.queryDOM(".T_M_G-video-picture-in-picture-icon-wrapper"),
      cueContainer: this.queryDOM(".T_M_G-video-cue-container"),
      fullScreenOrientationBtn: ui.fullScreen ? this.queryDOM(".T_M_G-video-full-screen-orientation-btn") : null,
      miniPlayerExpandBtn: modes.miniPlayer ? this.queryDOM(".T_M_G-video-mini-player-expand-btn") : null,
      miniPlayerCancelBtn: modes.miniPlayer ? this.queryDOM(".T_M_G-video-mini-player-cancel-btn") : null,
      mainPrevBtn: ui.prev ? this.queryDOM(".T_M_G-video-main-prev-btn") : null,
      mainPlayPauseBtn: ui.playPause ? this.queryDOM(".T_M_G-video-main-play-pause-btn") : null,
      mainNextBtn: ui.next ? this.queryDOM(".T_M_G-video-main-next-btn") : null,
      timelineContainer: ui.timeline ? this.queryDOM(".T_M_G-video-timeline-container") : null,
      previewContainer: ui.timeline ? this.queryDOM(".T_M_G-video-preview-container") : null,
      previewImg: ui.timeline ? this.queryDOM(".T_M_G-video-preview-image") : null,
      previewCanvas: ui.timeline ? this.queryDOM(".T_M_G-video-preview-canvas") : null,
      prevBtn: ui.prev ? this.queryDOM(".T_M_G-video-prev-btn") : null,
      playPauseBtn: ui.playPause ? this.queryDOM(".T_M_G-video-play-pause-btn") : null,
      nextBtn: ui.next ? this.queryDOM(".T_M_G-video-next-btn") : null,
      objectFitBtn: ui.objectFit ? this.queryDOM(".T_M_G-video-object-fit-btn") : null,
      volumeContainer: ui.volume ? this.queryDOM(".T_M_G-video-volume-container") : null,
      volumeSlider: ui.volume ? this.queryDOM(".T_M_G-video-volume-slider") : null,
      brightnessContainer: ui.brightness ? this.queryDOM(".T_M_G-video-brightness-container") : null,
      brightnessSlider: ui.brightness ? this.queryDOM(".T_M_G-video-brightness-slider") : null,
      durationContainer: ui.duration ? this.queryDOM(".T_M_G-video-duration-container") : null,
      currentTimeElement: ui.duration ? this.queryDOM(".T_M_G-video-current-time") : null,
      totalTimeElement: ui.duration ? this.queryDOM(".T_M_G-video-total-time") : null,
      muteBtn: ui.volume ? this.queryDOM(".T_M_G-video-mute-btn") : null,
      darkBtn: ui.volume ? this.queryDOM(".T_M_G-video-dark-btn") : null,
      captionsBtn: ui.captions ? this.queryDOM(".T_M_G-video-captions-btn") : null,
      settingsBtn: ui.settings ? this.queryDOM(".T_M_G-video-settings-btn") : null,
      playbackRateBtn: ui.playbackRate ? this.queryDOM(".T_M_G-video-playback-rate-btn") : null,
      pictureInPictureBtn: ui.pictureInPicture ? this.queryDOM(".T_M_G-video-picture-in-picture-btn") : null,
      theaterBtn: ui.theater ? this.queryDOM(".T_M_G-video-theater-btn") : null,
      fullScreenBtn: ui.fullScreen ? this.queryDOM(".T_M_G-video-full-screen-btn") : null,
      svgs: this.videoContainer.getElementsByTagName("svg"),
      focusableControls: this.videoContainer.querySelectorAll("[data-focusable-control]"),
      draggableControls: ui.draggableControls ? this.videoContainer.querySelectorAll("[data-draggable-control]") : null,
      draggableControlContainers: ui.draggableControls ? this.videoContainer.querySelectorAll(".T_M_G-video-side-controls-wrapper") : null,
      settingsCloseBtn: this.settings ? this.queryDOM(".T_M_G-video-settings-close-btn") : null,
    };
  }

  initPlayer() {
    this.retrieveDOM();
    this.syncAspectRatio();
    this.observeResize();
    this.svgSetup();
    if (!(this.video.currentSrc || this.video.src)) return this._handleLoadedError();
    this.setTitleState();
    this.setBtnsState();
    this.setVideoEventListeners();
    if (this.initialState && this.video.paused) this.addInitialState();
    else this.initControls();
    if (this.disabled) this.disable();
    this.initialized = true;
  }

  addInitialState() {
    if (!this.initialState) return;
    if (this.settings.time.start && !this.video.poster) this.currentTime = this.settings.time.start;
    this.videoContainer.classList.add("T_M_G-video-initial");
    this.video.addEventListener("play", this.removeInitialState, { once: true });
    this.DOM.mainPlayPauseBtn?.addEventListener("click", this.removeInitialState);
    this.DOM.videoContainerContent.addEventListener("click", this.removeInitialState);
  }

  removeInitialState() {
    if (!this.initialState) return;
    this.stall();
    this.videoContainer.classList.remove("T_M_G-video-initial");
    this.initialState = false;
    this.togglePlay(true);
    this.initControls();
    this.DOM.mainPlayPauseBtn?.removeEventListener("click", this.removeInitialState);
    this.DOM.videoContainerContent.removeEventListener("click", this.removeInitialState);
  }

  stall() {
    this.showOverlay();
    this.DOM.mainPlayPauseBtn?.classList.add("T_M_G-video-control-spin");
    this.DOM.mainPlayPauseBtn?.addEventListener("animationend", () => this.DOM.mainPlayPauseBtn?.classList.remove("T_M_G-video-control-spin"), { once: true });
  }

  initControls() {
    this._handleLoadedMetadata();
    this.updateAudioSettings();
    this.updateBrightnessSettings();
    this.updatePlaybackRateSettings();
    this.updateCaptionsSettings();
    this.enableFocusableControls("all");
    this.setInitialStates();
    this.setGeneralEventListeners();
    this.observeIntersection();
    this.cache();
  }

  setInitialStates() {
    this.showOverlay();
    this.setTitleState();
    this.setCaptionsState();
    this.setPreviewImagesState();
    this.setBtnsState();
    this.pseudoVideo.src = this.video.src || this.video.currentSrc;
  }

  setTitleState(title) {
    const t = (title ?? this.media?.title) || "";
    if (this.DOM.videoTitle) this.DOM.videoTitle.textContent = this.DOM.videoTitle.dataset.videoTitle = t;
  }

  setPosterState() {
    if (this.media?.artwork && this.media.artwork[0]?.src !== this.video.poster) this.video.poster = this.media.artwork[0].src;
  }

  setCaptionsState() {
    if (this.video.textTracks.length <= 0) return;
    [...this.video.textTracks].forEach((track, index) => {
      track.oncuechange = () => {
        const cue = track.activeCues?.[0];
        this._handleCueChange(cue);
      };
      if (track.mode === "showing") {
        this.textTrackIndex = index;
        return (track.mode = "hidden");
      }
      track.mode = "hidden";
    });
    this.video.textTracks[this.textTrackIndex].mode = this.settings.auto.captions ? "showing" : "hidden";
    this.videoContainer.classList.toggle("T_M_G-video-captions", this.settings.auto.captions);
    this.videoContainer.setAttribute("data-track-kind", this.video.textTracks[this.textTrackIndex].kind);
  }

  setPreviewImagesState() {
    this.videoAltImgSrc = `url(${tmg.ALT_IMG_SRC})`;
    this.videoContainer.classList.toggle("T_M_G-video-no-previews", !this.settings.time.previewImages);
    this.videoContainer.setAttribute("data-preview-type", this.settings.status.ui.previewImages ? "image" : "canvas");
    if (this.settings.status.ui.previewImages || !this.settings.time.previewImages) return;
    this.previewContext = this.DOM.previewCanvas.getContext("2d");
    this.thumbnailContext = this.DOM.thumbnailCanvas.getContext("2d");
    let dummyImg = document.createElement("img");
    dummyImg.src = tmg.ALT_IMG_SRC;
    dummyImg.onload = () => {
      this.previewContext?.drawImage(dummyImg, 0, 0, this.DOM.previewCanvas.width, this.DOM.previewCanvas.height);
      this.thumbnailContext?.drawImage(dummyImg, 0, 0, this.DOM.thumbnailCanvas.width, this.DOM.thumbnailCanvas.height);
      dummyImg = null;
    };
  }

  setBtnsState(target) {
    const setBtnState = (btn, { hidden = false, disabled = false }) => {
      btn?.classList?.toggle("T_M_G-video-control-hidden", hidden);
      btn?.classList?.toggle("T_M_G-video-control-disabled", disabled);
    };
    const t = this,
      atFirst = this.currentPlaylistIndex <= 0,
      atLast = !this.playlist || this.currentPlaylistIndex >= this.playlist.length - 1;
    const groups = {
      pictureInPicture: () => setBtnState(t.DOM.pictureInPictureBtn, { hidden: !t.settings.status.modes.pictureInPicture }),
      fullScreen: () => setBtnState(t.DOM.fullScreenBtn, { hidden: !t.settings.status.modes.fullScreen }),
      theater: () => setBtnState(t.DOM.theaterBtn, { hidden: !t.settings.status.modes.theater }),
      captions: () =>
        setBtnState(t.DOM.captionsBtn, {
          disabled: !t.video.textTracks[t.textTrackIndex],
        }),
      playbackRate() {
        if (t.DOM.playbackRateBtn) t.DOM.playbackRateBtn.textContent = `${t.playbackRate}x`;
      },
      playlist() {
        setBtnState(t.DOM?.mainPrevBtn, {
          hidden: !t.playlist,
          disabled: !!t.playlist && atFirst,
        });
        setBtnState(t.DOM?.mainNextBtn, {
          hidden: !t.playlist,
          disabled: !!t.playlist && atLast,
        });
        setBtnState(t.DOM?.prevBtn, { hidden: atFirst });
        setBtnState(t.DOM?.nextBtn, { hidden: atLast });
      },
    };
    if (tmg.isArray(target)) target.forEach((g) => groups[g]?.());
    else if (target) groups[target]?.();
    else Object.values(groups).forEach((fn) => fn());
  }

  setGeneralEventListeners() {
    this.setVideoContainerEventListeners();
    this.setControlsEventListeners();
    this.setSettingsEventListeners();
  }

  setKeyEventListeners(target) {
    if (this.disabled || this.locked) return;
    this.floatingPlayer?.addEventListener("keydown", this._handleKeyDown);
    this.floatingPlayer?.addEventListener("keyup", this._handleKeyUp);
    if (target === "floating") return;
    window.addEventListener("keydown", this._handleKeyDown);
    window.addEventListener("keyup", this._handleKeyUp);
  }

  removeKeyEventListeners(target) {
    this.floatingPlayer?.removeEventListener("keydown", this._handleKeyDown);
    this.floatingPlayer?.removeEventListener("keyup", this._handleKeyUp);
    if (target === "floating") return;
    window.removeEventListener("keydown", this._handleKeyDown);
    window.removeEventListener("keyup", this._handleKeyUp);
  }

  setVideoContainerEventListeners() {
    this.DOM.videoOverlayControlsContainer.addEventListener("contextmenu", this._handleRightClick);
    this.DOM.videoControlsContainer.addEventListener("contextmenu", this._handleRightClick);
    this.DOM.videoOverlayControlsContainer.addEventListener("click", this._handleHoverPointerDown, true);
    this.DOM.videoControlsContainer.addEventListener("click", this._handleHoverPointerDown, true);
    this.DOM.videoOverlayControlsContainer.addEventListener("pointerover", this._handleHoverPointerActive, true);
    this.DOM.videoControlsContainer.addEventListener("pointerover", this._handleHoverPointerActive, true);
    this.DOM.videoOverlayControlsContainer.addEventListener("pointermove", this._handleHoverPointerActive, true);
    this.DOM.videoControlsContainer.addEventListener("pointermove", this._handleHoverPointerActive, true);
    this.DOM.videoOverlayControlsContainer.addEventListener("mouseleave", this._handleHoverPointerOut, true);
    this.DOM.videoControlsContainer.addEventListener("mouseleave", this._handleHoverPointerOut, true);
    this.DOM.videoOverlayControlsContainer.addEventListener("click", this._handleClick, true);
    this.DOM.videoOverlayControlsContainer.addEventListener("dblclick", this._handleDoubleClick, true);
    this.DOM.videoOverlayControlsContainer.addEventListener("mousedown", this._handleSpeedPointerDown, true);
    this.DOM.videoOverlayControlsContainer.addEventListener("touchstart", this._handleSpeedPointerDown, { passive: true, useCapture: true });
    this.DOM.videoOverlayControlsContainer.addEventListener("touchstart", this._handleGestureTouchStart, { passive: false, useCapture: true });
  }

  setVideoEventListeners() {
    this.video.addEventListener("error", this._handleLoadedError);
    this.video.addEventListener("play", this._handlePlay);
    this.video.addEventListener("pause", this._handlePause);
    this.video.addEventListener("waiting", this._handleBufferStart);
    this.video.addEventListener("playing", this._handleBufferStop);
    this.video.addEventListener("durationchange", this._handleDurationChange);
    this.video.addEventListener("ratechange", this._handlePlaybackRateChange);
    this.video.addEventListener("timeupdate", this._handleTimeUpdate);
    this.video.addEventListener("progress", this._handleLoadedProgress);
    this.video.addEventListener("loadedmetadata", this._handleLoadedMetadata);
    this.video.addEventListener("loadeddata", this._handleLoadedData);
    this.video.addEventListener("ended", this._handleEnded);
    this.video.addEventListener("enterpictureinpicture", this._handleEnterPictureInPicture);
    this.video.addEventListener("leavepictureinpicture", this._handleLeavePictureInPicture);
  }

  removeVideoEventListeners() {
    if (this.initialState) this.video.removeEventListener("play", this.removeInitialState, { once: true });
    this.video.removeEventListener("error", this._handleLoadedError);
    this.video.removeEventListener("play", this._handlePlay);
    this.video.removeEventListener("pause", this._handlePause);
    this.video.removeEventListener("waiting", this._handleBufferStart);
    this.video.removeEventListener("playing", this._handleBufferStop);
    this.video.removeEventListener("durationchange", this._handleDurationChange);
    this.video.removeEventListener("ratechange", this._handlePlaybackRateChange);
    this.video.removeEventListener("timeupdate", this._handleTimeUpdate);
    this.video.removeEventListener("progress", this._handleLoadedProgress);
    this.video.removeEventListener("loadedmetadata", this._handleLoadedMetadata);
    this.video.removeEventListener("loadeddata", this._handleLoadedData);
    this.video.removeEventListener("ended", this._handleEnded);
    this.video.removeEventListener("enterpictureinpicture", this._handleEnterPictureInPicture);
    this.video.removeEventListener("leavepictureinpicture", this._handleLeavePictureInPicture);
  }

  setControlsEventListeners() {
    this.DOM.fullScreenOrientationBtn?.addEventListener("click", this.changeFullScreenOrientation);
    this.DOM.miniPlayerExpandBtn?.addEventListener("click", this.expandMiniPlayer);
    this.DOM.miniPlayerCancelBtn?.addEventListener("click", this.cancelMiniPlayer);
    this.DOM.mainPrevBtn?.addEventListener("click", this.previousVideo);
    this.DOM.prevBtn?.addEventListener("click", this.previousVideo);
    this.DOM.mainNextBtn?.addEventListener("click", this.nextVideo);
    this.DOM.nextBtn?.addEventListener("click", this.nextVideo);
    this.DOM.playPauseBtn?.addEventListener("click", this.togglePlay);
    this.DOM.mainPlayPauseBtn?.addEventListener("click", this.togglePlay);
    this.DOM.durationContainer?.addEventListener("click", this.rotateTimeFormat);
    this.DOM.playbackRateBtn?.addEventListener("click", this.rotatePlaybackRate);
    this.DOM.captionsBtn?.addEventListener("click", this.toggleCaptions);
    this.DOM.muteBtn?.addEventListener("click", this.toggleMute);
    this.DOM.darkBtn?.addEventListener("click", this.toggleDark);
    this.DOM.objectFitBtn?.addEventListener("click", this.rotateObjectFit);
    this.DOM.theaterBtn?.addEventListener("click", this.toggleTheaterMode);
    this.DOM.fullScreenBtn?.addEventListener("click", this.toggleFullScreenMode);
    this.DOM.pictureInPictureBtn?.addEventListener("click", this.togglePictureInPictureMode);
    this.DOM.pictureInPictureActiveIconWrapper?.addEventListener("click", this.togglePictureInPictureMode);
    this.DOM.settingsBtn?.addEventListener("click", this.toggleSettingsView);
    //timeline contanier event listeners
    this.DOM.timelineContainer?.addEventListener("pointerdown", this.startTimelineScrubbing);
    this.DOM.timelineContainer?.addEventListener("mouseover", this.showPreviewImages);
    this.DOM.timelineContainer?.addEventListener("mouseleave", this.hidePreviewImages);
    this.DOM.timelineContainer?.addEventListener("touchend", this.hidePreviewImages);
    this.DOM.timelineContainer?.addEventListener("mousemove", this._handleTimelineInput);
    this.DOM.timelineContainer?.addEventListener("keydown", this._handleTimelineKeyDown);
    //cue container listeners
    this.DOM.cueContainer?.addEventListener("pointerdown", this._handleCueDragStart);
    //volume event listeners
    this.DOM.volumeSlider?.addEventListener("input", this._handleVolumeSliderInput);
    this.DOM.volumeContainer?.addEventListener("mousemove", this._handleVolumeContainerMouseMove);
    //brightness event listeners
    this.DOM.brightnessSlider?.addEventListener("input", this._handleBrightnessSliderInput);
    this.DOM.brightnessContainer?.addEventListener("mousemove", this._handleBrightnessContainerMouseMove);
    //drag event listeners
    this.setDragEventListeners();
    //image event listeners
    if (this.settings.status.ui.previewImages) {
      this.DOM.previewImg?.addEventListener("error", this._handleImgBreak);
      this.DOM.thumbnailImg?.addEventListener("error", this._handleImgBreak);
    }
    //notifiers event listeners
    if (this.settings.status.ui.notifiers) new tmg.notify(this);
  }

  setDragEventListeners() {
    if (this.settings.status.ui.draggableControls) {
      this.DOM.draggableControls?.forEach((c) => (c.draggable = true));
      this.DOM.draggableControls?.forEach((c) => {
        c.addEventListener("dragstart", this._handleDragStart);
        c.addEventListener("drag", this._handleDrag);
        c.addEventListener("dragend", this._handleDragEnd);
      });
      this.DOM.draggableControlContainers?.forEach((c) => {
        c.addEventListener("dragenter", this._handleDragEnter);
        c.addEventListener("dragover", this._handleDragOver);
        c.addEventListener("drop", this._handleDrop);
        c.addEventListener("dragleave", this._handleDragLeave);
      });
    }
  }

  removeDragEventListeners() {
    this.DOM.draggableControls?.forEach((c) => (c.draggable = false));
    this.DOM.draggableControls?.forEach((c) => {
      c.removeEventListener("dragstart", this._handleDragStart);
      c.removeEventListener("drag", this._handleDrag);
      c.removeEventListener("dragend", this._handleDragEnd);
    });
    this.DOM.draggableControlContainers?.forEach((c) => {
      c.removeEventListener("dragenter", this._handleDragEnter);
      c.removeEventListener("dragover", this._handleDragOver);
      c.removeEventListener("drop", this._handleDrop);
      c.removeEventListener("dragleave", this._handleDragLeave);
    });
  }

  setSettingsEventListeners() {
    this.DOM.settingsCloseBtn?.addEventListener("click", this.leaveSettingsView);
  }

  toggleSettingsView() {
    !this.isModeActive("settings") ? this.enterSettingsView() : this.leaveSettingsView();
  }

  enterSettingsView() {
    if (this.isModeActive("settings")) return;
    this.DOM.settingsCloseBtn.focus();
    this.wasPaused = this.video.paused;
    this.togglePlay(false);
    this.videoContainer.classList.add("T_M_G-video-settings-view");
    window.addEventListener("keyup", this._handleSettingsKeyUp);
    this.floatingPlayer?.addEventListener("keyup", this._handleSettingsKeyUp);
    this.removeKeyEventListeners();
    this.disableFocusableControls();
  }

  leaveSettingsView() {
    if (!this.isModeActive("settings")) return;
    this.DOM.settingsCloseBtn.blur();
    this.videoContainer.classList.remove("T_M_G-video-settings-view");
    window.removeEventListener("keyup", this._handleSettingsKeyUp);
    this.floatingPlayer?.removeEventListener("keyup", this._handleSettingsKeyUp);
    this.setKeyEventListeners();
    this.enableFocusableControls();
    if (!this.wasPaused) this.togglePlay(true);
  }

  _handleSettingsKeyUp(e) {
    const action = this.keyEventAllowed(e);
    if (action === false) return;
    switch (action) {
      case "settings":
        this.leaveSettingsView();
        break;
    }
  }

  observeResize() {
    this._handleMediaParentResize();
    tmg.initScrollAssist(this.DOM.videoTitle, { pxPerSecond: 60 });
    tmg.initScrollAssist(this.DOM.scrubNotifierText, {
      pxPerSecond: 60,
    });
    [this.DOM.leftSideControlsWrapper, this.DOM.rightSideControlsWrapper].forEach((el) => {
      this._handleSideControlsWrapperResize(el);
      tmg.initScrollAssist(el, { pxPerSecond: 60 });
      tmg.resizeObserver.observe(el);
    });
    [this.videoContainer, this.pseudoVideoContainer].forEach((el) => tmg.resizeObserver.observe(el));
  }

  unobserveResize() {
    tmg.removeScrollAssist(this.DOM.videoTitle);
    tmg.removeScrollAssist(this.DOM.scrubNotifierText, {
      pxPerSecond: 60,
    });
    [this.DOM.leftSideControlsWrapper, this.DOM.rightSideControlsWrapper].forEach((el) => {
      tmg.removeScrollAssist(el);
      tmg.resizeObserver.unobserve(el);
    });
    [this.videoContainer, this.pseudoVideoContainer].forEach((el) => tmg.resizeObserver.unobserve(el));
  }

  observeIntersection() {
    tmg.intersectionObserver.observe(this.videoContainer.parentElement);
    tmg.intersectionObserver.observe(this.video);
  }

  unobserveIntersection() {
    const p = this.pseudoVideoContainer.parentElement ?? this.videoContainer.parentElement;
    p && tmg.intersectionObserver.unobserve(p);
    tmg.intersectionObserver.unobserve(this.video);
  }

  _handleResize(target) {
    const isPseudo = target.className.includes("T_M_G-pseudo");
    if (target.classList.contains("T_M_G-media-container")) this._handleMediaParentResize(isPseudo);
    else if (target.classList.contains("T_M_G-video-side-controls-wrapper")) this._handleSideControlsWrapperResize(target);
  }

  _handleMediaParentResize(isPseudo = false) {
    const getTier = (container) => {
      const { offsetWidth: w, offsetHeight: h } = container;
      return {
        tier: h <= 130 ? "xxxxx" : w <= 280 ? "xxxx" : w <= 380 ? "xxx" : w <= 480 ? "xx" : w <= 630 ? "x" : "",
        shouldRepeat: w < 1 && h < 1,
      };
    };
    if (!isPseudo) {
      const { tier, shouldRepeat } = getTier(this.videoContainer);
      this.videoContainer.dataset.sizeTier = tier;
      shouldRepeat && requestAnimationFrame(this._handleMediaParentResize);
    } else {
      const { tier } = getTier(this.pseudoVideoContainer);
      this.pseudoVideoContainer.dataset.sizeTier = tier;
    }
  }

  _handleSideControlsWrapperResize(wrapper) {
    this.updateSideControls({ target: wrapper });
  }

  _handleMediaIntersectionChange(isIntersecting) {
    this.isIntersecting = isIntersecting;
    this.isIntersecting && !this.isModeActive("settings") ? this.setKeyEventListeners() : this.removeKeyEventListeners();
  }

  _handleMediaParentIntersectionChange(isIntersecting) {
    this.parentIntersecting = isIntersecting;
    this.toggleMiniPlayerMode();
  }

  _handleWindowResize() {
    this.toggleMiniPlayerMode();
  }

  _handleVisibilityChange() {
    // tending to some observed glitches when visibility changes
    if (document.visibilityState === "visible") {
      this.stopTimelineScrubbing();
    }
  }

  _handleImgBreak(e) {
    e.target.src = tmg.ALT_IMG_SRC;
  }

  updateSideControls({ target: wrapper }) {
    let c = wrapper.children[0],
      spacer;
    do {
      if (!c) continue;
      c.dataset.spacer = "false";
      c.dataset.displayed = getComputedStyle(c).display !== "none" ? "true" : "false";
      if (c.dataset.displayed === "true" && !spacer) spacer = c;
    } while ((c = c?.nextElementSibling));
    if (wrapper === this.DOM.rightSideControlsWrapper) spacer?.setAttribute("data-spacer", true);
  }

  svgSetup() {
    let controlsSize = 25;
    [...this.DOM.svgs].forEach((svg) => {
      svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
      if (svg.dataset.noResize !== "true") svg.setAttribute("viewBox", `0 0 ${controlsSize} ${controlsSize}`);
      const title = svg.getAttribute("data-control-title");
      if (!title) return;
      svg.addEventListener("mouseover", () => (svg.parentElement.title = title));
    });
  }

  exportVideoFrame(type, time) {
    this.pseudoVideo.currentTime = time;
    this.exportCanvas.width = this.video.videoWidth;
    this.exportCanvas.height = this.video.videoHeight;
    this.exportContext?.drawImage(this.pseudoVideo, 0, 0, this.exportCanvas.width, this.exportCanvas.height);
    if (type === "monochrome") this.convertToMonoChrome(this.exportCanvas);
    return this.exportCanvas.toDataURL("image/png");
  }

  convertToMonoChrome(canvas) {
    const frame = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
    const l = frame.data.length / 4;
    for (let i = 0; i < l; i++) {
      const grey = (frame.data[i * 4 + 0] + frame.data[i * 4 + 1] + frame.data[i * 4 + 2]) / 3;
      frame.data[i * 4 + 0] = grey;
      frame.data[i * 4 + 1] = grey;
      frame.data[i * 4 + 2] = grey;
    }
    canvas.getContext("2d").putImageData(frame, 0, 0);
  }

  cache() {
    this.settingsCache = JSON.parse(JSON.stringify(this.settings));
  }

  enableFocusableControls(target) {
    if (this.disabled || this.locked) return;
    this.DOM.focusableControls?.forEach((control) => {
      if (target !== "all" && !this.DOM.videoContainerContent.contains(control)) return;
      control.tabIndex = "0";
      control.setAttribute("data-focusable-control", true);
    });
  }

  disableFocusableControls(target) {
    this.DOM.focusableControls?.forEach((control) => {
      if (target !== "all" && !this.DOM.videoContainerContent.contains(control)) return;
      control.tabIndex = "-1";
      control.setAttribute("data-focusable-control", false);
    });
  }

  deactivate(message) {
    this.showOverlay();
    this.showMessage(message);
    this.videoContainer.classList.add("T_M_G-video-inactive");
  }

  reactivate() {
    if (!this.videoContainer.classList.contains("T_M_G-video-inactive") || !this.loaded) return;
    this.videoContainer.classList.remove("T_M_G-video-inactive");
  }

  disable() {
    this.videoContainer.classList.add("T_M_G-video-disabled");
    this.video.pause();
    this.showOverlay();
    this.cancelAllThrottles();
    this.leaveSettingsView();
    this.disableFocusableControls("all");
    this.removeKeyEventListeners();
    this.disabled = true;
    this.log("You have to enable the TMG Player to access the custom controls", "warn");
  }

  enable() {
    if (!this.disabled) return;
    this.videoContainer.classList.remove("T_M_G-video-disabled");
    this.enableFocusableControls("all");
    this.setKeyEventListeners();
    this.disabled = false;
  }

  lock() {
    this.videoContainer.classList.add("T_M_G-video-locked");
    this.removeOverlay("force");
    this.leaveSettingsView();
    this.disableFocusableControls("all");
    this.removeKeyEventListeners();
    this.locked = true;
  }

  unlock() {
    if (!this.locked) return;
    this.videoContainer.classList.remove("T_M_G-video-locked");
    this.showOverlay();
  }

  activatePseudoMode() {
    this.mutatingDOMNodes = true;
    this.pseudoVideo.id = this.video.id;
    this.video.id = "";
    this.pseudoVideo.className += " " + this.video.className.replace(/T_M_G-media|T_M_G-video/g, "");
    this.pseudoVideoContainer.className += " " + this.videoContainer.className.replace(/T_M_G-media-container|T_M_G-pseudo-video-container/g, "");
    this.videoContainer.parentElement?.insertBefore(this.pseudoVideoContainer, this.videoContainer);
    document.body.append(this.videoContainer);
    setTimeout(() => (this.mutatingDOMNodes = false));
  }

  deactivatePseudoMode() {
    this.mutatingDOMNodes = true;
    this.video.id = this.pseudoVideo.id;
    this.pseudoVideo.id = "";
    this.pseudoVideo.className = "T_M_G-pseudo-video T_M_G-media";
    this.pseudoVideoContainer.className = "T_M_G-pseudo-video-container T_M_G-media-container";
    this.pseudoVideoContainer.parentElement?.insertBefore(this.videoContainer, this.pseudoVideoContainer);
    this.pseudoVideoContainer.remove();
    setTimeout(() => (this.mutatingDOMNodes = false));
  }

  isModeActive(mode) {
    switch (mode) {
      case "miniPlayer":
        return this.videoContainer.classList.contains("T_M_G-video-mini-player");
      case "fullScreen":
        return this.videoContainer.classList.contains("T_M_G-video-full-screen");
      case "pictureInPicture":
        return this.videoContainer.classList.contains("T_M_G-video-picture-in-picture");
      case "floatingPlayer":
        return this.videoContainer.classList.contains("T_M_G-video-floating-player");
      case "theater":
        return this.videoContainer.classList.contains("T_M_G-video-theater");
      case "settings":
        return this.videoContainer.classList.contains("T_M_G-video-settings-view");
      default:
        return false;
    }
  }

  showMessage(message) {
    if (message) this.DOM.videoContainerContent?.setAttribute("data-message", message);
  }

  _handleLoadedError(error) {
    const mediaError = this.video.error;
    // Get the error message from prioritized sources
    const fallbackMessage = (typeof error === "string" && error) || error?.message || mediaError?.message || "An unknown error occurred during video playback";
    const errorCode = mediaError?.code ?? 5;
    const message = this.settings.errorMessages?.[errorCode] || fallbackMessage;
    this.loaded = false;
    this.deactivate(message);
  }

  _handleLoadedMetadata() {
    if (this.settings.time.start) this.currentTime = this.settings.time.start;
    this.syncAspectRatio();
    if (this.DOM.totalTimeElement) this.DOM.totalTimeElement.textContent = tmg.formatTime(this.video.duration);
    this.videoCurrentProgressPosition = this.currentTime < 1 ? (this.videoCurrentLoadedPosition = 0) : tmg.parseNumber(this.video.currentTime / this.video.duration);
    this.loaded = true;
    this.reactivate();
  }

  _handleLoadedData() {
    if (this.DOM.totalTimeElement) this.DOM.totalTimeElement.textContent = tmg.formatTime(this.video.duration);
  }

  _handleDurationChange() {
    if (this.DOM.totalTimeElement) this.DOM.totalTimeElement.textContent = tmg.formatTime(this.video.duration);
  }

  _handleLoadedProgress() {
    for (let i = 0; i < this.video.buffered.length; i++) {
      if (this.video.buffered.start(this.video.buffered.length - 1 - i) < this.currentTime) {
        this.videoCurrentLoadedPosition = this.video.buffered.end(this.video.buffered.length - 1 - i) / this.duration;
        break;
      }
    }
  }

  syncAspectRatio() {
    if (!this.video.videoWidth || !this.video.videoHeight) return;
    this.aspectRatio = this.video.videoWidth / this.video.videoHeight;
    this.videoAspectRatio = `${this.video.videoWidth} / ${this.video.videoHeight}`;
  }

  previousVideo() {
    if (this.currentTime >= 3) return this.replay();
    if (this.playlist && this.currentPlaylistIndex > 0 && this.currentTime < 3) this.movePlaylistTo(this.currentPlaylistIndex - 1);
  }

  nextVideo() {
    if (this.playlist && this.currentPlaylistIndex < this.playlist.length - 1) this.movePlaylistTo(this.currentPlaylistIndex + 1);
  }

  movePlaylistTo(index, shouldPlay = true) {
    if (!this.playlist) return;
    this.stall();
    if (this.settings.status.allowOverride.time) this.playlist[this.currentPlaylistIndex].settings.time.start = this.currentTime < this.duration - (this.settings.time.end || this.settings.auto.next || 0) ? this.playlistCurrentTime : null;
    this.playlistCurrentTime = null;
    this.loaded = false;
    this.currentPlaylistIndex = index;
    const v = this.playlist[index];
    this.media = v.media ? { ...this.media, ...v.media } : v.media ?? null;
    this.setPosterState();
    this.settings.time.start = v.settings.time.start;
    this.settings.time.end = v.settings.time.end;
    this.settings.time.previewImages = tmg.isObject(v.settings.time.previewImages) ? { ...this.settings.time.previewImages, ...v.settings.time.previewImages } : v.settings.time.previewImages;
    this.settings.status.ui.previewImages = !!(this.settings.time.previewImages?.address && this.settings.time.previewImages?.spf);
    if (v.src) this.src = v.src;
    else if (v.sources?.length > 0) this.sources = v.sources;
    if (v.tracks?.length > 0) this.tracks = v.tracks;
    this.setInitialStates();
    this.togglePlay(shouldPlay);
    this.canAutoMovePlaylist = true;
  }

  autonextVideo() {
    if (!this.loaded || !this.playlist || this.settings.auto.next < 0 || !this.canAutoMovePlaylist || this.currentPlaylistIndex >= this.playlist.length - 1 || this.video.paused) return;
    this.canAutoMovePlaylist = false;
    const count = Math.floor((this.settings.time.end || this.duration) - this.currentTime);
    const {
      src,
      media: { title },
    } = this.playlist[this.currentPlaylistIndex + 1];
    const playlistToastContainer = document.createElement("div");
    playlistToastContainer.classList = "T_M_G-video-playlist-toast-container";
    playlistToastContainer.innerHTML = `
        <span title="Play next video" class="T_M_G-video-playlist-next-video-preview-wrapper">
          <button type="button">
            <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 25 25">
              <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
            </svg>
          </button>
          <video src="${src}" class="T_M_G-video-playlist-next-video-preview" autoplay muted loop></video>
        </span>
        <span class="T_M_G-video-playlist-next-video-info">
          <h2>Next Video in <span class="T_M_G-video-playlist-next-video-countdown">${count}</span></h2>
          ${title ? `<p class="T_M_G-video-playlist-next-video-title">${title}</p>` : ""}
        </span>
        <button title="Cancel" type="button" class="T_M_G-video-playlist-next-video-cancel-btn">&times;</button>         
      `;
    this.DOM.videoOverlayControlsContainer.append(playlistToastContainer);

    const updatePlaylistToast = (timestamp) => {
        if (shouldUnPause) {
          lastTime = null;
          shouldUnPause = false;
        }
        if (lastTime == null) {
          lastTime = timestamp;
          nextVideoFrameId = requestAnimationFrame(updatePlaylistToast);
          return;
        }
        if (!isPaused) {
          timeVisible += timestamp - lastTime;
          constraint += timestamp - lastTime;
          this.videoCurrentPlaylistCountdownPosition = timeVisible / (count * 1000);
          if (constraint >= 1000) {
            nextVideoCountdown--;
            playlistNextVideoCountdown.textContent = nextVideoCountdown;
            constraint = 0;
          }
          if (timeVisible >= count * 1000) return autoNextVideo();
        }
        lastTime = timestamp;
        nextVideoFrameId = requestAnimationFrame(updatePlaylistToast);
      },
      handleAutoPlaylistVisibilityChange = () => (shouldUnPause = document.visibilityState === "visible"),
      autoNextVideo = () => {
        cleanUpPlaylistToast();
        this.nextVideo();
      },
      cleanUpPlaylistToastWhenNeeded = () => {
        if (!(this.currentTime === this.duration)) cleanUpPlaylistToast();
      },
      autoCleanUpPlaylistToast = () => {
        if (Math.floor((this.settings.time.end || this.duration) - this.currentTime) > this.settings.auto.next) cleanUpPlaylistToast();
      },
      cleanUpPlaylistToast = (permanent = false) => {
        playlistToastContainer.remove();
        cancelAnimationFrame(nextVideoFrameId);
        document.removeEventListener("visibilitychange", handleAutoPlaylistVisibilityChange);
        this.video.removeEventListener("pause", cleanUpPlaylistToastWhenNeeded);
        this.video.removeEventListener("waiting", cleanUpPlaylistToastWhenNeeded);
        this.video.removeEventListener("timeupdate", autoCleanUpPlaylistToast);
        this.canAutoMovePlaylist = !permanent;
      },
      handleToastPointerStart = (e) => {
        if (e.touches?.length > 1) return;
        e.stopImmediatePropagation();
        pointerStartX = e.clientX ?? e.targetTouches[0]?.clientX;
        playlistToastContainer.addEventListener("pointermove", handleToastPointerMove, { passive: false });
        isPaused = true;
      },
      handleToastPointerMove = (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        this.RAFLoop("toastPointerMove", () => {
          let x = e.clientX ?? e.targetTouches[0]?.clientX;
          pointerDeltaX = x - pointerStartX;
          playlistToastContainer.style.setProperty("transition", "none", "important");
          playlistToastContainer.style.setProperty("transform", `translateX(${pointerDeltaX}px)`, "important");
          playlistToastContainer.style.setProperty("opacity", tmg.clamp(0, 1 - Math.abs(pointerDeltaX) / playlistToastContainer.offsetWidth, 1), "important");
        });
      },
      handleToastPointerEnd = () => {
        this.cancelRAFLoop("toastPointerMove");
        if (Math.abs(pointerDeltaX) > playlistToastContainer.offsetWidth * 0.4) return cleanUpPlaylistToast(true);
        playlistToastContainer.removeEventListener("pointermove", handleToastPointerMove, { passive: false });
        playlistToastContainer.style.removeProperty("transition");
        playlistToastContainer.style.removeProperty("transform");
        playlistToastContainer.style.removeProperty("opacity");
        isPaused = false;
      },
      playlistNextVideoPreviewWrapper = this.queryDOM(".T_M_G-video-playlist-next-video-preview-wrapper"),
      playlistNextVideoCountdown = this.queryDOM(".T_M_G-video-playlist-next-video-countdown"),
      playlistNextVideoCancelBtn = this.queryDOM(".T_M_G-video-playlist-next-video-cancel-btn");

    let isPaused = false,
      shouldUnPause,
      lastTime,
      pointerStartX,
      pointerDeltaX,
      constraint = 0,
      timeVisible = 0,
      nextVideoCountdown = count,
      nextVideoFrameId = requestAnimationFrame(updatePlaylistToast);

    document.addEventListener("visibilitychange", handleAutoPlaylistVisibilityChange);
    playlistToastContainer.addEventListener("mouseover", () => (isPaused = true));
    playlistToastContainer.addEventListener("mouseleave", () => {
      if (!playlistToastContainer.matches(":hover")) setTimeout(() => (isPaused = false));
    });
    playlistToastContainer.addEventListener("pointerdown", handleToastPointerStart.bind(this), { passive: false });
    playlistToastContainer.addEventListener("pointerup", handleToastPointerEnd.bind(this));
    playlistToastContainer.addEventListener("pointercancel", handleToastPointerEnd.bind(this));
    this.video.addEventListener("pause", cleanUpPlaylistToastWhenNeeded);
    this.video.addEventListener("waiting", cleanUpPlaylistToastWhenNeeded);
    this.video.addEventListener("timeupdate", autoCleanUpPlaylistToast);
    playlistNextVideoPreviewWrapper.addEventListener("click", autoNextVideo);
    playlistNextVideoCancelBtn.addEventListener("click", () => cleanUpPlaylistToast(true));
  }

  setMediaSession() {
    if (!navigator.mediaSession || (tmg._PICTURE_IN_PICTURE_ACTIVE && !this.isModeActive("pictureInPicture"))) return;
    if (this.media) navigator.mediaSession.metadata = new MediaMetadata(this.media);
    const set = (...args) => navigator.mediaSession.setActionHandler(...args);
    set("play", () => this.togglePlay(true));
    set("pause", () => this.togglePlay(false));
    set("seekbackward", () => this.skip(-this.settings.time.skip));
    set("seekforward", () => this.skip(this.settings.time.skip));
    set("previoustrack", null);
    set("nexttrack", null);
    if (!this.playlist) return;
    if (this.currentPlaylistIndex > 0) set("previoustrack", this.previousVideo);
    if (this.currentPlaylistIndex < this.playlist?.length - 1) set("nexttrack", this.nextVideo);
  }

  rotateObjectFit() {
    const fitNames = ["Crop to Fit", "Fit To Screen", "Stretch"],
      fits = ["contain", "cover", "fill"];
    let fitIndex = fits.indexOf(this.videoObjectFit) + 1;
    if (fitIndex > 2) fitIndex = 0;
    if (fitIndex < 0) fitIndex = 2;
    this.videoObjectFit = fits[fitIndex];
    this.videoContainer.setAttribute("data-object-fit", this.videoObjectFit);
    if (this.DOM.objectFitNotifier) this.DOM.objectFitNotifier.textContent = fitNames[fitIndex];
    this.fire("objectfitchange");
  }

  async togglePlay(bool) {
    try {
      this.video.ended ? this.replay() : typeof bool === "boolean" ? await this.video[bool ? "play" : "pause"]() : await this.video[this.video.paused ? "play" : "pause"]();
    } catch (e) {
      this.video.error ? this._handleLoadedError() : this.log(e, "error", "swallow");
    }
  }

  replay() {
    this.stall();
    this.moveVideoTime({ to: "start" });
    this.video.play();
  }

  _handleBufferStart() {
    this.buffering = true;
    this.showOverlay();
    this.videoContainer.classList.add("T_M_G-video-buffering");
  }

  _handleBufferStop() {
    if (!this.buffering) return;
    this.buffering = false;
    this.delayOverlay();
    this.videoContainer.classList.remove("T_M_G-video-buffering");
  }

  _handlePlay() {
    tmg.connectAudio(this.audioGainNode);
    for (const media of document.querySelectorAll("video, audio")) {
      if (media !== this.video && !media.paused) media.pause();
    }
    this.videoContainer.classList.remove("T_M_G-video-paused");
    this.delayOverlay();
    this.setMediaSession();
    if (this.loaded) return;
    this.loaded = true;
    this.reactivate();
  }

  _handlePause() {
    this.videoContainer.classList.add("T_M_G-video-paused");
    this.showOverlay();
    if (this.buffering) this._handleBufferStop();
  }

  _handleEnded() {
    this.videoContainer.classList.add("T_M_G-video-replay");
  }

  get duration() {
    return tmg.parseNumber(this.video.duration);
  }

  set currentTime(value) {
    this.video.currentTime = value;
  }

  get currentTime() {
    return tmg.parseNumber(this.video.currentTime);
  }

  startTimelineScrubbing(e) {
    if (this.isScrubbing) return;
    this.DOM.timelineContainer?.setPointerCapture(e.pointerId);
    this.isScrubbing = true;
    this.toggleScrubbing(e);
    this.DOM.timelineContainer?.addEventListener("pointermove", this._handleTimelineInput);
    this.DOM.timelineContainer?.addEventListener("pointerup", this.stopTimelineScrubbing);
    this.DOM.timelineContainer?.addEventListener("pointercancel", this.stopTimelineScrubbing);
  }

  stopTimelineScrubbing(e) {
    if (!this.isScrubbing) return;
    this.isScrubbing = false;
    if (e) this.toggleScrubbing(e);
    else this.videoContainer.classList.remove("T_M_G-video-scrubbing");
    this.DOM.timelineContainer?.removeEventListener("pointermove", this._handleTimelineInput);
    this.DOM.timelineContainer?.removeEventListener("pointerup", this.stopTimelineScrubbing);
    this.DOM.timelineContainer?.removeEventListener("pointercancel", this.stopTimelineScrubbing);
  }

  toggleScrubbing(e) {
    const rect = this.DOM.timelineContainer?.getBoundingClientRect();
    const percent = Math.min(Math.max(0, e.clientX - rect.x), rect.width) / rect.width;
    this.videoContainer.classList.toggle("T_M_G-video-scrubbing", this.isScrubbing);
    if (this.isScrubbing) {
      let { width, height } = tmg.getRenderedBox(this.video);
      width = width ?? this.videoContainer.offsetWidth;
      height = height ?? this.videoContainer.offsetHeight;
      this.DOM.thumbnailCanvas.height = this.DOM.thumbnailImg.height = height + 1;
      this.DOM.thumbnailCanvas.width = this.DOM.thumbnailImg.width = width + 1;
      this.wasPaused = this.video.paused;
    } else {
      this.currentTime = percent * this.duration;
      if (!this.wasPaused) this.togglePlay(true);
    }
    this._handleTimelineInput(e);
  }

  showPreviewImages() {
    if (!this.isMediaMobile) this.videoContainer.classList.add("T_M_G-video-previewing");
  }

  hidePreviewImages() {
    setTimeout(() => this.videoContainer.classList.remove("T_M_G-video-previewing"));
  }

  _handleTimelineInput({ clientX: x }) {
    this.throttle(
      "timelineInput",
      () => {
        const rect = this.DOM.timelineContainer?.getBoundingClientRect();
        const percent = tmg.clamp(0, x - rect.left, rect.width) / rect.width;
        const previewImgMin = this.DOM.previewContainer.offsetWidth / 2 / rect.width;
        const previewImgPercent = tmg.clamp(previewImgMin, percent, 1 - previewImgMin);
        this.videoCurrentPreviewPosition = percent;
        this.videoCurrentPreviewImgPosition = previewImgPercent;
        this.DOM.previewContainer?.setAttribute("data-preview-time", tmg.formatTime(percent * this.video.duration));
        if (this.isScrubbing) {
          this.videoCurrentProgressPosition = percent;
          this.togglePlay(false);
          this.delayOverlay();
        }
        let previewImgSrc;
        if (this.settings.status.ui.previewImages) {
          const previewImgNumber = Math.max(1, Math.floor((percent * this.duration) / this.settings.time.previewImages.spf));
          previewImgSrc = this.settings.time.previewImages.address.replace("$", previewImgNumber);
          if (this.settings.time.previewImages && !this.isMediaMobile) this.DOM.previewImg.src = previewImgSrc;
          if (this.isScrubbing) this.DOM.thumbnailImg.src = previewImgSrc;
        } else if (this.settings.time.previewImages) {
          this.pseudoVideo.currentTime = percent * this.duration;
          if (!this.isMediaMobile) this.previewContext?.drawImage(this.pseudoVideo, 0, 0, this.DOM.previewCanvas.width, this.DOM.previewCanvas.height);
          if (this.isScrubbing) this.thumbnailContext?.drawImage(this.pseudoVideo, 0, 0, this.DOM.thumbnailCanvas.width, this.DOM.thumbnailCanvas.height);
        }
        let arrowPosition,
          arrowPositionMin = ((this.isModeActive("theater") && !this.isModeActive("miniPlayer")) || this.isModeActive("fullScreen")) && this.settings.time.previewImages && !this.isMediaMobile ? 10 : 16.5;
        if (percent < previewImgMin) arrowPosition = `${Math.max(percent * rect.width, arrowPositionMin)}px`;
        else if (percent > 1 - previewImgMin) arrowPosition = `${Math.min(this.DOM.previewContainer.offsetWidth / 2 + percent * rect.width - this.DOM.previewContainer.offsetLeft, this.DOM.previewContainer.offsetWidth - arrowPositionMin)}px`;
        else arrowPosition = "50%";
        this.videoCurrentPreviewImgArrowPosition = arrowPosition;
      },
      this.timelineInputThrottleDelay
    );
  }

  _handleGestureTimelineInput({ percent, sign, multiplier }) {
    multiplier = multiplier.toFixed(1);
    percent = percent * multiplier;
    const time = sign === "+" ? this.currentTime + percent * this.duration : this.currentTime - percent * this.duration;
    this.gestureNextTime = tmg.clamp(0, Math.floor(time), this.duration);
    if (this.DOM.touchTimelineNotifier) this.DOM.touchTimelineNotifier.textContent = `${sign}${tmg.formatTime(Math.abs(this.gestureNextTime - this.currentTime))} (${tmg.formatTime(this.gestureNextTime)}) ${multiplier < 1 ? `x${multiplier}` : ""}`;
  }

  _handleTimelineKeyDown(e) {
    switch (e.key?.toLowerCase()) {
      case "arrowleft":
      case "arrowdown":
        e.preventDefault();
        e.stopImmediatePropagation();
        this.currentTime -= e.shiftKey ? 5 : 1;
        break;
      case "arrowright":
      case "arrowup":
        e.preventDefault();
        e.stopImmediatePropagation();
        this.currentTime += e.shiftKey ? 5 : 1;
        break;
    }
  }

  _handleTimeUpdate() {
    if (this.isScrubbing) return;
    this.video.removeAttribute("controls"); // youtube did this too :)
    this.video.volume = 1; // just in case
    this.videoCurrentProgressPosition = tmg.isValidNumber(this.video.duration) ? tmg.parseNumber(this.video.currentTime / this.video.duration) : this.video.currentTime / 60; // progress fallback, shouldn't take more than a min for duration to be available
    if (this.DOM.currentTimeElement) this.DOM.currentTimeElement.textContent = this.settings.time.format !== "timespent" ? tmg.formatTime(this.video.currentTime) : `-${tmg.formatTime(this.video.duration - this.video.currentTime)}`;
    if (this.speedCheck && !this.video.paused) this.DOM.playbackRateNotifier?.setAttribute("data-current-time", tmg.formatTime(this.video.currentTime));
    if (this.playlist && this.currentTime > 3) this.playlistCurrentTime = this.currentTime;
    if (Math.floor((this.settings.time.end || this.duration) - this.currentTime) <= this.settings.auto.next) this.autonextVideo();
    this.videoContainer.classList.remove("T_M_G-video-replay");
  }

  rotateTimeFormat() {
    if (!this.settings.status.allowOverride.time) return;
    this.showOverlay();
    this.settings.time.format = this.settings.time.format !== "timespent" ? "timespent" : "timeleft";
    if (this.DOM.currentTimeElement) this.DOM.currentTimeElement.textContent = this.settings.time.format !== "timespent" ? tmg.formatTime(this.video.currentTime) : `-${tmg.formatTime(this.video.duration - this.video.currentTime)}`;
  }

  skip(duration) {
    const notifier = duration > 0 ? this.DOM.fwdNotifier : this.DOM.bwdNotifier;
    duration = Math.sign(duration) === 1 ? (this.duration - this.currentTime > duration ? duration : this.duration - this.currentTime) : Math.sign(duration) === -1 ? (this.currentTime > Math.abs(duration) ? duration : -this.currentTime) : 0;
    duration = Math.trunc(duration);
    this.videoCurrentProgressPosition = (this.currentTime += duration) / this.duration;
    if (this.skipPersist) {
      if (this.currentNotifier && notifier !== this.currentNotifier) {
        this.skipDuration = 0;
        this.currentNotifier.classList.remove("T_M_G-video-control-persist");
      }
      this.currentNotifier = notifier;
      notifier.classList.add("T_M_G-video-control-persist");
      this.skipDuration += duration;
      clearTimeout(this.skipDurationId);
      this.skipDurationId = setTimeout(() => {
        this.deactivateSkipPersist();
        this.skipDuration = 0;
        notifier.classList.remove("T_M_G-video-control-persist");
        this.currentNotifier = null;
        this.removeOverlay();
      }, tmg.formatCSSTime(this.videoNotifiersAnimationTime));
      notifier.setAttribute("data-skip", this.skipDuration);
      return;
    } else this.currentNotifier?.classList.remove("T_M_G-video-control-persist");
    notifier.setAttribute("data-skip", Math.abs(duration));
  }

  moveVideoTime(details) {
    switch (details.to) {
      case "start":
        this.currentTime = 0;
        break;
      case "end":
        this.currentTime = this.duration;
        break;
      default:
        this.currentTime = (Number(details.to) / Number(details.max)) * this.duration;
    }
  }

  moveVideoFrame(dir = "forwards") {
    if (!this.video.paused) return;
    this.throttle(
      "frameStepping",
      () => {
        if (!this.video.paused) return;
        const frame = Math.round(this.currentTime * this.pfps);
        const delta = dir === "backwards" ? -1 : 1;
        const maxFrame = Math.floor(this.video.duration * this.pfps);
        this.currentTime = Math.min(maxFrame, Math.max(0, frame + delta)) / this.pfps;
      },
      this.frameThrottleDelay
    );
  }

  set playbackRate(value) {
    this.video.playbackRate = this.video.defaultPlaybackRate = this.settings.playbackRate.value = tmg.clamp(this.settings.playbackRate.min, value, this.settings.playbackRate.max);
  }

  get playbackRate() {
    return this.video.playbackRate ?? 1;
  }

  updatePlaybackRateSettings() {
    this.playbackRate = this.video.playbackRate;
  }

  rotatePlaybackRate(dir = "forwards") {
    const delta = dir === "backwards" ? -this.settings.playbackRate.skip : this.settings.playbackRate.skip;
    let rate = this.playbackRate + delta;
    if (rate < this.settings.playbackRate.min) rate = this.settings.playbackRate.max;
    else if (rate > this.settings.playbackRate.max) rate = this.settings.playbackRate.min;
    this.playbackRate = rate;
  }

  changePlaybackRate(value) {
    const sign = Math.sign(value) === 1 ? "+" : "-";
    value = Math.abs(value);
    const rate = this.playbackRate;
    switch (sign) {
      case "-":
        if (rate > this.settings.playbackRate.min) this.playbackRate -= rate % value ? rate % value : value;
        this.fire("playbackratedown");
        break;
      default:
        if (rate < this.settings.playbackRate.max) this.playbackRate += rate % value ? rate % value : value;
        this.fire("playbackrateup");
        break;
    }
  }

  _handlePlaybackRateChange() {
    if (this.DOM.playbackRateNotifierContent) this.DOM.playbackRateNotifierContent.textContent = `${this.playbackRate}x`;
    if (this.DOM.playbackRateNotifierText) this.DOM.playbackRateNotifierText.textContent = `${this.playbackRate}x`;
    this.setBtnsState("playbackRate");
  }

  fastPlay(pos) {
    if (this.speedCheck) return;
    this.speedCheck = true;
    this.lastPlaybackRate = this.playbackRate;
    this.DOM.playbackRateNotifier?.classList.add("T_M_G-video-control-active");
    pos === "backwards" && this.settings.status.beta?.rewind ? setTimeout(this.rewind) : setTimeout(this.fastForward);
  }

  fastForward() {
    this.playbackRate = this.settings.playbackRate.fast;
    this.togglePlay(true);
  }

  rewind() {
    this.playbackRate = 1;
    if (this.DOM.playbackRateNotifierText) this.DOM.playbackRateNotifierText.textContent = `${this.settings.playbackRate.fast}x`;
    this.DOM.playbackRateNotifier?.classList.add("T_M_G-video-rewind");
    this.video.addEventListener("play", this.rewindReset);
    this.speedIntervalId = setInterval(this.rewindVideo, this.frameThrottleDelay);
  }

  rewindVideo() {
    this.togglePlay(false);
    this.currentTime -= this.settings.playbackRate.fast / this.pfps;
    this.videoCurrentProgressPosition = this.currentTime / this.duration;
    this.DOM.playbackRateNotifier?.setAttribute("data-current-time", tmg.formatTime(this.video.currentTime));
  }

  rewindReset() {
    if (this.speedIntervalId) {
      this.fire("videopause");
      clearInterval(this.speedIntervalId);
      this.speedIntervalId = null;
    } else this.speedIntervalId = setInterval(this.rewindVideo, this.frameThrottleDelay);
  }

  slowDown() {
    if (!this.speedCheck) return;
    this.speedCheck = false;
    this.playbackRate = this.lastPlaybackRate;
    clearInterval(this.speedIntervalId);
    this.video.removeEventListener("play", this.rewindReset);
    this.DOM.playbackRateNotifier?.classList.remove("T_M_G-video-control-active", "T_M_G-video-rewind");
    this.togglePlay(true);
  }

  set captionsSize(value) {
    this.videoCaptionsSize = this.settings.captionsSize.value = tmg.clamp(this.settings.captionsSize.min, value, this.settings.captionsSize.max);
  }

  get captionsSize() {
    return Number(this.videoCaptionsSize ?? 100);
  }

  set videoCaptionsCharacterEdgeStyle(value) {
    this.DOM.cueContainer.classList = "T_M_G-video-cue-container";
    this.DOM.cueContainer.classList.add(`T_M_G-video-cue-${value.replaceAll(" ", "-")}`);
  }

  get videoCaptionsCharacterEdgeStyle() {
    [...(this.DOM.cueContainer?.classList ?? [])]
      .find((cls) => cls !== "T_M_G-video-cue-container")
      ?.replace("T_M_G-video-cue-", "")
      .replaceAll("-", " ");
  }

  updateCaptionsSettings() {
    this.videoCaptionsMinSize = this.settings.captionsSize.min;
    this.videoCaptionsMaxSize = this.settings.captionsSize.max;
    this.captionsSize = this.captionsSize;
  }

  toggleCaptions() {
    if (this.video.textTracks[this.textTrackIndex]) this.videoContainer.classList.toggle("T_M_G-video-captions");
    else this.previewCaptions("No captions available for this video");
  }

  previewCaptions(show = "") {
    this.videoContainer.classList.add("T_M_G-video-captions-preview");
    if (!this.videoContainer.classList.contains("T_M_G-video-captions") || !this.DOM.cueContainer.innerHTML)
      this._handleCueChange({
        text: show || `${tmg.capitalize(this.videoContainer.dataset.trackKind) || "Captions"} look like this`,
      });
    clearTimeout(this.previewCaptionsTimeoutId);
    this.previewCaptionsTimeoutId = setTimeout(() => this.videoContainer.classList.remove("T_M_G-video-captions-preview"), 1500);
  }

  rotateCaptionsOpacity() {
    this.videoCaptionsOpacity = Number(this.videoCaptionsOpacity) === 1 ? 0.5 : 1;
    this.previewCaptions();
  }

  rotateCaptionsWindowOpacity() {
    this.videoCaptionsWindowOpacity = Number(this.videoCaptionsWindowOpacity) === 1 ? 0 : 1;
    this.previewCaptions();
  }

  changeCaptionsSize(value) {
    const sign = Math.sign(value) === 1 ? "+" : "-";
    value = Math.abs(value);
    const size = this.captionsSize;
    switch (sign) {
      case "-":
        if (size > this.settings.captionsSize.min) this.captionsSize = size - (size % value ? size % value : value);
        break;
      default:
        if (size < this.settings.captionsSize.max) this.captionsSize = size + (size % value ? size % value : value);
    }
    this.previewCaptions();
  }

  _handleCueChange(cue) {
    this.DOM.cueContainer.innerHTML = "";
    if (!cue) return;
    const cueText = cue.text;
    const cueWrapper = document.createElement("div");
    cueWrapper.className = "T_M_G-video-cue-wrapper";
    const words = cueText.split(" ");
    const parts = [words.slice(0, 8), words.slice(8)];
    parts.forEach((part) => {
      if (!part.length) return;
      const cueLine = document.createElement("div");
      cueLine.className = "T_M_G-video-cue-line";
      const cueEl = document.createElement("span");
      cueEl.className = "T_M_G-video-cue";
      cueEl.textContent = part.join(" ");
      cueLine.appendChild(cueEl);
      cueWrapper.appendChild(cueLine);
    });
    this.DOM.cueContainer.appendChild(cueWrapper);
    this.videoCurrentCueContainerHeight = this.DOM.cueContainer.offsetHeight + "px";
    this.videoCurrentCueContainerWidth = this.DOM.cueContainer.offsetWidth + "px";
    this._handleCuePosition();
  }

  _handleCueDragStart(e) {
    this.DOM.cueContainer?.setPointerCapture(e.pointerId);
    this.DOM.cueContainer?.addEventListener("pointermove", this._handleCueDragging);
    this.DOM.cueContainer?.addEventListener("pointerup", this._handleCueDragEnd);
    this.DOM.cueContainer?.addEventListener("pointercancel", this._handleCueDragEnd);
  }

  _handleCueDragging({ clientX, clientY }) {
    this.DOM.videoContainer.classList.add("T_M_G-video-cue-dragging");
    this.cuePositionX = clientX;
    this.cuePositionY = clientY;
    this._handleCuePosition();
  }

  _handleCuePosition() {
    if (!this.cuePositionX || !this.cuePositionY) return;
    this.RAFLoop("cueDragging", () => {
      const rect = this.videoContainer.getBoundingClientRect(),
        { offsetWidth: w, offsetHeight: h } = this.DOM.cueContainer,
        xR = 0,
        yR = 0,
        posX = tmg.clamp(xR + w / 2, rect.width - (this.cuePositionX - rect.left), rect.width - w / 2 - xR),
        posY = tmg.clamp(yR, rect.height - (this.cuePositionY - rect.top + h / 2), rect.height - h - yR);
      this.videoCurrentCueX = `${Math.round((posX / rect.width) * 100)}%`;
      this.videoCurrentCueY = `${Math.round((posY / rect.height) * 100)}%`;
    });
  }

  _handleCueDragEnd() {
    this.cancelRAFLoop("cueDragging");
    this.DOM.videoContainer.classList.remove("T_M_G-video-cue-dragging");
    this.DOM.cueContainer.removeEventListener("pointermove", this._handleCueDragging);
    this.DOM.cueContainer?.removeEventListener("pointerup", this._handleCueDragEnd);
    this.DOM.cueContainer?.removeEventListener("pointercancel", this._handleCueDragEnd);
  }

  set volume(value) {
    const v = tmg.clamp(this.shouldMute ? 0 : this.settings.volume.min, value, this.settings.volume.max) / 100;
    if (this.audioGainNode) this.audioGainNode.gain.value = this.settings.volume.value = v;
    this.video.muted = this.video.defaultMuted = this.settings.volume.muted = v === 0;
    this._handleVolumeChange();
  }

  get volume() {
    return Math.round((this.audioGainNode?.gain?.value ?? 1) * 100);
  }

  setUpAudio() {
    if (this.audioSetup) return;
    tmg.connectMediaToAudioManager(this.video);
    this.audioSourceNode = this.video.tmgSourceNode;
    this.audioGainNode = this.video.tmgGainNode;
    this.audioSetup = true;
  }

  removeAudio() {
    this.audioSourceNode?.disconnect();
    this.audioGainNode?.disconnect();
    this.audioSourceNode = this.audioGainNode = null;
    this.audioSetup = false;
  }

  updateAudioSettings() {
    tmg.initAudioManager(!this.video.autoplay);
    this.videoContainer.classList.toggle("T_M_G-video-volume-boost", this.settings.volume.max > 100);
    if (this.DOM.volumeSlider) this.DOM.volumeSlider.max = this.settings.volume.max;
    this.videoVolumeSliderPercent = Math.round((100 / this.settings.volume.max) * 100);
    this.videoMaxVolumeRatio = this.settings.volume.max / 100;
    this.lastVolume = this.settings.volume.value;
    this.shouldMute = this.shouldSetLastVolume = this.video.muted;
    this.volume = this.shouldMute ? 0 : this.lastVolume;
  }

  toggleMute(auto) {
    let volume;
    if (this.volume) {
      this.lastVolume = this.volume;
      this.shouldSetLastVolume = true;
      volume = 0;
    } else {
      volume = this.shouldSetLastVolume ? this.lastVolume : this.volume;
      if (volume === 0) volume = auto === "auto" ? this.settings.volume.skip : this.volumeSliderVolume;
      this.shouldSetLastVolume = false;
    }
    this.shouldMute = volume === 0;
    this.volume = volume;
  }

  _handleVolumeSliderInput({ target: { value: volume } }) {
    this.shouldMute = false;
    this.volume = volume;
    if (volume > 5) this.volumeSliderVolume = volume;
    this.shouldSetLastVolume = false;
    this.volumeActiveRestraint();
    this.delayOverlay();
  }

  _handleGestureVolumeSliderInput({ percent, sign }) {
    let volume = sign === "+" ? this.volume + percent * this.settings.volume.max : this.volume - percent * this.settings.volume.max;
    volume = tmg.clamp(0, Math.floor(volume), this.settings.volume.max);
    this.volume = volume;
    this.shouldSetLastVolume = false;
  }

  _handleVolumeChange() {
    let v = this.volume;
    if (this.DOM.volumeNotifierContent) this.DOM.volumeNotifierContent.textContent = v + "%";
    let vLevel = "";
    if (v == 0) vLevel = "muted";
    else if (v < 50) vLevel = "low";
    else if (v <= 100) vLevel = "high";
    else if (v > 100) vLevel = "boost";
    const vPercent = (v - 0) / (this.settings.volume.max - 0);
    this.videoContainer.setAttribute("data-volume-level", vLevel);
    if (this.DOM.volumeSlider) this.DOM.volumeSlider.value = v;
    this.DOM.volumeSlider?.setAttribute("data-volume", v);
    if (this.DOM.touchVolumeContent) this.DOM.touchVolumeContent.textContent = v + "%";
    this.videoCurrentVolumeValuePosition = `${12 + vPercent * 77}%`;
    if (this.settings.volume.max > 100) {
      if (v <= 100) {
        this.videoVolumeSliderBoostPercent = 0;
        this.videoCurrentVolumeSliderBoostPosition = 0;
        this.videoCurrentVolumeSliderPosition = (v - 0) / (100 - 0);
      } else if (v > 100) {
        this.videoVolumeSliderBoostPercent = Number(this.videoVolumeSliderPercent) + 5;
        this.videoCurrentVolumeSliderBoostPosition = (v - 100) / (this.settings.volume.max - 100);
      }
    } else this.videoCurrentVolumeSliderPosition = vPercent;
  }

  changeVolume(value) {
    const sign = Math.sign(value) === 1 ? "+" : "-";
    value = Math.abs(value);
    let volume = this.shouldSetLastVolume ? this.lastVolume : this.volume;
    switch (sign) {
      case "-":
        if (volume > this.settings.volume.min) volume -= volume % value ? volume % value : value;
        if (volume === 0) {
          this.fire("volumemuted");
          break;
        }
        this.fire("volumedown");
        break;
      default:
        if (volume < this.settings.volume.max) volume += volume % value ? value - (volume % value) : value;
        this.fire("volumeup");
        break;
    }
    if (this.shouldSetLastVolume) {
      if (this.DOM.volumeNotifierContent) this.DOM.volumeNotifierContent.textContent = volume + "%";
      this.lastVolume = volume;
    } else this.volume = volume;
  }

  _handleVolumeContainerMouseMove() {
    if (!this.DOM.volumeSlider?.parentElement?.matches(":hover")) return;
    this.DOM.volumeSlider?.parentElement?.classList.add("T_M_G-video-control-active");
    this.volumeActiveRestraint();
  }

  volumeActiveRestraint() {
    clearTimeout(this.volumeActiveRestraintId);
    this.volumeActiveRestraintId = setTimeout(() => this.DOM.volumeSlider?.parentElement?.classList.remove("T_M_G-video-control-active"), this.settings.overlayDelay);
  }

  updateBrightnessSettings() {
    this.videoContainer.classList.toggle("T_M_G-video-brightness-boost", this.settings.brightness.max > 100);
    if (this.DOM.brightnessSlider) this.DOM.brightnessSlider.max = this.settings.brightness.max;
    this.videoBrightnessSliderPercent = Math.round((100 / this.settings.brightness.max) * 100);
    this.videoMaxBrightnessRatio = this.settings.brightness.max / 100;
    this.lastBrightness = this.settings.brightness.value;
    this.brightness = this.lastBrightness;
  }

  set brightness(value) {
    this.videoBrightness = this.settings.brightness.value = tmg.clamp(this.shouldDark ? 0 : this.settings.brightness.min, value, this.settings.brightness.max);
    this._handleBrightnessChange();
  }

  get brightness() {
    return Number(this.videoBrightness ?? 100);
  }

  toggleDark(auto) {
    let brightness;
    if (this.brightness) {
      this.lastBrightness = this.brightness;
      this.shouldSetLastBrightness = true;
      brightness = 0;
    } else {
      brightness = this.shouldSetLastBrightness ? this.lastBrightness : this.brightness;
      if (brightness === 0) brightness = auto === "auto" ? this.settings.brightness.skip : this.brightnessSliderBrightness;
      this.shouldSetLastBrightness = false;
    }
    this.shouldDark = brightness === 0;
    this.brightness = brightness;
  }

  _handleBrightnessSliderInput({ target: { value: brightness } }) {
    this.shouldDark = false;
    this.brightness = brightness;
    if (brightness > 5) this.brightnessSliderBrightness = brightness;
    this.shouldSetLastBrightness = false;
    this.brightnessActiveRestraint();
    this.delayOverlay();
  }

  _handleGestureBrightnessSliderInput({ percent, sign }) {
    let brightness = sign === "+" ? this.brightness + percent * this.settings.brightness.max : this.brightness - percent * this.settings.brightness.max;
    brightness = tmg.clamp(0, Math.floor(brightness), this.settings.brightness.max);
    this.brightness = brightness;
    this.shouldSetLastBrightness = false;
  }

  _handleBrightnessChange() {
    let b = this.brightness;
    if (this.DOM.brightnessNotifierContent) this.DOM.brightnessNotifierContent.textContent = b + "%";
    let bLevel = "";
    if (b == 0) bLevel = "dark";
    else if (b < 50) bLevel = "low";
    else if (b <= 100) bLevel = "high";
    else if (b > 100) bLevel = "boost";
    const bPercent = (b - 0) / (this.settings.brightness.max - 0);
    this.videoContainer.setAttribute("data-brightness-level", bLevel);
    if (this.DOM.brightnessSlider) this.DOM.brightnessSlider.value = b;
    this.DOM.brightnessSlider?.setAttribute("data-brightness", b);
    if (this.DOM.touchBrightnessContent) this.DOM.touchBrightnessContent.textContent = b + "%";
    this.videoCurrentBrightnessValuePosition = `${12 + bPercent * 77}%`;
    if (this.settings.brightness.max > 100) {
      if (b <= 100) {
        this.videoBrightnessSliderBoostPercent = 0;
        this.videoCurrentBrightnessSliderBoostPosition = 0;
        this.videoCurrentBrightnessSliderPosition = (b - 0) / (100 - 0);
      } else if (b > 100) {
        this.videoBrightnessSliderBoostPercent = Number(this.videoBrightnessSliderPercent) + 5;
        this.videoCurrentBrightnessSliderBoostPosition = (b - 100) / (this.settings.brightness.max - 100);
      }
    } else this.videoCurrentBrightnessSliderPosition = bPercent;
  }

  changeBrightness(value) {
    const sign = Math.sign(value) === 1 ? "+" : "-";
    value = Math.abs(value);
    let brightness = this.shouldSetLastBrightness ? this.lastBrightness : this.brightness;
    value = Math.abs(value);
    switch (sign) {
      case "-":
        if (brightness > this.settings.brightness.min) brightness -= brightness % value ? brightness % value : value;
        if (brightness === 0) {
          this.fire("brightnessdark");
          break;
        }
        this.fire("brightnessdown");
        break;
      default:
        if (brightness < this.settings.brightness.max) brightness += brightness % value ? value - (brightness % value) : value;
        this.fire("brightnessup");
        break;
    }
    if (this.shouldSetLastBrightness) {
      if (this.DOM.brightnessNotifierContent) this.DOM.brightnessNotifierContent.textContent = brightness + "%";
      this.lastBrightness = brightness;
    } else this.brightness = brightness;
  }

  _handleBrightnessContainerMouseMove() {
    if (!this.DOM.brightnessSlider?.parentElement?.matches(":hover")) return;
    this.DOM.brightnessSlider?.parentElement?.classList.add("T_M_G-video-control-active");
    this.brightnessActiveRestraint();
  }

  brightnessActiveRestraint() {
    clearTimeout(this.brightnessActiveRestraintId);
    this.brightnessActiveRestraintId = setTimeout(() => this.DOM.brightnessSlider?.parentElement?.classList.remove("T_M_G-video-control-active"), this.settings.overlayDelay);
  }

  toggleTheaterMode() {
    if (this.settings.status.modes.theater) this.videoContainer.classList.toggle("T_M_G-video-theater");
  }

  async toggleFullScreenMode() {
    if (!this.settings.status.modes.fullScreen) return;
    if (!this.isModeActive("fullScreen")) {
      if (tmg._CURRENT_FULL_SCREEN_PLAYER) return;
      if (this.isModeActive("floatingPlayer")) {
        this.floatingPlayer?.addEventListener("pagehide", this.toggleFullScreenMode);
        return this.floatingPlayer?.close();
      }
      if (this.isModeActive("pictureInPicture")) document.exitPictureInPicture();
      if (this.isModeActive("miniPlayer")) this.toggleMiniPlayerMode(false, "instant");
      tmg._CURRENT_FULL_SCREEN_PLAYER = this;
      if (this.videoContainer.requestFullscreen) await this.videoContainer.requestFullscreen();
      else if (this.videoContainer.mozRequestFullScreen) await this.videoContainer.mozRequestFullScreen();
      else if (this.videoContainer.msRequestFullscreen) await this.videoContainer.msRequestFullscreen();
      else if (this.videoContainer.webkitRequestFullScreen) await this.videoContainer.webkitRequestFullScreen();
      else if (this.video.webkitEnterFullScreen) {
        // this is for native ios fullscreen support
        await this.video.webkitEnterFullScreen();
        this.video.addEventListener(
          "webkitendfullscreen",
          () => {
            this.inFullScreen = false;
            this._handleFullScreenChange();
          },
          { once: true }
        );
      }
      this.inFullScreen = true;
    } else {
      if (document.exitFullscreen) await document.exitFullscreen();
      else if (document.mozCancelFullScreen) await document.mozCancelFullScreen();
      else if (document.msExitFullscreen) await document.msExitFullscreen();
      else if (document.webkitCancelFullScreen) await document.webkitCancelFullScreen();
      this.inFullScreen = false;
    }
  }

  async _handleFullScreenChange() {
    if (this.inFullScreen) {
      this.videoContainer.classList.add("T_M_G-video-full-screen");
      this.videoContainer.addEventListener("wheel", this._handleGestureWheel, { passive: false });
    }
    if (!this.inFullScreen || !tmg.queryFullScreen()) {
      this.videoContainer.classList.remove("T_M_G-video-full-screen");
      tmg._CURRENT_FULL_SCREEN_PLAYER = null;
      this.inFullScreen = false;
      this.videoContainer.removeEventListener("wheel", this._handleGestureWheel, { passive: false });
    }
    await this.autoLockFullScreenOrientation();
  }

  async autoLockFullScreenOrientation() {
    if (this.isModeActive("fullScreen")) {
      const lockOrientation = this.video.videoHeight > this.video.videoWidth ? "portrait" : "landscape";
      if (screen.orientation) await screen.orientation?.lock?.(lockOrientation);
      this.DOM.fullScreenOrientationBtn.classList.remove("T_M_G-video-control-hidden");
    } else {
      screen.orientation?.unlock?.();
      this.DOM.fullScreenOrientationBtn.classList.add("T_M_G-video-control-hidden");
    }
  }

  async changeFullScreenOrientation() {
    await screen.orientation?.lock?.(screen.orientation.angle === 0 ? "landscape" : "portrait");
  }

  async togglePictureInPictureMode() {
    if (!this.settings.status.modes.pictureInPicture) return;
    if (this.isModeActive("fullScreen")) await this.toggleFullScreenMode();
    if (this.settings.status.beta.floatingPlayer && window.documentPictureInPicture) return this.toggleFloatingPlayer();
    !this.isModeActive("pictureInPicture") ? this.video.requestPictureInPicture() : document.exitPictureInPicture();
  }

  _handleEnterPictureInPicture() {
    this.videoContainer.classList.add("T_M_G-video-picture-in-picture");
    this.showOverlay();
    this.toggleMiniPlayerMode(false);
    this.setMediaSession();
    tmg._PICTURE_IN_PICTURE_ACTIVE = true;
  }

  _handleLeavePictureInPicture() {
    tmg._PICTURE_IN_PICTURE_ACTIVE = false;
    //the video takes a while before it enters back into the player so a timeout is used to prevent the user from seeing the default ui
    setTimeout(() => {
      this.videoContainer.classList.remove("T_M_G-video-picture-in-picture");
      this.toggleMiniPlayerMode();
    }, 180);
    this.delayOverlay();
  }

  toggleFloatingPlayer() {
    if (!this.settings.status.modes.pictureInPicture || !("documentPictureInPicture" in window)) return;
    if (!this.floatingPlayerActive) this.initFloatingPlayer();
    else this.floatingPlayer?.close();
  }

  async initFloatingPlayer() {
    if (this.floatingPlayerActive) return;
    this.floatingPlayerActive = true;
    documentPictureInPicture.window?.close?.();
    this.toggleMiniPlayerMode(false);
    this.floatingPlayer = await documentPictureInPicture.requestWindow(this.floatingPlayerOptions);
    this.pseudoVideoContainer.append(this.DOM.pictureInPictureWrapper.cloneNode(true));
    this.queryDOM(".T_M_G-video-picture-in-picture-icon-wrapper", true).addEventListener("click", this.toggleFloatingPlayer);
    this.activatePseudoMode();
    this.videoContainer.classList.add("T_M_G-video-progress-bar", "T_M_G-video-floating-player");
    const style = document.createElement("style");
    let cssText = "";
    for (const sheet of document.styleSheets) {
      try {
        for (const cssRule of sheet.cssRules) {
          if (cssRule.selectorText?.includes(":root") || cssRule.cssText.includes("T_M_G")) cssText += cssRule.cssText;
        }
      } catch {
        continue;
      }
    }
    style.textContent = cssText;
    this.floatingPlayer?.document.head.appendChild(style);
    this.floatingPlayer?.document.body.append(this.videoContainer);
    if (this.floatingPlayer) {
      this.floatingPlayer.document.documentElement.id = document.documentElement.id;
      this.floatingPlayer.document.documentElement.className = document.documentElement.className;
      document.documentElement.getAttributeNames().forEach((attr) => this.floatingPlayer.document.documentElement.setAttribute(attr, document.documentElement.getAttribute(attr)));
    }
    tmg.DOMMutationObserver.observe(this.floatingPlayer.document.documentElement, { childList: true, subtree: true });
    this.floatingPlayer?.addEventListener("pagehide", this._handleFloatingPlayerClose);
    this.floatingPlayer?.addEventListener("resize", this._handleMediaParentResize);
    this.floatingPlayer?.addEventListener("wheel", this._handleGestureWheel, { passive: false });
    this.setKeyEventListeners("floating");
  }

  _handleFloatingPlayerClose() {
    if (!this.floatingPlayerActive) return;
    this.floatingPlayerActive = false;
    this.videoContainer.classList.toggle("T_M_G-video-progress-bar", this.settings.time.progressBar);
    this.videoContainer.classList.remove("T_M_G-video-floating-player");
    this.deactivatePseudoMode();
    this.queryDOM(".T_M_G-video-picture-in-picture-wrapper", true).remove();
    this.toggleMiniPlayerMode();
  }

  expandMiniPlayer() {
    this.toggleMiniPlayerMode(false, "instant");
  }

  cancelMiniPlayer() {
    this.togglePlay(false);
    this.toggleMiniPlayerMode(false);
  }

  toggleMiniPlayerMode(bool, behaviour) {
    if (!this.settings.status.modes.miniPlayer) return;
    // mini player has an actual behaviour :)
    if ((!this.isModeActive("miniPlayer") && !this.isModeActive("pictureInPicture") && !this.isModeActive("floatingPlayer") && !this.isModeActive("fullScreen") && !this.parentIntersecting && window.innerWidth >= this.miniPlayerMinWindowWidth && !this.video.paused) || (bool === true && !this.isModeActive("miniPlayer"))) {
      this.activatePseudoMode();
      this.videoContainer.classList.add("T_M_G-video-progress-bar", "T_M_G-video-mini-player");
      this.videoContainer.addEventListener("mousedown", this.moveMiniPlayer);
      this.videoContainer.addEventListener("touchstart", this.moveMiniPlayer, { passive: false });
    } else if ((this.isModeActive("miniPlayer") && this.parentIntersecting) || (this.isModeActive("miniPlayer") && window.innerWidth < this.miniPlayerMinWindowWidth) || (bool === false && this.isModeActive("miniPlayer"))) {
      if (behaviour && tmg.isInWindowView(this.pseudoVideoContainer))
        this.pseudoVideoContainer.scrollIntoView({
          behavior: behaviour,
          block: "center",
          inline: "center",
        }); // british and american spellings :(
      this.deactivatePseudoMode();
      this.videoContainer.classList.toggle("T_M_G-video-progress-bar", this.settings.time.progressBar);
      this.videoContainer.classList.remove("T_M_G-video-mini-player");
      this.videoContainer.removeEventListener("mousedown", this.moveMiniPlayer);
      this.videoContainer.removeEventListener("touchstart", this.moveMiniPlayer, { passive: false });
    }
  }

  moveMiniPlayer({ target }) {
    if (!this.isModeActive("miniPlayer") || this.DOM.videoControlsContainer.contains(target) || this.DOM.cueContainer?.contains(target)) return;
    document.addEventListener("mousemove", this._handleMiniPlayerPosition);
    document.addEventListener("mouseup", this.emptyMiniPlayerListeners);
    document.addEventListener("mouseleave", this.emptyMiniPlayerListeners);
    document.addEventListener("touchmove", this._handleMiniPlayerPosition, { passive: false });
    document.addEventListener("touchend", this.emptyMiniPlayerListeners, { passive: false });
  }

  _handleMiniPlayerPosition(e) {
    if (e.touches?.length > 1) return;
    e.preventDefault();
    this.removeOverlay("force");
    this.videoContainer.classList.add("T_M_G-video-movement");
    this.RAFLoop("miniPlayerDragging", () => {
      let { innerWidth: ww, innerHeight: wh } = window,
        { offsetWidth: w, offsetHeight: h } = this.videoContainer;
      const x = e.clientX ?? e.changedTouches[0].clientX,
        y = e.clientY ?? e.changedTouches[0].clientY,
        xR = 0,
        yR = 0,
        posX = tmg.clamp(xR, ww - x - w / 2, ww - w - xR),
        posY = tmg.clamp(yR, wh - y - h / 2, wh - h - yR);
      this.videoCurrentMiniPlayerX = `${Math.round((posX / ww) * 100)}%`;
      this.videoCurrentMiniPlayerY = `${Math.round((posY / wh) * 100)}%`;
    });
  }

  emptyMiniPlayerListeners() {
    this.cancelRAFLoop("miniPlayerDragging");
    this.videoContainer.classList.remove("T_M_G-video-movement");
    this.showOverlay();
    document.removeEventListener("mousemove", this._handleMiniPlayerPosition);
    document.removeEventListener("mouseup", this.emptyMiniPlayerListeners);
    document.removeEventListener("mouseleave", this.emptyMiniPlayerListeners);
    document.removeEventListener("touchmove", this._handleMiniPlayerPosition, { passive: false });
    document.removeEventListener("touchend", this.emptyMiniPlayerListeners, { passive: false });
  }

  //Keyboard and General Accessibility Functions
  _handleClick({ target }) {
    if (target !== this.DOM.videoOverlayControlsContainer) return;
    clearTimeout(this.clickTimeoutId);
    if (this.speedCheck && this.playTriggerCounter < 1) return;
    this.clickTimeoutId = setTimeout(() => {
      if (this.isMediaMobile && !this.isModeActive("miniPlayer")) {
        if (!this.buffering && !this.isModeActive("pictureInPicture")) this.videoContainer.classList.toggle("T_M_G-video-overlay");
      }
      if (this.isMediaMobile || this.isModeActive("miniPlayer")) return;
      this.togglePlay();
      this.video.paused ? this.fire("videopause") : this.fire("videoplay");
      this.showOverlay();
    }, 300);
  }

  _handleRightClick(e) {
    e.preventDefault();
  }

  _handleDoubleClick(e) {
    const { clientX: x, target, detail } = e;
    //this function triggers the forward and backward skip, they then assign the function to the click event, when the trigger is pulled, skipPersist is set to true and the skip is handled by only the click event, if the position of the click changes within the skip interval and when the 'skipPosition' prop is still available, the click event assignment is revoked
    if (target !== this.DOM.videoOverlayControlsContainer) return;
    clearTimeout(this.clickTimeoutId);
    const rect = this.videoContainer.getBoundingClientRect();
    let pos = x - rect.left > rect.width * 0.65 ? "right" : x - rect.left < rect.width * 0.35 ? "left" : "center";
    if (this.skipPersist && pos !== this.skipPersistPosition) {
      this.deactivateSkipPersist();
      if (detail == 1) return;
    }
    if (pos === "center") {
      this.isMediaMobile || this.isModeActive("miniPlayer") ? this.togglePlay() : this.toggleFullScreenMode();
      return;
    } else {
      if (this.skipPersist && detail == 2) return;
      this.activateSkipPersist(pos);
      pos === "right" ? this.skip(this.settings.time.skip) : this.skip(-this.settings.time.skip);
      tmg.rippleHandler(e, this.currentNotifier);
    }
  }

  activateSkipPersist(pos) {
    if (this.skipPersist) return;
    this.videoContainer.addEventListener("click", this._handleDoubleClick);
    this.skipPersist = true;
    this.skipPersistPosition = pos;
  }

  deactivateSkipPersist() {
    if (!this.skipPersist) return;
    this.videoContainer.removeEventListener("click", this._handleDoubleClick);
    this.skipPersist = false;
    this.skipPersistPosition = null;
  }

  _handleHoverPointerActive({ target }) {
    if (!(this.isMediaMobile && !this.isModeActive("miniPlayer"))) this.showOverlay();
    if (this.DOM.videoControlsContainer.contains(target)) clearTimeout(this.overlayDelayId);
  }

  _handleHoverPointerDown() {
    this.delayOverlay();
  }

  _handleHoverPointerOut() {
    if (!this.isMediaMobile && !this.videoContainer.matches(":hover")) this.removeOverlay();
  }

  showOverlay() {
    if (!this.shouldShowOverlay()) return;
    this.videoContainer.classList.add("T_M_G-video-overlay");
    this.delayOverlay();
  }

  shouldShowOverlay() {
    return !this.videoContainer.classList.contains("T_M_G-video-movement");
  }

  delayOverlay() {
    clearTimeout(this.overlayDelayId);
    if (this.shouldRemoveOverlay()) this.overlayDelayId = setTimeout(this.removeOverlay, this.settings.overlayDelay);
  }

  removeOverlay(manner) {
    if (manner === "force" || this.shouldRemoveOverlay()) this.videoContainer.classList.remove("T_M_G-video-overlay");
  }

  shouldRemoveOverlay() {
    return !this.video.paused && !this.buffering && !this.isModeActive("pictureInPicture");
  }

  _handleGestureWheel(e) {
    if (!this.settings.status.beta.gestureControls || this.gestureTouchXCheck || this.gestureTouchYCheck || this.speedCheck || this.isModeActive("settings")) return;
    e.preventDefault();
    this.gestureWheelTimeoutId ? clearTimeout(this.gestureWheelTimeoutId) : this._handleGestureWheelInit(e);
    this.gestureWheelTimeoutId = setTimeout(this._handleGestureWheelStop, this.gestureWheelTimeout);
    this._handleGestureWheelMove(e);
  }

  _handleGestureWheelInit({ clientX: x, clientY: y }) {
    const rect = this.videoContainer.getBoundingClientRect();
    this.gestureWheelZone = {
      x: x - rect.left > rect.width / 2 ? "right" : "left",
      y: y - rect.left > rect.height / 2 ? "bottom" : "top",
    };
    this.gestureWheelTimePercent = 0;
    this.gestureWheelTimeMultiplier = 1;
    this.gestureTimeMultiplierY = 0;
  }

  _handleGestureWheelMove({ clientX: x, deltaX, deltaY, shiftKey }) {
    deltaX = shiftKey ? deltaY : deltaX;
    const rect = this.videoContainer.getBoundingClientRect();
    const width = shiftKey ? rect.height : rect.width,
      height = shiftKey ? rect.width : rect.height;
    let xPercent = -deltaX / (width * 6);
    xPercent = this.gestureWheelTimePercent += xPercent;
    const xSign = Math.sign(xPercent) === 1 ? "+" : "-";
    xPercent = Math.abs(xPercent);
    if (deltaX || shiftKey) {
      if (this.gestureWheelYCheck) return this._handleGestureWheelStop();
      this.gestureWheelXCheck = true;
      this.DOM.touchTimelineNotifier.classList.add("T_M_G-video-control-active");
      this._handleGestureTimelineInput({
        percent: xPercent,
        sign: xSign,
        multiplier: this.gestureWheelTimeMultiplier,
      });
      if (shiftKey) return;
    }
    if (deltaY) {
      if (this.gestureWheelXCheck) {
        const mY = tmg.clamp(0, Math.abs((this.gestureTimeMultiplierY += deltaY)), height * 3);
        this.gestureWheelTimeMultiplier = 1 - mY / (height * 3);
        this._handleGestureTimelineInput({
          percent: xPercent,
          sign: xSign,
          multiplier: this.gestureWheelTimeMultiplier,
        });
        return;
      }
      const currentXZone = x - rect.left > width / 2 ? "right" : "left";
      if (currentXZone !== this.gestureWheelZone.x) return this._handleGestureWheelStop();
      this.gestureWheelYCheck = true;
      (this.gestureWheelZone?.x === "right" ? this.DOM.touchVolumeNotifier : this.DOM.touchBrightnessNotifier)?.classList.add("T_M_G-video-control-active");
      const ySign = deltaY >= 0 ? "+" : "-";
      const yPercent = tmg.clamp(0, Math.abs(deltaY), height * 3) / (height * 3);
      this.gestureWheelZone?.x === "right"
        ? this._handleGestureVolumeSliderInput({
            percent: yPercent,
            sign: ySign,
          })
        : this._handleGestureBrightnessSliderInput({
            percent: yPercent,
            sign: ySign,
          });
    }
  }

  _handleGestureWheelStop() {
    this.gestureWheelTimeoutId = null;
    if (this.gestureWheelYCheck) {
      this.gestureWheelYCheck = false;
      this.removeOverlay();
      this.DOM.touchVolumeNotifier?.classList.remove("T_M_G-video-control-active");
      this.DOM.touchBrightnessNotifier?.classList.remove("T_M_G-video-control-active");
    }
    if (this.gestureWheelXCheck) {
      this.gestureWheelXCheck = false;
      this.DOM.touchTimelineNotifier?.classList.remove("T_M_G-video-control-active");
      this.currentTime = this.gestureNextTime;
    }
  }

  setGestureTouchCancel() {
    this.gestureTouchCanCancel = true;
  }

  _handleGestureTouchStart(e) {
    if (e.touches?.length > 1) return;
    if (e.target !== this.DOM.videoControlsContainer && e.target !== this.DOM.videoOverlayControlsContainer) return;
    if (!this.settings.status.beta.gestureControls || this.isModeActive("miniPlayer") || this.speedCheck) return;
    this._handleGestureTouchEnd();
    this.lastGestureTouchX = e.clientX ?? e.targetTouches[0].clientX;
    this.lastGestureTouchY = e.clientY ?? e.targetTouches[0].clientY;
    this.videoContainer.addEventListener("touchmove", this._handleGestureTouchInit, { once: true, passive: false });
    //if user moves finger like during scrolling
    this.videoContainer.addEventListener("touchmove", this.setGestureTouchCancel, { passive: true });
    //changing bool since timeout reached and user is not scrolling
    this.gestureTouchTimeoutId = setTimeout(() => {
      this.videoContainer.removeEventListener("touchmove", this.setGestureTouchCancel, { passive: true });
      this.gestureTouchCanCancel = false;
    }, this.gestureTouchThreshold);
    this.videoContainer.addEventListener("touchend", this._handleGestureTouchEnd);
  }

  _handleGestureTouchInit(e) {
    if (e.touches?.length > 1) return;
    if (!this.settings.status.beta.gestureControls || this.isModeActive("miniPlayer") || this.speedCheck) return;
    e.preventDefault();
    const rect = this.videoContainer.getBoundingClientRect(),
      x = e.clientX ?? e.targetTouches[0].clientX,
      y = e.clientY ?? e.targetTouches[0].clientY,
      deltaX = Math.abs(this.lastGestureTouchX - x),
      deltaY = Math.abs(this.lastGestureTouchY - y);
    this.gestureTouchZone = {
      x: x - rect.left > rect.width / 2 ? "right" : "left",
      y: y - rect.left > rect.height / 2 ? "bottom" : "top",
    };
    if (deltaX > deltaY * this.gestureTouchFingerXRatio) {
      this.gestureTouchXCheck = true;
      this.videoContainer.addEventListener("touchmove", this._handleGestureTouchXMove, { passive: false });
    } else if (deltaY > deltaX * this.gestureTouchFingerYRatio) {
      this.gestureTouchYCheck = true;
      this.videoContainer.addEventListener("touchmove", this._handleGestureTouchYMove, { passive: false });
    }
  }

  _handleGestureTouchXMove(e) {
    e.preventDefault();
    if (this.gestureTouchCanCancel) return this._handleGestureTouchEnd();
    else this.DOM.touchTimelineNotifier.classList.add("T_M_G-video-control-active");
    this.throttle(
      "gestureTouchMove",
      () => {
        const width = this.videoContainer.offsetWidth,
          height = this.videoContainer.offsetHeight,
          x = e.clientX ?? e.targetTouches[0].clientX,
          y = e.clientY ?? e.targetTouches[0].clientY,
          deltaX = x - this.lastGestureTouchX,
          deltaY = y - this.lastGestureTouchY,
          sign = deltaX >= 0 ? "+" : "-",
          percent = tmg.clamp(0, Math.abs(deltaX), width) / width,
          mY = tmg.clamp(0, Math.abs(deltaY), height * 0.5),
          multiplier = 1 - mY / (height * 0.5);
        this._handleGestureTimelineInput({ percent, sign, multiplier });
      },
      this.gestureTouchMoveThrottleDelay
    );
  }

  _handleGestureTouchYMove(e) {
    e.preventDefault();
    if (!this.isModeActive("fullScreen") && this.gestureTouchCanCancel) return this._handleGestureTouchEnd();
    else (this.gestureTouchZone.x === "right" ? this.DOM.touchVolumeNotifier : this.DOM.touchBrightnessNotifier)?.classList.add("T_M_G-video-control-active");
    this.throttle(
      "gestureTouchMove",
      () => {
        const height = this.videoContainer.offsetHeight,
          y = e.clientY ?? e.targetTouches[0].clientY,
          deltaY = y - this.lastGestureTouchY,
          sign = deltaY >= 0 ? "-" : "+",
          percent = tmg.clamp(0, Math.abs(deltaY), height) / height;
        this.lastGestureTouchY = y;
        this.gestureTouchZone?.x === "right" ? this._handleGestureVolumeSliderInput({ percent, sign }) : this._handleGestureBrightnessSliderInput({ percent, sign });
      },
      this.gestureTouchMoveThrottleDelay
    );
  }

  _handleGestureTouchEnd() {
    if (this.gestureTouchXCheck) {
      this.gestureTouchXCheck = false;
      this.videoContainer.removeEventListener("touchmove", this._handleGestureTouchXMove, { passive: false });
      this.DOM.touchTimelineNotifier?.classList.remove("T_M_G-video-control-active");
      if (!this.gestureTouchCanCancel) this.currentTime = this.gestureNextTime;
    }
    if (this.gestureTouchYCheck) {
      this.gestureTouchYCheck = false;
      this.videoContainer.removeEventListener("touchmove", this._handleGestureTouchYMove, { passive: false });
      this.DOM.touchVolumeNotifier?.classList.remove("T_M_G-video-control-active");
      this.DOM.touchBrightnessNotifier?.classList.remove("T_M_G-video-control-active");
      if (!this.gestureTouchCanCancel) this.removeOverlay();
    }
    if (this.gestureTouchTimeoutId) {
      clearTimeout(this.gestureTouchTimeoutId);
      this.videoContainer.removeEventListener("touchmove", this.setGestureTouchCancel, {
        passive: true,
      });
      this.gestureTouchCanCancel = true;
    }
    this.videoContainer.removeEventListener("touchmove", this._handleGestureTouchInit, { once: true, passive: false });
    this.videoContainer.removeEventListener("touchend", this._handleGestureTouchEnd);
  }

  _handleSpeedPointerDown(e) {
    if (e.target !== this.DOM.videoControlsContainer && e.target !== this.DOM.videoOverlayControlsContainer) return;
    if (this.isModeActive("miniPlayer")) return;
    //conditions to cancel the speed timeout
    //tm: if user moves finger before speedup is called like during scrolling
    this.videoContainer.addEventListener("touchmove", this._handleSpeedPointerUp, {
      passive: true,
    });
    this.videoContainer.addEventListener("mouseup", this._handleSpeedPointerUp);
    this.videoContainer.addEventListener("mouseleave", this._handleSpeedPointerOut);
    this.videoContainer.addEventListener("touchend", this._handleSpeedPointerUp);
    clearTimeout(this.speedTimeoutId);
    this.speedTimeoutId = setTimeout(() => {
      //tm: removing listener since timeout reached and user is not scrolling
      this.videoContainer.removeEventListener("touchmove", this._handleSpeedPointerUp, {
        passive: true,
      });
      this.speedPointerCheck = true;
      const x = e.clientX ?? e.targetTouches[0].clientX;
      const rect = this.videoContainer.getBoundingClientRect();
      this.speedDirection = x - rect.left >= rect.width * 0.5 ? "forwards" : "backwards";
      if (this.settings.status.beta.rewind) {
        this.videoContainer.addEventListener("mousemove", this._handleSpeedPointerMove);
        this.videoContainer.addEventListener("touchmove", this._handleSpeedPointerMove, {
          passive: true,
        });
      }
      this.fastPlay(this.speedDirection);
    }, this.fastPlayThreshold);
  }

  _handleSpeedPointerOut(e) {
    if (!this.videoContainer.matches(":hover")) this._handleSpeedPointerUp(e);
  }

  _handleSpeedPointerMove(e) {
    if (e.touches?.length > 1) return;
    this.throttle(
      "speedPointerMove",
      () => {
        const rect = this.videoContainer.getBoundingClientRect();
        const x = e.clientX ?? e.targetTouches[0].clientX;
        const currPos = x - rect.left >= rect.width * 0.5 ? "forwards" : "backwards";
        if (currPos !== this.speedDirection) {
          this.speedDirection = currPos;
          this.slowDown();
          this.fastPlay(this.speedDirection);
        }
      },
      this.speedPointerMoveThrottleDelay
    );
  }

  _handleSpeedPointerUp() {
    this.videoContainer.removeEventListener("mouseup", this._handleSpeedPointerUp);
    this.videoContainer.removeEventListener("mouseleave", this._handleSpeedPointerOut);
    this.videoContainer.removeEventListener("touchend", this._handleSpeedPointerUp);
    if (this.settings.status.beta.rewind) {
      this.videoContainer.removeEventListener("mousemove", this._handleSpeedPointerMove);
      this.videoContainer.removeEventListener("touchmove", this._handleSpeedPointerMove, {
        passive: true,
      });
    }
    this.speedPointerCheck = false;
    clearTimeout(this.speedTimeoutId);
    //tm: removing listener since user is not scrolling
    this.videoContainer.removeEventListener("touchmove", this._handleSpeedPointerUp, { passive: true });
    if (this.speedCheck && this.playTriggerCounter < 1) setTimeout(this.slowDown);
  }

  fetchKeyShortcutsForDisplay() {
    const shortcuts = {};
    tmg.KEY_SHORTCUT_ACTIONS.forEach((action) => (shortcuts[action] = tmg.formatKeyForDisplay(this.settings.keys.shortcuts[action])));
    return shortcuts;
  }

  getTermsForCombo(combo) {
    const terms = { override: false, block: false, allowed: false, action: null };
    const { overrides, shortcuts, blocks, strictMatches: s } = this.settings.keys;
    if (tmg.matchKeys(overrides, combo, s)) terms.override = true;
    if (tmg.matchKeys(blocks, combo, s)) terms.block = true;
    if (tmg.matchKeys(tmg.WHITE_LISTED_KEYS, combo)) terms.allowed = true; // Allow whitelisted system keys - w
    terms.action = Object.entries(shortcuts).find(([, shortcut]) => tmg.matchKeys(shortcut, combo, s))?.[0] || null; // Find action name for shortcuts
    return terms;
  }

  keyEventAllowed(e) {
    if (this.settings.keys.disabled) return;
    // UI safety checks
    if ((e.key === " " || e.key === "Enter") && e.currentTarget.document.activeElement?.tagName === "BUTTON") return false;
    if (e.currentTarget.document.activeElement?.matches("input,textarea,[contenteditable='true']")) return false;
    const combo = tmg.stringifyKeyCombo(e);
    console.log(combo)
    const { override, block, action, allowed } = this.getTermsForCombo(combo);
    if (block) return false;
    if (override) e.preventDefault();
    if (action) return action;
    if (allowed) return e.key.toLowerCase(); // inner system defaults
    return false; // Not allowed
  }

  _handleKeyDown(e) {
    const action = this.keyEventAllowed(e);
    if (action === false) return;
    this.throttle(
      "keyDown",
      () => {
        switch (action) {
          case " ": // -w
          case "playPause":
            this.playTriggerCounter++;
            if (this.playTriggerCounter === 1) e.currentTarget.addEventListener("keyup", this._handlePlayTriggerUp);
            if (this.playTriggerCounter === 2 && !this.speedPointerCheck) e.shiftKey ? this.fastPlay("backwards") : this.fastPlay("forwards");
            break;
          case "prev":
            this.previousVideo();
            break;
          case "next":
            this.nextVideo();
            break;
          case "skipBwd":
            this.deactivateSkipPersist();
            this.skip(-this.settings.time.skip);
            this.fire("bwd");
            break;
          case "skipFwd":
            this.deactivateSkipPersist();
            this.skip(this.settings.time.skip);
            this.fire("fwd");
            break;
          case "stepBwd":
            this.moveVideoFrame("backwards");
            break;
          case "stepFwd":
            this.moveVideoFrame("forwards");
            break;
          case "volumeUp":
            this.changeVolume(this.settings.volume.skip);
            break;
          case "volumeDown":
            this.changeVolume(-this.settings.volume.skip);
            break;
          case "brightnessUp":
            this.changeBrightness(this.settings.brightness.skip);
            break;
          case "brightnessDown":
            this.changeBrightness(-this.settings.brightness.skip);
            break;
          case "playbackRateUp":
            this.changePlaybackRate(this.settings.playbackRate.skip);
            break;
          case "playbackRateDown":
            this.changePlaybackRate(-this.settings.playbackRate.skip);
            break;
          case "captionsSizeUp":
            this.changeCaptionsSize(this.settings.captionsSize.skip);
            break;
          case "captionsSizeDown":
            this.changeCaptionsSize(-this.settings.captionsSize.skip);
            break;
          case "captionsOpacity":
            this.rotateCaptionsOpacity();
            break;
          case "captionsWindowOpacity":
            this.rotateCaptionsWindowOpacity();
            break;
          case "expandMiniPlayer":
            this.toggleMiniPlayerMode(false, "instant");
            break;
          case "removeMiniPlayer":
            this.toggleMiniPlayerMode(false);
            break;
          case "escape": // -w
            this.isModeActive("miniPlayer") && this.toggleMiniPlayerMode(false);
            this.isModeActive("floatingPlayer") && this.togglePictureInPictureMode();
            break;
          case "arrowup": // -w
            e.shiftKey ? this.changeVolume(10) : this.changeVolume(5);
            break;
          case "arrowdown": // -w
            e.shiftKey ? this.changeVolume(-10) : this.changeVolume(-5);
            break;
          case "arrowleft": // -w
            this.deactivateSkipPersist();
            e.shiftKey ? this.skip(-10) : this.skip(-5);
            this.fire("bwd");
            break;
          case "arrowright": // -w
            this.deactivateSkipPersist();
            e.shiftKey ? this.skip(10) : this.skip(5);
            this.fire("fwd");
            break;
        }
      },
      this.keyDownThrottleDelay
    );
  }

  _handleKeyUp(e) {
    const action = this.keyEventAllowed(e);
    if (action === false) return;
    switch (action) {
      case "objectFit":
        if (!this.isModeActive("pictureInPicture")) this.rotateObjectFit();
        break;
      case "timeFormat":
        this.rotateTimeFormat();
        break;
      case "mute":
        this.toggleMute("auto");
        this.volume === 0 ? this.fire("volumemuted") : this.fire("volumeup");
        break;
      case "dark":
        this.toggleDark("auto");
        this.brightness === 0 ? this.fire("brightnessdark") : this.fire("brightnessup");
        break;
      case "fullScreen":
        this.toggleFullScreenMode();
        break;
      case "theater":
        if (!this.isMediaMobile && !this.isModeActive("fullScreen") && !this.isModeActive("miniPlayer") && !this.isModeActive("floatingPlayer")) this.toggleTheaterMode();
        break;
      case "pictureInPicture":
        this.togglePictureInPictureMode();
        break;
      case "captions":
        if (!this.isModeActive("pictureInPicture"))
          if (this.video.textTracks[this.textTrackIndex]) {
            this.toggleCaptions();
            this.fire("captions");
          } else this.previewCaptions("No captions available for this video");
        break;
      case "settings":
        this.toggleSettingsView();
        break;
      case "home": // -w
      case "0": // -w
        this.moveVideoTime({ to: "start" });
        break;
      case "1": // -w
      case "2": // -w
      case "3": // -w
      case "4": // -w
      case "5": // -w
      case "6": // -w
      case "7": // -w
      case "8": // -w
      case "9": // -w
        this.moveVideoTime({ to: e.key, max: 10 });
        break;
      case "end": // -w
        this.moveVideoTime({ to: "end" });
        break;
    }
  }

  _handlePlayTriggerUp(e) {
    const action = this.keyEventAllowed(e);
    switch (action) {
      case " ": // -w
      case "playPause":
        e.stopImmediatePropagation();
        if (this.playTriggerCounter === 1) {
          this.togglePlay();
          this.video.paused ? this.fire("videopause") : this.fire("videoplay");
        }
      default:
        if (this.speedCheck && this.playTriggerCounter > 1 && !this.speedPointerCheck) this.slowDown();
        this.playTriggerCounter = 0;
    }
    e.currentTarget.removeEventListener("keyup", this._handlePlayTriggerUp);
  }

  _handleDragStart({ target, dataTransfer }) {
    dataTransfer.effectAllowed = "move";
    target.classList.add("T_M_G-video-control-dragging");
    this.dragging = target.classList.contains("T_M_G-video-vb-btn") ? target.parentElement : target;
  }

  _handleDrag() {
    this.delayOverlay();
  }

  _handleDragEnd({ target }) {
    this.showOverlay();
    target.classList.remove("T_M_G-video-control-dragging");
    this.dragging = null;
    const leftSideStructure = this.settings.status.ui.leftSideControls && this.DOM.leftSideControlsWrapper.children ? Array.from(this.DOM.leftSideControlsWrapper.children, (el) => el.dataset.controlId) : [];
    const rightSideStructure = this.settings.status.ui.rightSideControls && this.DOM.rightSideControlsWrapper.children ? Array.from(this.DOM.rightSideControlsWrapper.children, (el) => el.dataset.controlId) : [];
    this.settings.controllerStructure = [...leftSideStructure, "spacer", ...rightSideStructure];
    tmg.userSettings = {
      controllerStructure: this.settings.controllerStructure,
    };
  }

  _handleDragEnter({ target }) {
    if (target.dataset.dropzone && this.dragging) target.classList.add("T_M_G-video-dragover");
  }

  _handleDragOver(e) {
    if (e.target.dataset.dropzone && this.dragging) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      this.throttle(
        "dragOver",
        () => {
          const afterControl = this.getControlAfterDragging(e.target, e.clientX);
          if (afterControl) e.target?.insertBefore(this.dragging, afterControl);
          else e.target.appendChild(this.dragging);
          this.updateSideControls(e);
        },
        this.dragOverThrottleDelay
      );
    }
  }

  _handleDrop(e) {
    if (!e.target.dataset.dropzone) return;
    e.preventDefault();
    e.target.classList.remove("T_M_G-video-dragover");
  }

  _handleDragLeave({ target }) {
    if (target.dataset.dropzone) target.classList.remove("T_M_G-video-dragover");
  }

  getControlAfterDragging(container, x) {
    const draggableControls = [...container.querySelectorAll("[draggable=true]:not(.T_M_G-video-control-dragging, .T_M_G-video-vb-btn), .T_M_G-video-vb-container:has([draggable=true])")];
    return draggableControls.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = x - box.left - box.width / 2;
        if (offset < 0 && offset > closest.offset) return { offset: offset, element: child };
        else return closest;
      },
      { offset: -Infinity }
    ).element;
  }
}

class T_M_G_Media_Player {
  #active;
  #medium;
  #build;

  constructor(customOptions) {
    this.Player = null;
    this.#build = { ...tmg.DEFAULT_VIDEO_BUILD };
    this.builder(customOptions);
  }

  get build() {
    return this.#build;
  }

  set build(customOptions) {
    this.builder(customOptions);
  }

  _initMedium(medium) {
    if (medium.tmgPlayer) medium.tmgPlayer?.detach();
    medium.tmgPlayer = this;
    this.#medium = medium;
  }

  queryBuild() {
    if (!this.#active) return true;
    console.error("TMG has already deployed the custom controls of your build configuration options");
    console.warn("Consider setting your build configuration before attaching your media element");
    return false;
  }

  setVideoContainer(container) {
    if (this.queryBuild()) this.#build.videoContainer = container;
  }

  builder(customOptions) {
    if (!this.queryBuild() || !(typeof customOptions === "object")) return;
    this.#build = { ...this.#build, ...customOptions };
    const dfs = tmg.DEFAULT_VIDEO_BUILD.settings;
    const s = { ...dfs, ...this.#build.settings };
    Object.entries(s).forEach(([k, v]) => {
      if (tmg.isObject(v)) s[k] = { ...dfs[k], ...s[k] };
    });
    s.keys.shortcuts = { ...dfs.keys.shortcuts, ...s.keys.shortcuts };
    Object.entries(s.keys.shortcuts).forEach(([k, v]) => (s.keys.shortcuts[k] = tmg.cleanKeyCombo(v)));
    s.keys.blocks = tmg.cleanKeyCombo(s.keys.blocks);
    s.keys.overrides = tmg.cleanKeyCombo(s.keys.overrides);
    this.build.settings = s;
  }

  async attach(medium) {
    if (tmg.isIterable(medium)) {
      console.error("An iterable argument cannot be attached to the TMG media player");
      console.warn("Consider looping the iterable argument to get a single argument and instantiate a new 'tmg.Player' for each");
    } else if (!this.#active) {
      medium.tmgPlayer?.detach();
      medium.tmgPlayer = this;
      this.#medium = medium;
      await this.fetchCustomOptions();
      await this.#deploy();
    }
  }

  detach() {
    if (!this.#active) return;
    this.#medium = this.Player?._destroy();
    if (tmg.Players.indexOf(this.Player) !== -1) tmg.Players?.splice(tmg.Players.indexOf(this.Player), 1);
    this.Player = null;
    this.#active = false;
    this.#medium.tmgcontrols = false;
    tmg.initMedia(this.#medium, true);
  }

  async fetchCustomOptions() {
    let fetchedControls;
    if (this.#medium.getAttribute("tmg")?.includes(".json")) {
      fetchedControls = fetch(this.#medium.getAttribute("tmg"))
        .then((res) => {
          if (!res.ok) throw new Error(`TMG could not find provided JSON file!. Status: ${res.status}`);
          return res.json();
        })
        .catch(({ message }) => {
          console.error(`${message}`);
          console.warn("TMG requires a valid JSON file for parsing your video options");
          fetchedControls = undefined;
        });
    }
    const customOptions = (await fetchedControls) ?? {};
    if (customOptions && Object.keys(customOptions).length === 0) {
      const attributes = this.#medium.getAttributeNames().filter((attr) => attr.startsWith("tmg--"));
      const specialProps = ["tmg--media--artwork", "tmg--playlist"];
      attributes?.forEach((attr) => !specialProps.some((sp) => attr.includes(sp)) && tmg.putHTMLOptions(attr, customOptions, this.#medium));
      if (this.#medium.poster || attributes.includes("tmg--media-artwork")) {
        customOptions.media
          ? (customOptions.media.artwork = [
              {
                src: this.#medium.getAttribute("tmg--media-artwork") ?? this.#medium.poster,
              },
            ])
          : (customOptions.media = {
              artwork: [
                {
                  src: this.#medium.getAttribute("tmg--media-artwork") ?? this.#medium.poster,
                },
              ],
            });
      }
    }
    if (this.#active) {
      if (customOptions?.settings) Object.entries(customOptions.settings).forEach(([setting, value]) => (this.Player.settings[setting] = value));
    } else this.builder(customOptions);
  }

  async #deploy() {
    if (this.#active) return;
    if (!(this.#medium instanceof HTMLVideoElement)) {
      console.error(`TMG could not deploy custom controls on the '${this.#medium.tagName}' element as it is not supported`);
      return console.warn("TMG only supports the 'VIDEO' element currently");
    }
    this.#active = true;
    this.#medium.controls = false;
    this.#medium.tmgcontrols = true;
    this.#medium.classList.add("T_M_G-video", "T_M_G-media");
    // doing some cleanup to the settings
    const s = this.#build.settings.allowOverride ? { ...this.#build.settings, ...tmg.userSettings } : { ...this.#build.settings };
    this.#build.video = this.#medium;
    this.#build.mediaPlayer = "TMG";
    this.#build.mediaType = "video";
    this.#medium.playsInline = s.playsInline = s.playsInline ?? this.#medium.playsInline;
    this.#medium.toggleAttribute("webkit-playsinline", s.playsInline);
    this.#medium.autoplay = s.auto.play = s.autoplay ?? this.#medium.autoplay;
    this.#medium.muted = s.volume.muted = s.volume.muted ?? this.#medium.muted;
    this.#medium.loop = s.time.loop = s.time.loop ?? this.#medium.loop;
    if (this.#build.playlist?.[0]) {
      const v = this.#build.playlist[0];
      tmg.assignIfDefined(this.#build, v, "src");
      tmg.assignIfDefined(this.#build, v, "sources");
      tmg.assignIfDefined(this.#build, v, "tracks");
      if (v.media) this.#build.media = { ...this.#build.media, ...v.media };
      tmg.assignIfDefined(s.time, v.settings?.time, "start");
      tmg.assignIfDefined(s.time, v.settings?.time, "end");
      if (v.settings?.time?.previewImages !== undefined) s.time.previewImages = tmg.isObject(v.settings.time.previewImages) ? { ...s.time.previewImages, ...v.settings.time.previewImages } : v.settings.time.previewImages;
    }
    if (this.#build.src) {
      tmg.removeSources(this.#medium);
      this.#medium.src = this.#build.src;
    } else if (this.#build.sources) {
      this.#medium.src = "";
      tmg.removeSources(this.#medium);
      tmg.addSources(this.#build.sources, this.#medium);
    }
    if (this.#build.tracks) {
      tmg.removeTracks(this.#medium);
      tmg.addTracks(this.#build.tracks, this.#medium);
    }
    s.status = { allowOverride: {}, beta: {}, modes: {} };
    tmg.ALLOWED_SETTINGS.slice(1).forEach((k) => (s.status.allowOverride[k] = s.allowOverride.includes?.(k.toLowerCase()) ?? s.allowOverride));
    tmg.BETA_FEATURES.forEach((k) => (s.status.beta[k] = s.status.beta[k] = s.beta.includes?.(k.toLowerCase()) ?? s.beta));
    tmg.ALLOWED_MODES.forEach((m) => (s.status.modes[m] = (s.modes.includes?.(m.toLowerCase()) ?? s.modes) && (tmg[`supports${tmg.capitalize(m)}`]?.() ?? true)));
    s.status.ui = {
      notifiers: s.notifiers || s.status.allowOverride.notifiers,
      timeline: /top|bottom/.test(s.time.linePosition),
      previewImages: !!(s.time.previewImages?.address && s.time.previewImages?.spf),
      leftSideControls: s.controllerStructure.indexOf("spacer") > -1 ? s.controllerStructure.slice(0, s.controllerStructure.indexOf("spacer")).length > 0 : false,
      rightSideControls: s.controllerStructure.indexOf("spacer") > -1 ? s.controllerStructure.slice(s.controllerStructure.indexOf("spacer") + 1).length > 0 : false,
      draggableControls: !!(s.controllerStructure && s.status.allowOverride.controllerStructure),
    };
    tmg.ALLOWED_CONTROLS.forEach((c) => (s.status.ui[c] = s.controllerStructure.includes?.(c.toLowerCase()) ?? s.controllerStructure));
    this.#build.settings = { ...tmg.DEFAULT_VIDEO_BUILD.settings, ...s };
    this.#build.video = this.#medium;
    // tmg.loadResource("/TMG_MEDIA_PROTOTYPE/prototype-2/drag-drop-touch-polyfill.js", "script")
    await tmg.loadResource(tmg.VIDEO_CSS_SRC);
    this.Player = new T_M_G_Video_Player(this.#build);
    tmg.Players.push(this.Player);
    this.Player.fire("tmgready", this.#medium, { loaded: true });
  }
}

class T_M_G {
  static DEFAULT_VIDEO_BUILD = {
    mediaPlayer: "TMG",
    mediaType: "video",
    disabled: false,
    initialState: true,
    debug: true,
    settings: {
      allowOverride: true,
      errorMessages: { 1: "The video playback was aborted", 2: "The video failed due to a network error", 3: "The video could not be decoded", 4: "The video source is not supported" },
      beta: ["rewind", "draggablecontrols", "gesturecontrols", "floatingplayer"],
      modes: ["fullscreen", "theater", "pictureinpicture", "miniplayer"],
      controllerStructure: ["prev", "playpause", "next", "brightness", "volume", "duration", "spacer", "captions", "settings", "objectfit", "pictureinpicture", "theater", "fullscreen"],
      notifiers: true,
      persist: true,
      playsInline: true,
      overlayDelay: 3000,
      auto: { next: 0, captions: false },
      volume: { min: 0, max: 300, value: 100, skip: 5 },
      brightness: { min: 0, max: 150, value: 100, skip: 5 },
      playbackRate: { min: 0.25, max: 8, value: 1, skip: 0.25, fast: 2 },
      captionsSize: { min: 100, max: 400, value: 100, skip: 100 },
      time: { linePosition: "top", progressBar: false, previewImages: false, format: "timeLeft", start: null, end: null, skip: 10 },
      keys: {
        disabled: false,
        strictMatches: false,
        overrides: [" ", "ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Home", "End", "Ctrl+Shift+i"],
        shortcuts: {
          prev: "Shift+p",
          next: "Shift+n",
          playPause: "k",
          timeFormat: "q",
          skipBwd: "j",
          skipFwd: "l",
          stepFwd: ".",
          stepBwd: ",",
          mute: "m",
          dark: "d",
          volumeUp: "ArrowUp",
          volumeDown: "ArrowDown",
          brightnessUp: "y",
          brightnessDown: "h",
          playbackRateUp: ">",
          playbackRateDown: "<",
          objectFit: "a",
          fullScreen: "f",
          theater: "t",
          expandMiniPlayer: "e",
          removeMiniPlayer: "r",
          pictureInPicture: "i",
          captions: "c",
          captionsSizeUp: "=",
          captionsSizeDown: "-",
          captionsOpacity: "o",
          captionsWindowOpacity: "w",
          settings: "?",
        },
        blocks: [
          // Tab navigation
          "Ctrl+Tab",
          "Ctrl+Shift+Tab",
          "Ctrl+PageUp",
          "Ctrl+PageDown",
          "Cmd+Option+RightArrow",
          "Cmd+Option+LeftArrow",
          "Ctrl+1",
          "Ctrl+2",
          "Ctrl+3",
          "Ctrl+4",
          "Ctrl+5",
          "Ctrl+6",
          "Ctrl+7",
          "Ctrl+8",
          "Ctrl+9",
          "Cmd+1",
          "Cmd+2",
          "Cmd+3",
          "Cmd+4",
          "Cmd+5",
          "Cmd+6",
          "Cmd+7",
          "Cmd+8",
          "Cmd+9",
          // Navigation
          "Alt+LeftArrow",
          "Alt+RightArrow",
          "Cmd+LeftArrow",
          "Cmd+RightArrow",
          // Refresh
          "Ctrl+r",
          "Ctrl+Shift+r",
          "F5",
          "Shift+F5",
          "Cmd+r",
          "Cmd+Shift+r",
          // History / Bookmarks / Find
          "Ctrl+h",
          "Ctrl+j",
          "Ctrl+d",
          "Ctrl+f",
          "Cmd+y",
          "Cmd+Option+b",
          "Cmd+d",
          "Cmd+f",
          // Dev Tools / Source View
          "Ctrl+Shift+i",
          "Ctrl+Shift+j",
          "Ctrl+Shift+c",
          "Ctrl+u",
          "F12",
          "Cmd+Option+i",
          "Cmd+Option+j",
          "Cmd+Option+c",
          "Cmd+Option+u",
          // Zoom
          "Ctrl+=",
          "Ctrl+-",
          "Ctrl+0",
          "Cmd+=",
          "Cmd+-",
          "Cmd+0",
          // Print / Save / Open
          "Ctrl+p",
          "Ctrl+s",
          "Ctrl+o",
          "Cmd+p",
          "Cmd+s",
          "Cmd+o",
        ],
      },
    },
  };
  static ALLOWED_MODES = ["fullScreen", "theater", "pictureInPicture", "miniPlayer"];
  static ALLOWED_CONTROLS = ["prev", "playPause", "next", "brightness", "volume", "duration", "spacer", "playbackRate", "captions", "settings", "objectFit", "pictureInPicture", "theater", "fullScreen"];
  static ALLOWED_SETTINGS = ["allowOverride", "errorMessages", "beta", "modes", "controllerStructure", "notifiers", "persist", "auto", "autocaptions", "playsInline", "overlayDelay", "volume", "brightness", "playbackRate", "captionsSize", "time", "keys"];
  static NOTIFIER_EVENTS = ["videoplay", "videopause", "playbackrateup", "playbackratedown", "volumeup", "volumedown", "volumemuted", "brightnessup", "brightnessdown", "brightnessdark", "captions", "objectfitchange", "theater", "fullScreen", "fwd", "bwd"];
  static KEY_SHORTCUT_ACTIONS = ["prev", "next", "playPause", "timeFormat", "skipBwd", "skipFwd", "stepFwd", "stepBwd", "mute", "dark", "volumeUp", "volumeDown", "brightnessUp", "brightnessDown", "playbackRateUp", "playbackRateDown", "objectFit", "fullScreen", "theater", "expandMiniPlayer", "removeMiniPlayer", "pictureInPicture", "captions", "captionsOpacity", "captionsWindowOpacity", "captionsSizeUp", "captionsSizeDown", "settings"];
  static BETA_FEATURES = ["rewind", "draggableControls", "gestureControls", "floatingPlayer"];
  static WHITE_LISTED_KEYS = [" ", "Enter", "Escape", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].map((k) => k.toLowerCase());
  static _RESOURCE_CACHE = {};
  static _AUDIO_CONTEXT = null;
  static _INTERNAL_MUTATION_SET = new WeakSet();
  static _INTERNAL_MUTATION_ID = null;
  static _CURRENT_AUDIO_GAIN_NODE = null;
  static _CURRENT_FULL_SCREEN_PLAYER = null;
  static _PICTURE_IN_PICTURE_ACTIVE = false;
  static get VIDEO_CSS_SRC() {
    return window.TMG_VIDEO_CSS_SRC || "/TMG_MEDIA_PROTOTYPE/prototype-2/prototype-2-video.css";
  }
  static get ALT_IMG_SRC() {
    return window.TMG_VIDEO_ALT_IMG_SRC || "/TMG_MEDIA_PROTOTYPE/assets/icons/movie-tape.png";
  }
  static get userSettings() {
    if (localStorage._tmgUserVideoSettings) return JSON.parse(localStorage._tmgUserVideoSettings);
    else return {};
  }
  static set userSettings(customSettings) {
    localStorage._tmgUserVideoSettings = JSON.stringify(customSettings);
  }
  static activateInternalMutation(m, check = true) {
    if (!tmg._INTERNAL_MUTATION_SET.has(m) && check) tmg._INTERNAL_MUTATION_SET.add(m);
  }
  static deactivateInternalMutation(m) {
    clearTimeout(tmg._INTERNAL_MUTATION_ID);
    tmg._INTERNAL_MUTATION_ID = setTimeout(() => {
      tmg._INTERNAL_MUTATION_SET.delete(m);
      tmg._INTERNAL_MUTATION_ID = null;
    });
  }
  static mountMedia() {
    Object.defineProperty(HTMLVideoElement.prototype, "tmgcontrols", {
      get: function () {
        return this.hasAttribute("tmgcontrols");
      },
      set: async function (value) {
        const bool = Boolean(value);
        if (bool) {
          tmg.activateInternalMutation(this);
          await this.tmgPlayer?.attach(this);
          this.setAttribute("tmgcontrols", "");
          tmg.deactivateInternalMutation(this);
        } else {
          tmg.activateInternalMutation(this, this.hasAttribute("tmgcontrols"));
          this.removeAttribute("tmgcontrols");
          this.tmgPlayer?.detach();
          tmg.deactivateInternalMutation(this);
        }
      },
      enumerable: true,
      configurable: true,
    });
  }
  static unmountMedia() {
    delete HTMLVideoElement.tmgcontrols;
  }
  static init() {
    tmg.mountMedia();
    for (const medium of document.querySelectorAll("video")) {
      tmg.mutationObserver.observe(medium, { attributes: true });
      tmg.initMedia(medium);
    }
    tmg.DOMMutationObserver.observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener("resize", tmg._handleWindowResize);
    document.addEventListener("fullscreenchange", tmg._handleFullScreenChange);
    document.addEventListener("webkitfullscreenchange", tmg._handleFullScreenChange);
    document.addEventListener("mozfullscreenchange", tmg._handleFullScreenChange);
    document.addEventListener("msfullscreenchange", tmg._handleFullScreenChange);
    document.addEventListener("visibilitychange", tmg._handleVisibilityChange);
  }
  static intersectionObserver =
    typeof window !== "undefined" &&
    new IntersectionObserver(
      (entries) => {
        for (const { target, isIntersecting } of entries) {
          target.classList.contains("T_M_G-media") ? target.tmgPlayer?.Player?._handleMediaIntersectionChange(isIntersecting) : target.querySelector(".T_M_G-media")?.tmgPlayer?.Player?._handleMediaParentIntersectionChange(isIntersecting);
        }
      },
      { root: null, rootMargin: "0px", threshold: 0.3 }
    );
  static resizeObserver =
    typeof window !== "undefined" &&
    new ResizeObserver((entries) => {
      for (const { target } of entries) {
        const player = target.classList.contains("T_M_G-media") ? target.tmgPlayer?.Player : (target.querySelector(".T_M_G-media") || target.closest(".T_M_G-media-container")?.querySelector(".T_M_G-media"))?.tmgPlayer?.Player;
        player?._handleResize(target);
      }
    });
  static mutationObserver =
    typeof window !== "undefined" &&
    new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type !== "attributes") continue;
        const video = mutation.target;
        if (mutation.attributeName === "tmgcontrols") {
          if (!tmg._INTERNAL_MUTATION_SET.has(video)) video.tmgcontrols = video.hasAttribute("tmgcontrols");
        } else if (mutation.attributeName.startsWith("tmg")) {
          if (video.hasAttribute(mutation.attributeName)) video.tmgPlayer?.fetchCustomOptions();
        }
      }
    });
  static DOMMutationObserver =
    typeof window !== "undefined" &&
    new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (!node.tagName || !(node.matches("video:not(.T_M_G-media") || node.querySelector("video:not(.T_M_G-media)"))) return;
          const nodes = [...(node.querySelector("video:not(.T_M_G-media)") ? node.querySelectorAll("video:not(.T_M_G-media)") : [node])];
          for (const node of nodes) {
            tmg.mutationObserver.observe(node, { attributes: true });
            tmg.initMedia(node);
          }
        }
        for (const node of mutation.removedNodes) {
          if (!node.tagName || !(node.matches("video.T_M_G-media") || node.querySelector("video.T_M_G-media")) || tmg.isInDOM(node)) return;
          const nodes = [...(node.querySelector("video.T_M_G-media") ? node.querySelectorAll("video.T_M_G-media") : [node])];
          for (const node of nodes) {
            if (node.tmgPlayer?.Player?.mutatingDOMNodes) return;
            node.tmgcontrols = false;
          }
        }
      }
    });
  static initMedia(media, reset = false) {
    if (tmg.isIterable(media)) {
      for (const medium of media) {
        _initMedium(medium);
      }
    } else _initMedium(media);
    function _initMedium(medium) {
      if (medium.tmgPlayer && !reset) return;
      new tmg.Player()._initMedium(medium);
      medium.tmgcontrols = medium.hasAttribute("tmgcontrols");
    }
  }
  static _handleWindowResize() {
    tmg.Players?.forEach((Player) => Player._handleWindowResize());
  }
  static _handleVisibilityChange() {
    tmg.Players?.forEach((Player) => Player._handleVisibilityChange());
  }
  static _handleFullScreenChange() {
    tmg._CURRENT_FULL_SCREEN_PLAYER?._handleFullScreenChange();
  }
  static initAudioManager(bool = true) {
    if (!tmg._AUDIO_CONTEXT && bool) {
      tmg._AUDIO_CONTEXT = new (AudioContext || webkitAudioContext)();
      tmg.Players?.forEach((Player) => Player.setUpAudio());
      document.addEventListener("visibilitychange", () => (document.visibilityState === "visible" ? tmg.resumeAudioManager() : tmg.suspendAudioManager()));
    }
    document.removeEventListener("click", tmg.resumeAudioManager);
    document.addEventListener("click", tmg.resumeAudioManager);
    return !!tmg._AUDIO_CONTEXT;
  }
  static connectMediaToAudioManager(medium) {
    medium.tmgSourceNode = medium.tmgSourceNode || tmg._AUDIO_CONTEXT.createMediaElementSource(medium);
    medium.tmgGainNode = medium.tmgGainNode || tmg._AUDIO_CONTEXT.createGain();
    medium.tmgSourceNode.connect(medium.tmgGainNode);
    if (!medium.paused) tmg.connectAudio(medium.tmgGainNode);
  }
  static connectAudio(gainNode) {
    if (!gainNode || tmg._CURRENT_AUDIO_GAIN_NODE === gainNode) return;
    tmg._CURRENT_AUDIO_GAIN_NODE?.disconnect();
    tmg._CURRENT_AUDIO_GAIN_NODE = gainNode;
    gainNode.connect(tmg._AUDIO_CONTEXT.destination);
  }
  static resumeAudioManager() {
    if (!tmg._AUDIO_CONTEXT) tmg.initAudioManager();
    else if (tmg._AUDIO_CONTEXT?.state === "suspended") tmg._AUDIO_CONTEXT.resume();
  }
  static suspendAudioManager() {
    if (tmg._AUDIO_CONTEXT?.state === "running") tmg._AUDIO_CONTEXT.suspend();
  }
  static loadResource(src, type = "style", options = {}) {
    const { module = false, media = null, crossorigin = null, integrity = null } = options;
    if (tmg._RESOURCE_CACHE[src]) return tmg._RESOURCE_CACHE[src];
    const isLoaded = (() => {
      if (type === "script") {
        return [...document.scripts].some((s) => s.src?.includes(src));
      } else if (type === "style") {
        return [...document.styleSheets].some((s) => s.href?.includes(src));
      }
      return false;
    })();
    if (isLoaded) return Promise.resolve(null);
    tmg._RESOURCE_CACHE[src] = new Promise((resolve, reject) => {
      if (type === "script") {
        const script = document.createElement("script");
        script.src = src;
        if (module) script.type = "module";
        if (crossorigin) script.crossOrigin = crossorigin;
        if (integrity) script.integrity = integrity;
        script.onload = () => resolve(script);
        script.onerror = () => reject(new Error(`Script load error: ${src}`));
        document.body.append(script);
      } else if (type === "style") {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = src;
        if (media) link.media = media;
        link.onload = () => resolve(link);
        link.onerror = () => reject(new Error(`Stylesheet load error: ${src}`));
        document.head.append(link);
      } else {
        reject(new Error(`Unsupported type: ${type}`));
      }
    });
    return tmg._RESOURCE_CACHE[src];
  }
  static addSources(sources, medium) {
    const addSource = (source, medium) => {
      const sourceElement = document.createElement("source");
      tmg.putSourceDetails(source, sourceElement);
      medium.appendChild(sourceElement);
    };
    tmg.isIterable(sources) ? sources.forEach((source) => addSource(source, medium)) : addSource(sources, medium);
  }
  static getSources(medium) {
    const sources = medium.querySelectorAll("source"),
      _sources = [];
    sources.forEach((source) => {
      const obj = {};
      tmg.putSourceDetails(source, obj);
      _sources.push(obj);
    });
    return _sources;
  }
  static putSourceDetails(source, sourceElement) {
    if (source.src) sourceElement.src = source.src;
    if (source.type) sourceElement.type = source.type;
    if (source.media) sourceElement.media = source.media;
  }
  static removeSources(medium) {
    medium.querySelectorAll("source")?.forEach((source) => source.remove());
  }
  static addTracks(tracks, medium) {
    const addTrack = (track, medium) => {
      const trackElement = document.createElement("track");
      tmg.putTrackDetails(track, trackElement);
      medium.appendChild(trackElement);
    };
    tmg.isIterable(tracks) ? tracks.forEach((track) => addTrack(track, medium)) : addTrack(tracks, medium);
  }
  static getTracks(medium) {
    const tracks = medium.querySelectorAll("track[kind='captions'], track[kind='subtitles']"),
      _tracks = [];
    tracks.forEach((track) => {
      const obj = {};
      tmg.putTrackDetails(track, obj);
      _tracks.push(obj);
    });
    return _tracks;
  }
  static putTrackDetails(track, trackElement) {
    if (track.kind) trackElement.kind = track.kind;
    if (track.label) trackElement.label = track.label;
    if (track.srclang) trackElement.srclang = track.srclang;
    if (track.src) trackElement.src = track.src;
    if (track.default) trackElement.default = track.default;
    if (track.id) trackElement.id = track.id;
  }
  static removeTracks(medium) {
    medium.querySelectorAll("track")?.forEach((track) => {
      if (track.kind == "subtitles" || track.kind == "captions") track.remove();
    });
  }
  static putHTMLOptions(attr, optionsObject, medium) {
    const prop = attr.replace("tmg--", "").replace(/(\w)(-)(\w)/g, (match) => `${match[0]}${match[2].toUpperCase()}`);
    const parts = prop.split("--");
    let currObj = optionsObject;
    parts.forEach((part, index) => {
      if (!currObj[part]) {
        if (index === parts.length - 1) {
          let value = medium.getAttribute(attr);
          if (value.includes(",")) value = value.split(",")?.map((val) => val.replace(/\s+/g, ""));
          else if (/^(true|false|null|\d+)$/.test(value)) value = JSON.parse(value);
          currObj[part] = value;
        } else currObj[part] = {};
      }
      currObj = currObj[part];
    });
  }
  static notify = class {
    constructor(self) {
      this.self = self;
      this.init();
    }
    init() {
      this.resetNotifiers = this.resetNotifiers.bind(this);
      [...(this.self.DOM.notifiersContainer?.children ?? [])].forEach((n) => n.addEventListener("animationend", this.resetNotifiers));
      tmg.NOTIFIER_EVENTS.forEach((e) => this.self.DOM.notifiersContainer?.addEventListener(e, this));
    }
    handleEvent(e) {
      if (!this.self.settings.notifiers) return;
      this.resetNotifiers();
      setTimeout(() => this.self.DOM.notifiersContainer?.setAttribute("data-current-notifier", e.type), 10);
    }
    resetNotifiers() {
      this.self.DOM.notifiersContainer?.setAttribute("data-current-notifier", "");
    }
  };
  static queryMediaMobile(strict = true) {
    const isMobileDimensions = matchMedia("(max-width: 480px), (max-width: 940px) and (max-height: 480px) and (orientation: landscape)").matches,
      isMobileDevice = /Mobi|Android|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    return strict ? isMobileDevice : isMobileDimensions;
  }
  static queryFullScreen() {
    return !!(document.fullscreenElement || document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement);
  }
  static queryPictureInPicture() {
    return document.pictureInPictureEnabled;
  }
  static supportsFullScreen() {
    return !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullscreen || document.webkitFullscreenEnabled || HTMLVideoElement.prototype.webkitEnterFullScreen);
  }
  static supportsPictureInPicture() {
    return !!(document.pictureInPictureEnabled || HTMLVideoElement.prototype.requestPictureInPicture || window.documentPictureInPicture);
  }
  static isValidNumber(number) {
    return !isNaN(number ?? NaN) && number !== Infinity;
  }
  static isIterable(obj) {
    return obj !== null && obj !== undefined && typeof obj[Symbol.iterator] === "function";
  }
  static isObject(obj) {
    return typeof obj === "object" && obj !== null && !tmg.isArray(obj);
  }
  static isArray(arr) {
    return Array.isArray(arr);
  }
  static isInDOM(el) {
    return el.ownerDocument.documentElement.contains(el);
  }
  static isInWindowView(el, axis = "y") {
    const rect = el.getBoundingClientRect(),
      inX = rect.right >= 0 && rect.left <= (el.ownerDocument.defaultView.innerWidth || document.documentElement.clientWidth),
      inY = rect.bottom >= 0 && rect.top <= (el.ownerDocument.defaultView.innerHeight || document.documentElement.clientHeight);
    return axis === "x" ? inY : axis === "y" ? inX : inY && inX;
  }
  static clamp(min = 0, amount, max = Infinity) {
    return Math.min(Math.max(amount, min), max);
  }
  static assignIfDefined(target, source = {}, key) {
    if (source[key] !== undefined) target[key] = source[key];
  }
  static formatTime(time) {
    if (!this.isValidNumber(time)) return "-:--";
    const pad = (v) => String(v).padStart(2, "0");
    const seconds = pad(Math.floor(time % 60));
    const minutes = Math.floor(time / 60) % 60;
    const hours = Math.floor(time / 3600);
    return hours == 0 ? `${minutes}:${seconds}` : `${hours}:${pad(minutes)}:${seconds}`;
  }
  static parseNumber(number) {
    return tmg.isValidNumber(number) ? number : 0;
  }
  static formatCSSTime(time) {
    return time.endsWith("ms") ? Number(time.replace("ms", "")) : Number(time.replace("s", "")) * 1000;
  }
  static capitalize(word = "") {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
  static camelize(str = "", seperator = " ") {
    return str
      .toLowerCase()
      .replace(/^\w|\b\w/g, (match, index) => (index === 0 ? match.toLowerCase() : match.toUpperCase()))
      .replaceAll(seperator, "");
  }
  static uncamelize(str = "", separator = " ") {
    return str.replace(/(?:[a-z])(?:[A-Z])/g, (match) => `${match[0]}${separator ?? " "}${match[1].toLowerCase()}`);
  }
  static parseKeyCombo(combo) {
    const parts = combo.toLowerCase().split("+");
    return {
      ctrlKey: parts.includes("ctrl"),
      shiftKey: parts.includes("shift"),
      altKey: parts.includes("alt"),
      metaKey: parts.includes("meta") || parts.includes("cmd"),
      key: parts.find((p) => !["ctrl", "shift", "alt", "meta", "cmd"].includes(p)) || "",
    };
  }
  static stringifyKeyCombo(e) {
    const parts = [];
    if (e.ctrlKey) parts.push("ctrl");
    if (e.altKey) parts.push("alt");
    if (e.shiftKey) parts.push("shift");
    if (e.metaKey) parts.push("meta");
    parts.push(e.key?.toLowerCase());
    return parts.join("+");
  }
  static cleanKeyCombo(combo) {
    const clean = (combo) => {
      const m = ["ctrl", "alt", "shift", "meta"];
      const alias = { cmd: "meta" }; // allow cmd - meta
      if (combo === " " || combo === "+") return combo;
      combo = combo.replace(/\+\s*\+$/, "+plus");
      const p = combo
        .toLowerCase()
        .split("+")
        .filter((k) => k !== "")
        .map((k) => alias[k] || (k === "plus" ? "+" : k.trim() || " "));
      return [...p.filter((k) => m.includes(k)).sort((a, b) => m.indexOf(a) - m.indexOf(b)), ...(p.filter((k) => !m.includes(k)) || "")].join("+");
    };
    return tmg.isArray(combo) ? combo.map(clean) : clean(combo);
  }
  static matchKeys(required, actual, strict = false) {
    const match = (required, actual) => {
      if (strict) return required === actual;
      const reqKeys = required.split("+");
      const actKeys = actual.split("+");
      return reqKeys.every((k) => actKeys.includes(k));
    };
    return tmg.isArray(required) ? required.some((req) => match(req, actual)) : match(required, actual);
  }
  static formatKeyForDisplay(combo) {
    return ` ${(tmg.isArray(combo) ? combo : [combo]).map((c) => `(${c})`).join(" or ")}`;
  }
  static getRenderedBox(elem) {
    const getResourceDimensions = (source) => (source.videoWidth ? { width: source.videoWidth, height: source.videoHeight } : null);
    function parsePositionAsPx(str, bboxSize, objectSize) {
      const num = parseFloat(str);
      if (!str.endsWith("%")) return num;
      const ratio = num / 100;
      return bboxSize * ratio - objectSize * ratio;
    }
    function parseObjectPosition(position, bbox, object) {
      const [left, top] = position.split(" ");
      return {
        left: parsePositionAsPx(left, bbox.width, object.width),
        top: parsePositionAsPx(top, bbox.height, object.height),
      };
    }
    let { objectFit, objectPosition } = getComputedStyle(elem);
    const bbox = elem.getBoundingClientRect();
    const object = getResourceDimensions(elem);

    if (!object) return { width: null, height: null, left: null, right: null };

    if (objectFit === "scale-down") objectFit = bbox.width < object.width || bbox.height < object.height ? "contain" : "none";
    if (objectFit === "none") {
      const { left, top } = parseObjectPosition(objectPosition, bbox, object);
      return { left, top, ...object };
    } else if (objectFit === "contain") {
      const objectRatio = object.height / object.width;
      const bboxRatio = bbox.height / bbox.width;
      const width = bboxRatio > objectRatio ? bbox.width : bbox.height / objectRatio;
      const height = bboxRatio > objectRatio ? bbox.width * objectRatio : bbox.height;
      const { left, top } = parseObjectPosition(objectPosition, bbox, {
        width,
        height,
      });
      return { left, top, width, height };
    } else if (objectFit === "fill") {
      // Relative positioning is discarded with `object-fit: fill`,
      // so we need to check here if it's relative or not
      const { left, top } = parseObjectPosition(objectPosition, bbox, object);
      return {
        left: objectPosition.split(" ")[0].endsWith("%") ? 0 : left,
        top: objectPosition.split(" ")[1].endsWith("%") ? 0 : top,
        width: bbox.width,
        height: bbox.height,
      };
    } else if (objectFit === "cover") {
      const minRatio = Math.min(bbox.width / object.width, bbox.height / object.height);
      let width = object.width * minRatio;
      let height = object.height * minRatio;
      let outRatio = 1;
      if (width < bbox.width) outRatio = bbox.width / width;
      if (Math.abs(outRatio - 1) < 1e-14 && height < bbox.height) outRatio = bbox.height / height;
      width *= outRatio;
      height *= outRatio;
      const { left, top } = parseObjectPosition(objectPosition, bbox, {
        width,
        height,
      });
      return { left, top, width, height };
    }
  }
  static _SCROLLER_R_OBSERVER = typeof window !== "undefined" && new ResizeObserver((entries) => entries.forEach(({ target }) => tmg._SCROLLERS.get(target)?.update()));
  static _SCROLLER_M_OBSERVER =
    typeof window !== "undefined" &&
    new MutationObserver((entries) => {
      const els = new Set();
      for (const entry of entries) {
        let node = entry.target;
        while (node && !tmg._SCROLLERS.has(node)) node = node.parentElement;
        if (node) els.add(node);
      }
      for (const el of els) {
        tmg._SCROLLERS.get(el)?.update();
      }
    });
  static _SCROLLERS = new WeakMap();
  static initScrollAssist(el, { pxPerSecond = 80, assistClassName = "T_M_G-video-controls-scroll-assist", vertical = true, horizontal = true } = {}) {
    const parent = el?.parentElement;
    if (!parent || tmg._SCROLLERS.has(el)) return;
    const assist = {};
    let scrollId = null,
      last = performance.now(),
      assistWidth = 20,
      assistHeight = 20;
    const update = () => {
      const hasInteractive = !!parent.querySelector('button, a[href], input, select, textarea, [contenteditable="true"], [tabindex]:not([tabindex="-1"])');
      if (horizontal) {
        const w = assist.left?.offsetWidth || assistWidth;
        const check = hasInteractive ? el.clientWidth < w * 2 : false;
        assist.left.style.display = check ? "none" : el.scrollLeft > 0 ? "block" : "none";
        assist.right.style.display = check ? "none" : el.scrollLeft + el.clientWidth < el.scrollWidth - 1 ? "block" : "none";
        assistWidth = w;
      }
      if (vertical) {
        const h = assist.up?.offsetHeight || assistHeight;
        const check = hasInteractive ? el.clientHeight < h * 2 : false;
        assist.up.style.display = check ? "none" : el.scrollTop > 0 ? "block" : "none";
        assist.down.style.display = check ? "none" : el.scrollTop + el.clientHeight < el.scrollHeight - 1 ? "block" : "none";
        assistHeight = h;
      }
    };
    const scroll = (dir) => {
      const frame = () => {
        const now = performance.now(),
          dt = now - last;
        last = now;
        const d = (pxPerSecond * dt) / 1000;
        if (dir === "left") el.scrollLeft = Math.max(0, el.scrollLeft - d);
        if (dir === "right") el.scrollLeft = Math.min(el.scrollWidth - el.clientWidth, el.scrollLeft + d);
        if (dir === "up") el.scrollTop = Math.max(0, el.scrollTop - d);
        if (dir === "down") el.scrollTop = Math.min(el.scrollHeight - el.clientHeight, el.scrollTop + d);
        scrollId = requestAnimationFrame(frame);
      };
      last = performance.now();
      frame();
    };
    const stop = () => {
      if (scrollId) cancelAnimationFrame(scrollId);
      scrollId = null;
    };
    const addAssist = (dir) => {
      const div = Object.assign(document.createElement("div"), {
        className: assistClassName,
        style: "display:none",
      });
      div.dataset.scrollDirection = dir;
      ["pointerenter", "dragenter"].forEach((e) => div.addEventListener(e, () => scroll(dir)));
      ["pointerleave", "pointerup", "pointercancel", "dragleave", "dragend"].forEach((e) => div.addEventListener(e, stop));
      (dir === "left" || dir === "up" ? parent.insertBefore : parent.appendChild).call(parent, div, el);
      assist[dir] = div;
    };
    if (horizontal) ["left", "right"].forEach(addAssist);
    if (vertical) ["up", "down"].forEach(addAssist);
    el.addEventListener("scroll", update);
    tmg._SCROLLER_R_OBSERVER.observe(el);
    tmg._SCROLLER_M_OBSERVER.observe(el, { childList: true, subtree: true, characterData: true });
    tmg._SCROLLERS.set(el, {
      update,
      destroy() {
        stop();
        el.removeEventListener("scroll", update);
        tmg._SCROLLER_R_OBSERVER.unobserve(el);
        tmg._SCROLLERS.delete(el);
        Object.values(assist).forEach((a) => a.remove());
      },
    });
    update();
    return tmg._SCROLLERS.get(el);
  }
  static removeScrollAssist(el) {
    tmg._SCROLLERS.get(el)?.destroy();
  }
  static rippleHandler(e, target, forceCenter = false) {
    const currentTarget = target || e.currentTarget;
    if ((e.target !== e.currentTarget && e.target?.matches("button,[href],input,label,select,textarea,[tabindex]:not([tabindex='-1'])")) || currentTarget?.hasAttribute("disabled")) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.stopPropagation?.();
    const el = currentTarget;
    const rW = el.offsetWidth;
    const rH = el.offsetHeight;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rW, rH);
    const x = forceCenter ? rW / 2 - size / 2 : (e.clientX - rect.left) * (rW / rect.width) - size / 2;
    const y = forceCenter ? rH / 2 - size / 2 : (e.clientY - rect.top) * (rH / rect.height) - size / 2;
    const wrapper = document.createElement("span");
    const ripple = document.createElement("span");
    wrapper.className = "T_M_G-video-ripple-container";
    ripple.className = "T_M_G-video-ripple T_M_G-video-ripple-hold";
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
    let canRelease = false;
    ripple.addEventListener("animationend", () => (canRelease = true), { once: true });
    wrapper.appendChild(ripple);
    el.appendChild(wrapper);
    const release = () => {
      if (!canRelease) return ripple.addEventListener("animationend", release, { once: true });
      ripple.classList.replace("T_M_G-video-ripple-hold", "T_M_G-video-ripple-fade");
      ripple.addEventListener("animationend", () => (requestIdleCallback || setTimeout)(() => wrapper.remove()));
      el.ownerDocument.defaultView.removeEventListener("pointerup", release);
      el.ownerDocument.defaultView.removeEventListener("pointercancel", release);
    };
    el.ownerDocument.defaultView.addEventListener("pointerup", release);
    el.ownerDocument.defaultView.addEventListener("pointercancel", release);
  }
  //a wild card for deploying TMG controls to available media, returns a promise that resolves with an array referencing the media
  static async launch(medium) {
    if (arguments.length === 0) {
      const media = document.querySelectorAll("[tmgcontrols]");
      let promises = [];
      if (media) {
        for (const medium of media) {
          promises.push(tmg.launch(medium));
        }
        return Promise.all(promises);
      }
    } else {
      return (async function buildPlayers() {
        const player = medium.tmgPlayer;
        await player.attach(medium);
        return player.Player;
      })();
    }
  }
  //REFERENCES TO ALL THE DEPLOYED TMG MEDIA PLAYERS
  static Players = [];
  //THE TMG MEDIA PLAYER BUILDER CLASS
  static Player = T_M_G_Media_Player;
}

if (typeof window !== "undefined") {
  window.tmg = T_M_G;
  tmg.init();
} else {
  console.error("TMG Media Player cannot run in a terminal!");
  console.warn("Consider moving to a browser environment to use the TMG Media Player");
}
