"use strict"
/* 
TODO: 
    editable settings
*/

//running a runtime environment check
typeof window !== "undefined" ? console.log("%cTMG Media Player Available", "color: green") : console.log("TMG Media Player Unavailable")

//The TMG Video Player Class
class _T_M_G_Video_Player {
    constructor(videoOptions) {
    try {
        //turning the video build into the Video Player Instance
        for (const [key, value] of Object.entries(videoOptions)) {
          this[key] = value
        }                
        this._log(videoOptions)
        //some general variables
        this.audioSetup = false
        this.loaded = false
        this.CSSCustomPropertiesCache = {}
        this.currentPlaylistIndex = this._playlist ? 0 : null
        this.playlistCurrentTime = null
        this.inFullScreen = false
        this.wasPaused = !this.video.autoplay
        this.keyDownThrottleId = null
        this.keyDownThrottleDelay = 20
        this.miniPlayerThrottleId = null
        this.miniPlayerThrottleDelay = 10
        this.timelineThrottleId = null
        this.timelineThrottleDelay = 50
        this.advancedTouchXMoveThrottleId = null
        this.advancedTouchXMoveThrottleDelay = 20
        this.advancedTouchYMoveThrottleId = null
        this.advancedTouchYMoveThrottleDelay = 20
        this.speedThrottleId = null
        this.speedThrottleDelay = 100
        this.dragOverThrottleId = null
        this.dragOverThrottleDelay = 20
        this.lastRate = this.video.playbackRate
        this.isScrubbing = false
        this.parentIntersecting = true
        this.isIntersecting = true
        this.isTimelineFocused = false
        this.buffering = false
        this.clickId = null 
        this.overlayRestraintId = null
        this.floatingPlayerActive = false
        this.floatingPlayerOptions = null
        this.lastAdvanedTouchX = null
        this.lastAdvanedTouchY = null
        this.advancedTouchZone = null
        this.advancedNextTime = null
        this.advancedTouchTimeoutId = null
        this.advancedTouchThreshold = 150
        this.advancedTouchXCheck = false
        this.advancedTouchYCheck = false
        this.advancedWheelZone = null
        this.advancedWheelXCheck = false
        this.advancedWheelYCheck = false
        this.advancedWheelTimeoutId = null
        this.advancedWheelTimePercent = 0
        this.lastVolume = this.lastBrightness = 100
        this.volumeSliderVolume = this.brightnessSliderBrightness = 5
        this.shouldSetLastVolume = this.shouldSetLastBrightness = false
        this.volumeActiveRestraintId = null
        this.brightnessActiveRestraintId = null
        this.playTriggerCounter = 0
        this.speedUpThreshold = 1000
        this.speedPointerCheck = false
        this.speedCheck = false
        this.speedToken = null
        this.speedTimeoutId = null
        this.speedIntervalId = null
        this.speedIntervalTime = 0.08
        this.speedIntervalDelay = 5
        this.speedVideoTime = null
        this.speedDirection = null
        this.skipDurationId = null
        this.skipDuration = 0
        this.skipPersistPosition = null
        this.skipPersist = false
        this.currentNotifier = null
        this.dragging = null
        this.textTrackIndex = 0
        this.canAutoMovePlaylist = true
        this.aspectRatio = null
        this.contentCanvas = document.createElement("canvas")
        this.contentContext = this.contentCanvas.getContext("2d")
        this.pseudoVideo = document.createElement("video")
        this.pseudoVideo.tmgPlayer = this.video.tmgPlayer
        this.pseudoVideo.classList.add("T_M_G-pseudo-video")
        this.pseudoVideo.classList.add("T_M_G-media")
        this.pseudoVideoContainer = document.createElement("div")
        this.pseudoVideoContainer.classList.add("T_M_G-pseudo-video-container")
        this.pseudoVideoContainer.append(this.pseudoVideo)
        this.notify = this.settings.status.ui.notifiers ? {
            self: null,
            notifierEvents: ["videoplay","videopause","volumeup","volumedown","volumemuted","brightnessup","brightnessdown","brightnessdark","playbackratechange","captions","objectfitchange","theater","fullScreen","fwd","bwd"],
            init(self) {
            if (self.settings.notifiers) {
                this.self = self
                this.resetNotifiers = this.resetNotifiers.bind(this)
                for (const notifier of this.self.DOM.notifiersContainer.children) {
                    notifier.addEventListener('animationend', this.resetNotifiers)
                }
                for (const event of this.notifierEvents) {
                    this.self.DOM.notifiersContainer?.addEventListener(event, this)
                }
            }
            },
            handleEvent(e) {
            if (this.self.settings.notifiers) {
                this.resetNotifiers()
                setTimeout(() => this.self.DOM.notifiersContainer?.setAttribute("data-current-notifier", e.type), 10)
            }
            },
            resetNotifiers() {
                this.self.DOM.notifiersContainer?.setAttribute("data-current-notifier", "")
            }
        } : null          

        this.bindMethods()
        this.initSettingsManager(videoOptions.settings)
        // build code block
        const videoContainer = document.querySelector(".build.container >  .T_M_G-video-container")
        if (videoContainer) {
            this.videoContainer = videoContainer
            this.initCSSVariablesManager()
            this.retrieveVideoPlayerDOM()
            this.initializeVideoPlayer()
            return
        }
        // build code block ends
        this.buildVideoPlayerInterface()
    } catch(e) {
        this._log(e, "error", "swallow")
    }                        
    }

    get playlist() {
        return this._playlist
    }

    set playlist(value) {
        if (typeof value === "object") {
            for (const val of value) {
                val.settings = val.settings ?? {}
                val.settings.previewImages = val.settings.previewImages ?? false
                val.settings.startTime = val.settings.startTime ?? null
                val.settings.endTime = val.settings.endTime ?? null
            }
            this._playlist = value
            if (!this.currentPlaylistIndex) this.currentPlaylistIndex = 0
            this.setPlaylistBtnsState()
        }
    }

    get src() {
        return this.video.src
    }

    set src(value) {
        window.tmg.removeSources(this.video)
        this.video.src = value
        this.video.load()
    }

    get sources() {
        return window.tmg.getSources(this.video)
    }

    set sources(value) {
        this.video.src = ""
        window.tmg.removeSources(this.video)
        window.tmg.addSources(value, this.video) 
    }

    get tracks() {
        return window.tmg.getTracks(this.video)
    }

    set tracks(value) {
        window.tmg.removeTracks(this.video)
        window.tmg.addTracks(value, this.video)
    }

    get duration() {
        return window.tmg.formatNumber(this.video.duration)
    }

    set currentTime(value) {
        this.video.currentTime = value
    }

    get currentTime() {
        return window.tmg.formatNumber(this.video.currentTime)
    }

    _log(message, type, action) {
        switch (type) {
            case "error":
                if (this.debug) action === "swallow" ? console.warn(`TMG silenced a rendering error:`, message) : console.error(`TMG rendering error:`, message)
            break
            default:
                if (this.debug) console.log(message)
        }
    }

    _destroy() {     
        this.video.pause() 
        this.src = ""
        this.removeAudio()
        this.leaveSettingsView()
        this.unobserveIntersection()
        this.removeKeyEventListeners()
        this.removeVideoEventListeners()
        this.video.classList.remove("T_M_G-video")
        this.video.classList.remove("T_M_G-media")
        if (this.initialState) this.video.removeEventListener("play", this.removeInitialState, {once:true})
        if (this.isModeActive("miniPlayer")) {
            this.pseudoVideoContainer.parentElement.insertBefore(this.video, this.pseudoVideoContainer)
            this.pseudoVideoContainer.remove()
        } else this.videoContainer.parentElement.insertBefore(this.video, this.videoContainer)
        this.videoContainer.remove()
    }

    bindMethods() {
        for (const method of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
            if (method !== "constructor" && typeof Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this), method).value === "function") this[method] = this[method].bind(this)
        }
    }

    //fetching all css varibles from the stylesheet for easy accessibility
    initCSSVariablesManager() {
        Array.from(document.styleSheets)
        .flatMap(styleSheet => {
            try {
                return [...styleSheet.cssRules]
            } catch(e) {
                return []
            }
        })
        .filter(cssRule => cssRule instanceof CSSStyleRule && cssRule.selectorText.includes(":root"))
        .flatMap(cssRule => {
            return [...cssRule.style].map(property => {
                const value = cssRule.style.getPropertyValue(property)
                return {property, value}
            })
        })
        .filter(style => style.property.startsWith("--T_M_G-video-"))
        .forEach(({property, value}) => {
            const field = window.tmg.camelizeString(property.replace("--T_M_G-", "").replaceAll("-", " "))
            this.CSSCustomPropertiesCache[field] = value
            Object.defineProperty(this, field, {  
                get() {  
                    return getComputedStyle(this.videoContainer).getPropertyValue(property)
                },  
                set(value) {  
                    this.videoContainer.style.setProperty(property, value)  
                    this.pseudoVideoContainer.style.setProperty(property, value)
                },  
                enumerable: true,  
                configurable: true  
            })  
        })
    }

    fire(eventName, el = this.DOM.notifiersContainer, detail=null, bubbles=true, cancellable=true) {
    try {
        let evt = new CustomEvent(eventName, {detail, bubbles, cancellable})
        el.dispatchEvent(evt)
    } catch(e) {
        this._log(e, "error", "swallow")
    }                        
    }

    initSettingsManager() {
    try {
        this._log("TMG Video Settings Manager started")
    } catch(e) {
        this._log(e, "error", "swallow")
    }                        
    }

    get settingsView() {
        return this.videoContainer.classList.contains("T_M_G-video-settings-view")
    }

    set settingsView(value) {
        this.videoContainer.classList.toggle("T_M_G-video-settings-view", value)
    }

    toggleSettingsView() {
    try {
        !this.settingsView ? this.enterSettingsView() : this.leaveSettingsView()
    } catch(e) {
        this._log(e, "error", "swallow")
    }                        
    }

    enterSettingsView() {
    try {
        if (!this.settingsView) {
        this.DOM.settingsCloseBtn.focus()
        this.wasPaused = this.video.paused
        if (!this.wasPaused) this.togglePlay(false)
        this.settingsView = true
        document.addEventListener("keyup", this._handleSettingsKeyUp) 
        this.removeKeyEventListeners()
        this.disableFocusableControls()
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }                    
    }

    leaveSettingsView() {
    try {
        if (this.settingsView) {
        this.DOM.settingsCloseBtn.blur()
        this.settingsView = false
        document.removeEventListener("keyup", this._handleSettingsKeyUp)
        this.setKeyEventListeners()
        this.enableFocusableControls()
        if (!this.wasPaused) this.togglePlay(true)
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }                        
    }
    
    _handleSettingsKeyUp(e) {
    try {
        if (!this.keyEventAllowed(e)) return

        switch (e.key.toString().toLowerCase()) {
            case this.settings.keyShortcuts["settings"]?.toString()?.toLowerCase():     
                this.leaveSettingsView()
                break
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }

    buildVideoPlayerInterface() {
    try {     
        if (this.media?.artwork) 
            if (this.media.artwork[0]?.src !== this.video.poster) this.video.poster = this.media.artwork[0].src
        if (!this.videoContainer) {
            this.videoContainer = document.createElement('div')
            this.video.parentElement.insertBefore(this.videoContainer, this.video)
        }
        this.initCSSVariablesManager()
        this.videoContainer.classList.add("T_M_G-video-container")
        if (!this.video.autoplay) this.videoContainer.classList.add("T_M_G-video-paused")
        if (this.initialMode && this.initialMode !== "normal") this.videoContainer.classList.add(`T_M_G-video-${window.tmg.uncamelizeString(this.initialMode, "-")}`)
        if (this.settings.progressBar) this.videoContainer.classList.add("T_M_G-video-progress-bar")
        this.videoContainer.setAttribute("data-timeline-position", `${this.settings.timelinePosition}`)
        this.videoContainer.setAttribute("data-object-fit", this.videoObjectFit)

        this.videoContainer.insertAdjacentHTML('beforeend', 
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
                        <button type="button" title="Close Settings" class="T_M_G-video-settings-close-btn" data-focusable-control="false" tabindex="-1">
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
        `)    

        this.videoContainer.querySelector(".T_M_G-video-container-content").appendChild(this.video)
        this.buildVideoControllerStructure()
        this.retrieveVideoPlayerDOM()
        this.initializeVideoPlayer()
    } catch(e) {
        this._log(e, "error", "swallow")
    }                        
    }

    buildVideoControllerStructure() {  
    try {   
        const spacerIndex = this.settings.controllerStructure.indexOf("spacer"),
        leftSidedControls = spacerIndex > -1 ? this.settings.controllerStructure.slice(0, spacerIndex) : null,
        rightSidedControls = spacerIndex > -1 ? this.settings.controllerStructure.slice(spacerIndex + 1) : null,
        //breaking HTML into smaller units to use as building blocks
        overlayControlsContainerBuild = this.videoContainer.querySelector(".T_M_G-video-overlay-controls-container"),
        controlsContainerBuild = this.videoContainer.querySelector(".T_M_G-video-controls-container"),
        notifiersContainerBuild = this.settings.status.ui.notifiers ? document.createElement("div") : null,
        overlayMainControlsWrapperBuild = document.createElement("div"),
        controlsWrapperBuild = document.createElement("div"),
        leftSidedControlsWrapperBuild = this.settings.status.ui.leftSidedControls ? document.createElement("div") : null,
        rightSidedControlsWrapperBuild = this.settings.status.ui.rightSidedControls ? document.createElement("div") : null,
        keyShortcuts = this.fetchKeyShortcuts()

        this.HTML = (() => { 
        return {
            pictureinpicturewrapper :
            `
                <div class="T_M_G-video-picture-in-picture-wrapper">
                    <span class="T_M_G-video-picture-in-picture-active-icon-wrapper">
                        <svg class="T_M_G-video-picture-in-picture-active-icon" viewBox="0 0 73 73" data-no-resize="true">
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
            playlisttitle : 
            `
                <div class="T_M_G-video-title-wrapper">
                    <p class="T_M_G-video-title"></p>
                </div>        
            `,
            videobuffer : 
            `
                <div title="Video buffering" class="T_M_G-video-buffer">
                </div>
            `,
            thumbnail :
            `
                <img class="T_M_G-video-thumbnail T_M_G-video-thumbnail-image" alt="movie-image" src="${window.tmg.ALT_IMG_SRC}">
                <canvas class="T_M_G-video-thumbnail T_M_G-video-thumbnail-canvas"></canvas>
            `,
            playpausenotifier : this.settings.status.ui.notifiers ?
            `
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
            ` : null,
            captionsnotifier : this.settings.status.ui.notifiers ?
            `
                <div class="T_M_G-video-notifiers T_M_G-video-captions-notifier">
                    <svg class="T_M_G-video-subtitles-icon">
                        <path fill="currentColor" transform="scale(0.5)" d="M44,6H4A2,2,0,0,0,2,8V40a2,2,0,0,0,2,2H44a2,2,0,0,0,2-2V8A2,2,0,0,0,44,6ZM12,26h4a2,2,0,0,1,0,4H12a2,2,0,0,1,0-4ZM26,36H12a2,2,0,0,1,0-4H26a2,2,0,0,1,0,4Zm10,0H32a2,2,0,0,1,0-4h4a2,2,0,0,1,0,4Zm0-6H22a2,2,0,0,1,0-4H36a2,2,0,0,1,0,4Z" />
                    </svg>
                    <svg class="T_M_G-video-captions-icon" transform="scale(1.15)">
                        <path fill="currentColor" d="M18,11H16.5V10.5H14.5V13.5H16.5V13H18V14A1,1 0 0,1 17,15H14A1,1 0 0,1 13,14V10A1,1 0 0,1 14,9H17A1,1 0 0,1 18,10M11,11H9.5V10.5H7.5V13.5H9.5V13H11V14A1,1 0 0,1 10,15H7A1,1 0 0,1 6,14V10A1,1 0 0,1 7,9H10A1,1 0 0,1 11,10M19,4H5C3.89,4 3,4.89 3,6V18A2,2 0 0,0 5,20H19A2,2 0 0,0 21,18V6C21,4.89 20.1,4 19,4Z"></path>
                    <svg>
                </div>
            ` : null,
            objectfitnotifier : this.settings.status.ui.notifiers ? 
            `
                <div class="T_M_G-video-notifiers T_M_G-video-object-fit-notifier"></div>
            ` : null,
            playbackratenotifier : this.settings.status.ui.notifiers ? 
            `
                <div class="T_M_G-video-notifiers T_M_G-video-playback-rate-notifier"></div>
            ` : null,
            volumenotifier : this.settings.status.ui.notifiers ?
            `
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
            ` : null,
            brightnessnotifier : this.settings.status.ui.notifiers ?
            `
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
            ` : null,
            fwdnotifier : this.settings.status.ui.notifiers ? 
            `
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
            ` : null,
            bwdnotifier : this.settings.status.ui.notifiers ?
            `
                <div class="T_M_G-video-notifiers T_M_G-video-bwd-notifier">
                    <svg style="transform: scaleX(-1);">
                        <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                    </svg>
                    <svg style="transform: scaleX(-1);">
                        <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                    </svg>
                    <svg style="transform: scaleX(-1);">
                        <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                    </svg>                
                </div>    
            ` : null,            
            touchtimelinenotifier : this.settings.status.ui.notifiers ? 
            `
                <div class="T_M_G-video-notifiers T_M_G-video-touch-timeline-notifier T_M_G-video-touch-notifier"></div>
            ` : null,
            touchvolumenotifier : this.settings.status.ui.notifiers ?
            `
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
            ` : null,    
            touchbrightnessnotifier : this.settings.status.ui.notifiers ?
            `
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
            ` : null,            
            fullscreenorientation : this.settings.status.modes.fullScreen ?
            `
                <div class="T_M_G-video-full-screen-orientation-btn-wrapper">
                    <button type="button" class="T_M_G-video-full-screen-orientation-btn T_M_G-video-control-hidden" title="Change Orientation" data-focusable-control="false" tabindex="-1"> 
                        <svg viewBox="0 0 512 512" class="T_M_G-video-full-screen-orientation-icon" data-tooltip-text="Toggle Orientation" data-tooltip-position="top" data-no-resize="true">
                            <path fill="currentColor" d="M446.81,275.82H236.18V65.19c0-20.78-16.91-37.69-37.69-37.69H65.19c-20.78,0-37.69,16.91-37.69,37.69v255.32    c0,20.78,16.91,37.68,37.69,37.68h88.62v88.62c0,20.78,16.9,37.69,37.68,37.69h255.32c20.78,0,37.69-16.91,37.69-37.69v-133.3    C484.5,292.73,467.59,275.82,446.81,275.82z M65.19,326.19c-3.14,0-5.69-2.55-5.69-5.68V65.19c0-3.14,2.55-5.69,5.69-5.69h133.3    c3.14,0,5.69,2.55,5.69,5.69v210.63h-12.69c-20.78,0-37.68,16.91-37.68,37.69v12.68H65.19z M452.5,446.81    c0,3.14-2.55,5.69-5.69,5.69H191.49c-3.13,0-5.68-2.55-5.68-5.69V342.19v-28.68c0-2.94,2.24-5.37,5.1-5.66    c0.19-0.02,0.38-0.03,0.58-0.03h28.69h226.63c3.14,0,5.69,2.55,5.69,5.69V446.81z"/>
                            <path fill="currentColor" d="M369.92,181.53c-6.25-6.25-16.38-6.25-22.63,0c-6.25,6.25-6.25,16.38,0,22.63l44.39,44.39    c3.12,3.13,7.22,4.69,11.31,4.69c0.21,0,0.42-0.02,0.63-0.03c0.2,0.01,0.4,0.03,0.6,0.03c6.31,0,11.74-3.66,14.35-8.96    l37.86-37.86c6.25-6.25,6.25-16.38,0-22.63c-6.25-6.25-16.38-6.25-22.63,0l-13.59,13.59v-86.58c0-8.84-7.16-16-16-16h-86.29    l15.95-15.95c6.25-6.25,6.25-16.38,0-22.63c-6.25-6.25-16.38-6.25-22.63,0l-40.33,40.33c-5.19,2.65-8.75,8.03-8.75,14.25    c0,0.19,0.02,0.37,0.03,0.56c-0.01,0.19-0.03,0.38-0.03,0.57c0,4.24,1.69,8.31,4.69,11.31l42.14,42.14    c3.12,3.12,7.22,4.69,11.31,4.69s8.19-1.56,11.31-4.69c6.25-6.25,6.25-16.38,0-22.63l-15.95-15.95h72.54v73.05L369.92,181.53z"/>
                        </svg>                                
                    </button>
                </div>                
            ` : null,
            expandminiplayer : this.settings.status.modes.miniPlayer ?
            `
                <div class="T_M_G-video-mini-player-expand-btn-wrapper">
                    <button type="button" class="T_M_G-video-mini-player-expand-btn" title="Expand mini-player${keyShortcuts["expandMiniPlayer"]}" data-focusable-control="false" tabindex="-1">
                        <svg class="T_M_G-video-mini-player-expand-icon" viewBox="0 -960 960 960" data-tooltip-text="Expand Mini Player${keyShortcuts["expandMiniPlayer"]}" data-tooltip-position="top" data-no-resize="true">
                            <path d="M120-120v-320h80v184l504-504H520v-80h320v320h-80v-184L256-200h184v80H120Z"/>
                        </svg>
                    </button>
                </div>    
            ` : null,
            removeminiplayer : this.settings.status.modes.miniPlayer ?
            `
                <div class="T_M_G-video-mini-player-cancel-btn-wrapper">
                    <button type="button" class="T_M_G-video-mini-player-cancel-btn" title="Remove Mini-player${keyShortcuts["removeMiniPlayer"]}" data-focusable-control="false" tabindex="-1">
                        <svg class="T_M_G-video-mini-player-cancel-icon" viewBox="0 -960 960 960" data-tooltip-text="Remove Mini Player${keyShortcuts["removeMiniPlayer"]}" data-tooltip-position="top" data-no-resize="true">
                            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                        </svg>
                    </button>
                </div>    
            ` : null,
            mainprev : this.settings.status.ui.prev ?
            `
                <button type="button" class="T_M_G-video-main-prev-btn" title="Previous Video${keyShortcuts["prev"]}" data-focusable-control="false" tabindex="-1">
                    <svg class="T_M_G-video-prev-icon" data-tooltip-text="Previous Video${keyShortcuts["prev"]}" data-tooltip-position="top" style="transform: scaleX(-1);">
                        <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                    </svg>
                </button>       
            ` : null,
            mainplaypause : this.settings.status.ui.playPause ?
            `
                <button type="button" class="T_M_G-video-main-play-pause-btn" title="Play/Pause${keyShortcuts["playPause"]}" data-focusable-control="false" tabindex="${this.initialState ? "0" : "-1"}">
                    <svg class="T_M_G-video-play-icon" data-tooltip-text="Play${keyShortcuts["playPause"]}" data-tooltip-position="top">
                        <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                    </svg>
                    <svg class="T_M_G-video-pause-icon" data-tooltip-text="Pause${keyShortcuts["playPause"]}" data-tooltip-position="top">
                        <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
                    </svg>
                    <svg class="T_M_G-video-replay-icon" viewBox="0 -960 960 960" data-tooltip-text="Replay" data-tooltip-position="top"  data-no-resize="true">
                        <path d="M480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440h80q0 117 81.5 198.5T480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720h-6l62 62-56 58-160-160 160-160 56 58-62 62h6q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Z"/>
                    </svg> 
                </button>            
            ` : null,
            mainnext : this.settings.status.ui.next ?
            `
                <button type="button" class="T_M_G-video-main-next-btn" title="Next Video${keyShortcuts["next"]}" data-focusable-control="false" tabindex="-1">
                    <svg class="T_M_G-video-next-icon" data-tooltip-text="Next Video${keyShortcuts["next"]}" data-tooltip-position="top">
                        <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                    </svg>
                </button>       
            ` : null,
            timeline : this.settings.status.ui.timeline ?
            `
                <div class="T_M_G-video-timeline-container" data-focusable-control="false">
                    <div class="T_M_G-video-timeline">
                        <div class="T_M_G-video-loaded-timeline"></div>
                        <div class="T_M_G-video-preview-container">
                            <img class="T_M_G-video-preview T_M_G-video-preview-image" alt="Preview image" src="${window.tmg.ALT_IMG_SRC}">
                            <canvas class="T_M_G-video-preview T_M_G-video-preview-canvas"></canvas>
                        </div>
                        <div class="T_M_G-video-thumb-indicator"></div>
                    </div>
                </div>
            ` : null,
            prev : this.settings.status.ui.prev ?
            `
                    <button type="button" class="T_M_G-video-prev-btn" title="Previous Video${keyShortcuts["prev"]}" data-draggable-control="${this.settings.status.ui.draggableControls ? true : false}" data-control-id="prev" data-focusable-control="false" tabindex="-1">
                        <svg class="T_M_G-video-prev-icon" data-tooltip-text="Previous Video${keyShortcuts["prev"]}" data-tooltip-position="top" style="transform: scaleX(-1);">
                            <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                        </svg>
                    </button>       
            ` : null,
            playpause : this.settings.status.ui.playPause ?
            `
                    <button type="button" class="T_M_G-video-play-pause-btn" title="Play/Pause${keyShortcuts["playPause"]}" data-draggable-control="${this.settings.status.ui.draggableControls ? true : false}" data-control-id="playpause" data-focusable-control="false" tabindex="-1">
                        <svg class="T_M_G-video-play-icon" data-tooltip-text="Play${keyShortcuts["playPause"]}" data-tooltip-position="top">
                            <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                        </svg>
                        <svg class="T_M_G-video-pause-icon" data-tooltip-text="Pause${keyShortcuts["playPause"]}" data-tooltip-position="top">
                            <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
                        </svg>
                        <svg class="T_M_G-video-replay-icon" viewBox="0 -960 960 960" data-tooltip-text="Replay" data-tooltip-position="top" data-no-resize="true">
                            <path d="M480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440h80q0 117 81.5 198.5T480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720h-6l62 62-56 58-160-160 160-160 56 58-62 62h6q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Z"/>
                        </svg> 
                    </button>    
            ` : null,
            next : this.settings.status.ui.next ?
            `
                    <button type="button" class="T_M_G-video-next-btn" title="Next Video${keyShortcuts["next"]}" data-draggable-control="${this.settings.status.ui.draggableControls ? true : false}" data-control-id="next" data-focusable-control="false" tabindex="-1">
                        <svg class="T_M_G-video-next-icon" data-tooltip-text="Next Video${keyShortcuts["next"]}" data-tooltip-position="top">
                            <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                        </svg>
                    </button>    
            ` : null,
            volume : this.settings.status.ui.volume ?
            `
                <div class="T_M_G-video-volume-container T_M_G-video-vb-container" data-control-id="volume">
                    <button type="button" class="T_M_G-video-mute-btn T_M_G-video-vb-btn" title="Toggle Volume${keyShortcuts["mute"]}" data-draggable-control="${this.settings.status.ui.draggableControls ? true : false}" data-focusable-control="false" tabindex="-1">
                    <g class="T_M_G-video-volume-boost-sign T_M_G-video-vb-boost-sign">
                        <svg class="T_M_G-video-volume-high-icon" data-tooltip-text="Mute${keyShortcuts["mute"]}" data-tooltip-position="top">
                            <path fill="currentColor" d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
                        </svg>
                        <svg class="T_M_G-video-volume-low-icon" data-tooltip-text="Mute${keyShortcuts["mute"]}" data-tooltip-position="top">
                            <path fill="currentColor" d="M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z" />
                        </svg>
                        <svg class="T_M_G-video-volume-muted-icon" data-tooltip-text="Unmute${keyShortcuts["mute"]}" data-tooltip-position="top">
                            <path fill="currentColor" d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z" />
                        </svg>
                    </g>
                    </button>
                    <input class="T_M_G-video-volume-slider T_M_G-video-vb-slider" type="range" min="0" max="100" step="1" data-focusable-control="false" tabindex="-1">
                </div>
            ` : null,
            brightness: this.settings.status.ui.brightness ? 
            `
                <div class="T_M_G-video-brightness-container T_M_G-video-vb-container" data-control-id="brightness">
                    <button type="button" class="T_M_G-video-dark-btn T_M_G-video-vb-btn" title="Toggle Dark${keyShortcuts["dark"]}" data-draggable-control="${this.settings.status.ui.draggableControls ? true : false}" data-focusable-control="false" tabindex="-1">
                    <g class="T_M_G-video-brightness-boost-sign T_M_G-video-vb-boost-sign">
                        <svg class="T_M_G-video-brightness-high-icon" data-tooltip-text="Dark${keyShortcuts["dark"]}" data-tooltip-position="top">
                            <path transform="scale(1.05) translate(1.5, 1.5)"  d="M10 14.858a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6-5h3a1 1 0 0 1 0 2h-3a1 1 0 0 1 0-2zm-6 6a1 1 0 0 1 1 1v3a1 1 0 0 1-2 0v-3a1 1 0 0 1 1-1zm0-15a1 1 0 0 1 1 1v3a1 1 0 0 1-2 0v-3a1 1 0 0 1 1-1zm-9 9h3a1 1 0 1 1 0 2H1a1 1 0 0 1 0-2zm13.95 4.535l2.121 2.122a1 1 0 0 1-1.414 1.414l-2.121-2.121a1 1 0 0 1 1.414-1.415zm-8.486 0a1 1 0 0 1 0 1.415l-2.12 2.12a1 1 0 1 1-1.415-1.413l2.121-2.122a1 1 0 0 1 1.414 0zM17.071 3.787a1 1 0 0 1 0 1.414L14.95 7.322a1 1 0 0 1-1.414-1.414l2.12-2.121a1 1 0 0 1 1.415 0zm-12.728 0l2.121 2.121A1 1 0 1 1 5.05 7.322L2.93 5.201a1 1 0 0 1 1.414-1.414z">
                            </path>
                        </svg>
                        <svg class="T_M_G-video-brightness-low-icon" data-tooltip-text="Bright${keyShortcuts["dark"]}" data-tooltip-position="top">
                            <path transform="scale(1.05) translate(3.25, 3.25)" d="M8 12.858a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6-5h1a1 1 0 0 1 0 2h-1a1 1 0 0 1 0-2zm-6 6a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0v-1a1 1 0 0 1 1-1zm0-13a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1zm-7 7h1a1 1 0 1 1 0 2H1a1 1 0 1 1 0-2zm11.95 4.535l.707.708a1 1 0 1 1-1.414 1.414l-.707-.707a1 1 0 0 1 1.414-1.415zm-8.486 0a1 1 0 0 1 0 1.415l-.707.707A1 1 0 0 1 2.343 13.1l.707-.708a1 1 0 0 1 1.414 0zm9.193-9.192a1 1 0 0 1 0 1.414l-.707.707a1 1 0 0 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 0zm-9.9 0l.707.707A1 1 0 1 1 3.05 5.322l-.707-.707a1 1 0 0 1 1.414-1.414z">
                            </path>
                        </svg>
                        <svg class="T_M_G-video-brightness-dark-icon" data-tooltip-text="Bright${keyShortcuts["dark"]}" data-tooltip-position="top">
                            <path transform="scale(1.2) translate(2, 2.5)" d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8.5 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0 11a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm5-5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm-11 0a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9.743-4.036a.5.5 0 1 1-.707-.707.5.5 0 0 1 .707.707zm-7.779 7.779a.5.5 0 1 1-.707-.707.5.5 0 0 1 .707.707zm7.072 0a.5.5 0 1 1 .707-.707.5.5 0 0 1-.707.707zM3.757 4.464a.5.5 0 1 1 .707-.707.5.5 0 0 1-.707.707z">
                            </path>
                        </svg>                        
                    </g>
                    </button>
                    <input class="T_M_G-video-brightness-slider T_M_G-video-vb-slider" type="range" min="0" max="100" step="1" data-focusable-control="false" tabindex="-1">
                </div>            
            ` : null,
            duration : this.settings.status.ui.duration ?
            `
                    <div class="T_M_G-video-duration-container" title="Change Time Format${keyShortcuts["timeFormat"]}" data-draggable-control="${this.settings.status.ui.draggableControls ? true : false}" data-control-id="duration">
                        <div class="T_M_G-video-current-time">0:00</div>
                        /
                        <div class="T_M_G-video-total-time">-:--</div>
                    </div>    
            ` : null,
            playbackrate : this.settings.status.ui.playbackRate ? 
            `
                    <button type="button" class="T_M_G-video-playback-rate-btn" title="Playback Rate${keyShortcuts["playbackRate"]}" data-draggable-control="${this.settings.status.ui.draggableControls ? true : false}" data-focusable-control="false" tabindex="-1" data-control-id="playbackrate">${this.video.playbackRate}x</button>
            ` : null,
            captions : this.settings.status.ui.captions ?
            `
                    <button type="button" class="T_M_G-video-captions-btn" title="Toggle Captions/Subtitles${keyShortcuts["captions"]}" data-draggable-control="${this.settings.status.ui.draggableControls ? true : false}" data-focusable-control="false" tabindex="-1" data-control-id="captions">
                        <svg data-tooltip-text="Toggle Subtitles${keyShortcuts["captions"]}" data-tooltip-position="top" class="T_M_G-video-subtitles-icon">
                            <path fill="currentColor" transform="scale(0.5)" d="M44,6H4A2,2,0,0,0,2,8V40a2,2,0,0,0,2,2H44a2,2,0,0,0,2-2V8A2,2,0,0,0,44,6ZM12,26h4a2,2,0,0,1,0,4H12a2,2,0,0,1,0-4ZM26,36H12a2,2,0,0,1,0-4H26a2,2,0,0,1,0,4Zm10,0H32a2,2,0,0,1,0-4h4a2,2,0,0,1,0,4Zm0-6H22a2,2,0,0,1,0-4H36a2,2,0,0,1,0,4Z" />
                        </svg>
                        <svg data-tooltip-text="Toggle Captions${keyShortcuts["captions"]}" data-tooltip-position="top" class="T_M_G-video-captions-icon" transform="scale(1.15)">
                            <path fill="currentColor" d="M18,11H16.5V10.5H14.5V13.5H16.5V13H18V14A1,1 0 0,1 17,15H14A1,1 0 0,1 13,14V10A1,1 0 0,1 14,9H17A1,1 0 0,1 18,10M11,11H9.5V10.5H7.5V13.5H9.5V13H11V14A1,1 0 0,1 10,15H7A1,1 0 0,1 6,14V10A1,1 0 0,1 7,9H10A1,1 0 0,1 11,10M19,4H5C3.89,4 3,4.89 3,6V18A2,2 0 0,0 5,20H19A2,2 0 0,0 21,18V6C21,4.89 20.1,4 19,4Z"></path>
                        <svg>
                    </button>
            ` : null,
            settings : this.settings.status.ui.settings ?
            `
                    <button type="button" class="T_M_G-video-settings-btn" title="Toggle Settings${keyShortcuts["settings"]}" data-draggable-control="${this.settings.status.ui.draggableControls ? true : false}" data-focusable-control="false" tabindex="-1" data-control-id="settings">
                        <svg class="T_M_G-video-settings-icon" viewBox="0 -960 960 960" data-tooltip-text="Toggle Settings${keyShortcuts["settings"]}" data-tooltip-position="top" data-no-resize="true">
                            <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/>
                        </svg>
                    </button>        
            ` : null,
            objectfit : this.settings.status.ui.objectFit ?
            `
                    <button type="button" class="T_M_G-video-object-fit-btn " title="Change Object Fit${keyShortcuts["objectFit"]}" data-draggable-control="${this.settings.status.ui.draggableControls ? true : false}" data-control-id="objectfit" data-focusable-control="false" tabindex="-1">
                        <svg class="T_M_G-video-object-fit-contain-icon" data-tooltip-text="Fit to Screen${keyShortcuts["objectFit"]}" data-tooltip-position="top" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16" data-no-resize="true" transform="scale(0.78)">
                            <rect width="16" height="16" rx="4" ry="4" fill="none" stroke-width="2.25" stroke="currentColor" class="T_M_G-video-no-fill" />
                            <g stroke-width="1" stroke="currentColor" fill="currentColor" transform="translate(3,3) scale(0.6)">
                                <path d="M521.667563,212.999001 L523.509521,212.999001 C523.784943,212.999001 524,213.222859 524,213.499001 C524,213.767068 523.780405,213.999001 523.509521,213.999001 L520.490479,213.999001 C520.354351,213.999001 520.232969,213.944316 520.145011,213.855661 C520.056625,213.763694 520,213.642369 520,213.508523 L520,210.48948 C520,210.214059 520.223858,209.999001 520.5,209.999001 C520.768066,209.999001 521,210.218596 521,210.48948 L521,212.252351 L525.779724,207.472627 C525.975228,207.277123 526.284966,207.283968 526.480228,207.47923 C526.66978,207.668781 526.678447,207.988118 526.486831,208.179734 L521.667563,212.999001 Z" transform="translate(-520 -198)"/>
                                <path d="M534.330152,212.999001 L532.488194,212.999001 C532.212773,212.999001 531.997715,213.222859 531.997715,213.499001 C531.997715,213.767068 532.21731,213.999001 532.488194,213.999001 L535.507237,213.999001 C535.643364,213.999001 535.764746,213.944316 535.852704,213.855661 C535.94109,213.763694 535.997715,213.642369 535.997715,213.508523 L535.997715,210.48948 C535.997715,210.214059 535.773858,209.999001 535.497715,209.999001 C535.229649,209.999001 534.997715,210.218596 534.997715,210.48948 L534.997715,212.252351 L530.217991,207.472627 C530.022487,207.277123 529.712749,207.283968 529.517487,207.47923 C529.327935,207.668781 529.319269,207.988118 529.510884,208.179734 L534.330152,212.999001 Z" transform="translate(-520 -198)"/>
                                <path d="M521.667563,199 L523.509521,199 C523.784943,199 524,198.776142 524,198.5 C524,198.231934 523.780405,198 523.509521,198 L520.490479,198 C520.354351,198 520.232969,198.054685 520.145011,198.14334 C520.056625,198.235308 520,198.356632 520,198.490479 L520,201.509521 C520,201.784943 520.223858,202 520.5,202 C520.768066,202 521,201.780405 521,201.509521 L521,199.74665 L525.779724,204.526374 C525.975228,204.721878 526.284966,204.715034 526.480228,204.519772 C526.66978,204.33022 526.678447,204.010883 526.486831,203.819268 L521.667563,199 Z" transform="translate(-520 -198)"/>
                                <path d="M534.251065,199 L532.488194,199 C532.212773,199 531.997715,198.776142 531.997715,198.5 C531.997715,198.231934 532.21731,198 532.488194,198 L535.507237,198 C535.643364,198 535.764746,198.054685 535.852704,198.14334 C535.94109,198.235308 535.997715,198.356632 535.997715,198.490479 L535.997715,201.509521 C535.997715,201.784943 535.773858,202 535.497715,202 C535.229649,202 534.997715,201.780405 534.997715,201.509521 L534.997715,199.667563 L530.178448,204.486831 C529.982944,204.682335 529.673206,204.67549 529.477943,204.480228 C529.288392,204.290677 529.279725,203.97134 529.471341,203.779724 L534.251065,199 Z" transform="translate(-520 -198)"/>
                            </g>
                        </svg>
                        <svg class="T_M_G-video-object-fit-cover-icon" data-tooltip-text="Crop to Fit${keyShortcuts["objectFit"]}" data-tooltip-position="top" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16" data-no-resize="true" transform="scale(0.78)">
                            <rect width="16" height="16" rx="4" ry="4" fill="none" stroke-width="2.25" stroke="currentColor" class="T_M_G-video-no-fill" />
                            <g stroke-width="1" stroke="currentColor" fill="currentColor" transform="translate(3,3) scale(0.6)">
                                <path d="M521.667563,212.999001 L523.509521,212.999001 C523.784943,212.999001 524,213.222859 524,213.499001 C524,213.767068 523.780405,213.999001 523.509521,213.999001 L520.490479,213.999001 C520.354351,213.999001 520.232969,213.944316 520.145011,213.855661 C520.056625,213.763694 520,213.642369 520,213.508523 L520,210.48948 C520,210.214059 520.223858,209.999001 520.5,209.999001 C520.768066,209.999001 521,210.218596 521,210.48948 L521,212.252351 L525.779724,207.472627 C525.975228,207.277123 526.284966,207.283968 526.480228,207.47923 C526.66978,207.668781 526.678447,207.988118 526.486831,208.179734 L521.667563,212.999001 Z" transform="translate(-520 -198)"/>
                                <path d="M534.251065,199 L532.488194,199 C532.212773,199 531.997715,198.776142 531.997715,198.5 C531.997715,198.231934 532.21731,198 532.488194,198 L535.507237,198 C535.643364,198 535.764746,198.054685 535.852704,198.14334 C535.94109,198.235308 535.997715,198.356632 535.997715,198.490479 L535.997715,201.509521 C535.997715,201.784943 535.773858,202 535.497715,202 C535.229649,202 534.997715,201.780405 534.997715,201.509521 L534.997715,199.667563 L530.178448,204.486831 C529.982944,204.682335 529.673206,204.67549 529.477943,204.480228 C529.288392,204.290677 529.279725,203.97134 529.471341,203.779724 L534.251065,199 Z" transform="translate(-520 -198)"/>
                            </g>
                        </svg>
                        <svg class="T_M_G-video-object-fit-fill-icon" data-tooltip-text="Stretch${keyShortcuts["objectFit"]}" data-tooltip-position="top" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16" data-no-resize="true" transform="scale(0.78)">
                            <rect x="4" y="4" width="8" height="8" rx="1" ry="1" fill="none" stroke-width="1.5" stroke="currentColor" class="T_M_G-video-no-fill" />
                            <g stroke-width="1" stroke="currentColor" fill="currentColor" transform="translate(3, 3) scale(0.65)">  
                                <path d="M521.667563,212.999001 L523.509521,212.999001 C523.784943,212.999001 524,213.222859 524,213.499001 C524,213.767068 523.780405,213.999001 523.509521,213.999001 L520.490479,213.999001 C520.354351,213.999001 520.232969,213.944316 520.145011,213.855661 C520.056625,213.763694 520,213.642369 520,213.508523 L520,210.48948 C520,210.214059 520.223858,209.999001 520.5,209.999001 C520.768066,209.999001 521,210.218596 521,210.48948 L521,212.252351 L525.779724,207.472627 C525.975228,207.277123 526.284966,207.283968 526.480228,207.47923 C526.66978,207.668781 526.678447,207.988118 526.486831,208.179734 L521.667563,212.999001 Z" transform="translate(-520, -198) translate(-3.25, 2.75)" />  
                                <path d="M534.251065,199 L532.488194,199 C532.212773,199 531.997715,198.776142 531.997715,198.5 C531.997715,198.231934 532.21731,198 532.488194,198 L535.507237,198 C535.643364,198 535.764746,198.054685 535.852704,198.14334 C535.94109,198.235308 535.997715,198.356632 535.997715,198.490479 L535.997715,201.509521 C535.997715,201.784943 535.773858,202 535.497715,202 C535.229649,202 534.997715,201.780405 534.997715,201.509521 L534.997715,199.667563 L530.178448,204.486831 C529.982944,204.682335 529.673206,204.67549 529.477943,204.480228 C529.288392,204.290677 529.279725,203.97134 529.471341,203.779724 L534.251065,199 Z" transform="translate(-520, -198) translate(2.5, -3.25)" />  
                            </g> 
                        </svg>                    
                    </button>               
            ` : null,
            pictureinpicture : this.settings.status.ui.pictureInPicture ? 
            `
                    <button type="button" class="T_M_G-video-picture-in-picture-btn" title="Toggle Picture-in-Picture${keyShortcuts["pictureInPicture"]}" data-draggable-control="${this.settings.status.ui.draggableControls ? true : false}" data-focusable-control="false" tabindex="-1" data-control-id="pictureinpicture">
                        <svg class="T_M_G-video-enter-picture-in-picture-icon" data-tooltip-text="Enter Picture-in-Picture${keyShortcuts["pictureInPicture"]}" data-tooltip-position="top">
                            <path class="T_M_G-video-no-fill" fill="none" d="M0 0h24v24H0z" />
                            <path fill="currentColor" fill-rule="nonzero" d="M21 3a1 1 0 0 1 1 1v7h-2V5H4v14h6v2H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18zm0 10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h8zM6.707 6.293l2.25 2.25L11 6.5V12H5.5l2.043-2.043-2.25-2.25 1.414-1.414z" />
                        </svg>
                        <svg class="T_M_G-video-leave-picture-in-picture-icon" data-tooltip-text="Leave Picture-in-Picture${keyShortcuts["pictureInPicture"]}" data-tooltip-position="top">
                            <path class="T_M_G-video-no-fill" fill="none" d="M0 0h24v24H0z"></path>
                            <path fill-rule="nonzero" d="M21 3a1 1 0 0 1 1 1v7h-2V5H4v14h6v2H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18zm0 10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h8zm-9.5-6L9.457 9.043l2.25 2.25-1.414 1.414-2.25-2.25L6 12.5V7h5.5z">
                            </path>
                        </svg>
                    </button>    
            ` : null,  
            theater : this.settings.status.ui.theater ?
            `
                    <button type="button" class="T_M_G-video-theater-btn" title="Toggle Theater${keyShortcuts["theater"]}" data-draggable-control="${this.settings.status.ui.draggableControls ? true : false}" data-focusable-control="false" tabindex="-1" data-control-id="theater">
                        <svg class="T_M_G-video-enter-theater-icon" data-tooltip-text="Enter Theater${keyShortcuts["theater"]}" data-tooltip-position="top">
                            <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M23 7C23 5.34315 21.6569 4 20 4H4C2.34315 4 1 5.34315 1 7V17C1 18.6569 2.34315 20 4 20H20C21.6569 20 23 18.6569 23 17V7ZM21 7C21 6.44772 20.5523 6 20 6H4C3.44772 6 3 6.44771 3 7V17C3 17.5523 3.44772 18 4 18H20C20.5523 18 21 17.5523 21 17V7Z"/>
                        </svg>
                        <svg class="T_M_G-video-leave-theater-icon" data-tooltip-text="Leave Theater${keyShortcuts["theater"]}" data-tooltip-position="top">
                            <path fill="currentColor" d="M19 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H5V8h14v8z"></path>
                        </svg>
                    </button>
            ` : null,
            fullscreen : this.settings.status.ui.fullScreen ?
            `
                    <button type="button" class="T_M_G-video-full-screen-btn" title="Toggle Full Screen${keyShortcuts["fullScreen"]}" data-draggable-control="${this.settings.status.ui.draggableControls ? true : false}" data-focusable-control="false" tabindex="-1" data-control-id="fullscreen">
                        <svg class="T_M_G-video-enter-full-screen-icon" data-tooltip-text="Enter Full Screen${keyShortcuts["fullScreen"]}" data-tooltip-position="top" transform="scale(.8)">
                            <path d="M4 1.5C2.61929 1.5 1.5 2.61929 1.5 4V8.5C1.5 9.05228 1.94772 9.5 2.5 9.5H3.5C4.05228 9.5 4.5 9.05228 4.5 8.5V4.5H8.5C9.05228 4.5 9.5 4.05228 9.5 3.5V2.5C9.5 1.94772 9.05228 1.5 8.5 1.5H4Z" fill="currentColor" />
                            <path d="M20 1.5C21.3807 1.5 22.5 2.61929 22.5 4V8.5C22.5 9.05228 22.0523 9.5 21.5 9.5H20.5C19.9477 9.5 19.5 9.05228 19.5 8.5V4.5H15.5C14.9477 4.5 14.5 4.05228 14.5 3.5V2.5C14.5 1.94772 14.9477 1.5 15.5 1.5H20Z" fill="currentColor" />
                            <path d="M20 22.5C21.3807 22.5 22.5 21.3807 22.5 20V15.5C22.5 14.9477 22.0523 14.5 21.5 14.5H20.5C19.9477 14.5 19.5 14.9477 19.5 15.5V19.5H15.5C14.9477 19.5 14.5 19.9477 14.5 20.5V21.5C14.5 22.0523 14.9477 22.5 15.5 22.5H20Z" fill="currentColor" />
                            <path d="M1.5 20C1.5 21.3807 2.61929 22.5 4 22.5H8.5C9.05228 22.5 9.5 22.0523 9.5 21.5V20.5C9.5 19.9477 9.05228 19.5 8.5 19.5H4.5V15.5C4.5 14.9477 4.05228 14.5 3.5 14.5H2.5C1.94772 14.5 1.5 14.9477 1.5 15.5V20Z" fill="currentColor" />
                        </svg>
                        <svg class="T_M_G-video-leave-full-screen-icon" data-tooltip-text="Leave Full Screen${keyShortcuts["fullScreen"]}" data-tooltip-position="top" transform="scale(.8)">
                            <path d="M7 9.5C8.38071 9.5 9.5 8.38071 9.5 7V2.5C9.5 1.94772 9.05228 1.5 8.5 1.5H7.5C6.94772 1.5 6.5 1.94772 6.5 2.5V6.5H2.5C1.94772 6.5 1.5 6.94772 1.5 7.5V8.5C1.5 9.05228 1.94772 9.5 2.5 9.5H7Z" fill="currentColor" />
                            <path d="M17 9.5C15.6193 9.5 14.5 8.38071 14.5 7V2.5C14.5 1.94772 14.9477 1.5 15.5 1.5H16.5C17.0523 1.5 17.5 1.94772 17.5 2.5V6.5H21.5C22.0523 6.5 22.5 6.94772 22.5 7.5V8.5C22.5 9.05228 22.0523 9.5 21.5 9.5H17Z" fill="currentColor" />
                            <path d="M17 14.5C15.6193 14.5 14.5 15.6193 14.5 17V21.5C14.5 22.0523 14.9477 22.5 15.5 22.5H16.5C17.0523 22.5 17.5 22.0523 17.5 21.5V17.5H21.5C22.0523 17.5 22.5 17.0523 22.5 16.5V15.5C22.5 14.9477 22.0523 14.5 21.5 14.5H17Z" fill="currentColor" />
                            <path d="M9.5 17C9.5 15.6193 8.38071 14.5 7 14.5H2.5C1.94772 14.5 1.5 14.9477 1.5 15.5V16.5C1.5 17.0523 1.94772 17.5 2.5 17.5H6.5V21.5C6.5 22.0523 6.94772 22.5 7.5 22.5H8.5C9.05228 22.5 9.5 22.0523 9.5 21.5V17Z" fill="currentColor" />
                        </svg>
                    </button>    
            ` : null
        }
        })()

        //building and deploying video controls
        overlayControlsContainerBuild.innerHTML = ``
        controlsContainerBuild.innerHTML = ``

        //builiding overlay controls so order of insertioni matters because they are eall positioned absolutely
        overlayControlsContainerBuild.innerHTML += this.HTML.pictureinpicturewrapper

        //builidng and deploying Notifiers HTML
        if (this.settings.status.ui.notifiers) {
            notifiersContainerBuild.classList = "T_M_G-video-notifiers-container"
            notifiersContainerBuild.setAttribute("data-current-notifier", "")
            notifiersContainerBuild.innerHTML += ``.concat(this.HTML.playpausenotifier ?? "", this.HTML.captionsnotifier ?? "", this.HTML.objectfitnotifier ?? "", this.HTML.playbackratenotifier ?? "", this.HTML.volumenotifier ?? "", this.HTML.brightnessnotifier ?? "", this.HTML.fwdnotifier ?? "", this.HTML.bwdnotifier ?? "", this.HTML.touchtimelinenotifier ?? "", this.HTML.touchvolumenotifier ?? "", this.HTML.touchbrightnessnotifier ?? "")
            overlayControlsContainerBuild.append(notifiersContainerBuild)
        }
    
        //building and deploying overlay general controls
        overlayControlsContainerBuild.innerHTML += ``.concat(this.HTML.thumbnail ?? '', this.HTML.videobuffer ?? '', this.HTML.playlisttitle ?? '', this.HTML.expandminiplayer ?? '', this.HTML.removeminiplayer ?? '', this.HTML.fullscreenorientation ?? '')
    
        //building and deploying overlay main controls wrapper 
        overlayMainControlsWrapperBuild.innerHTML += ``.concat(this.HTML.mainprev ?? '', this.HTML.mainplaypause ?? '', this.HTML.mainnext ?? '')
        overlayMainControlsWrapperBuild.classList = "T_M_G-video-overlay-main-controls-wrapper"
        overlayControlsContainerBuild.append(overlayMainControlsWrapperBuild)

        //building and deploying controls wrapper
        if (this.settings.status.ui.leftSidedControls) {
            leftSidedControlsWrapperBuild.classList = "T_M_G-video-left-side-controls-wrapper"
            leftSidedControlsWrapperBuild.setAttribute("data-dropzone", this.settings.status.ui.draggableControls ? true : false)
            leftSidedControlsWrapperBuild.innerHTML += ``.concat(...Array.from(leftSidedControls, el => this.HTML[el] ? this.HTML[el] : ''))
            controlsWrapperBuild.append(leftSidedControlsWrapperBuild)
        }
        if (this.settings.status.ui.rightSidedControls) {
            rightSidedControlsWrapperBuild.classList = "T_M_G-video-right-side-controls-wrapper"
            rightSidedControlsWrapperBuild.setAttribute("data-dropzone", this.settings.status.ui.draggableControls ? true : false)
            rightSidedControlsWrapperBuild.innerHTML += ``.concat(...Array.from(rightSidedControls, el => this.HTML[el] ? this.HTML[el] : ''))
            controlsWrapperBuild.append(rightSidedControlsWrapperBuild)
        }

        controlsContainerBuild.innerHTML += this.HTML.timeline ?? ""        
        controlsWrapperBuild.classList = "T_M_G-video-controls-wrapper"
        controlsContainerBuild.append(controlsWrapperBuild)  
    } catch(e) {
        this._log(e, "error", "swallow")
    }                        
    }

    retrieveVideoPlayerDOM() {
    try {
        this.DOM = {
            video: this.video,
            videoContainer : this.videoContainer,
            videoContainerContentWrapper: this.videoContainer.querySelector(".T_M_G-video-container-content-wrapper"),
            videoContainerContent: this.videoContainer.querySelector(".T_M_G-video-container-content"),
            videoTitleWrapper: this.videoContainer.querySelector(".T_M_G-video-title-wrapper"),
            videoTitle: this.videoContainer.querySelector(".T_M_G-video-title"),
            thumbnailImg : this.videoContainer.querySelector(".T_M_G-video-thumbnail-image"),
            thumbnailCanvas : this.videoContainer.querySelector(".T_M_G-video-thumbnail-canvas"),
            videoBuffer : this.videoContainer.querySelector(".T_M_G-video-buffer"),
            notifiersContainer: this.settings.status.ui.notifiers ? this.videoContainer.querySelector(".T_M_G-video-notifiers-container") : null,
            playNotifier : this.settings.status.ui.notifiers ? this.videoContainer.querySelector(".T_M_G-video-play-notifier") : null,
            pauseNotifier : this.settings.status.ui.notifiers ? this.videoContainer.querySelector(".T_M_G-video-pause-notifier") : null,
            captionsNotifier : this.settings.status.ui.notifiers ? this.videoContainer.querySelector(".T_M_G-video-captions-notifier") : null,
            objectFitNotifier: this.settings.status.ui.notifiers ? this.videoContainer.querySelector(".T_M_G-video-object-fit-notifier") : null,
            playbackRateNotifier : this.settings.status.ui.notifiers ? this.videoContainer.querySelector(".T_M_G-video-playback-rate-notifier") : null,
            volumeNotifierContent : this.settings.status.ui.notifiers ?  this.videoContainer.querySelector(".T_M_G-video-volume-notifier-content") : null,
            volumeUpNotifier : this.settings.status.ui.notifiers ? this.videoContainer.querySelector(".T_M_G-video-volume-up-notifier") : null,
            volumeDownNotifier : this.settings.status.ui.notifiers ? this.videoContainer.querySelector(".T_M_G-video-volume-down-notifier") : null,
            volumeMutedNotifier : this.settings.status.ui.notifiers ? this.videoContainer.querySelector(".T_M_G-video-volume-muted-notifier") : null,
            brightnessNotifierContent : this.settings.status.ui.notifiers ?  this.videoContainer.querySelector(".T_M_G-video-brightness-notifier-content") : null,
            brightnessUpNotifier : this.settings.status.ui.notifiers ? this.videoContainer.querySelector(".T_M_G-video-brightness-up-notifier") : null,
            brightnessDownNotifier : this.settings.status.ui.notifiers ? this.videoContainer.querySelector(".T_M_G-video-brightness-down-notifier") : null,
            brightnessDarkNotifier : this.settings.status.ui.notifiers ? this.videoContainer.querySelector(".T_M_G-video-brightness-dark-notifier") : null,
            fwdNotifier : this.settings.status.ui.notifiers ? this.videoContainer.querySelector(".T_M_G-video-fwd-notifier") : null,
            bwdNotifier : this.settings.status.ui.notifiers ? this.videoContainer.querySelector(".T_M_G-video-bwd-notifier") : null,
            touchTimelineNotifier : this.settings.status.ui.notifiers ? this.videoContainer.querySelector(".T_M_G-video-touch-timeline-notifier") : null,
            touchVolumeContent : this.settings.status.ui.notifiers ? this.videoContainer.querySelector(".T_M_G-video-touch-volume-content") : null,
            touchVolumeNotifier : this.settings.status.ui.notifiers ? this.videoContainer.querySelector(".T_M_G-video-touch-volume-notifier") : null,
            touchVolumeSlider : this.settings.status.ui.notifiers ? this.videoContainer.querySelector(".T_M_G-video-touch-volume-slider") : null,
            touchBrightnessContent : this.settings.status.ui.notifiers ? this.videoContainer.querySelector(".T_M_G-video-touch-brightness-content") : null,
            touchBrightnessNotifier : this.settings.status.ui.notifiers ? this.videoContainer.querySelector(".T_M_G-video-touch-brightness-notifier") : null,
            touchBrightnessSlider : this.settings.status.ui.notifiers ? this.videoContainer.querySelector(".T_M_G-video-touch-brightness-slider") : null,
            videoOverlayControlsContainer: this.videoContainer.querySelector(".T_M_G-video-overlay-controls-container"),
            videoOverlayMainControlsWrapper: this.videoContainer.querySelector(".T_M_G-video-overlay-main-controls-wrapper"),
            videoControlsContainer : this.videoContainer.querySelector(".T_M_G-video-controls-container"),
            leftSidedControlsWrapper : this.settings.status.ui.leftSidedControls ? this.videoContainer.querySelector(".T_M_G-video-left-side-controls-wrapper") : null,
            rightSidedControlsWrapper : this.settings.status.ui.rightSidedControls ? this.videoContainer.querySelector(".T_M_G-video-right-side-controls-wrapper") : null,
            pictureInPictureWrapper : this.videoContainer.querySelector(".T_M_G-video-picture-in-picture-wrapper"),
            pictureInPictureActiveIconWrapper : this.videoContainer.querySelector(".T_M_G-video-picture-in-picture-active-icon-wrapper"),
            fullScreenOrientationBtn : this.settings.status.ui.fullScreen ? this.videoContainer.querySelector(".T_M_G-video-full-screen-orientation-btn") : null,
            miniPlayerExpandBtn : this.settings.status.modes.miniPlayer ? this.videoContainer.querySelector(".T_M_G-video-mini-player-expand-btn") : null,
            miniPlayerCancelBtn : this.settings.status.modes.miniPlayer ? this.videoContainer.querySelector(".T_M_G-video-mini-player-cancel-btn") : null,
            mainPrevBtn : this.settings.status.ui.prev ? this.videoContainer.querySelector(".T_M_G-video-main-prev-btn") : null,
            mainPlayPauseBtn : this.settings.status.ui.playPause ? this.videoContainer.querySelector(".T_M_G-video-main-play-pause-btn") : null,
            mainNextBtn : this.settings.status.ui.next ? this.videoContainer.querySelector(".T_M_G-video-main-next-btn") : null,
            timelineContainer : this.settings.status.ui.timeline ? this.videoContainer.querySelector(".T_M_G-video-timeline-container") : null,
            previewContainer : this.settings.status.ui.timeline ? this.videoContainer.querySelector(".T_M_G-video-preview-container") : null,
            previewImg : this.settings.status.ui.timeline ? this.videoContainer.querySelector(".T_M_G-video-preview-image") : null,
            previewCanvas : this.settings.status.ui.timeline ? this.videoContainer.querySelector(".T_M_G-video-preview-canvas") : null,
            prevBtn : this.settings.status.ui.prev ? this.videoContainer.querySelector(".T_M_G-video-prev-btn") : null,
            playPauseBtn : this.settings.status.ui.playPause ? this.videoContainer.querySelector(".T_M_G-video-play-pause-btn") : null,
            nextBtn : this.settings.status.ui.next ? this.videoContainer.querySelector(".T_M_G-video-next-btn") : null,
            objectFitBtn : this.settings.status.ui.objectFit ? this.videoContainer.querySelector(".T_M_G-video-object-fit-btn") : null,
            volumeContainer : this.settings.status.ui.volume ? this.videoContainer.querySelector(".T_M_G-video-volume-container") : null,
            volumeBoostSign : this.settings.status.ui.volume ? this.videoContainer.querySelector(".T_M_G-video-volume-boost-sign") : null,
            volumeSlider : this.settings.status.ui.volume ? this.videoContainer.querySelector(".T_M_G-video-volume-slider") : null,
            brightnessContainer : this.settings.status.ui.brightness ? this.videoContainer.querySelector(".T_M_G-video-brightness-container") : null,
            brightnessBoostSign : this.settings.status.ui.brightness ? this.videoContainer.querySelector(".T_M_G-video-brightness-boost-sign") : null,
            brightnessSlider : this.settings.status.ui.brightness ? this.videoContainer.querySelector(".T_M_G-video-brightness-slider") : null,
            durationContainer : this.settings.status.ui.duration ? this.videoContainer.querySelector(".T_M_G-video-duration-container") : null,
            currentTimeElement : this.settings.status.ui.duration ? this.videoContainer.querySelector(".T_M_G-video-current-time") : null,
            totalTimeElement : this.settings.status.ui.duration ? this.videoContainer.querySelector(".T_M_G-video-total-time") : null,
            muteBtn : this.settings.status.ui.volume ? this.videoContainer.querySelector(".T_M_G-video-mute-btn") : null,
            darkBtn : this.settings.status.ui.volume ? this.videoContainer.querySelector(".T_M_G-video-dark-btn") : null,
            captionsBtn : this.settings.status.ui.captions ?  this.videoContainer.querySelector(".T_M_G-video-captions-btn") : null,
            settingsBtn : this.settings.status.ui.settings ? this.videoContainer.querySelector(".T_M_G-video-settings-btn") : null,
            playbackRateBtn : this.settings.status.ui.playbackRate ? this.videoContainer.querySelector(".T_M_G-video-playback-rate-btn") : null,
            pictureInPictureBtn : this.settings.status.ui.pictureInPicture ? this.videoContainer.querySelector(".T_M_G-video-picture-in-picture-btn") : null,
            theaterBtn : this.settings.status.ui.theater ? this.videoContainer.querySelector(".T_M_G-video-theater-btn") : null,
            fullScreenBtn : this.settings.status.ui.fullScreen ? this.videoContainer.querySelector(".T_M_G-video-full-screen-btn") : null,
            svgs : this.videoContainer.querySelectorAll("svg"),
            focusableControls: this.videoContainer.querySelectorAll("[data-focusable-control]"),
            draggableControls: this.settings.status.ui.draggableControls ? this.videoContainer.querySelectorAll("[data-draggable-control]") : null,
            draggableControlContainers: this.settings.status.ui.draggableControls ? this.videoContainer.querySelectorAll(".T_M_G-video-left-side-controls-wrapper, .T_M_G-video-right-side-controls-wrapper") : null,
            settingsCloseBtn: this.settings ? this.videoContainer.querySelector(".T_M_G-video-settings-close-btn") : null,
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }                        
    }

    initializeVideoPlayer() {
    try {
        this.controlsResize()
        if (!(this.video.currentSrc || this.video.src)) {
            this._handleLoadedError() 
            return
        } else {
            this.setVideoTitleState()
            this.setVideoEventListeners()
        }
        if (this.activated) {
            if (this.initialState) this.addInitialState()
            else this.initializeVideoControls()  
        } else {
            console.warn("You have to activate the TMG controller to access the custom controls")
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }

    addInitialState() {
    try {
        if (this.initialState) {
        this.videoContainer.classList.add("T_M_G-video-initial")
        this.video.addEventListener("play", this.removeInitialState, {once:true})
        this.DOM.mainPlayPauseBtn?.addEventListener("click", this.removeInitialState)
        this.videoContainer.addEventListener("click", this.removeInitialState)
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    removeInitialState() {
    try {
        if (this.initialState) {
        this.stall()
        this.videoContainer.classList.remove("T_M_G-video-initial")
        this.initialState = false
        this.togglePlay(true) 
        this.initializeVideoControls()
        this.DOM.mainPlayPauseBtn?.removeEventListener("click", this.removeInitialState)
        this.videoContainer.removeEventListener("click", this.removeInitialState)
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }

    stall() {
    try {
        this.showOverlay()
        this.DOM.mainPlayPauseBtn?.classList.add("T_M_G-video-control-spin")
        this.DOM.mainPlayPauseBtn?.addEventListener("animationend", () => this.DOM.mainPlayPauseBtn?.classList.remove("T_M_G-video-control-spin"), {once: true}) 
    } catch(e) {
        this._log(e, "error", "swallow")
    }           
    }

    initializeVideoControls() {
    try {     
        this._handleLoadedMetadata()
        this.initAudioManager()
        this.updateBrightnessSettings()
        this.enableFocusableControls("all")
        this.setInitialStates()
        this.setGeneralEventListeners()
        this.observeIntersection()
        this.cache()
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    setInitialStates() {
    try {     
        this.showOverlay()
        this.setVideoTitleState()
        this.setCaptionsState()   
        this.setPreviewImagesState()
        this.setBtnsState()
        this.pseudoVideo.src = this.video.src || this.video.currentSrc
    } catch(e) {
        this._log(e, "error", "swallow")
    }    
    }

    setVideoTitleState() {
    try {
        if (this.DOM.videoTitle) this.DOM.videoTitle.textContent = this.media?.title || ""
        this.DOM.videoTitle?.setAttribute("data-video-title", this.media?.title || "")
    } catch(e) {
        this._log(e, "error", "swallow")
    } 
    }

    setCaptionsState() {
    try {
        if (this.video.textTracks.length > 0) { 
            Array.from(this.video.textTracks).forEach((track, index) => {
                if (track.mode === "showing") {
                    this.textTrackIndex = index
                    return
                }
                track.mode = "hidden"
            })
            this.video.textTracks[this.textTrackIndex].mode = this.settings.autocaptions ? "showing" : "hidden"
            this.videoContainer.classList.toggle("T_M_G-video-captions", this.settings.autocaptions)
            this.videoContainer.setAttribute("data-track-kind", this.video.textTracks[this.textTrackIndex].kind)
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    } 
    }

    setPreviewImagesState() {
    try {
        this.videoContainer.classList.toggle("T_M_G-video-no-previews", !this.settings.previewImages)
        this.videoContainer.setAttribute("data-preview-type", this.settings.status.ui.previewImages ? "image" : "canvas")
        if (!this.settings.status.ui.previewImages && this.settings.previewImages) {
            this.previewContext = this.DOM.previewCanvas.getContext("2d")
            this.thumbnailContext = this.DOM.thumbnailCanvas.getContext("2d")
            let dummyImg = document.createElement("img")
            dummyImg.src = window.tmg.ALT_IMG_SRC
            dummyImg.onload = () => {
                this.previewContext.drawImage(dummyImg, 0, 0, this.DOM.previewCanvas.width, this.DOM.previewCanvas.height)
                this.thumbnailContext.drawImage(dummyImg, 0, 0, this.DOM.thumbnailCanvas.width, this.DOM.thumbnailCanvas.height)
                dummyImg = null
            }
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    } 
    }

    setBtnsState() {
    try {
        this.setCaptionBtnState()
        this.setFullScreenBtnState()
        this.setTheaterBtnState()
        this.setPictureInPictureBtnState()
        this.setPlaylistBtnsState()
    } catch(e) {
        this._log(e, "error", "swallow")
    }            
    }

    setCaptionBtnState() {
    try {
        if (!this.video.textTracks[this.textTrackIndex]) {
            this.DOM.captionsBtn?.classList.add("T_M_G-video-control-disabled")
        } else {
            this.DOM.captionsBtn?.classList.remove("T_M_G-video-control-disabled")
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }                    
    }

    setFullScreenBtnState() {
    try {
        if (!this.settings.status.modes.fullScreen) {
            this.DOM.fullScreenBtn?.classList.add("T_M_G-video-control-hidden")
        } else {
            this.DOM.fullScreenBtn?.classList.remove("T_M_G-video-control-hidden")
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }                    
    }

    setTheaterBtnState() {
    try {
        if (!this.settings.status.modes.theater) {
            this.DOM.theaterBtn?.classList.add("T_M_G-video-control-hidden")
        } else {
            this.DOM.theaterBtn?.classList.remove("T_M_G-video-control-hidden")
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }                    
    }

    setPictureInPictureBtnState() {
    try {
        if (!this.settings.status.modes.pictureInPicture) {
            this.DOM.pictureInPictureBtn?.classList.add("T_M_G-video-control-hidden")
        } else {
            this.DOM.pictureInPictureBtn?.classList.remove("T_M_G-video-control-hidden")
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }                    
    }

    setPlaylistBtnsState() {
    try {
        if (!this.DOM) return
        if (this._playlist) {
            this.DOM.mainPrevBtn?.classList.remove
            ("T_M_G-video-control-hidden")
            this.DOM.mainNextBtn?.classList.remove("T_M_G-video-control-hidden")
            if (!(this.currentPlaylistIndex > 0) && !(this.currentPlaylistIndex < this._playlist?.length - 1)) {
                this.DOM.mainPrevBtn?.classList.add
                ("T_M_G-video-control-hidden")
                this.DOM.mainNextBtn?.classList.add("T_M_G-video-control-hidden")                
            } else {
                if (!(this.currentPlaylistIndex > 0)) {
                    this.DOM.mainPrevBtn?.classList.add("T_M_G-video-control-disabled")
                } else {
                    this.DOM.mainPrevBtn?.classList.remove("T_M_G-video-control-disabled")
                }
                if (!(this.currentPlaylistIndex < this._playlist?.length - 1)) {
                    this.DOM.mainNextBtn?.classList.add("T_M_G-video-control-disabled")
                } else {
                    this.DOM.mainNextBtn?.classList.remove("T_M_G-video-control-disabled")
                }
            }
        } else {
            this.DOM.mainPrevBtn?.classList.add
            ("T_M_G-video-control-hidden")
            this.DOM.mainNextBtn?.classList.add("T_M_G-video-control-hidden")
        }
        if (!(this.currentPlaylistIndex > 0)) {
            this.DOM.prevBtn?.classList.add("T_M_G-video-control-hidden")
        } else {
            this.DOM.mainPrevBtn?.classList.remove("T_M_G-video-control-hidden")
            this.DOM.prevBtn?.classList.remove("T_M_G-video-control-hidden")
        }
        if (!(this.currentPlaylistIndex < this._playlist?.length - 1)) {
            this.DOM.nextBtn?.classList.add("T_M_G-video-control-hidden")
        } else {
            this.DOM.nextBtn?.classList.remove("T_M_G-video-control-hidden")
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }                    
    }

    setGeneralEventListeners() {
    try { 
        this.setVideoContainerEventListeners()
        this.setControlsEventListeners()
        this.setSettingsEventListeners()
    } catch(e) {
        this._log(e, "error", "swallow")
    }                    
    }

    setKeyEventListeners() {
    try {        
        if (this.settings.keyShortcuts) {
        document.addEventListener("keydown", this._handleKeyDown)
        document.addEventListener("keyup", this._handleKeyUp)
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    removeKeyEventListeners() {
    try {        
        document.removeEventListener("keydown", this._handleKeyDown)
        document.removeEventListener("keyup", this._handleKeyUp)
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    setVideoContainerEventListeners() {
    try {
        this.DOM.videoControlsContainer.addEventListener("contextmenu", this._handleRightClick)
        this.DOM.videoOverlayControlsContainer.addEventListener("contextmenu", this._handleRightClick)
        this.DOM.videoOverlayControlsContainer.addEventListener("click", this._handleHoverPointerDown, true)
        this.DOM.videoControlsContainer.addEventListener("click", this._handleHoverPointerDown, true)
        this.DOM.videoOverlayControlsContainer.addEventListener("pointerover", this._handleHoverPointerActive, true)
        this.DOM.videoControlsContainer.addEventListener("pointerover", this._handleHoverPointerActive, true)
        this.DOM.videoOverlayControlsContainer.addEventListener("pointermove", this._handleHoverPointerActive, true)
        this.DOM.videoControlsContainer.addEventListener("pointermove", this._handleHoverPointerActive, true)
        this.DOM.videoOverlayControlsContainer.addEventListener("mouseleave", this._handleHoverPointerOut, true)
        this.DOM.videoControlsContainer.addEventListener("mouseleave", this._handleHoverPointerOut, true)
        this.DOM.videoOverlayControlsContainer.addEventListener("click", this._handleClick, true)
        this.DOM.videoOverlayControlsContainer.addEventListener("dblclick", this._handleDoubleClick, true)
        this.DOM.videoOverlayControlsContainer.addEventListener("mousedown", this._handleSpeedPointerDown, true)
        this.DOM.videoOverlayControlsContainer.addEventListener("touchstart", this._handleSpeedPointerDown, {passive:true, useCapture:true})
        this.DOM.videoOverlayControlsContainer.addEventListener("touchstart", this._handleAdvancedTouchStart, {passive:false, useCapture:true})

    } catch(e) {
        this._log(e, "error", "swallow")
    }            
    }    

    setVideoEventListeners() {
    try {
        this.video.addEventListener("error", this._handleLoadedError)
        this.video.addEventListener("play", this._handlePlay)
        this.video.addEventListener("pause", this._handlePause)        
        this.video.addEventListener("waiting", this._handleBufferStart)
        this.video.addEventListener("playing", this._handleBufferStop)
	    this.video.addEventListener("durationchange", this._handleDurationChange)
        this.video.addEventListener("ratechange", this._handlePlaybackRateChange)      
        this.video.addEventListener("timeupdate", this._handleTimeUpdate)
        this.video.addEventListener("progress", this._handleLoadedProgress)
        this.video.addEventListener("loadedmetadata", this._handleLoadedMetadata)
        this.video.addEventListener("loadeddata", this._handleLoadedData)
        this.video.addEventListener("ended", this._handleEnded)
        this.video.addEventListener("enterpictureinpicture", this._handleEnterPictureInPicture)
        this.video.addEventListener("leavepictureinpicture", this._handleLeavePictureInPicture)
    } catch(e) {
        this._log(e, "error", "swallow")
    }            
    }

    removeVideoEventListeners() {
    try {
        this.video.removeEventListener("error", this._handleLoadedError)
        this.video.removeEventListener("play", this._handlePlay)
        this.video.removeEventListener("pause", this._handlePause)        
        this.video.removeEventListener("waiting", this._handleBufferStart)
        this.video.removeEventListener("playing", this._handleBufferStop)
	    this.video.removeEventListener("durationchange", this._handleDurationChange)
        this.video.removeEventListener("ratechange", this._handlePlaybackRateChange)      
        this.video.removeEventListener("timeupdate", this._handleTimeUpdate)
        this.video.removeEventListener("progress", this._handleLoadedProgress)
        this.video.removeEventListener("loadedmetadata", this._handleLoadedMetadata)
        this.video.removeEventListener("loadeddata", this._handleLoadedData)
        this.video.removeEventListener("ended", this._handleEnded)
        this.video.removeEventListener("enterpictureinpicture", this._handleEnterPictureInPicture)
        this.video.removeEventListener("leavepictureinpicture", this._handleLeavePictureInPicture)
    } catch(e) {
        this._log(e, "error", "swallow")
    }           
    }

    setControlsEventListeners() {
    try {
        this.DOM.fullScreenOrientationBtn?.addEventListener("click", this.changeFullScreenOrientation)
        this.DOM.miniPlayerExpandBtn?.addEventListener("click", this.expandMiniPlayer)
        this.DOM.miniPlayerCancelBtn?.addEventListener("click", this.cancelMiniPlayer)        
        this.DOM.mainPrevBtn?.addEventListener("click", this.previousVideo)
        this.DOM.prevBtn?.addEventListener("click", this.previousVideo)
        this.DOM.mainNextBtn?.addEventListener("click", this.nextVideo)
        this.DOM.nextBtn?.addEventListener("click", this.nextVideo)
        this.DOM.playPauseBtn?.addEventListener("click", this.togglePlay)
        this.DOM.mainPlayPauseBtn?.addEventListener("click", this.togglePlay)
        this.DOM.durationContainer?.addEventListener("click", this.changeTimeFormat)
        this.DOM.playbackRateBtn?.addEventListener("click", this.togglePlaybackRate)
        this.DOM.captionsBtn?.addEventListener("click", this.toggleCaptions)
        this.DOM.muteBtn?.addEventListener("click", this.toggleMute)
        this.DOM.darkBtn?.addEventListener("click", this.toggleDark)
        this.DOM.objectFitBtn?.addEventListener("click", this.toggleObjectFit)
        this.DOM.theaterBtn?.addEventListener("click", this.toggleTheaterMode)
        this.DOM.fullScreenBtn?.addEventListener("click", this.toggleFullScreenMode)
        this.DOM.pictureInPictureBtn?.addEventListener("click", this.togglePictureInPictureMode)
        this.DOM.pictureInPictureActiveIconWrapper?.addEventListener("click", this.togglePictureInPictureMode)
        this.DOM.settingsBtn?.addEventListener("click", this.toggleSettingsView)

        //timeline contanier event listeners
        this.DOM.timelineContainer?.addEventListener("pointerdown", this._handleTimelineScrubbing)
        this.DOM.timelineContainer?.addEventListener("mouseover", this.showPreviewImages)
        this.DOM.timelineContainer?.addEventListener("mouseleave", this.hidePreviewImages)
        this.DOM.timelineContainer?.addEventListener("touchend", this.hidePreviewImages)
        this.DOM.timelineContainer?.addEventListener("mousemove", this._handleTimelineInput)
        this.DOM.timelineContainer?.addEventListener("focus", this._handleTimelineFocus)
        this.DOM.timelineContainer?.addEventListener("blur", this._handleTimelineBlur)

        //volume event listeners
        this.DOM.volumeSlider?.addEventListener("input", this._handleVolumeSliderInput)
        this.DOM.volumeSlider?.addEventListener("mousedown", this. _handleVolumeSliderMouseDown)
        this.DOM.volumeSlider?.addEventListener("mouseup", this._handleVolumeSliderMouseUp)
        this.DOM.volumeContainer?.addEventListener("mousemove", this._handleVolumeContainerMouseMove)

        //brightness event listeners
        this.DOM.brightnessSlider?.addEventListener("input", this._handleBrightnessSliderInput)
        this.DOM.brightnessSlider?.addEventListener("mousedown", this. _handleBrightnessSliderMouseDown)
        this.DOM.brightnessSlider?.addEventListener("mouseup", this._handleBrightnessSliderMouseUp)
        this.DOM.brightnessContainer?.addEventListener("mousemove", this._handleBrightnessContainerMouseMove)

        //drag event listeners
        this.setDragEventListeners()

        //image event listeners 
        if (this.settings.status.ui.previewImages) {
        this.DOM.previewImg?.addEventListener("error", this._handleImgBreak)
        this.DOM.thumbnailImg?.addEventListener("error", this._handleImgBreak)
        }

        //notifiers event listeners
        this.notify.init(this)
    } catch(e) {
        this._log(e, "error", "swallow")
    }            
    }

    setDragEventListeners() {
    try {
    if (this.settings.status.ui.draggableControls) {
        this.DOM.draggableControls?.forEach(control => control.draggable = true)
        this.DOM.draggableControls?.forEach(control => {
            control.addEventListener("dragstart", this._handleDragStart)
            control.addEventListener("drag", this._handleDrag)
            control.addEventListener("dragend", this._handleDragEnd)
        })
        this.DOM.draggableControlContainers?.forEach(container => {
            container.addEventListener("dragenter", this._handleDragEnter)
            container.addEventListener("dragover", this._handleDragOver)
            container.addEventListener("drop", this._handleDrop)
            container.addEventListener("dragleave", this._handleDragLeave)
        })
    }
    } catch(e) {
        this._log(e, "error", "swallow")
    }            
    }

    removeDragEventListeners() {
    try {        
        this.DOM.draggableControls?.forEach(control => control.draggable = false)
        this.DOM.draggableControls?.forEach(control => {
            control.removeEventListener("dragstart", this._handleDragStart)
            control.removeEventListener("drag", this._handleDrag)
            control.removeEventListener("dragend", this._handleDragEnd)
        })
        this.DOM.draggableControlContainers?.forEach(container => {
            container.removeEventListener("dragenter", this._handleDragEnter)
            container.removeEventListener("dragover", this._handleDragOver)
            container.removeEventListener("drop", this._handleDrop)
            container.removeEventListener("dragleave", this._handleDragLeave)
        })
    } catch(e) {
        this._log(e, "error", "swallow")
    }            
    }

    setSettingsEventListeners() {
    try {
        this.DOM.settingsCloseBtn?.addEventListener("click", this.leaveSettingsView)
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }

    observeIntersection() {
    try {
        window.tmg.intersectionObserver.observe(this.videoContainer.parentElement)
        window.tmg.intersectionObserver.observe(this.video)      
    } catch(e) {
        this._log(e, "error", "swallow")
    }            
    }

    unobserveIntersection() {
    try {
        window.tmg.intersectionObserver.unobserve(this.videoContainer.parentElement)
        window.tmg.intersectionObserver.unobserve(this.video)      
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    _handleMediaIntersectionChange(isIntersecting) {
    try {
        this.isIntersecting = isIntersecting
        this.isIntersecting && !this.settingsView ? this.setKeyEventListeners() : this.removeKeyEventListeners()
    } catch(e) {
        this._log(e, "error", "swallow")
    } 
    }

    _handleMediaParentIntersectionChange(isIntersecting) {
    try {
        this.parentIntersecting = isIntersecting
        this.toggleMiniPlayerMode()
    } catch(e) {
        this._log(e, "error", "swallow")
    } 
    }

    cache() {
    try {
        this.settingsCache = JSON.parse(JSON.stringify(this.settings))
    } catch(e) {
        this._log(e, "error", "swallow")
    }                        
    }

    enableFocusableControls(all) {
    try {
        if (all === "all") {
            this.DOM.focusableControls?.forEach(control => {
                control.tabIndex = "0"
                control.setAttribute("data-focusable-control", true)
            })
        } else {
            this.DOM.focusableControls?.forEach(control => {
                if (this.DOM.videoContainerContent.contains(control)) {
                    control.tabIndex = "0"
                    control.setAttribute("data-focusable-control", true)
                }
            })
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }  
    }

    disableFocusableControls(all) {
    try {
        if (all === "all") {
            this.DOM.focusableControls?.forEach(control => {
                control.tabIndex = "-1"
                control.setAttribute("data-focusable-control", false)
            })
        } else {
            this.DOM.focusableControls?.forEach(control => {
                if (this.DOM.videoContainerContent.contains(control)) {
                    control.tabIndex = "-1"
                    control.setAttribute("data-focusable-control", false)
                }
            })
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }  
    }

    getCurrentVideoFrame(type) {
    try {
        this.pseudoVideo.currentTime = this.currentTime
        this.contentCanvas.width = this.video.videoWidth
        this.contentCanvas.height = this.video.videoHeight
        this.contentContext.drawImage(this.pseudoVideo, 0, 0, this.contentCanvas.width, this.contentCanvas.height)
        if (type === "monochrome") this.convertToMonoChrome(this.contentCanvas)
        return this.contentCanvas.toDataURL("image/png")
    } catch(e) {
        this._log(e, "error", "swallow")
    }                    
    }

    convertToMonoChrome(canvas) {
    try {
        const frame = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height)
        const l = frame.data.length / 4

        for (let i = 0; i < l; i ++) {
            const grey = (
                frame.data[i * 4 + 0] +
                frame.data[i * 4 + 1] +
                frame.data[i * 4 + 2]
            ) / 3
            frame.data[i * 4 + 0] = grey
            frame.data[i * 4 + 1] = grey
            frame.data[i * 4 + 2] = grey
        }

        canvas.getContext("2d").putImageData(frame, 0, 0)
    } catch(e) {
        this._log(e, "error", "swallow")
    }                        
    }

    controlsResize() {           
    try {
        let controlsSize = 25
        this.DOM.svgs?.forEach(svg => {
            svg.setAttribute("preserveAspectRatio", "xMidYMid meet")
            if (!(svg.dataset.noResize === "true")) svg.setAttribute("viewBox", `0 0 ${controlsSize} ${controlsSize}`)
        })
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }       

    deactivate() {
    try {
        this.showOverlay()
        this.videoContainer.classList.add("T_M_G-video-unavailable")
        // this.disableFocusableControls("all")
        // this.removeKeyEventListeners()
    } catch(e) {
        this._log(e, "error", "swallow")
    } 
    }

    reactivate() {
    try {
        if (this.videoContainer.classList.contains("T_M_G-video-unavailable") && this.loaded) {
            this.videoContainer.classList.remove("T_M_G-video-unavailable")
            // this.enableFocusableControls("all")
            // this.setKeyEventListeners()
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    } 
    }

    activatePseudoMode() {
    try {
        this.pseudoVideoContainer.className += this.videoContainer.className.replace("T_M_G-video-container", "")
        this.videoContainer.parentElement.insertBefore(this.pseudoVideoContainer, this.videoContainer)
        document.body.append(this.videoContainer)
    } catch(e) {
        this._log(e, "error", "swallow")
    } 
    }

    deactivatePseudoMode() {
    try {
        this.pseudoVideoContainer.className = "T_M_G-pseudo-video-container"
        this.pseudoVideoContainer.parentElement.insertBefore(this.videoContainer, this.pseudoVideoContainer)
        this.pseudoVideoContainer.remove()
    } catch(e) {
        this._log(e, "error", "swallow")
    } 
    }

    isModeActive(mode) {
    try {
        switch (mode) {
            case "miniPlayer":
                return this.videoContainer.classList.contains("T_M_G-video-mini-player")
            case "fullScreen":
                return this.videoContainer.classList.contains("T_M_G-video-full-screen")
            case "pictureInPicture":
                return this.videoContainer.classList.contains("T_M_G-video-picture-in-picture")
            case "floatingPlayer": 
                return this.videoContainer.classList.contains("T_M_G-video-floating-player")
            case "theater":
                return this.videoContainer.classList.contains("T_M_G-video-theater")
            case "normal":
            default:
                return false
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }         
    }

    _handleWindowResize() {
    try {        
        this.toggleMiniPlayerMode()
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    _handleVisibilityChange() {
    try {
        //tending to some observed glitches when visibility changes
        if (document.visibilityState === "visible") {
            this.stopTimelineScrubbing()
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }

    _handleImgBreak(e) {
    try {
        e.target.src = window.tmg.ALT_IMG_SRC
    } catch(e) {
        this._log(e, "error", "swallow")
    }                        
    }        

    showMessage(message) {
    try {
        if (message) this.DOM.videoContainerContent?.setAttribute("data-message", message)
    } catch(e) {
        this._log(e, "error", "swallow")
    }             
    }

    _handleLoadedError(error) {
    try {
        if (error) this._log(error, "error", "swallow")
        let message 
        switch (error.code) {
            case error.MEDIA_ERR_ABORTED:
                message = "The video playback was aborted."
                break;
            case error.MEDIA_ERR_NETWORK:
                message = "The video failed due to a network error."
                break;
            case error.MEDIA_ERR_DECODE:
                message = "The video could not be decoded."
                break;
            case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                message = "The video source is not supported."
                break;
            default:
                message = "An unknown error occurred during video playback."
        }
        this.showMessage(message)
        this.loaded = false
        this.deactivate()
    } catch(e) {
        this._log(e, "error", "swallow")
    } 
    }

    _handleLoadedMetadata() {
    try {
        if (this.settings.startTime) this.currentTime = this.settings.startTime
        if (this.DOM.totalTimeElement) this.DOM.totalTimeElement.textContent = window.tmg.formatTime(this.video.duration)
        this.aspectRatio = this.video.videoWidth / this.video.videoHeight
        this.videoAspectRatio = `${this.video.videoWidth} / ${this.video.videoHeight}`
        this.videoCurrentProgressPosition = (this.currentTime < 1) ? this.videoCurrentLoadedPosition = 0 : window.tmg.formatNumber(this.video.currentTime / this.video.duration)
        this.loaded = true
        this.reactivate()
    } catch(e) {
        this._log(e, "error", "swallow")
    }                   
    }

    _handleLoadedData() {
    try {
        if (this.DOM.totalTimeElement) this.DOM.totalTimeElement.textContent = window.tmg.formatTime(this.video.duration)
    } catch(e) {
        this._log(e, "error", "swallow")
    }                
    }

    _handleDurationChange() {
    try {
        if (this.DOM.totalTimeElement) this.DOM.totalTimeElement.textContent = window.tmg.formatTime(this.video.duration)
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    } 

    _handleLoadedProgress() {
    try {
        for (let i = 0; i < this.video.buffered.length; i++) {
            if (this.video.buffered.start(this.video.buffered.length - 1 - i) < this.currentTime) {
                this.videoCurrentLoadedPosition = this.video.buffered.end(this.video.buffered.length - 1 - i) / this.duration
                break
            }
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }                    
    }    

    previousVideo() {
    try {
        if (this._playlist && this.currentPlaylistIndex > 0) {
            this.currentTime < 3 ? this.movePlaylistTo(this.currentPlaylistIndex - 1) : this.moveVideoTime({to: "start"})
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }                
    }

    nextVideo() {
    try {
        if (this._playlist && this.currentPlaylistIndex < this._playlist.length - 1) this.movePlaylistTo(this.currentPlaylistIndex + 1)
    } catch(e) {
        this._log(e, "error", "swallow")
    }                
    }

    movePlaylistTo(index) {
    try {
        if (this._playlist) {
            if (this.settings.status.allowOverride.startTime) {
                this._playlist[this.currentPlaylistIndex].settings.startTime = this.currentTime < (this.duration - this.settings.endTime ?? 0) ? this.playlistCurrentTime : null
            }
            this.stall()
            this.loaded = false
            this.currentPlaylistIndex = index
            const video = this._playlist[index]
            if (video.media?.artwork) 
            if (video.media.artwork[0]?.src !== this.video.poster) this.video.poster = video.media.artwork[0].src
            if (video.src) this.src = video.src
            else if (video.sources?.length > 0) this.sources = video.sources
            if (video.tracks?.length > 0) this.tracks = video.tracks
            this.media = video.media ? {...this.media, ...video.media} : video.media ?? null
            this.settings.startTime = video.settings.startTime
            this.settings.endTime = video.settings.endTime
            this.settings.previewImages = video.settings.previewImages?.length > 0 ? {...this.settings.previewImages, ...video.settings.previewImages} : video.settings.previewImages
            this.settings.status.ui.previewImages = this.settings.previewImages?.address && this.settings.previewImages?.fps ? true : false
            this.playlistCurrentTime = null
            this.setInitialStates()
            this.togglePlay(true)
            this.canAutoMovePlaylist = true
        }        
    } catch(e) {
        this._log(e, "error", "swallow")
    }            
    }

    automovePlaylist() {
    try {        
        if (this.loaded && this._playlist && this.settings.automove && this.canAutoMovePlaylist && (this.currentPlaylistIndex < this._playlist.length - 1) && !this.video.paused) {
            this.canAutoMovePlaylist = false
            const count = Math.floor((this.settings.endTime || this.duration) - this.currentTime)
            const {src, media: {title}} = this._playlist[this.currentPlaylistIndex + 1]
            const playlistToastContainer = document.createElement("div")
            playlistToastContainer.classList = "T_M_G-video-playlist-toast-container"
            playlistToastContainer.innerHTML = 
            `
                <span title="Play next Video" class="T_M_G-video-playlist-next-video-preview-wrapper">
                    <button type="button" title="Play next video">
                        <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 25 25">
                            <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                        </svg>
                    </button>
                    <video src="${src}" class="T_M_G-video-playlist-next-video-preview" autoplay muted></video>
                </span>
                <span class="T_M_G-video-playlist-next-video-info">
                    <h2>Next Video in <span class="T_M_G-video-playlist-next-video-countdown">${count}</span></h2>
                    ${title ? `<p class="T_M_G-video-playlist-next-video-title">${title}</p>` : ""}
                </span>
                <button title="Cancel" type="button" class="T_M_G-video-playlist-next-video-cancel-btn">&times;</button>            
            `   
            this.DOM.videoOverlayControlsContainer.append(playlistToastContainer)
            
            //now to explain this seemingly complex function, for the first if statement, it is a known fact that request animation frame stops when one leaves the current tab so our last time variable will become stale and lead to unpredictabilities so everytime visibility changes, we update a boolean shouldUnpase which works like so: it is set to false if it was true which would have been caused by the document becoming visible again and it is set to false to ensure that the only other time it is set to true is when the document loses visibility and then gets it back and then lastTime will be set to null which will then lead the second if statement which is a smart one as it is activated initially when lastTime was null or undefined but coerced to null since the comparison is not strict and it is also activated after the whole visibility sharade which does the same initial work as the two lines at the bottom so like a refresh that is exactly the same as the initial cuz both of them occur before the next loop and then the next if statment just updates the UI and watches for when timeVisible becomes greater than the initial count
            const updatePlaylistToast = timestamp =>  {
                if (shouldUnPause) {
                    lastTime = null
                    shouldUnPause = false
                }
                if (lastTime == null) {
                    lastTime = timestamp
                    nextVideoFrameId = requestAnimationFrame(updatePlaylistToast)
                    return
                }
                if (!isPaused) {
                    timeVisible += timestamp - lastTime
                    constraint += timestamp - lastTime
                    this.videoCurrentAutoPlaylistPosition = timeVisible / (count * 1000)
                    if (constraint >= 1000) {
                        nextVideoCountdown--
                        playlistNextVideoCountdown.textContent = nextVideoCountdown
                        constraint = 0
                    }
                    if (timeVisible >= count * 1000) {
                        autoNextVideo()
                        return
                    }
                }
                lastTime = timestamp
                nextVideoFrameId = requestAnimationFrame(updatePlaylistToast)
            },
            handleAutoPlaylistVisibilityChange = () => shouldUnPause = document.visibilityState === "visible",
            autoNextVideo = () => {
                cleanUpPlaylistToast()
                this.nextVideo()
            },
            cleanUpPlaylistToastWhenNeeded = () => {
                if (!(this.currentTime === this.duration)) cleanUpPlaylistToast()
            },
            autoCleanUpPlaylistToast = () => {
                if (Math.floor((this.settings.endTime || this.duration) - this.currentTime) > this.settings.automoveCountdown) cleanUpPlaylistToast()
            },
            cleanUpPlaylistToast = e => {
                playlistToastContainer.remove()
                cancelAnimationFrame(nextVideoFrameId)
                document.removeEventListener("visibilitychange", handleAutoPlaylistVisibilityChange)
                this.video.removeEventListener("pause", cleanUpPlaylistToastWhenNeeded)
                this.video.removeEventListener("waiting", cleanUpPlaylistToastWhenNeeded)
                this.video.removeEventListener("timeupdate", autoCleanUpPlaylistToast)
                if (!e?.target.classList.contains("T_M_G-video-playlist-next-video-cancel-btn")) this.canAutoMovePlaylist = true
            },
            playlistNextVideoPreviewWrapper = this.videoContainer.querySelector(".T_M_G-video-playlist-next-video-preview-wrapper"),
            playlistNextVideoCountdown = this.videoContainer.querySelector(".T_M_G-video-playlist-next-video-countdown"),
            playlistNextVideoCancelBtn = this.videoContainer.querySelector(".T_M_G-video-playlist-next-video-cancel-btn")

            let isPaused = false, 
            shouldUnPause,
            lastTime,
            constraint = 0,
            timeVisible = 0,
            nextVideoCountdown = count,
            nextVideoFrameId = requestAnimationFrame(updatePlaylistToast)

            document.addEventListener("visibilitychange", handleAutoPlaylistVisibilityChange)
            playlistToastContainer.addEventListener("mouseover", () => isPaused = true)
            playlistToastContainer.addEventListener("mouseleave", () => {if (!playlistToastContainer.matches(":hover")) setTimeout(() => isPaused = false)})
            playlistToastContainer.addEventListener("touchend", () => setTimeout(() => isPaused = false))
            this.video.addEventListener("pause", cleanUpPlaylistToastWhenNeeded)
            this.video.addEventListener("waiting", cleanUpPlaylistToastWhenNeeded)
            this.video.addEventListener("timeupdate", autoCleanUpPlaylistToast)
            playlistNextVideoPreviewWrapper.addEventListener('click', autoNextVideo)
            playlistNextVideoCancelBtn.addEventListener('click', cleanUpPlaylistToast)
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }

    setMediaSession() {
    try {
        if (window.tmg._PICTURE_IN_PICTURE_ACTIVE && !this.isModeActive("pictureInPicture")) return
        if ('mediaSession' in navigator) {
            if (this.media) navigator.mediaSession.metadata = new MediaMetadata(this.media)
            navigator.mediaSession.setActionHandler('play', () => this.togglePlay(true))
            navigator.mediaSession.setActionHandler('pause', () => this.togglePlay(false))
            navigator.mediaSession.setActionHandler("seekbackward", () => this.skip(-this.settings.timeSkip))
            navigator.mediaSession.setActionHandler("seekforward", () => this.skip(this.settings.timeSkip))
            navigator.mediaSession.setActionHandler("previoustrack", null)
            navigator.mediaSession.setActionHandler("nexttrack", null)
            if (this._playlist) {
            if (this.currentPlaylistIndex > 0)
                navigator.mediaSession.setActionHandler("previoustrack", () => this.previousVideo())
            if (this.currentPlaylistIndex < this._playlist?.length - 1)
                navigator.mediaSession.setActionHandler("nexttrack", () => this.nextVideo())
            }            
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }

    toggleObjectFit() {
    try {
        const fitNames = ["Crop to Fit", "Fit To Screen", "Stretch"],
        fits = ["contain", "cover", "fill"]
        let fitIndex = fits.indexOf(this.videoObjectFit) + 1
        if (fitIndex > 2) fitIndex = 0
        if (fitIndex < 0) fitIndex = 2
        this.videoObjectFit = fits[fitIndex]
        this.videoContainer.setAttribute("data-object-fit", this.videoObjectFit)
        if (this.DOM.objectFitNotifier) this.DOM.objectFitNotifier.textContent = fitNames[fitIndex]
        this.fire("objectfitchange")
    } catch(e) {
        this._log(e, "error", "swallow")
    }  
    }

    togglePlay(bool) {
    try {        
        this.video.ended ? this.replay() : typeof bool == "boolean" ? bool ? this.video.play() : this.video.pause() : this.video.paused ? this.video.play() : this.video.pause()
    } catch(e) {
        this._handleLoadedError(e)
    }        
    }

    replay() {
    try {        
        this.stall()
        this.moveVideoTime({to: "start"})
        this.video.play()
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }    
    
    _handleBufferStart() {
    try {
        this.buffering = true
        this.showOverlay()
        this.videoContainer.classList.add("T_M_G-video-buffering")
    } catch(e) {
        this._log(e, "error", "swallow")
    }                
    }

    _handleBufferStop() {
    try {        
        if (this.buffering) {
        this.buffering = false
        this.overlayRestraint()
        this.videoContainer.classList.remove("T_M_G-video-buffering")
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }                        
    }
    
    _handlePlay() {
    try {
        window.tmg.connectAudio(this.audioGainNode)
        for (const media of document.querySelectorAll("video, audio")) {
            if (media !== this.video) media.pause()
        }
        this.videoContainer.classList.remove("T_M_G-video-paused")
        this.overlayRestraint()
        this.setMediaSession()
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }
            
    _handlePause() {
    try {        
        this.videoContainer.classList.add("T_M_G-video-paused")
        this.showOverlay()
        if (this.buffering) this._handleBufferStop()
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    _handleEnded() {
    try {        
        this.videoContainer.classList.add("T_M_G-video-replay")
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }  

    moveVideoTime(details) {
    try {        
        switch(details.to) {
            case "start":
                this.currentTime = 0
                break
            case "end":
                this.currentTime = this.duration
                break
            default:                        
                this.currentTime = (Number(details.to)/Number(details.max)) * this.duration
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    _handleTimelineScrubbing(e) {
    try {
        if (!this.isScrubbing) {
        this.DOM.timelineContainer?.setPointerCapture(e.pointerId)
        this.isScrubbing = true
        this.toggleScrubbing(e)
        this.DOM.timelineContainer?.addEventListener("pointermove", this._handleTimelineInput)
        this.DOM.timelineContainer?.addEventListener("pointerup", this.stopTimelineScrubbing, {once:true})
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    stopTimelineScrubbing(e) {
    try {
        if (this.isScrubbing) {
        this.isScrubbing = false
        if (e) this.toggleScrubbing(e)
        else this.videoContainer.classList.remove("T_M_G-video-scrubbing")
        this.DOM.timelineContainer?.removeEventListener("pointermove", this._handleTimelineInput)
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }
    
    toggleScrubbing(e) {
    try {        
        const rect = this.DOM.timelineContainer?.getBoundingClientRect()
        const percent = Math.min(Math.max(0, e.clientX - rect.x), rect.width) / rect.width
        this.videoContainer.classList.toggle("T_M_G-video-scrubbing", this.isScrubbing)
        if (this.isScrubbing) {
            const width = window.tmg.getRenderedBox(this.video)?.width ?? this.videoContainer.offsetWidth
            const height = window.tmg.getRenderedBox(this.video)?.height ?? this.videoContainer.offsetHeight
            this.DOM.thumbnailCanvas.height = this.DOM.thumbnailImg.height = height + 1
            this.DOM.thumbnailCanvas.width = this.DOM.thumbnailImg.width = width + 1
            this.wasPaused = this.video.paused
            this.togglePlay(false)
        } else {
            this.currentTime = percent * this.duration
            if (!this.wasPaused) this.togglePlay(true)
        }
        this._handleTimelineInput(e)
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }

    showPreviewImages() {
        if (!window.tmg.queryMediaMobile()) this.videoContainer.classList.add("T_M_G-video-previewing")
    }

    hidePreviewImages() {
        setTimeout(() => this.videoContainer.classList.remove("T_M_G-video-previewing"))
    }

    _handleTimelineInput({clientX: x}) { 
    try {        
        if (this.timelineThrottleId !== null) return
        this.timelineThrottleId = setTimeout(() => this.timelineThrottleId = null, this.timelineThrottleDelay)

        const rect = this.DOM.timelineContainer?.getBoundingClientRect()
        const percent = window.tmg.clamp(0, x - rect.x, rect.width) / rect.width
        const previewImgMin = (this.DOM.previewContainer.offsetWidth / 2) / rect.width
        const previewImgPercent = window.tmg.clamp(previewImgMin, percent, (1 - previewImgMin))
        this.videoCurrentPreviewPosition = percent
        this.videoCurrentPreviewImgPosition = previewImgPercent
        this.DOM.previewContainer?.setAttribute("data-preview-time", window.tmg.formatTime(percent * this.video.duration))  
        if (this.isScrubbing) {
            this.videoCurrentProgressPosition =  percent
            this.overlayRestraint()
        } 
        let previewImgSrc
        if (this.settings.status.ui.previewImages) {
            const previewImgNumber = Math.max(1, Math.floor((percent * this.duration) / this.settings.previewImages.fps))
            previewImgSrc = this.settings.previewImages.address.replace('$', previewImgNumber)
            if (this.settings.previewImages && !window.tmg.queryMediaMobile()) this.DOM.previewImg.src = previewImgSrc
            if (this.isScrubbing) this.DOM.thumbnailImg.src = previewImgSrc
        } else if (this.settings.previewImages) {
            this.pseudoVideo.currentTime = percent * this.duration
            if (this.settings.previewImages && !window.tmg.queryMediaMobile()) this.previewContext.drawImage(this.pseudoVideo, 0, 0, this.DOM.previewCanvas.width, this.DOM.previewCanvas.height)
            if (this.isScrubbing) this.thumbnailContext.drawImage(this.pseudoVideo, 0, 0, this.DOM.thumbnailCanvas.width, this.DOM.thumbnailCanvas.height)
        }    
        let arrowPosition, arrowPositionMin = (((this.isModeActive("theater") && !this.isModeActive("miniPlayer")) || (this.isModeActive("fullScreen"))) && this.settings.previewImages) && !window.tmg.queryMediaMobile() ? 10 : 16.5
        if (percent < previewImgMin) {
            arrowPosition = `${Math.max(percent * rect.width, arrowPositionMin)}px`
        } else if (percent > (1 - previewImgMin)) {
            arrowPosition = `${Math.min(((this.DOM.previewContainer.offsetWidth/2 + (percent * rect.width) - this.DOM.previewContainer.offsetLeft)), this.DOM.previewContainer.offsetWidth - arrowPositionMin)}px`
        } else arrowPosition = "50%"
        this.videoCurrentPreviewImgArrowPosition = arrowPosition
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    _handleAdvancedTimelineInput({percent, sign}) {
        try {   
            const time = sign === "+" ? this.currentTime + (percent * this.duration) : this.currentTime- (percent * this.duration)
            this.advancedNextTime = window.tmg.clamp(0, Math.floor(time), this.duration)
            if (this.DOM.touchTimelineNotifier) this.DOM.touchTimelineNotifier.textContent = `${sign}${window.tmg.formatTime(Math.abs(this.advancedNextTime - this.currentTime))} (${window.tmg.formatTime(this.advancedNextTime)})`
        } catch(e) {
            this._log(e, "error", "swallow")
        }        
    }

    _handleTimelineFocus() {
    try {        
        if (this.DOM.timelineContainer?.matches(":focus-visible")) {
            this.isTimelineFocused = true
            document.addEventListener("keydown", this._handleTimelineKeyDown)
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    _handleTimelineKeyDown(e) {
    try {
        switch (e.key.toString().toLowerCase()) {
            case "arrowleft":
            case "arrowdown":
                e.preventDefault()
                e.stopImmediatePropagation()
                this.currentTime -= e.shiftKey ? 5 : 1
            break
            case "arrowright":
            case "arrowup":
                e.preventDefault()
                e.stopImmediatePropagation()
                this.currentTime += e.shiftKey ? 5 : 1
            break
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    _handleTimelineBlur() { 
    try {
        this.isTimelineFocused = false
        document.removeEventListener('keydown', this._handleTimelineKeyDown)
    } catch(e) {
        this._log(e, "error", "swallow")
    }            
    }

    _handleTimeUpdate() {
    try {    
        this.video.removeAttribute("controls")
        this.videoCurrentProgressPosition = window.tmg.formatNumber(this.video.currentTime / this.video.duration)
        if (this.DOM.currentTimeElement) this.DOM.currentTimeElement.textContent = this.settings.timeFormat !== "timespent" ? window.tmg.formatTime(this.video.currentTime) : `-${window.tmg.formatTime(this.video.duration - this.video.currentTime)}`
        if (this.speedCheck && this.speedToken === 1) this.DOM.playbackRateNotifier?.setAttribute("data-current-time", window.tmg.formatTime(this.video.currentTime))
        if (this._playlist && this.currentTime > 3) this.playlistCurrentTime = this.currentTime
        if (Math.floor((this.settings.endTime || this.duration) - this.currentTime) <= this.settings.automoveCountdown) this.automovePlaylist()
        if (this.videoContainer.classList.contains("T_M_G-video-replay")) this.videoContainer.classList.remove("T_M_G-video-replay")
    } catch(e) {
        this._log(e, "error", "swallow")
    }    
    }
    
    changeTimeFormat() {
    try {
        if (this.settings.status.allowOverride.timeFormat) {
            this.showOverlay()
            this.settings.timeFormat = this.settings.timeFormat !== "timespent" ? "timespent" : "timeleft"
            if (this.DOM.currentTimeElement) this.DOM.currentTimeElement.textContent = this.settings.timeFormat !== "timespent" ? window.tmg.formatTime(this.video.currentTime) : `-${window.tmg.formatTime(this.video.duration - this.video.currentTime)}`
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }      
    }
    
    skip(duration) {
    try {
        const notifier = duration > 0 ? this.DOM.fwdNotifier : this.DOM.bwdNotifier
        duration = Math.sign(duration) === 1 ? this.duration - this.currentTime > duration ? duration : this.duration - this.currentTime : Math.sign(duration) === -1 ? this.currentTime > Math.abs(duration) ? duration : -this.currentTime : 0
        duration = Math.trunc(duration)
        this.videoCurrentProgressPosition = (this.currentTime += duration) / this.duration
        if (this.skipPersist) {
            if (this.currentNotifier && notifier !== this.currentNotifier) {
                this.skipDuration = 0
                this.currentNotifier.classList.remove("T_M_G-video-control-persist")
                this.currentNotifier = null
            }
            this.currentNotifier = notifier
            notifier.classList.add("T_M_G-video-control-persist")
            this.skipDuration += duration
            if (this.skipDurationId) clearTimeout(this.skipDurationId)
            this.skipDurationId = setTimeout(() => {
                this.deactivateSkipPersist()
                this.skipDuration = 0
                notifier.classList.remove("T_M_G-video-control-persist")
                this.currentNotifier = null
                this.removeOverlay() 
            }, window.tmg.formatCSSTime(this.videoNotifiersAnimationTime))
            notifier.setAttribute("data-skip", this.skipDuration)
            return
        } else this.currentNotifier?.classList.remove("T_M_G-video-control-persist")
        notifier.setAttribute("data-skip", Math.abs(duration))
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }
            
    togglePlaybackRate(dir = "forwards") {
    try {     
        let newPlaybackRate
        if (dir === "backwards") {
            newPlaybackRate = this.video.playbackRate - .25
            this.DOM.playbackRateNotifier?.classList.add("T_M_G-video-rewind")
        } else {
            newPlaybackRate = this.video.playbackRate + .25
            this.DOM.playbackRateNotifier?.classList.remove("T_M_G-video-rewind")
        }
        if (newPlaybackRate < 0.25) newPlaybackRate = 2
        else if (newPlaybackRate > 2) newPlaybackRate = 0.25
        this.video.playbackRate = newPlaybackRate
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    changePlaybackRate(value) {
    try {     
        const sign = Math.sign(value) === 1 ? "+" : "-"
        value = Math.abs(value)
        const rate = this.video.playbackRate
        switch(sign) {
            case "-":
                if (rate > 0.25) {
                    this.video.playbackRate -= (rate%value) ? (rate%value) : value
                }
                this.DOM.playbackRateNotifier?.classList.add("T_M_G-video-rewind")
                this.fire("playbackratechange")
                break
            default: 
                if (rate < Math.min(16, this.settings.maxPlaybackRate)) this.video.playbackRate += (rate%value) ? (rate%value) : value
                this.DOM.playbackRateNotifier?.classList.remove("T_M_G-video-rewind")
                this.fire("playbackratechange")
                break
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }
    
    _handlePlaybackRateChange() {
    try {     
        if (this.DOM.playbackRateBtn) this.DOM.playbackRateBtn.textContent = `${this.video.playbackRate}x`
        if (this.DOM.playbackRateNotifier) this.DOM.playbackRateNotifier.textContent = `${this.video.playbackRate}x`  
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }
    
    speedUp(pos) {
    try {        
        if (!this.speedCheck) {
            this.speedCheck = true
            this.wasPaused = this.video.paused
            this.DOM.playbackRateNotifier?.classList.remove("T_M_G-video-rewind")
            this.DOM.playbackRateNotifier?.classList.add("T_M_G-video-control-active")
            pos === "backwards" && this.settings.status.beta?.rewind ? setTimeout(this.rewind) : setTimeout(this.fastForward)
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }    
    }

    fastForward() {
        try {
            this.speedToken = 1
            this.lastRate = this.video.playbackRate
            this.video.playbackRate = 2    
            if (this.wasPaused) this.togglePlay(true)
        } catch(e) {
            this._log(e, "error", "swallow")
        }
    }

    rewind() {
        try {
            this.speedToken = 0
            if (this.DOM.playbackRateNotifier) this.DOM.playbackRateNotifier.textContent = '2x'
            this.DOM.playbackRateNotifier?.classList.add("T_M_G-video-rewind")
            this.video.addEventListener("play", this.rewindReset)
            this.video.addEventListener("pause", this.rewindReset)
            this.speedVideoTime = this.currentTime
            this.speedIntervalId = setInterval(this.rewindVideo.bind(this), this.speedIntervalDelay)
            setTimeout(() => {
                if (this.wasPaused) this.togglePlay(true)
            }, 1000)
        } catch(e) {
            this._log(e, "error", "swallow")
        }
    }        


    rewindVideo() {
    try {        
        this.speedVideoTime -= this.speedIntervalTime
        this.videoCurrentProgressPosition = this.speedVideoTime / this.duration
        if (this.DOM.playbackRateNotifier) this.DOM.playbackRateNotifier.setAttribute("data-current-time", window.tmg.formatTime(Math.max(this.speedVideoTime, 0)))
        this.currentTime -= this.speedIntervalTime
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    rewindReset() {
    try {
        clearInterval(this.speedIntervalId)
        if (!this.video.paused) this.speedIntervalId = setInterval(this.rewindVideo.bind(this), this.speedIntervalDelay)
    } catch(e) {
        this._log(e, "error", "swallow")
    }            
    }
    
    slowDown() {
    try {        
        if (this.speedCheck) {
            this.speedCheck = false
            if (this.speedToken === 1) {
                this.video.playbackRate = this.lastRate
            } else if (this.speedToken === 0) {
                if (this.DOM.playbackRateNotifier) this.DOM.playbackRateNotifier.textContent = `${this.lastRate}x`
                this.DOM.playbackRateNotifier?.classList.remove("T_M_G-video-rewind")
                this.video.removeEventListener("play", this.rewindReset)
                this.video.removeEventListener("pause", this.rewindReset)
                if (this.speedIntervalId) clearInterval(this.speedIntervalId)
            }
            this.DOM.playbackRateNotifier?.classList.remove("T_M_G-video-control-active")
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }    
    }

    toggleCaptions() {
    try {        
        if (this.video.textTracks[this.textTrackIndex]) {
        const isHidden = this.video.textTracks[this.textTrackIndex].mode === "hidden"
        this.video.textTracks[this.textTrackIndex].mode = isHidden ? "showing" : "hidden"
        this.videoContainer.classList.toggle("T_M_G-video-captions", isHidden)
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    initAudioManager() {
    try {
        this.updateAudioSettings() 
        if (!window.tmg._AUDIO_CONTEXT) window.tmg.initializeAudioManager(!this.video.autoplay)
        if (window.tmg._AUDIO_CONTEXT) this.manageAudio()
    } catch(e) {
        this._log(e, "error", "swallow")
    }          
    }

    set volume(value) {
        if (this.audioGainNode) this.audioGainNode.gain.value = Math.max(value, 0) / 100
        this._handleVolumeChange()
    }

    get volume() {
        return Math.round((this.audioGainNode?.gain?.value ?? 1) * 100)
    }

    manageAudio() {
    try {
        if (!this.audioSetup) {
        window.tmg.connectMediaToAudioManager(this.video)
        this.audioSourceNode = this.video.tmgSourceNode
        this.audioGainNode = this.video.tmgGainNode
        this.video.volume = 1
        this.volume = this.video.muted ? 0 : this.volume
        this.volumeTypeCounter = this.volume === 0 ? 1 : 0
        this.audioSetup = true
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }  
    }

    removeAudio() {
    try {
        this.audioSourceNode?.disconnect()
        this.audioGainNode?.disconnect()
        this.audioSourceNode = this.audioGainNode = null
        this.audioSetup = false
    } catch(e) {
        this._log(e, "error", "swallow")
    }       
    }

    updateAudioSettings() {
    try {
        this.volumeBoost = this.settings.maxVolume > 100
        this.videoContainer.classList.toggle("T_M_G-video-volume-boost", this.volumeBoost)
        if (this.DOM.volumeSlider) this.DOM.volumeSlider.max = this.settings.maxVolume
        this.videoVolumeSliderPercent = Math.round((100 / this.settings.maxVolume) * 100)
        this.videoMaxVolumeRatio = this.maxVolumeRatio = this.settings.maxVolume / 100
        this.shouldSetLastVolume = this.video.muted
        this._handleVolumeChange()
    } catch(e) {
        this._log(e, "error", "swallow")
    }    
    }

    toggleMute(auto) {
    try {
        let volume
        if (this.volume) {
            this.lastVolume = this.volume
            this.shouldSetLastVolume = true
            volume = 0
        } else {
            volume = this.shouldSetLastVolume ? this.lastVolume : this.volume
            if (volume === 0) volume = auto === "auto" ? this.settings.volumeSkip : this.volumeSliderVolume
            this.shouldSetLastVolume = false
        }
        this.video.muted = volume === 0
        this.volume = volume
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    _handleVolumeSliderInput({target: {value: volume}}) {
    try {                
        this.video.muted = volume === 0
        this.volume = volume
        if (volume > 5) this.volumeSliderVolume = volume
        this.shouldSetLastVolume = false
        this.volumeActiveRestraint()            
        this.overlayRestraint()
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }

    _handleAdvancedVolumeSliderInput({percent, sign}) {
    try {
        let volume = sign === "+" ? this.volume + (percent * this.settings.maxVolume) : this.volume - (percent * this.settings.maxVolume)
        volume = window.tmg.clamp(0, Math.floor(volume), this.settings.maxVolume)
        this.video.muted = volume === 0
        this.volume = volume
        this.shouldSetLastVolume = false
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }

    _handleVolumeSliderMouseDown() {
        this.DOM.volumeSlider?.classList.add("T_M_G-video-control-active")
    }

    _handleVolumeSliderMouseUp() {
        this.DOM.volumeSlider?.classList.remove("T_M_G-video-control-active")
    }
                
    _handleVolumeChange() {
    try {
        let volume = this.volume
        if (this.DOM.volumeNotifierContent) this.DOM.volumeNotifierContent.textContent = volume + "%"
        let volumeLevel = ""
        if (this.video.muted || volume == 0) {
            volume = 0
            volumeLevel = "muted"
        } else if (volume < 50)
            volumeLevel = "low" 
        else if (volume <= 100) 
            volumeLevel = "high"
        else if (volume > 100) 
            volumeLevel = "boost"
        const volumePercent = (volume - 0) / (this.settings.maxVolume - 0)
        this.videoContainer.setAttribute("data-volume-level", volumeLevel)
        if (this.DOM.volumeSlider) this.DOM.volumeSlider.value = volume
        this.DOM.volumeSlider?.setAttribute("data-volume", volume)
        if (this.DOM.touchVolumeContent) this.DOM.touchVolumeContent.textContent = volume + "%"
        this.videoCurrentVolumeValuePosition = `${12 + (volumePercent * 77)}%`
        if (this.volumeBoost) {
            if (volume <= 100) {
                this.videoVolumeSliderBoostPercent = 0
                this.videoCurrentVolumeSliderBoostPosition = 0
                this.videoCurrentVolumeSliderPosition = (volume - 0) / (100 - 0)
            } else if (volume > 100) {
                this.DOM.volumeBoostSign?.setAttribute("data-boost", Math.round(volume / 10) / 10)
                this.videoVolumeSliderBoostPercent = parseInt(this.videoVolumeSliderPercent) + 5
                this.videoCurrentVolumeSliderBoostPosition = (volume - 100) / (this.settings.maxVolume - 100)
            }
        } else this.videoCurrentVolumeSliderPosition = volumePercent
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    changeVolume(value) {
    try {
        const sign = Math.sign(value) === 1 ? "+" : "-"
        value = Math.abs(value)
        let volume = this.shouldSetLastVolume ? this.lastVolume : this.volume
        switch(sign) {
            case "-":
                if (volume > 0) {
                    volume -= (volume%value) ? (volume%value) : value
                } 
                if (volume === 0) {
                    this.fire("volumemuted")
                    break
                }
                this.fire("volumedown")
                break
            default:
                if (volume < this.settings.maxVolume) {
                    volume += (volume%value) ? (value - volume%value) : value 
                }
                this.fire("volumeup")
                break                
        }
        if (this.shouldSetLastVolume) {
            if (this.DOM.volumeNotifierContent) this.DOM.volumeNotifierContent.textContent = volume + "%"
            this.lastVolume = volume
        } else {
            this.video.muted = volume === 0
            this.volume = volume
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }

    _handleVolumeContainerMouseMove() {
    try {        
        if (this.DOM.volumeSlider?.parentElement.matches(':hover')) {
            this.DOM.volumeSlider?.parentElement.classList.add("T_M_G-video-control-active")
            this.volumeActiveRestraint()
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    volumeActiveRestraint() {
    try {
        if (this.volumeActiveRestraintId) clearTimeout(this.volumeActiveRestraintId)
        this.volumeActiveRestraintId = setTimeout(() => this.DOM.volumeSlider?.parentElement.classList.remove("T_M_G-video-control-active"), this.settings.overlayRestraint)  
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }

    updateBrightnessSettings() {
    try {
        this.brightnessBoost = this.settings.maxBrightness > 100
        if (this.DOM.brightnessSlider) this.DOM.brightnessSlider.max = this.settings.maxBrightness
        this.videoBrightnessSliderPercent = Math.round((100 / this.settings.maxBrightness) * 100)
        this.videoMaxBrightnessRatio = this.maxBrightnessRatio = this.settings.maxBrightness / 100
        this.videoContainer.classList.toggle("T_M_G-video-brightness-boost", this.brightnessBoost)
        this._handleBrightnessChange()
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }

    set brightness(value) {
        this.videoBrightness = value
        this._handleBrightnessChange()
    }

    get brightness() {
        return parseInt(this.videoBrightness)
    }

    toggleDark(auto) {
    try {
        let brightness
        if (this.brightness) {
            this.lastBrightness = this.brightness
            this.shouldSetLastBrightness = true
            brightness = 0
        } else {
            brightness = this.shouldSetLastBrightness ? this.lastBrightness : this.brightness
            if (brightness === 0) brightness = auto === "auto" ? this.settings.brightnessSkip : this.brightnessSliderBrightness
            this.shouldSetLastBrightness = false
        }
        this.brightness = brightness
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    _handleBrightnessSliderInput({target: {value: brightness}}) {
    try {                
        this.brightness = brightness
        if (brightness > 5) this.brightnessSliderBrightness = brightness
        this.shouldSetLastBrightness = false
        this.brightnessActiveRestraint()            
        this.overlayRestraint() 
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }

    _handleAdvancedBrightnessSliderInput({percent, sign}) {
    try {
        let brightness = sign === "+" ? this.brightness + (percent * this.settings.maxBrightness) : this.brightness - (percent * this.settings.maxBrightness)
        brightness = window.tmg.clamp(0, Math.floor(brightness), this.settings.maxBrightness)
        this.brightness = brightness
        this.shouldSetLastBrightness = false
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }

    _handleBrightnessSliderMouseDown() {
        this.DOM.brightnessSlider?.classList.add("T_M_G-video-control-active")
    }

    _handleBrightnessSliderMouseUp() {
        this.DOM.brightnessSlider?.classList.remove("T_M_G-video-control-active")
    }    

    _handleBrightnessChange() {
    try {
        let brightness = this.brightness
        if (this.DOM.brightnessNotifierContent) this.DOM.brightnessNotifierContent.textContent = brightness + "%"
        let brightnessLevel = ""
        if (brightness == 0)
            brightnessLevel = "dark"
        else if (brightness < 50)
            brightnessLevel = "low" 
        else if (brightness <= 100) 
            brightnessLevel = "high"
        else if (brightness > 100)
            brightnessLevel = "boost"
        const brightnessPercent = (brightness - 0) / (this.settings.maxBrightness - 0)
        this.videoContainer.setAttribute("data-brightness-level", brightnessLevel)  
        if (this.DOM.brightnessSlider) this.DOM.brightnessSlider.value = brightness
        this.DOM.brightnessSlider?.setAttribute("data-brightness", brightness)
        if (this.DOM.touchBrightnessContent) this.DOM.touchBrightnessContent.textContent = brightness + "%"
        this.videoCurrentBrightnessValuePosition = `${12 + (brightnessPercent * 77)}%`
        if (this.brightnessBoost) {
            if (brightness <= 100) {
                this.videoBrightnessSliderBoostPercent = 0
                this.videoCurrentBrightnessSliderBoostPosition = 0
                this.videoCurrentBrightnessSliderPosition = (brightness - 0) / (100 - 0)
            } else if (brightness > 100) {
                this.DOM.brightnessBoostSign?.setAttribute("data-boost", Math.round(brightness / 10) / 10)
                this.videoBrightnessSliderBoostPercent = parseInt(this.videoBrightnessSliderPercent) + 10
                this.videoCurrentBrightnessSliderBoostPosition = (brightness - 100) / (this.settings.maxBrightness - 100)
            }
        } else this.videoCurrentBrightnessSliderPosition = brightnessPercent
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    changeBrightness(value) {
    try {
        const sign = Math.sign(value) === 1 ? "+" : "-"
        value = Math.abs(value)
        let brightness = this.shouldSetLastBrightness ? this.lastBrightness : this.brightness
        value = Math.abs(value)
        switch(sign) {
            case "-":
                if (brightness > 0) {
                    brightness -= (brightness%value) ? (brightness%value) : value 
                } 
                if (brightness === 0) {
                    this.fire("brightnessdark")
                    break
                }
                this.fire("brightnessdown")
                break
            default:
                if (brightness < this.settings.maxBrightness) {
                    brightness += (brightness%value) ? (value - brightness%value) : value 
                }
                this.fire("brightnessup")
                break                
        }
        if (this.shouldSetLastBrightness) {
            if (this.DOM.brightnessNotifierContent) this.DOM.brightnessNotifierContent.textContent = brightness + "%"
            this.lastBrightness = brightness
        } else this.brightness = brightness
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }

    _handleBrightnessContainerMouseMove() {
    try {        
        if (this.DOM.brightnessSlider?.parentElement.matches(':hover')) {
            this.DOM.brightnessSlider?.parentElement.classList.add("T_M_G-video-control-active")
            this.brightnessActiveRestraint()
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    brightnessActiveRestraint() {
    try {
        if (this.brightnessActiveRestraintId) clearTimeout(this.brightnessActiveRestraintId)
        this.brightnessActiveRestraintId = setTimeout(() => this.DOM.brightnessSlider?.parentElement.classList.remove("T_M_G-video-control-active"), this.settings.overlayRestraint)  
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }

    toggleTheaterMode() {
    try {
        if (this.settings.status.modes.theater) this.videoContainer.classList.toggle("T_M_G-video-theater")
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    async toggleFullScreenMode() {
    try {
        if (this.settings.status.modes.fullScreen) {
        if (!this.isModeActive("fullScreen")) {
        if (!window.tmg._CURRENT_FULL_SCREEN_PLAYER) {
            if (this.isModeActive("floatingPlayer")) {
                this.floatingPlayer?.addEventListener("pagehide", this.toggleFullScreenMode)
                this.floatingPlayer?.close()
                return
            }
            if (this.isModeActive("pictureInPicture")) document.exitPictureInPicture()
            if (this.isModeActive("miniPlayer")) this.toggleMiniPlayerMode(false, "instant")
            window.tmg._CURRENT_FULL_SCREEN_PLAYER = this
            if (this.videoContainer.requestFullscreen) await this.videoContainer.requestFullscreen()
			else if (this.videoContainer.mozRequestFullScreen) await this.videoContainer.mozRequestFullScreen()
			else if (this.videoContainer.webkitRequestFullScreen) await video.webkitRequestFullScreen() || await this.videoContainer.webkitRequestFullScreen()
			else if (this.videoContainer.msRequestFullscreen) await this.videoContainer.msRequestFullscreen()
            this.inFullScreen = true
        }
        } else {
            if (document.exitFullscreen) await document.exitFullscreen()
			else if (document.mozCancelFullScreen) await document.mozCancelFullScreen()
			else if (document.webkitCancelFullScreen) await document.webkitCancelFullScreen()
			else if (document.msExitFullscreen) await document.msExitFullscreen()
            this.inFullScreen = false
        }
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    async _handleFullScreenChange() {
    try {
        if (this.inFullScreen) {
            this.videoContainer.classList.add("T_M_G-video-full-screen")
            this.setAdvancedWheelListeners()
        }
        if (!this.inFullScreen || !window.tmg.queryFullScreen()) {
            this.videoContainer.classList.remove("T_M_G-video-full-screen")
            window.tmg._CURRENT_FULL_SCREEN_PLAYER = null
            this.inFullScreen = false
            this.removeAdvancedWheelListeners()
        }
        await this.autoLockFullScreenOrientation()
    } catch(e) {
        this._log(e, "error", "swallow")
    }            
    }   
    
    async autoLockFullScreenOrientation() {
    try {
        if (this.isModeActive("fullScreen")) {
            const lockOrientation = this.video.videoHeight > this.video.videoWidth ? "portrait" : "landscape"
            if (screen.orientation && screen.orientation.lock) await screen.orientation.lock(lockOrientation)
            this.DOM.fullScreenOrientationBtn.classList.remove("T_M_G-video-control-hidden")
        } else {
            if (screen.orientation && screen.orientation.lock) screen.orientation.unlock()
            this.DOM.fullScreenOrientationBtn.classList.add("T_M_G-video-control-hidden")
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }

    changeFullScreenOrientation() {
    try {
        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock(screen.orientation.angle === 0 ? "landscape" : "portrait").catch(e => this._log(e, "error", "swallow"))
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }                    
    }

    async togglePictureInPictureMode() {
    try {
        if (this.isModeActive("fullScreen")) await this.toggleFullScreenMode()
        if (this.settings.status.modes.pictureInPicture) {
        if (this.settings.status.beta.floatingPlayer) {
            if ("documentPictureInPicture" in window) {
                this.toggleFloatingPlayer()
                return
            }
        }
        if (!this.isModeActive("pictureInPicture")) this.video.requestPictureInPicture() 
        else document.exitPictureInPicture() 
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    } 

    _handleEnterPictureInPicture() {
    try {
        this.videoContainer.classList.add("T_M_G-video-picture-in-picture")
        this.showOverlay()
        this.toggleMiniPlayerMode(false)
        this.setMediaSession()
        window.tmg._PICTURE_IN_PICTURE_ACTIVE = true
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    _handleLeavePictureInPicture() {
    try {
        window.tmg._PICTURE_IN_PICTURE_ACTIVE = false
        //the video takes a while before it enters back into the player so a timeout is used to prevent the user from seeing the default ui
        setTimeout(() => {
            this.videoContainer.classList.remove("T_M_G-video-picture-in-picture")
            this.toggleMiniPlayerMode()
        }, 180)
        this.overlayRestraint()
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }    

    toggleFloatingPlayer() {
    try {
    if ("documentPictureInPicture" in window) {
        if (this.floatingPlayerActive) {
            this.floatingPlayer?.close()
        } else {
            this.initFloatingPlayer()
        }
    }
    } catch(e) {
        this._log(e, "error", "swallow")
    }    
    }

    async initFloatingPlayer() {
    try {
        if (!this.floatingPlayerActive) {
        if (window.documentPictureInPicture.window) window.documentPictureInPicture.window.close()
        this.toggleMiniPlayerMode(false)

        this.floatingPlayerActive = true
        this.floatingPlayerOptions = {
            width: 378,
            height: 199,
        }
        this.floatingPlayer = await window.documentPictureInPicture.requestWindow(this.floatingPlayerOptions)
        const style = document.createElement("style")
        style.textContent = Array.from(document.styleSheets)
        .flatMap(styleSheet => {
            try {
                return [...styleSheet.cssRules]
            } catch(e) {
                return []
            }
        })
        .filter(cssRule => cssRule.cssText.includes("T_M_G"))
        .flatMap(cssRule => cssRule.cssText).join("")
        this.floatingPlayer?.document.head.appendChild(style)

        this.pseudoVideoContainer.append(this.DOM.pictureInPictureWrapper.cloneNode(true))
        this.pseudoVideoContainer.querySelector(".T_M_G-video-picture-in-picture-active-icon-wrapper").addEventListener("click", this.toggleFloatingPlayer)
        this.activatePseudoMode()

        this.videoContainer.classList.add("T_M_G-video-progress-bar")
        this.videoContainer.classList.add("T_M_G-video-floating-player")
        this.floatingPlayer?.addEventListener("pagehide", this._handleFloatingPlayerClose)
        this.floatingPlayer?.document.body.append(this.videoContainer)
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }       
    }

    _handleFloatingPlayerClose() {
    try {
        if (this.floatingPlayerActive) {
        this.floatingPlayerActive = false
        this.videoContainer.classList.toggle("T_M_G-video-progress-bar", this.settings.progressBar)
        this.videoContainer.classList.remove("T_M_G-video-floating-player")

        this.deactivatePseudoMode()
        this.pseudoVideoContainer.querySelector(".T_M_G-video-picture-in-picture-wrapper").remove()

        this.toggleMiniPlayerMode()
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }  
    }    

    expandMiniPlayer() {
        this.toggleMiniPlayerMode(false, "instant")
    }

    cancelMiniPlayer() {
        if (!this.video.paused) this.togglePlay(false)
        this.toggleMiniPlayerMode(false)
    }

    toggleMiniPlayerMode(bool, behaviour) {
    try {
    if (this.settings.status.modes.miniPlayer) {
        if ((!this.isModeActive("miniPlayer") && !this.isModeActive("pictureInPicture") && !this.isModeActive("floatingPlayer") && !this.isModeActive("fullScreen") && !this.parentIntersecting && window.innerWidth >= this.settings.miniPlayerThreshold && !this.video.paused) || (bool === true && !this.isModeActive("miniPlayer"))) {
            this.activatePseudoMode()
            this.videoContainer.classList.add("T_M_G-video-progress-bar")
            this.videoContainer.classList.add("T_M_G-video-mini-player")
            this.videoContainer.addEventListener("mousedown", this.moveMiniPlayer)
            this.videoContainer.addEventListener("touchstart", this.moveMiniPlayer, {passive: false})
            return
        } 
        if ((this.isModeActive("miniPlayer") && this.parentIntersecting) || (this.isModeActive("miniPlayer") && window.innerWidth < this.settings.miniPlayerThreshold) || (bool === false && this.isModeActive("miniPlayer"))) {
            if (behaviour) 
            window.scrollTo({
                top: this.pseudoVideoContainer.parentNode.offsetTop - ((window.innerHeight / 2) - (this.pseudoVideoContainer.offsetHeight / 2)),
                left: 0,
                behavior: behaviour,
            })  
            this.deactivatePseudoMode()
            this.videoContainer.classList.toggle("T_M_G-video-progress-bar", this.settings.progressBar)
            this.videoContainer.classList.remove("T_M_G-video-mini-player")
            this.videoContainer.removeEventListener("mousedown", this.moveMiniPlayer)
            this.videoContainer.removeEventListener("touchstart", this.moveMiniPlayer, {passive: false})
        } 
    }
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }                                 

    moveMiniPlayer(e){
    try {
        if (this.isModeActive("miniPlayer")) {
        if (!this.DOM.videoControlsContainer.contains(e.target)) {
            document.addEventListener("mousemove", this._handleMiniPlayerPosition)
            document.addEventListener("mouseup", this.emptyMiniPlayerListeners)
            document.addEventListener("mouseleave", this.emptyMiniPlayerListeners)
            document.addEventListener("touchmove", this._handleMiniPlayerPosition, {passive: false})
            document.addEventListener("touchend", this.emptyMiniPlayerListeners, {passive: false})
        }
    }        
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }    

    emptyMiniPlayerListeners() {
    try {
        this.videoContainer.classList.remove("T_M_G-video-movement")
        this.showOverlay()
        document.removeEventListener("mousemove", this._handleMiniPlayerPosition)
        document.removeEventListener("mouseup", this.emptyMiniPlayerListeners)
        document.removeEventListener("mouseleave", this.emptyMiniPlayerListeners)
        document.removeEventListener("touchmove", this._handleMiniPlayerPosition, {passive: false})
        document.removeEventListener("touchend", this.emptyMiniPlayerListeners, {passive: false})
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }

    _handleMiniPlayerPosition(e) {
    try {
        if (e.touches?.length > 1) return 
        e.preventDefault()
        this.videoContainer.classList.remove("T_M_G-video-overlay")
	    this.videoContainer.classList.add("T_M_G-video-movement")

        if (this.miniPlayerThrottleId !== null) return
        this.miniPlayerThrottleId = setTimeout(() => this.miniPlayerThrottleId = null, this.miniPlayerThrottleDelay)

        let {innerWidth: ww, innerHeight: wh} = window,
        {offsetWidth: w, offsetHeight: h} = this.videoContainer
        const x = e.clientX ?? e.changedTouches[0].clientX,
        y = e.clientY ?? e.changedTouches[0].clientY,
        xR = 0,
        yR = 0,
        posX = window.tmg.clamp(xR, ww - x - w/2, ww - w - xR),
        posY = window.tmg.clamp(yR, wh - y - h/2, wh - h - yR)
        this.videoCurrentMiniPlayerX = `${Math.round(posX/ww * 100)}%`
        this.videoCurrentMiniPlayerY = `${Math.round(posY/wh * 100)}%`
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }    

    //Keyboard and General Accessibility Functions
    _handleClick({target}) {
    try {
	if (target === this.DOM.videoOverlayControlsContainer) {
        if (this.clickId) clearTimeout(this.clickId)
        this.clickId = setTimeout(() => {
	    if (window.tmg.queryMediaMobile() && !this.isModeActive("miniPlayer")) {
                if (!this.buffering && !this.isModeActive("pictureInPicture")) this.videoContainer.classList.toggle("T_M_G-video-overlay")
            } 
            if (window.tmg.queryMediaMobile() || this.isModeActive("miniPlayer")) return
            if (!(this.speedCheck && this.playTriggerCounter < 1))  {
                this.togglePlay()
                this.video.paused ? this.fire("videopause") : this.fire("videoplay")
            }
            this.showOverlay()
        }, 300)
        } 
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    _handleRightClick(e) {
    try {
        e.preventDefault()
    } catch(e) {
        this._log(e, "error", "swallow")
    }                
    }

    _handleDoubleClick({clientX: x, target, detail}) {
    try {
        //this function triggers the forward and backward skip, they then assign the function to the click event, when the trigger is pulled, skipPersist is set to true and the skip is handled by only the click event, if the position of the click changes within the skip interval and when the 'skipPosition' prop is still available, the click event assignment is revoked
        if (target === this.DOM.videoOverlayControlsContainer) {
        if (this.clickId) clearTimeout(this.clickId)
        const rect = this.videoContainer.getBoundingClientRect()
        let pos = ((x-rect.left) > (rect.width*0.65)) ? "right" : ((x-rect.left) < (rect.width*0.35)) ? "left" : "center"
        if (this.skipPersist && (pos !== this.skipPersistPosition)) {
            this.deactivateSkipPersist()
            if (detail == 1) return
        }
        if (pos === "center") {
            window.tmg.queryMediaMobile() || this.isModeActive("miniPlayer") ? this.togglePlay() : this.toggleFullScreenMode()
            return
        } else {
            if (this.skipPersist  && detail == 2) return
            this.activateSkipPersist(pos)
            pos === "right" ? this.skip(this.settings.timeSkip) : this.skip(-this.settings.timeSkip)
        }
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    activateSkipPersist(pos) {
    try {
        if (!this.skipPersist) {
        this.videoContainer.addEventListener("click", this._handleDoubleClick)
        this.skipPersist = true
        this.skipPersistPosition = pos
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }   
    }

    deactivateSkipPersist() {
    try {
        if (this.skipPersist) {
        this.videoContainer.removeEventListener("click", this._handleDoubleClick)
        this.skipPersist = false
        this.skipPersistPosition = null
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }   
    }

    _handleHoverPointerActive() {
    try {
        if (!(window.tmg.queryMediaMobile() && !this.isModeActive("miniPlayer"))) this.showOverlay()
    } catch(e) {
        this._log(e, "error", "swallow")
    }                    
    }

    _handleHoverPointerDown() {
    try {
        this.overlayRestraint()
    } catch(e) {
        this._log(e, "error", "swallow")
    }                
    }

    _handleHoverPointerOut() {
    try {
        if (!window.tmg.queryMediaMobile() && !this.videoContainer.matches(":hover")) this.removeOverlay()
    } catch(e) {
        this._log(e, "error", "swallow")
    }                    
    }

    showOverlay() {
    try {
        if (this.shouldShowOverlay()) {
            this.videoContainer.classList.add("T_M_G-video-overlay")
            this.overlayRestraint()
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    shouldShowOverlay() {
    try {
        return !this.videoContainer.classList.contains("T_M_G-video-movement")
    } catch(e) {
        this._log(e, "error", "swallow")        
    }
    }
    
    overlayRestraint() {
    try {        
        if (this.overlayRestraintId) clearTimeout(this.overlayRestraintId)
        if (this.shouldRemoveOverlay()) {
            this.overlayRestraintId = setTimeout(this.removeOverlay, this.settings.overlayRestraint)
        }
    } catch(e) {
        this._log(e, "error", "swallow")        
    }    
    }        

    shouldRemoveOverlay() {
    try {
        return !this.video.paused && !this.buffering && !this.isModeActive("pictureInPicture")
    } catch(e) {
        this._log(e, "error", "swallow")        
    }
    }

    removeOverlay() {
    try {
        if (this.shouldRemoveOverlay()) this.videoContainer.classList.remove("T_M_G-video-overlay")
    } catch(e) {
        this._log(e, "error", "swallow")
    }                    
    }

    setAdvancedWheelListeners() {
    try {
        window.addEventListener("wheel", this._handleAdvancedWheel, {passive: false})
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }

    removeAdvancedWheelListeners() {
    try {
        window.removeEventListener("wheel", this._handleAdvancedWheel, {passive: false})
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }

    _handleAdvancedWheel(e) {
    try {
        if (!this.advancedTouchXCheck && !this.advancedTouchYCheck && this.settings.status.beta.advancedControls && !this.speedCheck && !this.settingsView) {
            e.preventDefault()
            if (this.advancedWheelTimeoutId) clearTimeout(this.advancedWheelTimeoutId)
            else this._handleAdvancedWheelInit(e)
            this.advancedWheelTimeoutId = setTimeout(this._handleAdvancedWheelStop, 1000)
            this._handleAdvancedWheelMove(e)
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }

    _handleAdvancedWheelInit({clientX: x, clientY: y}) {
    try {
        this.advancedWheelZone = {
            x : x > this.videoContainer.offsetWidth/2 ? "right" : "left",
            y : y > this.videoContainer.offsetHeight/2 ? "bottom" : "top"
        }
        this.advancedWheelTimePercent = 0
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }

    _handleAdvancedWheelMove({deltaX, deltaY}) {
    try {
        if (deltaX) {
            this.advancedWheelXCheck = true
            this.DOM.touchVolumeNotifier?.classList.remove("T_M_G-video-control-active") 
            this.DOM.touchBrightnessNotifier?.classList.remove("T_M_G-video-control-active")
            this.DOM.touchTimelineNotifier.classList.add("T_M_G-video-control-active")
            const width = this.videoContainer.offsetWidth 
            let percent = -deltaX / (width*10)
            percent = this.advancedWheelTimePercent += percent
            const sign = Math.sign(percent) === 1 ? "+" : "-"
            percent = Math.abs(percent)
            this._handleAdvancedTimelineInput({percent, sign})
        } 
        if (deltaY) {
            this.advancedWheelYCheck = true
            this.DOM.touchTimelineNotifier?.classList.remove("T_M_G-video-control-active")
            this.advancedWheelZone?.x === "right" ? this.DOM.touchVolumeNotifier?.classList.add("T_M_G-video-control-active") : this.DOM.touchBrightnessNotifier?.classList.add("T_M_G-video-control-active")
            const sign = deltaY >= 0 ? "+" : "-"
            const height = this.advancedWheelZone?.x === "right" ? ((this.videoContainer.offsetHeight * 0.7) * this.maxVolumeRatio) : (this.videoContainer.offsetHeight * this.maxBrightnessRatio)
            const percent = window.tmg.clamp(0, Math.abs(deltaY),  height) / height
            this.advancedWheelZone?.x === "right" ? this._handleAdvancedVolumeSliderInput({percent, sign}) : this._handleAdvancedBrightnessSliderInput({percent, sign})
        } 
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    } 

    _handleAdvancedWheelStop() {
    try {
        this.advancedWheelTimeoutId = null
        if (this.advancedWheelYCheck) {
            this.advancedWheelYCheck = false
            this.removeOverlay()
            this.DOM.touchVolumeNotifier?.classList.remove("T_M_G-video-control-active") 
            this.DOM.touchBrightnessNotifier?.classList.remove("T_M_G-video-control-active")
        } 
        if (this.advancedWheelXCheck) {
            this.advancedWheelXCheck = false
            this.DOM.touchTimelineNotifier?.classList.remove("T_M_G-video-control-active")
            this.currentTime = this.advancedNextTime
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }    

    _handleAdvancedTouchStart(e) {
    try {
        if (e.touches?.length > 1) return 
        if (e.target === this.DOM.videoControlsContainer || e.target === this.DOM.videoOverlayControlsContainer) {
        if (this.settings.status.beta.advancedControls && !this.isModeActive("miniPlayer") && !this.speedCheck) {       
            this._handleAdvancedTouchEnd()
            this.lastAdvanedTouchX = e.clientX ?? e.targetTouches[0].clientX
	        this.lastAdvanedTouchY = e.clientY ?? e.targetTouches[0].clientY
            if (this.isModeActive("fullScreen")) {
                this.videoContainer.addEventListener("touchmove", this._handleAdvancedTouchInit, {once: true, passive: false})
            } else {
                //tm: if user moves finger before advanced touchmove listener is attached like during scrolling
                this.videoContainer.addEventListener("touchmove", this._handleAdvancedTouchEnd, {passive: true})
                this.advancedTouchTimeoutId = setTimeout(() => {
                    //tm:  removing listener since timeout reached and user is not scrolling
                    this.videoContainer.removeEventListener("touchmove", this._handleAdvancedTouchEnd, {passive: true})
                    this.videoContainer.addEventListener("touchmove", this._handleAdvancedTouchInit, {once: true, passive: false})
                }, this.advancedTouchThreshold)
            }
            this.videoContainer.addEventListener("touchend", this._handleAdvancedTouchEnd)
        }
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }               
    }

    _handleAdvancedTouchInit(e) {
    try {
        if (e.touches?.length > 1) return 
        if (this.settings.status.beta.advancedControls && !this.isModeActive("miniPlayer") && !this.speedCheck) {  
            e.preventDefault()
            const rect = this.videoContainer.getBoundingClientRect(),
            x = e.clientX ?? e.targetTouches[0].clientX,
            y = e.clientY ?? e.targetTouches[0].clientY
            this.advancedTouchZone = {
                x : x - rect.left > rect.width/2 ? "right" : "left",
                y : y - rect.left > rect.height/2 ? "bottom" : "top"
            }
            if (Math.abs(this.lastAdvanedTouchY - y) < 5) {
                this.advancedTouchXCheck = true
                this.videoContainer.addEventListener("touchmove", this._handleAdvancedTouchXMove, {passive: false})
                this.DOM.touchTimelineNotifier.classList.add("T_M_G-video-control-active")
            } else if (Math.abs(this.lastAdvanedTouchX - x) < 10) {
                this.advancedTouchYCheck = true
                this.videoContainer.addEventListener("touchmove", this._handleAdvancedTouchYMove, {passive: false})
                this.advancedTouchZone.x === "right" ? this.DOM.touchVolumeNotifier?.classList.add("T_M_G-video-control-active") : this.DOM.touchBrightnessNotifier?.classList.add("T_M_G-video-control-active")
            }
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }

    _handleAdvancedTouchXMove(e) {
    try {
        e.preventDefault()

        if (this.advancedTouchXMoveThrottleId !== null) return
        this.advancedTouchXMoveThrottleId = setTimeout(() => this.advancedTouchXMoveThrottleId = null, this.timelineThrottleDelay)

        const width = this.videoContainer.offsetWidth
        const x = e.clientX ?? e.targetTouches[0].clientX
        const deltaX = x - this.lastAdvanedTouchX
        const sign = deltaX >= 0 ? "+" : "-"
        const percent = window.tmg.clamp(0, Math.abs(deltaX), width) / width
        this._handleAdvancedTimelineInput({percent, sign})
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }

    _handleAdvancedTouchYMove(e) {
    try {
        e.preventDefault()

        if (this.advancedTouchYMoveThrottleId !== null) return
        this.advancedTouchYMoveThrottleId = setTimeout(() => this.advancedTouchYMoveThrottleId = null, this.timelineThrottleDelay)

        const height = this.advancedTouchZone?.x === "right" ? (this.videoContainer.offsetHeight * 0.7) * this.maxVolumeRatio : this.videoContainer.offsetHeight * this.maxBrightnessRatio
        const y = e.clientY ?? e.targetTouches[0].clientY
        const deltaY = y - this.lastAdvanedTouchY
        const sign = deltaY >= 0 ? "-" : "+"
        const percent = window.tmg.clamp(0, Math.abs(deltaY), height) / height
        this.lastAdvanedTouchY = y
        this.advancedTouchZone?.x === "right" ? this._handleAdvancedVolumeSliderInput({percent, sign}) : this._handleAdvancedBrightnessSliderInput({percent, sign})
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }

    _handleAdvancedTouchEnd() {
        if (this.advancedTouchXCheck) {
            this.advancedTouchXCheck = false
            this.videoContainer.removeEventListener("touchmove", this._handleAdvancedTouchXMove, {passive: false})
            this.DOM.touchTimelineNotifier?.classList.remove("T_M_G-video-control-active")
            this.video.currentTime = this.advancedNextTime
        } 
        if (this.advancedTouchYCheck) {
            this.advancedTouchYCheck = false
            this.removeOverlay()
            this.videoContainer.removeEventListener("touchmove", this._handleAdvancedTouchYMove, {passive: false})
            this.DOM.touchVolumeNotifier?.classList.remove("T_M_G-video-control-active")
            this.DOM.touchBrightnessNotifier?.classList.remove("T_M_G-video-control-active")
        }
        if (this.advancedTouchTimeoutId) {
            clearTimeout(this.advancedTouchTimeoutId)
            //tm:  removing listener since timeout reached and user is not scrolling
            this.videoContainer.removeEventListener("touchmove", this._handleAdvancedTouchEnd, {passive: true})
        }
        this.videoContainer.removeEventListener("touchmove", this._handleAdvancedTouchInit, {once: true, passive: false})
        this.videoContainer.removeEventListener("touchend", this._handleAdvancedTouchEnd)
    }

    _handleSpeedPointerDown(e) {
    try {
        if (e.target === this.DOM.videoControlsContainer || e.target === this.DOM.videoOverlayControlsContainer) {
        if (!this.isModeActive("miniPlayer")) {    
            //conditions to cancel the speed timeout
            //tm: if user moves finger before speedup is called like during scrolling
            this.videoContainer.addEventListener("touchmove", this._handleSpeedPointerUp, {passive: true})     
            this.videoContainer.addEventListener("mouseup", this._handleSpeedPointerUp)
            this.videoContainer.addEventListener("mouseleave", this._handleSpeedPointerOut)           
            this.videoContainer.addEventListener("touchend", this._handleSpeedPointerUp)
            if (this.speedTimeoutId) clearTimeout(this.speedTimeoutId)
            this.speedTimeoutId = setTimeout(() => {   
                //tm: removing listener since timeout reached and user is not scrolling
                this.videoContainer.removeEventListener("touchmove", this._handleSpeedPointerUp, {passive: true})   
                this.speedPointerCheck = true
                const x = e.clientX ?? e.targetTouches[0].clientX
                const rect = this.videoContainer.getBoundingClientRect()
                this.speedDirection = x - rect.left >= rect.width * 0.5 ? "forwards" : "backwards"  
                if (this.settings.status.beta.rewind) {
                this.videoContainer.addEventListener("mousemove", this._handleSpeedPointerMove)
                this.videoContainer.addEventListener("touchmove", this._handleSpeedPointerMove, {passive: true})
                }
                this.speedUp(this.speedDirection)
            }, this.speedUpThreshold)
        }
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }   

    _handleSpeedPointerOut(e) {
    try {
        if (!this.videoContainer.matches(":hover")) this._handleSpeedPointerUp(e)
    } catch(e) {
        this._log(e, "error", "swallow")
    }          
    }
    
    _handleSpeedPointerMove(e) {
    try {
        if (e.touches?.length > 1) return 
        if (this.speedThrottleId !== null) return
        this.speedThrottleId = setTimeout(() => this.speedThrottleId = null, this.speedThrottleDelay)
        
        const rect = this.videoContainer.getBoundingClientRect()
        const x = e.clientX ?? e.targetTouches[0].clientX
        const currPos = x - rect.left >= rect.width * 0.5 ? "forwards" : "backwards"
        if (currPos !== this.speedDirection) {
            this.speedDirection = currPos
            this.slowDown()
            this.speedUp(this.speedDirection)
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }
        
    _handleSpeedPointerUp() {
    try {
        this.videoContainer.removeEventListener("mouseup", this._handleSpeedPointerUp)
        this.videoContainer.removeEventListener("mouseleave", this._handleSpeedPointerOut)      
        this.videoContainer.removeEventListener("touchend", this._handleSpeedPointerUp)
        if (this.settings.status.beta.rewind) {
        this.videoContainer.removeEventListener("mousemove", this._handleSpeedPointerMove)
        this.videoContainer.removeEventListener("touchmove", this._handleSpeedPointerMove, {passive: true})
        }
        this.speedPointerCheck = false
        if (this.speedTimeoutId) {
            clearTimeout(this.speedTimeoutId)
            //tm: removing listener since timeout reached and user is not scrolling
            this.videoContainer.removeEventListener("touchmove", this._handleSpeedPointerUp, {passive: true}) 
        }
        if (this.speedCheck && this.playTriggerCounter < 1) this.slowDown()     
    } catch(e) {
        this._log(e, "error", "swallow")                   
    }
    }

    fetchKeyShortcuts() {
    try {
        const shortcuts = {}
        for (const key of Object.keys(window.tmg._DEFAULT_VIDEO_BUILD.settings.keyShortcuts)) {
            let mods = ""
            if (this.settings.ctrlKeys?.includes(String(key)))
                mods += "ctrl + "
            if (this.settings.altKeys?.includes(String(key)))
                mods += "alt + "
            if (this.settings.shiftKeys?.includes(String(key)))
                mods += "shift + "
            shortcuts[key] = this.settings.keyShortcuts[key]?.toString()?.toLowerCase()?.replace(/^(.+)$/, `(${mods}$1)`) ?? ""
        }
        return shortcuts
    } catch(e) {
        this._log(e, "error", "swallow")                   
    }
    }

    keyEventAllowed(e) {
    try {
        const key = e.key.toString().toLowerCase() 
        if (document.activeElement.tagName=== 'INPUT') return false
        if (this.isTimelineFocused)
            if (key.startsWith("arrow")) return false
        if (this.settings.keyShortcuts)
            for (const [shortcut, value] of Object.entries(this.settings.keyShortcuts)) {
                if (value === key) {
                if (this.settings.ctrlKeys?.includes(shortcut))
                    if (!e.ctrlKey) return false
                if (this.settings.shiftKeys?.includes(shortcut)) 
                    if (!e.shiftKey) return false
                if (this.settings.altKeys?.includes(shortcut)) 
                    if (!e.altKey) return false
                }
            }
        if (key === "i" && !this.settings.keyOverrides.includes(key))
            if (e.ctrlKey && e.shiftKey) return false
        if (this.settings.keyOverrides.includes(key)) e.preventDefault()
        return true
    } catch(e) {
        this._log(e, "error", "swallow")                   
    }
    }

    _handleKeyDown(e) {
    try {
        if (!this.keyEventAllowed(e)) return
        
        if (this.keyDownThrottleId !== null) return
        this.keyDownThrottleId = setTimeout(() => this.keyDownThrottleId = null, this.keyDownThrottleDelay)
        
        switch (e.key.toString().toLowerCase()) {
            case " ":
                if (document.activeElement.tagName === 'BUTTON') return
                e.preventDefault()
            case this.settings.keyShortcuts["playPause"]?.toString()?.toLowerCase():
                this.playTriggerCounter ++
                if (this.playTriggerCounter === 1) document.addEventListener("keyup", this._handlePlayTriggerUp)
                if (this.playTriggerCounter === 2 && !this.speedPointerCheck) e.shiftKey ? this.speedUp("backwards") : this.speedUp("forwards")
                break
            case this.settings.keyShortcuts["prev"]?.toString()?.toLowerCase():
                this.previousVideo()
                break
            case this.settings.keyShortcuts["next"]?.toString()?.toLowerCase():
                this.nextVideo()
                break    
            case this.settings.keyShortcuts["skipBwd"]?.toString()?.toLowerCase():
                this.deactivateSkipPersist()
                this.skip(-this.settings.timeSkip)
                this.fire("bwd")
                break
            case this.settings.keyShortcuts["skipFwd"]?.toString()?.toLowerCase():
                this.deactivateSkipPersist()
                this.skip(this.settings.timeSkip)
                this.fire("fwd")
                break
            case this.settings.keyShortcuts["volumeUp"]?.toString()?.toLowerCase():
                this.changeVolume(this.settings.volumeSkip)
                break
            case this.settings.keyShortcuts["volumeDown"]?.toString()?.toLowerCase():
                this.changeVolume(-this.settings.volumeSkip)
                break
            case this.settings.keyShortcuts["brightnessUp"]?.toString()?.toLowerCase():
                this.changeBrightness(this.settings.brightnessSkip)
                break
            case this.settings.keyShortcuts["brightnessDown"]?.toString()?.toLowerCase():
                this.changeBrightness(-this.settings.brightnessSkip)
                break
            case this.settings.keyShortcuts["playbackRateUp"]?.toString()?.toLowerCase(): 
                this.changePlaybackRate(this.settings.playbackRateSkip)
                break
            case this.settings.keyShortcuts["playbackRateDown"]?.toString()?.toLowerCase():      
                this.changePlaybackRate(-this.settings.playbackRateSkip)
                break                             
            case "arrowup":
                e.shiftKey ? this.changeVolume(10) : this.changeVolume(5)
                break
            case "arrowdown":
                e.shiftKey ? this.changeVolume(-10) : this.changeVolume(-5)
                break   
            case "arrowleft":
                this.deactivateSkipPersist()
                e.shiftKey ? this.skip(-10) : this.skip(-5)
                this.fire("bwd")
                break
            case "arrowright":
                this.deactivateSkipPersist()
                e.shiftKey ? this.skip(10) : this.skip(5)
                this.fire("fwd")
                break                            
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }        

    _handleKeyUp(e) {
    try {                    
        if (!this.keyEventAllowed(e)) return

        switch (e.key.toString().toLowerCase()) {                 
            case this.settings.keyShortcuts["objectFit"]?.toString()?.toLowerCase():
                if (!this.isModeActive("pictureInPicture"))
                this.toggleObjectFit()
                break                
            case this.settings.keyShortcuts["timeFormat"]?.toString()?.toLowerCase(): 
                this.changeTimeFormat()
                break
            case this.settings.keyShortcuts["mute"]?.toString()?.toLowerCase():
                this.toggleMute("auto")
                this.volume === 0 ? this.fire("volumemuted") : this.fire("volumeup")
                break  
            case this.settings.keyShortcuts["dark"]?.toString()?.toLowerCase():
                this.toggleDark("auto")
                this.brightness === 0 ? this.fire("brightnessdark") : this.fire("brightnessup")
                break           
            case this.settings.keyShortcuts["fullScreen"]?.toString()?.toLowerCase():
                this.toggleFullScreenMode()
                break
            case this.settings.keyShortcuts["theater"]?.toString()?.toLowerCase():
                if (!window.tmg.queryMediaMobile() && !this.isModeActive("fullScreen") && !this.isModeActive("miniPlayer") && !this.isModeActive("floatingPlayer")) this.toggleTheaterMode()
                break
            case this.settings.keyShortcuts["expandMiniPlayer"]?.toString()?.toLowerCase():
                if (this.isModeActive("miniPlayer")) 
                this.toggleMiniPlayerMode(false, "instant")
                break
            case this.settings.keyShortcuts["removeMiniPlayer"]?.toString()?.toLowerCase():
                if (this.isModeActive("miniPlayer")) this.toggleMiniPlayerMode(false) 
                break
            case this.settings.keyShortcuts["pictureInPicture"]?.toString()?.toLowerCase():
                if (this.settings.status.modes.pictureInPicture) this.togglePictureInPictureMode()
                break
            case this.settings.keyShortcuts["captions"]?.toString()?.toLowerCase():
                if (this.video.textTracks[this.textTrackIndex] && !this.isModeActive("pictureInPicture")) {
                this.toggleCaptions()
                this.fire("captions")
                }
                break
            case this.settings.keyShortcuts["settings"]?.toString()?.toLowerCase():
                this.toggleSettingsView() 
            break
            case "home":
            case "0":
                this.moveVideoTime({to: "start"})
                break
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                this.moveVideoTime({to: e.key, max: 9})
                break 
            case "end":
                this.moveVideoTime({to: "end"})
                break                
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    _handlePlayTriggerUp(e) {
    try {       
        switch (e.key.toString().toLowerCase()) {
            case " ":
            case this.settings.keyShortcuts["playPause"]?.toString()?.toLowerCase(): 
                e.stopImmediatePropagation()
                if (this.playTriggerCounter === 1) {
                    e.shiftKey ? this.replay() : this.togglePlay()
                    this.video.paused ? this.fire("videopause") : this.fire("videoplay") 
                }
            default:
                if (this.speedCheck && this.playTriggerCounter > 1 && !this.speedPointerCheck) this.slowDown()
                this.playTriggerCounter = 0
        }
        document.removeEventListener("keyup", this._handlePlayTriggerUp)
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }    

    _handleDragStart({target, dataTransfer}) {
    try {
        dataTransfer.effectAllowed = "move"
        target.classList.add("T_M_G-video-control-dragging")
        this.dragging = target.classList.contains("T_M_G-video-vb-btn") ? target.parentElement : target
    } catch(e) {
        this._log(e, "error", "swallow")
    }                
    }

    _handleDrag() {
    try {
        this.overlayRestraint()
    } catch(e) {
        this._log(e, "error", "swallow")
    }                
    }

    _handleDragEnd({target}) {
    try {
        this.showOverlay()
        target.classList.remove("T_M_G-video-control-dragging")
        this.dragging = null
        const leftSideStructure = this.settings.status.ui.leftSidedControls && this.DOM.leftSidedControlsWrapper.children ? Array.from(this.DOM.leftSidedControlsWrapper.children, el => el.dataset.controlId) : []
        const rightSideStructure = this.settings.status.ui.rightSidedControls && this.DOM.rightSidedControlsWrapper.children ? Array.from(this.DOM.rightSidedControlsWrapper.children, el => el.dataset.controlId) : []
        this.settings.controllerStructure = [].concat(leftSideStructure, ["spacer"], rightSideStructure)
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    _handleDragEnter({target}) {
    try {
        if (target.dataset.dropzone && this.dragging) {
            target.classList.add("T_M_G-video-dragover")
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }                
    }

    _handleDragOver(e) {
    try {
        if (e.target.dataset.dropzone && this.dragging) {
            e.preventDefault()

            if (this.dragOverThrottleId !== null) return
            this.dragOverThrottleId = setTimeout(() => this.dragOverThrottleId = null, this.dragOverThrottleDelay)

            e.dataTransfer.dropEffect = "move"
            const afterControl = this.getControlAfterDragging(e.target, e.clientX)
            if (afterControl) e.target.insertBefore(this.dragging, afterControl) 
            else e.target.appendChild(this.dragging)         
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }                
    }

    _handleDrop(e) {
    try {        
        if (e.target.dataset.dropzone) {
            e.preventDefault()
            e.target.classList.remove("T_M_G-video-dragover")
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }            
    }

    _handleDragLeave({target}) {
    try {
        if (target.dataset.dropzone) target.classList.remove("T_M_G-video-dragover")
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    getControlAfterDragging(container, x) {
        const draggableControls = [...container.querySelectorAll("[draggable=true]:not(.T_M_G-video-control-dragging, .T_M_G-video-vb-btn), .T_M_G-video-vb-container:has([draggable=true])")]

        return draggableControls.reduce((closest, child) => {
            const box = child.getBoundingClientRect()
            const offset = x - box.left - (box.width / 2)
            if (offset < 0 && offset > closest.offset) return {offset: offset, element: child}
            else return closest
        }, {offset: Number.NEGATIVE_INFINITY}).element
    }
}

class _T_M_G_Media_Player {
    #active
    #medium
    #build

    constructor(customOptions) {
        this.Player = null
        this.#build = window.tmg._DEFAULT_VIDEO_BUILD
        this.builder(customOptions)
    }
    
    get build() {
        return this.#build
    }   

    set build(customOptions) {
        this.builder(customOptions)
    }

    _initMedium(medium) {
        if (medium.tmgPlayer) medium.tmgPlayer.detach()
        medium.tmgPlayer = this
        this.#medium = medium
    }

    queryBuild() {
        if (this.#active) {
            console.error("TMG has already deployed the custom controls of your build configuration options")
            console.warn("Consider setting your build configuration before attaching your media element")
            return false
        } else return true
    }

    setVideoContainer(container) {
        if (this.queryBuild()) this.#build.videoContainer = container
    }

    builder(customOptions) {
        if (this.queryBuild()) {
        if (typeof customOptions === "object") {
            this.#build = {...this.#build, ...customOptions}
            //The general settings and nested key shortcuts can either take the value of false to signify that they are not wanted or they can be given the value of true to use all the defaults or they can use the values passed down in the parameter, any other value like null or undefined will also pass down the default values
            this.#build.settings = this.#build.settings !== false ? (this.#build.settings ?? false) || !(this.#build.settings === true) ? {...window.tmg._DEFAULT_VIDEO_BUILD.settings, ...this.#build.settings} : window.tmg._DEFAULT_VIDEO_BUILD.settings : false
            this.#build.settings.keyShortcuts = this.#build.settings.keyShortcuts !== false ? (this.#build.settings.keyShortcuts ?? false) || !(this.#build.settings.keyShortcuts !== true) ? {...window.tmg._DEFAULT_VIDEO_BUILD.settings.keyShortcuts, ...this.#build.settings.keyShortcuts} : window.tmg._DEFAULT_VIDEO_BUILD.settings.keyShortcuts : false
        }
        }
    }

    async attach(medium) {
        if (window.tmg.isIterable(medium)) {
            console.error("Please provide a single media element to the TMG media player")
            console.warn("Consider looping the iterable argument to get a single argument and instantiate a new 'window.tmg.Player' for each of them")
        } else if (!this.#active) { 
            if (medium.tmgPlayer) medium.tmgPlayer.detach()
            medium.tmgPlayer = this
            this.#medium = medium
            await this.fetchCustomOptions()
            await this.#deploy()
        }
    }

    detach() {
        if (this.#active) {
            this.Player?._destroy()
            if (window.tmg.Players.indexOf(this.Player) !== -1) window.tmg.Players?.splice(window.tmg.Players.indexOf(this.Player), 1)
            this.Player = null
            this.#active = false
        }
    }

    async fetchCustomOptions() {
        let fetchedControls
        if (this.#medium.getAttribute("tmg")?.includes('.json')) {
            fetchedControls = fetch(v.window.tmg.toString()).then(res => {
                if (!res.ok) throw new Error(`TMG could not find JSON file!. Status: ${res.status}`)
                return res.json()
            }).catch(({message}) => {
                console.error(`${message}`)
                console.warn("TMG requires a valid JSON file")
                fetchedControls = undefined
            })
        }
        const customOptions = await fetchedControls ??  {} 
        if (customOptions && Object.keys(customOptions).length === 0) {
            const attributes = this.#medium.getAttributeNames().filter(attr => attr.startsWith("tmg--"))
            const specialProps = ["tmg--media--artwork", "tmg--playlist"]
            attributes?.forEach(attr => {
                if (!specialProps.some(sp => attr.includes(sp))) window.tmg.putHTMLOptions(attr, customOptions, this.#medium)
            })
            if (this.#medium.poster || attributes.includes("tmg--media-artwork")) {
                customOptions.media ? customOptions.media.artwork = [{src: this.#medium.getAttribute("tmg--media-artwork") ?? this.#medium.poster}] : customOptions.media = {
                    artwork: [{src: this.#medium.getAttribute("tmg--media-artwork") ?? this.#medium.poster}]
                }
            }                
        }
        if (this.#active) {
            if (customOptions?.settings) 
                for (const [setting, value] of Object.entries(customOptions.settings)) {
                    this.Player.settings[setting] = value
                }
        } else this.builder(customOptions)
    }

    async #deploy() {
        if (!this.#active) {
        if (this.#medium.tagName === 'VIDEO') {
            this.#active = true
            this.#medium.controls = false
            this.#medium.setAttribute('tmgcontrols', "")
            this.#medium.classList.add("T_M_G-media")
            this.#medium.classList.add("T_M_G-video")
            //doing some cleanup to make sure no necessary settings were removed
            const settings = this.#build.settings.allowOverride ? {...this.#build.settings, ...window.tmg.userSettings} : this.#build.settings
            this.#build.video = this.#medium
            this.#build.mediaPlayer = 'TMG'
            this.#build.mediaType = 'video'
            
            //adjusting the video settings
            if (settings.playsInline) {
                this.#medium.setAttribute("playsinline", "")
                this.#medium.setAttribute("webkit-playsinline", "")
                this.#medium.playsinline = true
            } else settings.playsInline = this.#medium.playsinline
            if (settings.autoplay) this.#medium.autoplay = true
            else settings.autoplay = this.#medium.autoplay
            if (settings.loop) this.#medium.loop = true
            else settings.loop = this.#medium.loop
            if (settings.muted) this.#medium.muted = true
            else settings.muted = this.#medium.muted
            
            //making some changes to the build based on the state of the playlist
            if (this.#build.playlist) {
                const video = this.#build.playlist[0]
                if (video) {
                if (video.src) this.#build.src = video.src
                else if (video.sources?.length > 0) this.#build.sources = video.sources
                if (video.tracks?.length > 0) this.#build.tracks = video.tracks
                if (video.media) this.#build.media = {...this.#build.media, ...video.media}
                if (video.settings?.startTime) settings.startTime = video.settings.startTime
                if (video.settings?.endTime) settings.endTime = video.settings.endTime
                if (video.settings?.previewImages) settings.previewImages = video.settings.previewImages
                }
            }
            if (this.#build.src) {
                window.tmg.removeSources(this.#medium)
                this.#medium.src = this.#build.src
            } else if (this.#build.sources) {
                this.#medium.src = ""
                window.tmg.removeSources(this.#medium)
                window.tmg.addSources(this.#build.sources, this.#medium)
            }
            if (this.#build.tracks) {
                window.tmg.removeTracks(this.#medium)
                window.tmg.addTracks(this.#build.tracks, this.#medium)
            }
            //doing some more work setting boolean values to indicate the status of the player
            settings.status = {}
            //beta and override can either be a boolean or an array of all the features that the developer specifies, if it is a boolean, the boolean is assigned to all props else the specified features are assigned so if value is truthy then, the props will not be assigned a false value which was assigned above except explicitly stated
            settings.status.allowOverride = {}
            for (const key of Object.keys(settings)) {
                if (key != "allowOverride") settings.status.allowOverride[key] = false
            }
            settings.status.beta = {
                rewind: false,
                draggableControls: false,
                advancedControls: false,
                floatingPlayer: false
            }          
            if (settings.allowOverride) {
                if (settings.allowOverride === true) {
                    for (const key of Object.keys(settings.status.allowOverride)) { 
                        settings.status.allowOverride[key] = true
                    }
                } else {
                    for (const key of Object.keys(settings)) {
                        if (key != "allowOverride") settings.status.allowOverride[key] = settings.allowOverride.includes(key)
                    }
                }
            }
            if (settings.beta) {
                if (settings.beta === true) {
                    for (const key of Object.keys(settings.status.beta)) {
                        settings.status.beta[key] = true
                    }
                } else {
                    settings.status.beta = {
                        rewind: settings.beta.includes("rewind"),
                        draggableControls: settings.beta.includes("draggablecontrols"),
                        advancedControls: settings.beta.includes("advancedcontrols"),
                        floatingPlayer: settings.beta.includes("floatingplayer")
                    }
                }
            }
            settings.status.ui = {
                //notifiers would be in the UI if specified in the settings or if not specified but override is allowed
                notifiers: settings.notifiers || settings.status.allowOverride.notifiers,
                timeline: (/top|bottom/).test(settings.timelinePosition),
                prev: settings.controllerStructure.includes("prev"),
                playPause: settings.controllerStructure.includes("playpause"),
                next: settings.controllerStructure.includes("next"),
                objectFit: settings.controllerStructure.includes("objectfit"),
                volume: settings.controllerStructure.includes("volume"),
                brightness: settings.controllerStructure.includes("brightness"), 
                duration: settings.controllerStructure.includes("duration"),
                captions: settings.controllerStructure.includes("captions"),
                settings: settings.controllerStructure.includes("settings"),
                playbackRate: settings.controllerStructure.includes("playbackrate"),
                pictureInPicture: settings.controllerStructure.includes("pictureinpicture"),
                theater: settings.controllerStructure.includes("theater"),
                fullScreen: settings.controllerStructure.includes("fullscreen"),
                previewImages: settings.previewImages?.address && settings.previewImages?.fps ? true : false,
                leftSidedControls: settings.controllerStructure.indexOf("spacer") > -1 ? settings.controllerStructure.slice(0, settings.controllerStructure.indexOf("spacer")).length > 0 : false,
                rightSidedControls: settings.controllerStructure.indexOf("spacer") > -1 ? settings.controllerStructure.slice(settings.controllerStructure.indexOf("spacer") + 1).length > 0 : false,
                draggableControls: !!(settings.controllerStructure && settings.status.allowOverride.controllerStructure)
            }
            settings.status.modes = {
                fullScreen: settings.modes.includes("fullscreen") && window.tmg.supportsFullScreen(),
                theater: settings.modes.includes("theater"),
                pictureInPicture: settings.modes.includes("pictureinpicture") && window.tmg.supportsPictureInPicture(),
                miniPlayer: settings.modes.includes("miniplayer")
            }  
            //Updating the build settings after the cleanup and modifications
            this.#build.settings = {...window.tmg._DEFAULT_VIDEO_BUILD.settings, ...settings}
            this.#build.video = this.#medium
            //window.tmg.loadResource("/TMG_MEDIA_PROTOTYPE/prototype-2/drag-drop-touch-polyfill.js", "script")
            await window.tmg.loadResource("/TMG_MEDIA_PROTOTYPE/prototype-2/prototype-2-video.css")
            this.Player = new _T_M_G_Video_Player(this.#build)
            window.tmg.Players.push(this.Player)
            this.Player.fire("tmgready", this.#medium, {loaded: true})
        } else {
            console.error(`TMG could not deploy custom controls on the '${this.#medium.tagName}' element as it is not supported`)
            console.warn("TMG only supports the 'video' element currently")
        }
        }
    }
}

class tmg {
    static _DEFAULT_VIDEO_BUILD = {
        mediaPlayer: 'TMG',
        mediaType: 'video',
        activated: true,
        initialMode: "normal",
        initialState: true,
        debug: true,
        settings: {
            allowOverride: true,
            beta: ["rewind", "draggablecontrols", "advancedcontrols", "floatingplayer"],
            modes: ["normal", "fullscreen", "theater", "pictureinpicture", "miniplayer"],
            controllerStructure: ["prev", "playpause", "next", "brightness", "volume", "duration", "spacer", "captions", "settings", "objectfit", "pictureinpicture", "theater", "fullscreen"],
            timelinePosition: "bottom",
            timeFormat: "timeleft",
            startTime: null,
            endTime: null,
            timeSkip: 10,
            volumeSkip: 5,
            brightnessSkip: 5,
            playbackRateSkip: 0.25,
            maxBrightness: 150,
            maxVolume: 300,
            maxPlaybackRate: 16,
            notifiers: true,
            progressBar: false,
            persist: true,
            automove: true,
            automoveCountdown: 10,
            autocaptions: false,
            autoplay: false,
            loop: false,
            muted: false,
            playsInline: true,
            previewImages: false,
            overlayRestraint: 3000,
            miniPlayerThreshold: 240,
            keyOverrides: [" ", "arrowdown", "arrowup", "arrowleft", "arrowright", "home", "end"],
            shiftKeys: ["prev", "next"],
            ctrlKeys: [],
            altKeys: [],
            keyShortcuts: {
                prev: "p", 
                next: "n",
                playPause: "k",
                timeFormat: "q",
                skipBwd: "j",
                skipFwd: "l",
                mute: "m",
                dark: "b",
                volumeUp: "arrowup",
                volumeDown: "arrowdown",
                brightnessUp: "w",
                brightnessDown: "s",
                playbackRateUp: ">",
                playbackRateDown: "<",
                objectFit: "a",
                fullScreen: "f",
                theater: "t",
                expandMiniPlayer: "e",
                removeMiniPlayer: "r",
                pictureInPicture: "i",
                captions: "c",
                settings: "?"
            },
        },
    }
    static ALT_IMG_SRC = "/TMG_MEDIA_PROTOTYPE/assets/icons/movie-tape.png"
    static _STYLE_CACHE = {}
    static _SCRIPT_CACHE = {}
    static _AUDIO_CONTEXT = null
    static _CURRENT_AUDIO_GAIN_NODE = null
    static _CURRENT_FULL_SCREEN_PLAYER = null
    static _PICTURE_IN_PICTURE_ACTIVE = false
    static get userSettings() {
        if (localStorage._tmgUserVideoSettings) 
            return JSON.parse(localStorage._tmgUserVideoSettings)
        else return {}
    }
    static set userSettings(customSettings) {
        localStorage._tmgUserVideoSettings = JSON.stringify(customSettings)
    }
    static mountMedia() {
        Object.defineProperty(HTMLVideoElement.prototype, 'tmgcontrols', {
            get: function() {
                return (this.getAttribute("tmgcontrols") === null ? false : true)
            },
            set: function(value) {
                value ? this.setAttribute("tmgcontrols", "") : this.removeAttribute("tmgcontrols")
            },
            enumerable: true,
            configurable: true
        })
    }
    static unmountMedia() {
        delete HTMLVideoElement.tmgcontrols
    }
    static init() {
        window.tmg.mountMedia()
        for (const medium of document.querySelectorAll("video")) {
            window.tmg.initMedia(medium)
            window.tmg.mutationObserver.observe(medium, {attributes: true})
        }
        window.tmg.DOMMutationObserver.observe(document.documentElement, {childList: true, subtree: true})        
        window.addEventListener("resize", window.tmg._handleWindowResize)
        document.addEventListener("fullscreenchange", window.tmg._handleFullScreenChange)
        document.addEventListener("webkitfullscreenchange", window.tmg._handleFullScreenChange)
        document.addEventListener("mozfullscreenchange", window.tmg._handleFullScreenChange)
        document.addEventListener("msfullscreenchange", window.tmg._handleFullScreenChange)
        document.addEventListener("visibilitychange", window.tmg._handleVisibilityChange)
        window.tmg.launch()
    }
    static intersectionObserver = new IntersectionObserver(entries => {
        for (const {target, isIntersecting} of entries) {
            target.classList.contains("T_M_G-media") ? target.tmgPlayer?.Player?._handleMediaIntersectionChange(isIntersecting) : target.querySelector(".T_M_G-media").tmgPlayer?.Player?._handleMediaParentIntersectionChange(isIntersecting)
        }
    }, {root: null, rootMargin: '0px', threshold: 0})
    static mutationObserver = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            const video = mutation.target
            const player = video.tmgPlayer
            if (mutation.type === "attributes" && mutation.attributeName === "tmgcontrols") {
                video.hasAttribute("tmgcontrols") ? player.attach(video) : player.detach()
            } else if (mutation.type === "attributes" && mutation.attributeName.startsWith("tmg")) {
                if (video.hasAttribute(mutation.attributeName)) player.fetchCustomOptions()
            }
        }
    })
    static DOMMutationObserver = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if ((node.tagName === 'VIDEO') && !node.classList.contains("T_M_G-media")) {
                    window.tmg.initMedia(node)
                    window.tmg.mutationObserver.observe(node, {attributes: true})
                }
            }
            for (const node of mutation.removedNodes) {
                if ((node.tagName === 'VIDEO') && node.classList.contains("T_M_G-media") && !document.documentElement.contains(node)) {
                    node.tmgPlayer?.detach()
                    node.tmgPlayer = null
                }
            }
        }
    })
    static initMedia(media) {
        if (window.tmg.isIterable(media)) {
            for (const medium of media) {
                _initMedium(medium)
            }
        } else _initMedium(media)
        function _initMedium(medium) {
            if (!medium.tmgPlayer) {
                const player = new window.tmg.Player()
                player._initMedium(medium)
            }
        }
    }
    static _handleWindowResize() {
        window.tmg.Players?.forEach(Player => Player._handleWindowResize())
    }
    static _handleVisibilityChange() {
        window.tmg.Players?.forEach(Player => Player._handleVisibilityChange())
    }
    static _handleFullScreenChange() {
        window.tmg._CURRENT_FULL_SCREEN_PLAYER?._handleFullScreenChange()
    }
    static initializeAudioManager(bool = true) {
        if (!window.tmg._AUDIO_CONTEXT && bool) {
            window.tmg._AUDIO_CONTEXT = new (window.AudioContext || window.webkitAudioContext)()
            window.tmg.Players?.forEach(Player => Player.manageAudio())
            document.addEventListener("visiblitychange", () => document.visiblityState === "visible" ? window.tmg.resumeAudioManager() : window.tmg.suspendAudioManager())
        }
        document.removeEventListener("click", window.tmg.resumeAudioManager)
        document.addEventListener("click", window.tmg.resumeAudioManager)
        return !!window.tmg._AUDIO_CONTEXT
    }
    static connectMediaToAudioManager(medium) {
        medium.tmgSourceNode = medium.tmgSourceNode || window.tmg._AUDIO_CONTEXT.createMediaElementSource(medium)
        medium.tmgGainNode = medium.tmgGainNode || window.tmg._AUDIO_CONTEXT.createGain()
        medium.tmgSourceNode.connect(medium.tmgGainNode)
        if (!medium.paused) window.tmg.connectAudio(medium.tmgGainNode)
    }
    static connectAudio(gainNode) {
        if (gainNode && window.tmg._CURRENT_AUDIO_GAIN_NODE !== gainNode) {
            if (window.tmg._CURRENT_AUDIO_GAIN_NODE) window.tmg._CURRENT_AUDIO_GAIN_NODE.disconnect()
            window.tmg._CURRENT_AUDIO_GAIN_NODE = gainNode
            window.tmg._CURRENT_AUDIO_GAIN_NODE.connect(window.tmg._AUDIO_CONTEXT.destination)
        }
    }
    static resumeAudioManager() {
        if (window.tmg._AUDIO_CONTEXT === "suspended") window.tmg._AUDIO_CONTEXT.resume()
        if (!window.tmg._AUDIO_CONTEXT) window.tmg.initializeAudioManager()
    }
    static suspendAudioManager() {
        if (window.tmg._AUDIO_CONTEXT === "running") window.tmg._AUDIO_CONTEXT.suspend()
    }
    static loadResource(src, type) {
    switch (type) {
        case "script":
            window.tmg._SCRIPT_CACHE[src] = window.tmg._SCRIPT_CACHE[src] || new Promise(function (resolve, reject) {
                let script = document.createElement("script")
                script.src = src

                script.onload = () => resolve(script)
                script.onerror = () =>  reject(new Error(`Load error for TMG JavaScript file`))

                document.body.append(script)
            })

            return window.tmg._SCRIPT_CACHE[src]
        default:
            window.tmg._STYLE_CACHE[src] = window.tmg._STYLE_CACHE[src] || new Promise(function (resolve, reject) {
                let link = document.createElement("link")
                link.href = src
                link.rel = "stylesheet"
        
                link.onload = () => resolve(link)

                link.onerror = () =>  reject(new Error(`Load error for TMG CSSStylesheet`))
        
                document.head.append(link)
            })
        
            return window.tmg._STYLE_CACHE[src]
    }
    }
    static addSources(sources, medium) {
        const addSource = (source, medium) => {
            const sourceElement = document.createElement("source")
            window.tmg.putSourceDetails(source, sourceElement)
            medium.appendChild(sourceElement)
        }
        if (window.tmg.isIterable(sources)) 
            for (const source of sources) {
                addSource(source, medium)
            }
        else addSource(sources, medium)
    }
    static getSources(medium) {
        const sources = medium.querySelectorAll("source"),
        _sources = []
        for (const source of sources) {
            const obj = {} 
            window.tmg.putSourceDetails(source, obj)
            _sources.push(obj)
        }       
        return _sources 
    }
    static putSourceDetails(source, sourceElement) {
        if (source.src) sourceElement.src = source.src
        if (source.type) sourceElement.type = source.type
        if (source.media) sourceElement.media = source.media
    }
    static removeSources(medium) {
        medium.querySelectorAll("source")?.forEach(source => source.remove())
    }    
    static addTracks(tracks, medium) {
        const addTrack = (track, medium) => {
            const trackElement = document.createElement("track")
            window.tmg.putTrackDetails(track, trackElement)
            medium.appendChild(trackElement)
        }
        if (window.tmg.isIterable(tracks)) 
            for (const track of tracks) {
                addTrack(track, medium)
            }
        else addTrack(tracks, medium)
    }
    static getTracks(medium) {
        const tracks = medium.querySelectorAll("track[kind='captions'], track[kind='subtitles']"),
        _tracks = []
        for (const track of tracks) {
            const obj = {}
            window.tmg.putTrackDetails(track, obj)
            _tracks.push(obj)
        }
        return _tracks
    }
    static putTrackDetails(track, trackElement) {
        if (track.kind) trackElement.kind = track.kind
        if (track.label) trackElement.label = track.label
        if (track.srclang) trackElement.srclang = track.srclang
        if (track.src) trackElement.src = track.src
        if (track.default) trackElement.default = track.default
        if (track.id) trackElement.id = track.id
    }
    static removeTracks(medium) {
        medium.querySelectorAll("track")?.forEach(track => {
            if (track.kind == "subtitles" || track.kind == "captions") track.remove()
        })
    }
    static putHTMLOptions(attr, optionsObject, medium) {
        const prop = attr.replace("tmg--", "").replace(/(\w)(-)(\w)/g, match => `${match[0]}${match[2].toUpperCase()}`)
        const parts = prop.split("--")
        let currObj = optionsObject
        parts.forEach((part, index) => {
            if (!currObj[part]) {
                if (index === parts.length - 1) {
                    let value = medium.getAttribute(attr)
                    if (value.includes(",")) value = value.split(",")?.map(val => val.replace(/\s+/g, ""))
                    else if ((/^(true|false|null|\d+)$/).test(value)) value = JSON.parse(value)
                    currObj[part] = value
                } else currObj[part] = {}
            }
            currObj = currObj[part]
        })
    }
    static queryMediaMobile() {
        return window.matchMedia('(max-width: 480px), (max-width: 940px) and (max-height: 480px) and (orientation: landscape)').matches
    }
    static queryFullScreen() {
        return !!(document.fullscreenElement || document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement)
    }
    static queryPictureInPicture() {
        return document.pictureInPictureEnabled
    }
    static supportsFullScreen() {
        return !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullscreen || document.webkitFullscreenEnabled)
    }
    static supportsPictureInPicture() {
        return document.pictureInPictureEnabled
    }
    static clamp(min, amount, max) {
        return Math.min(Math.max(amount, min), max)
    }
    static formatTime(time) {
        if (!isNaN(time ?? NaN) && time !== Infinity) {
            const seconds = Math.floor(time % 60)
            const minutes = Math.floor(time / 60) % 60
            const hours = Math.floor(time / 3600)
            if (hours === 0) return `${minutes}:${window.tmg.leadingZeroFormatter.format(seconds)}`
            else return `${hours}:${window.tmg.leadingZeroFormatter.format(minutes)}:${window.tmg.leadingZeroFormatter.format(seconds)}`
        } else return '-:--'
    }
    static formatNumber(number) {
        if (!isNaN(number ?? NaN) && number !== Infinity) return number
        else return 0
    }
    static formatCSSTime(time) {
        return time.endsWith("ms") ? Number(time.replace("ms", "")) : Number(time.replace("s", "")) * 1000
    }
    static leadingZeroFormatter = new Intl.NumberFormat(undefined, {minimumIntegerDigits: 2})
    static isIterable(obj) { 
        return obj !== null && obj !== undefined && typeof obj[Symbol.iterator] === 'function'
    }
    static camelizeString(str) {  
        return str.toLowerCase().replace(/^\w|\b\w/g, (match, index) => index === 0 ? match.toLowerCase() : match.toUpperCase()).replace(/\s+/g, "")  
    }
    static uncamelizeString(str, separator) {
        return str.replace(/(?:[a-z])(?:[A-Z])/g, match => `${match[0]}${separator ?? " "}${match[1].toLowerCase()}`)
    }
    static getRenderedBox(elem) {
        function getResourceDimensions(source) {
            if (source.videoWidth) {
                return { width: source.videoWidth, height: source.videoHeight }
            }
            return null
        }
        function parsePositionAsPx(str, bboxSize, objectSize) {
            const num = parseFloat(str)
            if (str.endsWith("%")) {
                const ratio = num / 100
                return (bboxSize * ratio) - (objectSize * ratio)
            }
            return num
        }
        function parseObjectPosition(position, bbox, object) {
            const [left, top] = position.split(" ")
            return {
                left: parsePositionAsPx(left, bbox.width, object.width),
                top:  parsePositionAsPx(top, bbox.height, object.height)
            }
        }        
        let { objectFit, objectPosition } = getComputedStyle(elem)
        const bbox   = elem.getBoundingClientRect()
        const object = getResourceDimensions(elem)
    
        if (!object) return null

        if (objectFit === "scale-down") {
            objectFit = (bbox.width < object.width || bbox.height < object.height) ? "contain" : "none"
        }
        if (objectFit === "none") {
            const { left, top } = parseObjectPosition(objectPosition, bbox, object)
            return { left, top, ...object }
        }
        if (objectFit === "contain") {
            const objectRatio = object.height / object.width
            const bboxRatio   = bbox.height / bbox.width
            const width  = bboxRatio > objectRatio ? bbox.width : bbox.height / objectRatio
            const height = bboxRatio > objectRatio ? bbox.width * objectRatio : bbox.height
            const {left, top} = parseObjectPosition(objectPosition, bbox, {width, height})
            return { left, top, width, height }
        }
        if (objectFit === "fill") {
            // Relative positioning is discarded with `object-fit: fill`,
            // so we need to check here if it's relative or not
            const {left, top} = parseObjectPosition(objectPosition, bbox, object)
            return {
                left: objectPosition.split(" ")[0].endsWith("%") ? 0 : left,
                top: objectPosition.split(" ")[1].endsWith("%") ? 0 : top,
                width: bbox.width,
                height: bbox.height,
            }
        }
        if (objectFit === "cover") {
            const minRatio = Math.min(bbox.width / object.width, bbox.height / object.height)
            let width = object.width  * minRatio
            let height = object.height * minRatio
            let outRatio = 1
            if (width < bbox.width) outRatio = bbox.width / width
            if (Math.abs(outRatio - 1) < 1e-14 && height < bbox.height) outRatio = bbox.height / height
            width  *= outRatio
            height *= outRatio
            const { left, top } = parseObjectPosition(objectPosition, bbox, {width, height})
            return { left, top, width, height }
        }
    }
    //a wild card for deploying TMG controls to available media, returns a promise that resolves with an array referencing the media
    static async launch(medium) {
        if (arguments.length === 0) {
            const media = document.querySelectorAll("[tmgcontrols]")    
            let promises = []
            if (media) {
                for (const medium of media) {
                    promises.push(window.tmg.launch(medium))
                }
                return Promise.all(promises)
            }
        } else {
            return (async function buildPlayers() {
                const player = medium.tmgPlayer
                await player.attach(medium)
                return player.Player
            })()
        }
    }
    //REFERENCES TO ALL THE DEPLOYED TMG MEDIA PLAYERS
    static Players = []
    //THE TMG MEDIA PLAYER BUILDER CLASS
    static Player = _T_M_G_Media_Player
}

if (typeof window === "undefined") {
    console.error("TMG Media Player cannot run in a terminal!")
    console.warn("Consider moving to a browser environment to use the TMG Media Player")
} else {
    window.tmg = tmg
    window.tmg.init()
}
