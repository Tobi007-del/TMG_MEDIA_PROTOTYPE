"use strict"
/* 
TODO: 
    editable settings: shortcut, beta, keyshortcuts, notifiers, progressbar, controllerStructure
*/

//running a runtime environment check
typeof window !== "undefined" ? console.log("%cTMG Media Player Available", "color: green") : console.log("TMG Media Player Unavailable")

//The TMG Video Player Class
class _T_M_G_Video_Player {
    #playlist
    //Custom Log Handling
    _log(message, type, action) {
        switch (type) {
            case "error":
                if (this.debug) action === "swallow" ? console.warn(`TMG silenced a rendering error:`, message) : console.error(`TMG rendering error:`, message)
            break
            default:
                if (this.debug) console.log(message)
        }
    }

    //fetching all css varibles from the stylesheet for easy accessibility
    initCSSVariablesManager(videoContainer) {
        this.cssVariableMatcher = {}
        Array.from(document.styleSheets)
        .flatMap(styleSheet => {
            try {
                return [...styleSheet.cssRules]
            } catch (error) {
                return []
            }
        })
        .filter(cssRule => cssRule instanceof CSSStyleRule && (cssRule.selectorText === ":root" || cssRule.selectorText === ":where(:root)"))
        .flatMap(cssRule => [...cssRule.style])
        .filter(style => style.startsWith("--T_M_G-video-"))
        .forEach(variable => {
            const field = tmg.camelize(variable.replace("--T_M_G-", "").replaceAll("-", " "))
            this.CSSCustomPropertiesCache[field] = getComputedStyle(videoContainer).getPropertyValue(variable)  
            Object.defineProperty(this, field, {  
                get() {  
                    return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue(variable)
                },  
                set(value) {  
                    this.ui.dom.videoContainer.style.setProperty(variable, value)  
                },  
                enumerable: true,  
                configurable: true  
            })  
        })
    }

    //using this method as some form of pseudo constructor to build the video player when the build options is compiled
    buildVideoPlayer(videoOptions) {
    try {
        //The playlist property is a dynamic property so anytime it is updated, the button states have to be refreshed
        Object.defineProperty(this, "playlist", {
            get() {
                return this.#playlist
            },
            set(value) {
                this.#playlist = value
                this.currentPlaylistIndex = this.currentPlaylistIndex ? this.currentPlaylistIndex : 0
                if (this.video) this.setPlaylistBtnsState()
            }, 
            enumerable: true,
            configurable: true
        })
        //merging the video build with the Video Player Instance
        Object.entries(videoOptions).forEach(([key, value]) => this[key] = value)
        this._log(videoOptions)
        //inititalizing settings manager
        this.initSettingsManager(videoOptions.settings)
        //some general variables
        this.loaded = false
        this.CSSCustomPropertiesCache = {}
        this.currentPlaylistIndex = this.#playlist ? 0 : null
        this.wasPaused = !this.video.autoplay
        this.miniPlayerInMotion = false
        this.miniPlayerThrottleId = null
        this.miniPlayerThrottleDelay = 16
        this.previousRate = this.video.playbackRate
        this.isScrubbing = false
        this.parentIntersecting = true
        this.isIntersecting = true
        this.isTimelineFocused = false
        this.buffering = false
        this.playId 
        this.overlayRestraintId
        this.timelineThrottleId = null
        this.timelineThrottleDelay = 33
        this.lastVolume
        this.lastVolumeTimeoutId
        this.volumeActiveId 
        this.volumeActiveRestraintId
        this.playTriggerCounter = 0
        this.speedUpThreshold = 1000
        this.speedPointerCheck = false
        this.speedCheck = false
        this.speedToken
        this.speedTimeoutId
        this.speedIntervalId
        this.speedVideoTime
        this.speedPosition
        this.speedThrottleId = null
        this.speedThrottleDelay = 500
        this.skipVideoTime
        this.skipDurationId = null
        this.skipDuration = 0
        this.skipTime = 5
        this.dbcSkipTime = 10
        this.currentNotifier
        this.overlayRestraintTime = 3000
        this.transitionId        
        this.dragging  
        this.keyOverrideRegex = /(arrow|home|end)/i
        this.settingsView = false
        this.textTrackIndex = 0
        this.autoMovePlaylistActive = false
        this.autoPlaylistCountdown = 10
        this.aspectRatio = null
        this.pseudoVideo = document.createElement("video")
        this.pseudoVideo.classList.add("T_M_G-pseudo-video")
        this.previewCanvas = document.createElement("canvas")
        this.previewContext = this.previewCanvas.getContext("2d")
        this.pseudoVideoContainer = document.createElement("div")
        this.pseudoVideoContainer.classList.add("T_M_G-pseudo-video-container")
        this.pseudoVideoContainer.append(this.pseudoVideo)

        //Binding methods so they don't lose context of the media player instance
        //Binding Handlers
        this._log = this._log.bind(this)
        this._handleWindowResize = this._handleWindowResize.bind(this)
        this._handleVisibilityChange = this._handleVisibilityChange.bind(this)
        this._handleFullScreenChange = this._handleFullScreenChange.bind(this)
        this._handleFullScreenChange = this._handleFullScreenChange.bind(this)
        this._handleKeyDown = this._handleKeyDown.bind(this)
        this._handleKeyUp = this._handleKeyUp.bind(this)
        this._handlePlayTriggerUp = this._handlePlayTriggerUp.bind(this)
        this._handleSettingsKeyUp = this._handleSettingsKeyUp.bind(this)
        this._handlePlay = this._handlePlay.bind(this)
        this._handlePause = this._handlePause.bind(this)
        this._handleBufferStart = this._handleBufferStart.bind(this)
        this._handleBufferStop = this._handleBufferStop.bind(this)
        this._handlePlaybackChange = this._handlePlaybackChange.bind(this)
        this._handleTimeUpdate = this._handleTimeUpdate.bind(this)
        this._handleVolumeChange = this._handleVolumeChange.bind(this)
        this._handleLoadedError = this._handleLoadedError.bind(this)
        this._handleLoadedProgress = this._handleLoadedProgress.bind(this)
        this._handleLoadedMetadata = this._handleLoadedMetadata.bind(this)
        this._handleLoadedData = this._handleLoadedData.bind(this)
        this._handleEnded = this._handleEnded.bind(this)
        this._handleHoverPointerMove = this._handleHoverPointerMove.bind(this)
        this._handleHoverPointerDown = this._handleHoverPointerDown.bind(this)
        this._handleHoverPointerOut = this._handleHoverPointerOut.bind(this)
        this._handlePointerDown = this._handlePointerDown.bind(this)
        this._handleSpeedPointerOut = this._handleSpeedPointerOut.bind(this)
        this._handleSpeedPointerUp = this._handleSpeedPointerUp.bind(this)
        this._handleSpeedPointerMove = this._handleSpeedPointerMove.bind(this)
        this._handleRightClick = this._handleRightClick.bind(this)
        this._handleClick = this._handleClick.bind(this)
        this._handleDoubleClick = this._handleDoubleClick.bind(this)
        this._handleEnterPictureInPicture = this._handleEnterPictureInPicture.bind(this)
        this._handleLeavePictureInPicture = this._handleLeavePictureInPicture.bind(this)
        this._handleTimelineScrubbing = this._handleTimelineScrubbing.bind(this)
        this._handleTimelineUpdate = this._handleTimelineUpdate.bind(this)
        this._handleTimelineFocus = this._handleTimelineFocus.bind(this)
        this._handleTimelineBlur = this._handleTimelineBlur.bind(this)
        this._handleTimelineKeyDown = this._handleTimelineKeyDown.bind(this)
        this._handleVolumeSliderInput = this._handleVolumeSliderInput.bind(this)
        this._handleVolumeSliderMouseDown = this._handleVolumeSliderMouseDown.bind(this)
        this._handleVolumeSliderMouseUp = this._handleVolumeSliderMouseUp.bind(this)
        this._handleVolumeContainerMouseMove = this._handleVolumeContainerMouseMove.bind(this)
        this._handleVolumeContainerMouseUp = this._handleVolumeContainerMouseUp.bind(this)
        this._handleImgBreak = this._handleImgBreak.bind(this)
        this._handleMiniPlayerPosition = this._handleMiniPlayerPosition.bind(this)
        this._handleDragStart = this._handleDragStart.bind(this)
        this._handleDrag = this._handleDrag.bind(this)
        this._handleDragEnd = this._handleDragEnd.bind(this)
        this._handleDragEnter = this._handleDragEnter.bind(this)
        this._handleDragOver = this._handleDragOver.bind(this)
        this._handleDrop = this._handleDrop.bind(this)
        this._handleDragLeave = this._handleDragLeave.bind(this)
        //Binding Performers
        this.enableFocusableControls = this.enableFocusableControls.bind(this)
        this.disableFocusableControls = this.disableFocusableControls.bind(this)
        this.previousVideo = this.previousVideo.bind(this)
        this.nextVideo = this.nextVideo.bind(this)
        this.togglePlay = this.togglePlay.bind(this)
        this.showVideoOverlay = this.showVideoOverlay.bind(this)
        this.showPreviewImages = this.showPreviewImages.bind(this)
        this.hidePreviewImages = this.hidePreviewImages.bind(this)
        this.stopTimelineScrubbing = this.stopTimelineScrubbing.bind(this)
        this.changePlaybackRate = this.changePlaybackRate.bind(this)
        this.toggleCaptions = this.toggleCaptions.bind(this)
        this.toggleMute = this.toggleMute.bind(this)
        this.toggleTheaterMode = this.toggleTheaterMode.bind(this)
        this.toggleFullScreenMode = this.toggleFullScreenMode.bind(this)
        this.togglePictureInPictureMode = this.togglePictureInPictureMode.bind(this)
        this.changeFullScreenOrientation = this.changeFullScreenOrientation.bind(this)
        this.expandMiniPlayer = this.expandMiniPlayer.bind(this)
        this.cancelMiniPlayer = this.cancelMiniPlayer.bind(this)
        this.moveMiniPlayer = this.moveMiniPlayer.bind(this)
        this.emptyMiniPlayerListeners = this.emptyMiniPlayerListeners.bind(this)
        this.speedUp = this.speedUp.bind(this)
        this.slowDown = this.slowDown.bind(this)
        this.rewindVideo = this.rewindVideo.bind(this)
        this.rewindReset = this.rewindReset.bind(this)
        this.toggleSettingsView = this.toggleSettingsView.bind(this)
        this.enterSettingsView = this.enterSettingsView.bind(this)
        this.leaveSettingsView = this.leaveSettingsView.bind(this)
        this.initializeVideoControls = this.initializeVideoControls.bind(this)

        //custom events for otifying user
        this.notifierEvents = this.settings.status.ui.notifiers ? ["videoplay","videopause","volumeup","volumedown","volumemuted","captions","playbackratechange","theater","fullScreen","fwd","bwd"] : null
        this.notify = this.settings.status.ui.notifiers ? {
            self: null,
            init: function(self) {
            if (self.settings.notifiers) {
                this.self = self
                this.resetNotifiers = this.resetNotifiers.bind(this)
                for(const notifier of this.self.ui.dom.notifiersContainer?.children) {
                    notifier.addEventListener('transitionend', this.resetNotifiers)
                }
                for (const event of this.self.notifierEvents) {
                    this.self.ui.dom.notifiersContainer?.addEventListener(event, this)
                }
            }
            },
    
            handleEvent: function(e) {
            if (this.self.settings.notifiers) {
                const transitionTime = e.type === "fwd" || e.type === "bwd" ? Number(this.self.videoArrowsTransitionTime.replace('ms', '')) + 10 : Number(this.self.videoTransitionTime.replace('ms', '')) + 10
                if (this.self.transitionId) clearTimeout(this.self.transitionId)
                this.self.ui.dom.notifiersContainer.dataset.currentNotifier = e.type
                this.self.transitionId = setTimeout(this.resetNotifiers.bind(this), transitionTime)
            }
            },
    
            resetNotifiers: function() {
                this.self.ui.dom.notifiersContainer.dataset.currentNotifier = ''
            }
        } : null
        //Intersection Observer Setup to watch the vieo
        this.observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.target !== this.video) {
                    this.parentIntersecting = entry.isIntersecting
                    this.toggleMiniPlayerMode()
                } else {
                    this.isIntersecting = entry.isIntersecting
                    this.isIntersecting && !this.settingsView ? this.setKeyEventListeners() : this.removeKeyEventListeners()
                }
            })
        }, {root: null, rootMargin: '0px', threshold: 0})           

        //the code block below is used during build process
        const videoContainer = document.querySelector(".build.container >  .T_M_G-video-container")
        if (videoContainer) {
        this.initCSSVariablesManager(videoContainer)
        this.retrieveVideoPlayerDOM(videoContainer)
        this.initializeVideoPlayer()
        return
        }

        //building the Video Player interface
        this.buildVideoPlayerInterface()
    } catch(e) {
        this._log(e, "error", "swallow")
    }                        
    }

    //firing custom events
    fire(eventName, el = this.ui.dom.notifiersContainer, detail=null, bubbles=true, cancellable=true) {
    try {
        let evt = new CustomEvent(eventName, {detail, bubbles, cancellable})
        el.dispatchEvent(evt)
    } catch(e) {
        this._log(e, "error", "swallow")
    }                        
    }

    //settings 
    initSettingsManager() {
    try {
        this._log("TMG Video Settings Manager started")
    } catch(e) {
        this._log(e, "error", "swallow")
    }                        
    }

    toggleSettingsView() {
    try {
        this.settingsView = this.ui.dom.videoContainer.classList.contains("T_M_G-video-settings-view")
        !this.settingsView ? this.enterSettingsView() : this.leaveSettingsView()
    } catch(e) {
        this._log(e, "error", "swallow")
    }                        
    }

    enterSettingsView() {
    try {
        this.ui.dom.settingsCloseBtn.focus()
        this.wasPaused = this.video.paused
        if (!this.wasPaused) this.togglePlay(false)
        this.ui.dom.videoContainer.classList.add("T_M_G-video-settings-view")
        this.removeKeyEventListeners()
        this.disableFocusableControls()
        document.addEventListener("keyup", this._handleSettingsKeyUp) 
    } catch(e) {
        this._log(e, "error", "swallow")
    }                    
    }

    _handleSettingsKeyUp(e) {
    try {
        if (document.activeElement.tagName.toLowerCase() === "input") return
        switch (e.key.toString().toLowerCase()) {
            case this.settings.keyShortcuts["settings"]?.toString()?.toLowerCase():     
                this.leaveSettingsView()
                break
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }

    leaveSettingsView() {
    try {
        this.ui.dom.settingsCloseBtn.blur()
        if (!this.wasPaused) this.togglePlay(true) 
        this.ui.dom.videoContainer.classList.remove("T_M_G-video-settings-view")
        this.setKeyEventListeners()
        this.enableFocusableControls()
        document.removeEventListener("keyup", this._handleSettingsKeyUp)
    } catch(e) {
        this._log(e, "error", "swallow")
    }                        
    }

    //getting current video frame
    getCurrentVideoFrame(type) {
    try {
        this.pseudoVideo.currentTime = this.video.currentTime
        this.previewCanvas.width = this.video.videoWidth
        this.previewCanvas.height = this.video.videoHeight
        this.previewContext.drawImage(this.pseudoVideo, 0, 0, this.previewCanvas.width, this.previewCanvas.height)
        if (type === "monochrome") this.convertToMonoChrome(this.previewCanvas)
        return this.previewCanvas.toDataURL("image/png")
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

    //prevent broken images
    _handleImgBreak(e) {
    try {
        e.target.src = tmg.altImgSrc
    } catch(e) {
        this._log(e, "error", "swallow")
    }                        
    }
    
    //dom builder and retreiver functions
    buildVideoPlayerInterface(videoContainer) {
    try {
        if (this.initialState)             
            if (this.media?.artwork) 
                if (this.media.artwork[0]?.src) 
                    this.video.poster = this.media.artwork[0]?.src
        videoContainer = videoContainer ?? document.createElement('div')
        videoContainer.classList.add("T_M_G-video-container")
        if (!this.video.autoplay) videoContainer.classList.add("T_M_G-video-paused")
        if (this.initialState) videoContainer.classList.add("T_M_G-video-initial")
        if (this.initialMode) {
            if (tmg.modeMatcher[this.initialMode]) videoContainer.classList.add(`T_M_G-video-${tmg.modeMatcher[this.initialMode]}`)
        }
        if (this.settings.status.ui.timeline) videoContainer.setAttribute("data-timeline-position", `${this.settings.controllerStructure.find(c => c.startsWith("timeline"))?.replace("timeline", "").toLowerCase()}`)
        if (this.settings.progressBar) videoContainer.setAttribute("data-progress-bar", this.settings.progressBar)
        if (this.settings.previewImages === false) videoContainer.setAttribute("data-previews", false) 
        this.video.parentElement.insertBefore(videoContainer, this.video)
    
        //building HTML for the Video Player
        videoContainer.innerHTML += 
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
        `    

        //appending the video to the controller
        videoContainer.querySelector(".T_M_G-video-container-content").append(this.video)    
        //getting all the CSS custom variables and storing them for caching and editing so they can be available quickly
        this.initCSSVariablesManager(videoContainer)
        this.buildVideoControllerStructure(videoContainer)
        this.retrieveVideoPlayerDOM(videoContainer)
        this.initializeVideoPlayer()
    } catch(e) {
        this._log(e, "error", "swallow")
    }                        
    }

    buildVideoControllerStructure(videoContainer) {  
    try {   
        const controllerStructure = this.settings.controllerStructure.filter(c => !c.startsWith("timeline")),
        spacerIndex = controllerStructure.indexOf("spacer"),
        leftSidedControls = spacerIndex > -1 ? controllerStructure.slice(0, spacerIndex) : controllerStructure,
        rightSidedControls = spacerIndex > -1 ? controllerStructure.slice(spacerIndex + 1) : null
    
        //breaking HTML into smaller units to use as building blocks
        const overlayControlsContainerBuild = videoContainer.querySelector(".T_M_G-video-overlay-controls-container"),
        controlsContainerBuild = videoContainer.querySelector(".T_M_G-video-controls-container"),
        notifiersContainerBuild = this.settings.status.ui.notifiers || this.initialState ? document.createElement("div") : null,
        overlayMainControlsWrapperBuild = document.createElement("div"),
        controlsWrapperBuild = document.createElement("div"),
        leftSidedControlsWrapperBuild = this.settings.status.ui.leftSidedControls ? document.createElement("div") : null,
        rightSidedControlsWrapperBuild = this.settings.status.ui.rightSidedControls ? document.createElement("div") : null,
        pictureInPictureWrapperHTML =
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
        playlistTitleWrapperHTML = 
        `
            <div class="T_M_G-video-playlist-title-wrapper">
                <p class="T_M_G-video-playlist-title"></p>
            </div>        
        `,
        videoBufferHTML = 
        `
        <div title="Video buffering" class="T_M_G-video-buffer">
        </div>
        `,
        thumbnailImgHTML =
        `
        ${this.settings.status.ui.previewImages ? `<img class="T_M_G-video-thumbnail-img" alt="movie-image" src="${tmg.altImgSrc}">` : '<canvas class="T_M_G-video-thumbnail-img"></canvas>'}
        `,
        playPauseNotifierHTML = this.settings.status.ui.notifiers || this.initialState ?
        `
            <div class="T_M_G-video-notifiers T_M_G-video-play-notifier">
                <svg class="T_M_G-video-play-notifier-icon" data-tooltip-text="Play(k)" data-tooltip-position="top">
                    <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                </svg>
            </div>
            <div class="T_M_G-video-notifiers T_M_G-video-pause-notifier">
                <svg class="T_M_G-video-pause-notifier-icon" data-tooltip-text="Pause(k)" data-tooltip-position="top">
                    <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
                </svg>
            </div>    
        ` : null,
        captionsNotifierHTML = this.settings.status.ui.notifiers ?
        `
            <div class="T_M_G-video-notifiers T_M_G-video-captions-notifier">
                <svg data-tooltip-text="Subtitles(c)" class="T_M_G-video-subtitles-icon">
                    <path fill="currentColor" transform="scale(0.5)" d="M44,6H4A2,2,0,0,0,2,8V40a2,2,0,0,0,2,2H44a2,2,0,0,0,2-2V8A2,2,0,0,0,44,6ZM12,26h4a2,2,0,0,1,0,4H12a2,2,0,0,1,0-4ZM26,36H12a2,2,0,0,1,0-4H26a2,2,0,0,1,0,4Zm10,0H32a2,2,0,0,1,0-4h4a2,2,0,0,1,0,4Zm0-6H22a2,2,0,0,1,0-4H36a2,2,0,0,1,0,4Z" />
                </svg>
                <svg data-tooltip-text="Captions(c)" data-tooltip-position="top" class="T_M_G-video-captions-icon" transform="scale(1.15)">
                    <path fill="currentColor" d="M18,11H16.5V10.5H14.5V13.5H16.5V13H18V14A1,1 0 0,1 17,15H14A1,1 0 0,1 13,14V10A1,1 0 0,1 14,9H17A1,1 0 0,1 18,10M11,11H9.5V10.5H7.5V13.5H9.5V13H11V14A1,1 0 0,1 10,15H7A1,1 0 0,1 6,14V10A1,1 0 0,1 7,9H10A1,1 0 0,1 11,10M19,4H5C3.89,4 3,4.89 3,6V18A2,2 0 0,0 5,20H19A2,2 0 0,0 21,18V6C21,4.89 20.1,4 19,4Z"></path>
                <svg>
            </div>
        ` : null,
        playbackRateNotifierHTML = this.settings.status.ui.notifiers ? 
        `
            <div class="T_M_G-video-notifiers T_M_G-video-playback-rate-notifier"></div>
        ` : null,
        theaterNotifierHTML = this.settings.status.ui.notifiers ?
        `
            <div class="T_M_G-video-notifiers T_M_G-video-theater-notifier">
                <svg class="T_M_G-video-tall" data-tooltip-text="Theater Mode(t)" data-tooltip-position="top">
                    <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M23 7C23 5.34315 21.6569 4 20 4H4C2.34315 4 1 5.34315 1 7V17C1 18.6569 2.34315 20 4 20H20C21.6569 20 23 18.6569 23 17V7ZM21 7C21 6.44772 20.5523 6 20 6H4C3.44772 6 3 6.44771 3 7V17C3 17.5523 3.44772 18 4 18H20C20.5523 18 21 17.5523 21 17V7Z"/>
                </svg>
                <svg class="T_M_G-video-wide" data-tooltip-text="Normal Mode(t)" data-tooltip-position="top">
                    <path fill="currentColor" d="M19 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H5V8h14v8z"></path>
                </svg>
            </div>
        ` : null,
        fullscreenNotifierHTML = this.settings.status.ui.notifiers ?
        `
            <div class="T_M_G-video-notifiers T_M_G-video-full-screen-notifier">
                <svg class="T_M_G-video-open" data-tooltip-text="Enter Full Screen(f)" data-tooltip-position="top" transform="scale(.8)">
                    <path d="M4 1.5C2.61929 1.5 1.5 2.61929 1.5 4V8.5C1.5 9.05228 1.94772 9.5 2.5 9.5H3.5C4.05228 9.5 4.5 9.05228 4.5 8.5V4.5H8.5C9.05228 4.5 9.5 4.05228 9.5 3.5V2.5C9.5 1.94772 9.05228 1.5 8.5 1.5H4Z" fill="currentColor" />
                    <path d="M20 1.5C21.3807 1.5 22.5 2.61929 22.5 4V8.5C22.5 9.05228 22.0523 9.5 21.5 9.5H20.5C19.9477 9.5 19.5 9.05228 19.5 8.5V4.5H15.5C14.9477 4.5 14.5 4.05228 14.5 3.5V2.5C14.5 1.94772 14.9477 1.5 15.5 1.5H20Z" fill="currentColor" />
                    <path d="M20 22.5C21.3807 22.5 22.5 21.3807 22.5 20V15.5C22.5 14.9477 22.0523 14.5 21.5 14.5H20.5C19.9477 14.5 19.5 14.9477 19.5 15.5V19.5H15.5C14.9477 19.5 14.5 19.9477 14.5 20.5V21.5C14.5 22.0523 14.9477 22.5 15.5 22.5H20Z" fill="currentColor" />
                    <path d="M1.5 20C1.5 21.3807 2.61929 22.5 4 22.5H8.5C9.05228 22.5 9.5 22.0523 9.5 21.5V20.5C9.5 19.9477 9.05228 19.5 8.5 19.5H4.5V15.5C4.5 14.9477 4.05228 14.5 3.5 14.5H2.5C1.94772 14.5 1.5 14.9477 1.5 15.5V20Z" fill="currentColor" />
                </svg>
                <svg class="T_M_G-video-close" data-tooltip-text="Leave Full Screen(f)" data-tooltip-position="top" transform="scale(.8)">
                    <path d="M7 9.5C8.38071 9.5 9.5 8.38071 9.5 7V2.5C9.5 1.94772 9.05228 1.5 8.5 1.5H7.5C6.94772 1.5 6.5 1.94772 6.5 2.5V6.5H2.5C1.94772 6.5 1.5 6.94772 1.5 7.5V8.5C1.5 9.05228 1.94772 9.5 2.5 9.5H7Z" fill="currentColor" />
                    <path d="M17 9.5C15.6193 9.5 14.5 8.38071 14.5 7V2.5C14.5 1.94772 14.9477 1.5 15.5 1.5H16.5C17.0523 1.5 17.5 1.94772 17.5 2.5V6.5H21.5C22.0523 6.5 22.5 6.94772 22.5 7.5V8.5C22.5 9.05228 22.0523 9.5 21.5 9.5H17Z" fill="currentColor" />
                    <path d="M17 14.5C15.6193 14.5 14.5 15.6193 14.5 17V21.5C14.5 22.0523 14.9477 22.5 15.5 22.5H16.5C17.0523 22.5 17.5 22.0523 17.5 21.5V17.5H21.5C22.0523 17.5 22.5 17.0523 22.5 16.5V15.5C22.5 14.9477 22.0523 14.5 21.5 14.5H17Z" fill="currentColor" />
                    <path d="M9.5 17C9.5 15.6193 8.38071 14.5 7 14.5H2.5C1.94772 14.5 1.5 14.9477 1.5 15.5V16.5C1.5 17.0523 1.94772 17.5 2.5 17.5H6.5V21.5C6.5 22.0523 6.94772 22.5 7.5 22.5H8.5C9.05228 22.5 9.5 22.0523 9.5 21.5V17Z" fill="currentColor" />
                </svg>
            </div>      
        ` : null,
        volumeNotifierHTML = this.settings.status.ui.notifiers ?
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
        fwdNotifierHTML = this.settings.status.ui.notifiers ? 
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
        bwdNotiferHTML = this.settings.status.ui.notifiers ?
        `
            <div class="T_M_G-video-notifiers T_M_G-video-bwd-notifier">
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
        fullScreenOrientationBtnHTML = this.settings.status.modes.fullScreen ?
        `
            <div class="T_M_G-video-full-screen-orientation-btn-wrapper">
                <button type="button" class="T_M_G-video-full-screen-orientation-btn T_M_G-video-control-hidden" title="Change Orientation" data-focusable-control="false" tabindex="-1"> 
                    <svg viewBox="0 0 512 512" class="T_M_G-video-full-screen-orientation-icon" data-tooltip-text="Toggle Orientation" data-no-resize="true">
                        <path fill="currentColor" d="M446.81,275.82H236.18V65.19c0-20.78-16.91-37.69-37.69-37.69H65.19c-20.78,0-37.69,16.91-37.69,37.69v255.32    c0,20.78,16.91,37.68,37.69,37.68h88.62v88.62c0,20.78,16.9,37.69,37.68,37.69h255.32c20.78,0,37.69-16.91,37.69-37.69v-133.3    C484.5,292.73,467.59,275.82,446.81,275.82z M65.19,326.19c-3.14,0-5.69-2.55-5.69-5.68V65.19c0-3.14,2.55-5.69,5.69-5.69h133.3    c3.14,0,5.69,2.55,5.69,5.69v210.63h-12.69c-20.78,0-37.68,16.91-37.68,37.69v12.68H65.19z M452.5,446.81    c0,3.14-2.55,5.69-5.69,5.69H191.49c-3.13,0-5.68-2.55-5.68-5.69V342.19v-28.68c0-2.94,2.24-5.37,5.1-5.66    c0.19-0.02,0.38-0.03,0.58-0.03h28.69h226.63c3.14,0,5.69,2.55,5.69,5.69V446.81z"/>
                        <path fill="currentColor" d="M369.92,181.53c-6.25-6.25-16.38-6.25-22.63,0c-6.25,6.25-6.25,16.38,0,22.63l44.39,44.39    c3.12,3.13,7.22,4.69,11.31,4.69c0.21,0,0.42-0.02,0.63-0.03c0.2,0.01,0.4,0.03,0.6,0.03c6.31,0,11.74-3.66,14.35-8.96    l37.86-37.86c6.25-6.25,6.25-16.38,0-22.63c-6.25-6.25-16.38-6.25-22.63,0l-13.59,13.59v-86.58c0-8.84-7.16-16-16-16h-86.29    l15.95-15.95c6.25-6.25,6.25-16.38,0-22.63c-6.25-6.25-16.38-6.25-22.63,0l-40.33,40.33c-5.19,2.65-8.75,8.03-8.75,14.25    c0,0.19,0.02,0.37,0.03,0.56c-0.01,0.19-0.03,0.38-0.03,0.57c0,4.24,1.69,8.31,4.69,11.31l42.14,42.14    c3.12,3.12,7.22,4.69,11.31,4.69s8.19-1.56,11.31-4.69c6.25-6.25,6.25-16.38,0-22.63l-15.95-15.95h72.54v73.05L369.92,181.53z"/>
                    </svg>                                
                </button>
            </div>                
        ` : null,
        miniPlayerExpandBtnHTML = this.settings.status.modes.miniPlayer ?
        `
        <div class="T_M_G-video-mini-player-expand-btn-wrapper">
            <button type="button" class="T_M_G-video-mini-player-expand-btn" title="Expand mini-player(e)" data-focusable-control="false" tabindex="-1">
                <svg class="T_M_G-video-mini-player-expand-icon" viewBox="0 -960 960 960" data-tooltip-text="Expand(e)" data-tooltip-position="top" data-no-resize="true">
                    <path d="M120-120v-320h80v184l504-504H520v-80h320v320h-80v-184L256-200h184v80H120Z"/>
                </svg>
            </button>
        </div>    
        ` : null,
        miniPlayerCancelBtnHTML = this.settings.status.modes.miniPlayer ?
        `
        <div class="T_M_G-video-mini-player-cancel-btn-wrapper">
            <button type="button" class="T_M_G-video-mini-player-cancel-btn" title="Remove Mini-player(r)" data-focusable-control="false" tabindex="-1">
                <svg class="T_M_G-video-mini-player-cancel-icon" viewBox="0 -960 960 960" data-tooltip-text="Remove(r)" data-tooltip-position="top" data-no-resize="true">
                    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                </svg>
            </button>
        </div>    
        ` : null,
        mainPrevBtnHTML = this.settings.status.ui.prev ?
        `
            <button type="button" class="T_M_G-video-main-prev-btn" title="Previous Video(Shift + p)" data-focusable-control="false" tabindex="-1">
                <svg class="T_M_G-video-prev-icon" data-tooltip-text="Previous Video(Shift + p)" data-tooltip-position="top">
                    <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                </svg>
            </button>       
        ` : null,
        mainPlayPauseBtnHTML = this.settings.status.ui.playPause ?
        `
            <button type="button" class="T_M_G-video-main-play-pause-btn" title="Play/Pause(k)" data-focusable-control="false" tabindex="-1">
                <svg class="T_M_G-video-play-icon" data-tooltip-text="Play(k)" data-tooltip-position="top">
                    <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                </svg>
                <svg class="T_M_G-video-pause-icon" data-tooltip-text="Pause(k)" data-tooltip-position="top">
                    <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
                </svg>
                <svg class="T_M_G-video-replay-icon" viewBox="0 -960 960 960" data-tooltip-text="Replay(shift + r)" data-tooltip-position="top"  data-no-resize="true">
                    <path d="M480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440h80q0 117 81.5 198.5T480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720h-6l62 62-56 58-160-160 160-160 56 58-62 62h6q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Z"/>
                </svg> 
            </button>            
        ` : null,
        mainNextBtnHTML = this.settings.status.ui.next ?
        `
            <button type="button" class="T_M_G-video-main-next-btn" title="Next Video(Shift + n)" data-focusable-control="false" tabindex="-1">
                <svg class="T_M_G-video-next-icon" data-tooltip-text="Next Video(Shift + n)" data-tooltip-position="top">
                    <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                </svg>
            </button>       
        ` : null,
        timelineHTML = this.settings.status.ui.timeline ?
        `
            <div class="T_M_G-video-timeline-container" title="'>' - 5s & Shift + '>' - 10s" data-control-id="timeline" data-focusable-control="false">
                <div class="T_M_G-video-timeline">
                    <div class="T_M_G-video-loaded-timeline"></div>
                    <div class="T_M_G-video-preview-img-container">
                        ${this.settings.status.ui.previewImages ? `<img class="T_M_G-video-preview-img" alt="Preview image" src="${tmg.altImgSrc}">` : '<canvas class="T_M_G-video-preview-img"></canvas>'}
                    </div>
                    <div class="T_M_G-video-thumb-indicator"></div>
                </div>
            </div>
        ` : null,
        prevBtnHTML = this.settings.status.ui.prev ?
        `
                <button type="button" class="T_M_G-video-prev-btn" title="Previous Video(Shift + p)" data-control-id="prev" data-focusable-control="false" tabindex="-1">
                    <svg class="T_M_G-video-prev-icon" data-tooltip-text="Previous Video(Shift + p)" data-tooltip-position="top">
                        <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                    </svg>
                </button>       
        ` : null,
        playPauseBtnHTML = this.settings.status.ui.playPause ?
        `
                <button type="button" class="T_M_G-video-play-pause-btn" title="Play/Pause(k)" data-draggable-control="${this.settings.status.ui.draggableControls ? true : false}" data-control-id="playPause" data-focusable-control="false" tabindex="-1">
                    <svg class="T_M_G-video-play-icon" data-tooltip-text="Play(k)" data-tooltip-position="top">
                        <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                    </svg>
                    <svg class="T_M_G-video-pause-icon" data-tooltip-text="Pause(k))" data-tooltip-position="top">
                        <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
                    </svg>
                    <svg class="T_M_G-video-replay-icon" viewBox="0 -960 960 960" data-tooltip-text="Replay(shift + r)" data-tooltip-position="top" data-no-resize="true">
                        <path d="M480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440h80q0 117 81.5 198.5T480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720h-6l62 62-56 58-160-160 160-160 56 58-62 62h6q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Z"/>
                    </svg> 
                </button>    
        ` : null,
        nextBtnHTML = this.settings.status.ui.next ?
        `
                <button type="button" class="T_M_G-video-next-btn" title="Next Video(Shift + n)" data-draggable-control="${this.settings.status.ui.draggableControls ? true : false}" data-control-id="next" data-focusable-control="false" tabindex="-1">
                    <svg class="T_M_G-video-next-icon" data-tooltip-text="Next Video(Shift + n)" data-tooltip-position="top">
                        <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                    </svg>
                </button>    
        ` : null,
        volumeHTML = this.settings.status.ui.volume ?
        `
                <div class="T_M_G-video-volume-container" data-control-id="volume">
                    <button type="button" class="T_M_G-video-mute-btn" title="Toggle Volume(m)" data-draggable-control="${this.settings.status.ui.draggableControls ? true : false}" data-focusable-control="false" tabindex="-1">
                        <svg class="T_M_G-video-volume-high-icon" data-tooltip-text="High Volume" data-tooltip-position="top">
                            <path fill="currentColor" d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
                        </svg>
                        <svg class="T_M_G-video-volume-low-icon" data-tooltip-text="Low Volume" data-tooltip-position="top">
                            <path fill="currentColor" d="M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z" />
                        </svg>
                        <svg class="T_M_G-video-volume-muted-icon" data-tooltip-text="Volume Muted" data-tooltip-position="top">
                            <path fill="currentColor" d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z" />
                        </svg>
                    </button>
                    <input class="T_M_G-video-volume-slider" type="range" min="0" max="100" step="any" title="Adjust Volume - Vertical arrows" data-focusable-control="false" tabindex="-1">
                </div>
        ` : null,
        durationHTML = this.settings.status.ui.duration ?
        `
                <div class="T_M_G-video-duration-container" data-draggable-control="${this.settings.status.ui.draggableControls ? true : false}" data-control-id="duration">
                    <div class="T_M_G-video-current-time">0:00</div>
                    /
                    <div class="T_M_G-video-total-time">-:--</div>
                </div>    
        ` : null,
        captionsBtnHTML = this.settings.status.ui.captions ?
        `
                <button type="button" class="T_M_G-video-captions-btn" title="Toggle Captions/Subtitles(c)" data-draggable-control="${this.settings.status.ui.draggableControls ? true : false}" data-focusable-control="false" tabindex="-1" data-control-id="captions">
                    <svg data-tooltip-text="Subtitles(c)" data-tooltip-position="top" class="T_M_G-video-subtitles-icon">
                        <path fill="currentColor" transform="scale(0.5)" d="M44,6H4A2,2,0,0,0,2,8V40a2,2,0,0,0,2,2H44a2,2,0,0,0,2-2V8A2,2,0,0,0,44,6ZM12,26h4a2,2,0,0,1,0,4H12a2,2,0,0,1,0-4ZM26,36H12a2,2,0,0,1,0-4H26a2,2,0,0,1,0,4Zm10,0H32a2,2,0,0,1,0-4h4a2,2,0,0,1,0,4Zm0-6H22a2,2,0,0,1,0-4H36a2,2,0,0,1,0,4Z" />
                    </svg>
                    <svg data-tooltip-text="Captions(c)" data-tooltip-position="top" class="T_M_G-video-captions-icon" transform="scale(1.15)">
                        <path fill="currentColor" d="M18,11H16.5V10.5H14.5V13.5H16.5V13H18V14A1,1 0 0,1 17,15H14A1,1 0 0,1 13,14V10A1,1 0 0,1 14,9H17A1,1 0 0,1 18,10M11,11H9.5V10.5H7.5V13.5H9.5V13H11V14A1,1 0 0,1 10,15H7A1,1 0 0,1 6,14V10A1,1 0 0,1 7,9H10A1,1 0 0,1 11,10M19,4H5C3.89,4 3,4.89 3,6V18A2,2 0 0,0 5,20H19A2,2 0 0,0 21,18V6C21,4.89 20.1,4 19,4Z"></path>
                    <svg>
                </button>
        ` : null,
        settingsBtnHTML = this.settings.status.ui.settings ?
        `
                <button type="button" class="T_M_G-video-settings-btn" title="Toggle Settings" data-draggable-control="${this.settings.status.ui.draggableControls ? true : false}" data-focusable-control="false" tabindex="-1" data-control-id="settings">
                    <svg class="T_M_G-video-settings-icon" viewBox="0 -960 960 960" data-tooltip-text="Settings(s)" data-tooltip-position="top" data-no-resize="true">
                        <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/>
                    </svg>
                </button>        
        ` : null,
        playbackRateBtnHTML = this.settings.status.ui.playbackRate ? 
        `
                <button type="button" class="T_M_G-video-playback-rate-btn T_M_G-video-wide-btn" title="Playback Rate(s)" data-draggable-control="${this.settings.status.ui.draggableControls ? true : false}" data-focusable-control="false" tabindex="-1" data-control-id="playbackRate">1x</button>
        ` : null,
        pictureInPictureBtnHTML = this.settings.status.ui.pictureInPicture ? 
        `
                <button type="button" class="T_M_G-video-picture-in-picture-btn" title="Toggle Picture-in-Picture(i)" data-draggable-control="${this.settings.status.ui.draggableControls ? true : false}" data-focusable-control="false" tabindex="-1" data-control-id="pictureInPicture">
                    <svg class="T_M_G-video-enter-picture-in-picture-icon" data-tooltip-text="Enter Picture-in-Picture(i)" data-tooltip-position="top">
                        <path class="T_M_G-video-no-fill-path" fill="none" d="M0 0h24v24H0z" />
                        <path fill="currentColor" fill-rule="nonzero" d="M21 3a1 1 0 0 1 1 1v7h-2V5H4v14h6v2H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18zm0 10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h8zM6.707 6.293l2.25 2.25L11 6.5V12H5.5l2.043-2.043-2.25-2.25 1.414-1.414z" />
                    </svg>
                    <svg class="T_M_G-video-leave-picture-in-picture-icon" data-tooltip-text="Leave Picture-in-Picture(i)" data-tooltip-position="top">
                        <path class="T_M_G-video-no-fill-path" fill="none" d="M0 0h24v24H0z"></path>
                        <path fill-rule="nonzero" d="M21 3a1 1 0 0 1 1 1v7h-2V5H4v14h6v2H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18zm0 10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h8zm-9.5-6L9.457 9.043l2.25 2.25-1.414 1.414-2.25-2.25L6 12.5V7h5.5z">
                        </path>
                    </svg>
                </button>    
        ` : null,  
        theaterBtnHTML = this.settings.status.ui.theater ?
        `
                <button type="button" class="T_M_G-video-theater-btn" title="Toggle Theater Mode(t)" data-draggable-control="${this.settings.status.ui.draggableControls ? true : false}" data-focusable-control="false" tabindex="-1" data-control-id="theater">
                    <svg class="T_M_G-video-tall" data-tooltip-text="Theater Mode(t)" data-tooltip-position="top">
                        <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M23 7C23 5.34315 21.6569 4 20 4H4C2.34315 4 1 5.34315 1 7V17C1 18.6569 2.34315 20 4 20H20C21.6569 20 23 18.6569 23 17V7ZM21 7C21 6.44772 20.5523 6 20 6H4C3.44772 6 3 6.44771 3 7V17C3 17.5523 3.44772 18 4 18H20C20.5523 18 21 17.5523 21 17V7Z"/>
                    </svg>
                    <svg class="T_M_G-video-wide" data-tooltip-text="Normal Mode(t)" data-tooltip-position="top">
                        <path fill="currentColor" d="M19 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H5V8h14v8z"></path>
                    </svg>
                </button>
        ` : null,
        fullScreenBtnHTML = this.settings.status.ui.fullScreen ?
        `
                <button type="button" class="T_M_G-video-full-screen-btn" title="Toggle Full Screen(f)" data-draggable-control="${this.settings.status.ui.draggableControls ? true : false}" data-focusable-control="false" tabindex="-1" data-control-id="fullScreen">
                    <svg class="T_M_G-video-open" data-tooltip-text="Enter Full Screen(f)" data-tooltip-position="top" transform="scale(.8)">
                        <path d="M4 1.5C2.61929 1.5 1.5 2.61929 1.5 4V8.5C1.5 9.05228 1.94772 9.5 2.5 9.5H3.5C4.05228 9.5 4.5 9.05228 4.5 8.5V4.5H8.5C9.05228 4.5 9.5 4.05228 9.5 3.5V2.5C9.5 1.94772 9.05228 1.5 8.5 1.5H4Z" fill="currentColor" />
                        <path d="M20 1.5C21.3807 1.5 22.5 2.61929 22.5 4V8.5C22.5 9.05228 22.0523 9.5 21.5 9.5H20.5C19.9477 9.5 19.5 9.05228 19.5 8.5V4.5H15.5C14.9477 4.5 14.5 4.05228 14.5 3.5V2.5C14.5 1.94772 14.9477 1.5 15.5 1.5H20Z" fill="currentColor" />
                        <path d="M20 22.5C21.3807 22.5 22.5 21.3807 22.5 20V15.5C22.5 14.9477 22.0523 14.5 21.5 14.5H20.5C19.9477 14.5 19.5 14.9477 19.5 15.5V19.5H15.5C14.9477 19.5 14.5 19.9477 14.5 20.5V21.5C14.5 22.0523 14.9477 22.5 15.5 22.5H20Z" fill="currentColor" />
                        <path d="M1.5 20C1.5 21.3807 2.61929 22.5 4 22.5H8.5C9.05228 22.5 9.5 22.0523 9.5 21.5V20.5C9.5 19.9477 9.05228 19.5 8.5 19.5H4.5V15.5C4.5 14.9477 4.05228 14.5 3.5 14.5H2.5C1.94772 14.5 1.5 14.9477 1.5 15.5V20Z" fill="currentColor" />
                    </svg>
                    <svg class="T_M_G-video-close" data-tooltip-text="Leave Full Screen(f)" data-tooltip-position="top" transform="scale(.8)">
                        <path d="M7 9.5C8.38071 9.5 9.5 8.38071 9.5 7V2.5C9.5 1.94772 9.05228 1.5 8.5 1.5H7.5C6.94772 1.5 6.5 1.94772 6.5 2.5V6.5H2.5C1.94772 6.5 1.5 6.94772 1.5 7.5V8.5C1.5 9.05228 1.94772 9.5 2.5 9.5H7Z" fill="currentColor" />
                        <path d="M17 9.5C15.6193 9.5 14.5 8.38071 14.5 7V2.5C14.5 1.94772 14.9477 1.5 15.5 1.5H16.5C17.0523 1.5 17.5 1.94772 17.5 2.5V6.5H21.5C22.0523 6.5 22.5 6.94772 22.5 7.5V8.5C22.5 9.05228 22.0523 9.5 21.5 9.5H17Z" fill="currentColor" />
                        <path d="M17 14.5C15.6193 14.5 14.5 15.6193 14.5 17V21.5C14.5 22.0523 14.9477 22.5 15.5 22.5H16.5C17.0523 22.5 17.5 22.0523 17.5 21.5V17.5H21.5C22.0523 17.5 22.5 17.0523 22.5 16.5V15.5C22.5 14.9477 22.0523 14.5 21.5 14.5H17Z" fill="currentColor" />
                        <path d="M9.5 17C9.5 15.6193 8.38071 14.5 7 14.5H2.5C1.94772 14.5 1.5 14.9477 1.5 15.5V16.5C1.5 17.0523 1.94772 17.5 2.5 17.5H6.5V21.5C6.5 22.0523 6.94772 22.5 7.5 22.5H8.5C9.05228 22.5 9.5 22.0523 9.5 21.5V17Z" fill="currentColor" />
                    </svg>
                </button>    
        ` : null
        
        //building and deploying video controls
        overlayControlsContainerBuild.innerHTML = ``
        controlsContainerBuild.innerHTML = ``

        //builiding overlay controls so order of insertioni matters because they are eall positioned absolutely
        overlayControlsContainerBuild.innerHTML += pictureInPictureWrapperHTML

        //builidng and deploying Notifiers HTML
        if (this.settings.status.ui.notifiers || this.initialState) {
            notifiersContainerBuild.classList = "T_M_G-video-notifiers-container"
            notifiersContainerBuild.dataset.currentNotifier = ""
            const notifiersContainerHTML =  ``.concat(playPauseNotifierHTML ?? "", captionsNotifierHTML ?? "", playbackRateNotifierHTML ?? "", theaterNotifierHTML ?? "", fullscreenNotifierHTML ?? "", volumeNotifierHTML ?? "", fwdNotifierHTML ?? "", bwdNotiferHTML ?? "")
            notifiersContainerBuild.innerHTML += notifiersContainerHTML
            overlayControlsContainerBuild.append(notifiersContainerBuild)
        }
    
        //building and deploying overlay general controls
        const overlayControlsHTML = ``.concat(thumbnailImgHTML ?? '', videoBufferHTML ?? '', playlistTitleWrapperHTML ?? '', miniPlayerExpandBtnHTML ?? '', miniPlayerCancelBtnHTML ?? '', fullScreenOrientationBtnHTML ?? '')
        overlayControlsContainerBuild.innerHTML += overlayControlsHTML
    
        //building and deploying overlay main controls wrapper 
        const overlayMainControlsHTML = ``.concat(mainPrevBtnHTML ?? '', mainPlayPauseBtnHTML ?? '', mainNextBtnHTML ?? '')
        overlayMainControlsWrapperBuild.innerHTML += overlayMainControlsHTML
        overlayMainControlsWrapperBuild.classList = "T_M_G-video-overlay-main-controls-wrapper"
        overlayControlsContainerBuild.append(overlayMainControlsWrapperBuild)

        //building and deploying controls wrapper
        const allControlsHTML = {
            timeline: timelineHTML, 
            prevBtn: prevBtnHTML, 
            playPause: playPauseBtnHTML, 
            prev: prevBtnHTML,
            next: nextBtnHTML, 
            volume: volumeHTML, 
            duration: durationHTML, 
            captions: captionsBtnHTML, 
            settings: settingsBtnHTML, 
            playbackRate: playbackRateBtnHTML, 
            pictureInPicture: pictureInPictureBtnHTML,
            theater: theaterBtnHTML, 
            fullScreen: fullScreenBtnHTML
        }
        if (this.settings.status.ui.leftSidedControls) {
            leftSidedControlsWrapperBuild.classList = "T_M_G-video-left-side-controls-wrapper"
            leftSidedControlsWrapperBuild.dataset.dropzone = this.settings.status.ui.draggableControls ? true : false
            const leftSidedControlsHTMLArray = Array.from(leftSidedControls, el => allControlsHTML[el] ? allControlsHTML[el] : '')
            const leftSidedControlsHTML = ``.concat(...leftSidedControlsHTMLArray)
            leftSidedControlsWrapperBuild.innerHTML += leftSidedControlsHTML
            controlsWrapperBuild.append(leftSidedControlsWrapperBuild)
        }
        if (this.settings.status.ui.rightSidedControls) {
            rightSidedControlsWrapperBuild.classList = "T_M_G-video-right-side-controls-wrapper"
            rightSidedControlsWrapperBuild.dataset.dropzone = this.settings.status.ui.draggableControls ? true : false
            const rightSidedControlsHTMLArray = Array.from(rightSidedControls, el => allControlsHTML[el] ? allControlsHTML[el] : '')
            const rightSidedControlsHTML = ``.concat(...rightSidedControlsHTMLArray)
            rightSidedControlsWrapperBuild.innerHTML += rightSidedControlsHTML
            controlsWrapperBuild.append(rightSidedControlsWrapperBuild)
        }

        controlsContainerBuild.innerHTML += timelineHTML ?? ""        
        controlsWrapperBuild.classList = "T_M_G-video-controls-wrapper"
        controlsContainerBuild.append(controlsWrapperBuild)  
    } catch(e) {
        this._log(e, "error", "swallow")
    }                        
    }

    retrieveVideoPlayerDOM(videoContainer) {
    try {
        //Setting Up DOM Elements for easy access
        this.ui = {
            dom : {
                video: this.video,
                videoContainer : videoContainer,
                videoContainerContentWrapper: videoContainer.querySelector(".T_M_G-video-container-content-wrapper"),
                videoContainerContent: videoContainer.querySelector(".T_M_G-video-container-content"),
                playlistTitleWrapper: videoContainer.querySelector(".T_M_G-video-playlist-title-wrapper"),
                playlistTitle: videoContainer.querySelector(".T_M_G-video-playlist-title"),
                thumbnailImg : videoContainer.querySelector(".T_M_G-video-thumbnail-img"),
                videoBuffer : videoContainer.querySelector(".T_M_G-video-buffer"),
                notifiersContainer: this.settings.status.ui.notifiers || this.initialState ? videoContainer.querySelector(".T_M_G-video-notifiers-container") : null,
                playNotifier : this.settings.status.ui.notifiers || this.initialState ? videoContainer.querySelector(".T_M_G-video-play-notifier") : null,
                pauseNotifier : this.settings.status.ui.notifiers ? videoContainer.querySelector(".T_M_G-video-pause-notifier") : null,
                captionsNotifier : this.settings.status.ui.notifiers ? videoContainer.querySelector(".T_M_G-video-captions-notifier") : null,
                playbackRateNotifier : this.settings.status.ui.notifiers ? videoContainer.querySelector(".T_M_G-video-playback-rate-notifier") : null,
                theaterNotifier : this.settings.status.ui.notifiers ? videoContainer.querySelector(".T_M_G-video-theater-notifier") : null,
                fullScreenNotifier : this.settings.status.ui.notifiers ? videoContainer.querySelector(".T_M_G-video-full-screen-notifier") : null,
                volumeNotifierContent : this.settings.status.ui.notifiers ?  videoContainer.querySelector(".T_M_G-video-volume-notifier-content") : null,
                volumeUpNotifier : this.settings.status.ui.notifiers ? videoContainer.querySelector(".T_M_G-video-volume-up-notifier") : null,
                volumeDownNotifier : this.settings.status.ui.notifiers ? videoContainer.querySelector(".T_M_G-video-volume-down-notifier") : null,
                volumeMutedNotifier : this.settings.status.ui.notifiers ? videoContainer.querySelector(".T_M_G-video-volume-muted-notifier") : null,
                fwdNotifier : this.settings.status.ui.notifiers ? videoContainer.querySelector(".T_M_G-video-fwd-notifier") : null,
                bwdNotifier : this.settings.status.ui.notifiers ? videoContainer.querySelector(".T_M_G-video-bwd-notifier") : null,
                videoOverlayControlsContainer: videoContainer.querySelector(".T_M_G-video-overlay-controls-container"),
                videoControlsContainer : videoContainer.querySelector(".T_M_G-video-controls-container"),
                leftSidedControlsWrapper : this.settings.status.ui.leftSidedControls ? videoContainer.querySelector(".T_M_G-video-left-side-controls-wrapper") : null,
                rightSidedControlsWrapper : this.settings.status.ui.rightSidedControls ? videoContainer.querySelector(".T_M_G-video-right-side-controls-wrapper") : null,
                fullScreenOrientationBtn : this.settings.status.ui.fullScreen ? videoContainer.querySelector(".T_M_G-video-full-screen-orientation-btn") : null,
                miniPlayerExpandBtn : this.settings.status.modes.miniPlayer ? videoContainer.querySelector(".T_M_G-video-mini-player-expand-btn") : null,
                miniPlayerCancelBtn : this.settings.status.modes.miniPlayer ? videoContainer.querySelector(".T_M_G-video-mini-player-cancel-btn") : null,
                mainPrevBtn : this.settings.status.ui.prev ? videoContainer.querySelector(".T_M_G-video-main-prev-btn") : null,
                mainPlayPauseBtn : this.settings.status.ui.playPause ? videoContainer.querySelector(".T_M_G-video-main-play-pause-btn") : null,
                mainNextBtn : this.settings.status.ui.next ? videoContainer.querySelector(".T_M_G-video-main-next-btn") : null,
                timelineContainer : this.settings.status.ui.timeline ? videoContainer.querySelector(".T_M_G-video-timeline-container") : null,
                previewImgContainer : this.settings.status.ui.timeline ? videoContainer.querySelector(".T_M_G-video-preview-img-container") : null,
                previewImg : this.settings.status.ui.timeline ? videoContainer.querySelector(".T_M_G-video-preview-img") : null,
                prevBtn : this.settings.status.ui.prev ? videoContainer.querySelector(".T_M_G-video-prev-btn") : null,
                playPauseBtn : this.settings.status.ui.playPause ? videoContainer.querySelector(".T_M_G-video-play-pause-btn") : null,
                nextBtn : this.settings.status.ui.next ? videoContainer.querySelector(".T_M_G-video-next-btn") : null,
                volumeContainer : this.settings.status.ui.volume ? videoContainer.querySelector(".T_M_G-video-volume-container") : null,
                volumeSlider : this.settings.status.ui.volume ? videoContainer.querySelector(".T_M_G-video-volume-slider") : null,
                durationContainer : this.settings.status.ui.duration ? videoContainer.querySelector(".T_M_G-video-duration-container") : null,
                currentTimeElement : this.settings.status.ui.duration ? videoContainer.querySelector(".T_M_G-video-current-time") : null,
                totalTimeElement : this.settings.status.ui.duration ? videoContainer.querySelector(".T_M_G-video-total-time") : null,
                muteBtn : this.settings.status.ui.volume ? videoContainer.querySelector(".T_M_G-video-mute-btn") : null,
                captionsBtn : this.settings.status.ui.captions ?  videoContainer.querySelector(".T_M_G-video-captions-btn") : null,
                settingsBtn : this.settings.status.ui.settings ? videoContainer.querySelector(".T_M_G-video-settings-btn") : null,
                playbackRateBtn : this.settings.status.ui.playbackRate ? videoContainer.querySelector(".T_M_G-video-playback-rate-btn") : null,
                pictureInPictureBtn : this.settings.status.ui.pictureInPicture ? videoContainer.querySelector(".T_M_G-video-picture-in-picture-btn") : null,
                theaterBtn : this.settings.status.ui.theater ? videoContainer.querySelector(".T_M_G-video-theater-btn") : null,
                fullScreenBtn : this.settings.status.ui.fullScreen ? videoContainer.querySelector(".T_M_G-video-full-screen-btn") : null,
                svgs : videoContainer.querySelectorAll("svg"),
                focusableControls: videoContainer.querySelectorAll("[data-focusable-control]"),
                draggableControls: this.settings.status.ui.draggableControls ? videoContainer.querySelectorAll("[data-draggable-control]") : null,
                draggableControlContainers: this.settings.status.ui.draggableControls ? videoContainer.querySelectorAll(".T_M_G-video-left-side-controls-wrapper, .T_M_G-video-right-side-controls-wrapper") : null,
                settingsCloseBtn: this.settings ? videoContainer.querySelector(".T_M_G-video-settings-close-btn") : null,
            }
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }                        
    }

    initializeVideoPlayer() {
    try {
        this.controlsResize()
        if (!(this.video.currentSrc || this.video.src)) this._handleLoadedError() 
        else {
            this.fire("tmgload", this.video, {loaded: true})
            this.video.addEventListener("loadedmetadata", this._handleLoadedMetadata, {once: true})
            this.video.addEventListener("error", this._handleLoadedError, {once: true})
        }
        if (this.activated) {
            if (this.initialState) {
                this.video.addEventListener("timeupdate", this.initializeVideoControls, {once:true})
                const handleInitialStateFocus = e => {
                    if (this.ui.dom.playNotifier.matches(":focus-visible")) document.addEventListener("keyup", handleInitialStateKeyUp)
                }
                const handleInitialStateBlur = () => document.removeEventListener("keyup", handleInitialStateKeyUp)
                const handleInitialStateKeyUp = e => {
                    if (document.activeElement.tagName.toLowerCase() === "input") return
                    switch (e.key.toString().toLowerCase()) {
                        case "enter":     
                        case " ":
                            e.preventDefault()
                            removeInitialState()
                            break
                    }
                }
                const removeInitialState = () => {
                    this.togglePlay(true)
                    this.ui.dom.playNotifier.blur()
                    this.ui.dom.playNotifier.tabIndex = "-1"
                    this.ui.dom.playNotifier.removeEventListener("focus", handleInitialStateFocus)
                    this.ui.dom.playNotifier.removeEventListener("blur", handleInitialStateBlur)
                }
                this.ui.dom.playNotifier.tabIndex = "0"
                this.ui.dom.playNotifier.addEventListener("focus", handleInitialStateFocus)
                this.ui.dom.playNotifier.addEventListener("blur", handleInitialStateBlur)
                this.ui.dom.notifiersContainer?.addEventListener("click", removeInitialState, {once:true})
            } else this.initializeVideoControls()  

        } else {
            console.warn("You have to activate the TMG controller to access the custom controls")
        }
    } catch(e) {
        console.warn('TMG silenced a rendering error: ', e)
    }
    }

    initializeVideoControls() {
    try {     
        this.ui.dom.videoContainer.classList.remove("T_M_G-video-initial")
        if (this.initialState) this.stall()
        this.enableFocusableControls("all")
        if (!this.loaded) this._handleLoadedMetadata()
        this.setInitialStates()
        this.setAllEventListeners()
        this.observePosition()
        this.cache()
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    stall() {
    try {
        this.showVideoOverlay()
        this.ui.dom.playNotifier.classList.add("T_M_G-video-control-spin")
        this.ui.dom.playNotifier.addEventListener("animationend", () => this.ui.dom.playNotifier.classList.remove("T_M_G-video-control-spin"), {once: true}) 
        if (!this.video.paused) this._handlePlay()
    } catch(e) {
        this._log(e, "error", "swallow")
    }           
    }

    setInitialStates() {
    try {        
        if (this.media?.title) 
            this.ui.dom.playlistTitle.textContent = this.ui.dom.playlistTitle.dataset.videoTitle = this.media.title || ""
        if (this.video.textTracks.length > 0) { 
            Array.from(this.video.textTracks).forEach((track, index) => {
                if (track.mode === "showing") {
                    this.textTrackIndex = index
                    return
                }
                track.mode = "hidden"
            })
            this.video.textTracks[this.textTrackIndex].mode = this.settings.autocaptions ? "showing" : "hidden"
            this.ui.dom.videoContainer.classList.toggle("T_M_G-video-captions", this.settings.autocaptions)
            this.ui.dom.videoContainer.dataset.trackKind = this.video.textTracks[this.textTrackIndex].kind
        }
        if (!this.settings.status.ui.previewImages) {
            this.ui.previewImgContext = this.ui.dom.previewImg.getContext("2d")
            this.ui.thumbnailImgContext = this.ui.dom.thumbnailImg.getContext("2d")
            let dummyImg = document.createElement("img")
            dummyImg.src = tmg.altImgSrc
            dummyImg.onload = () => {
                this.ui.previewImgContext.drawImage(dummyImg, 0, 0, this.ui.dom.previewImg.width, this.ui.dom.previewImg.height)
                this.ui.thumbnailImgContext.drawImage(dummyImg, 0, 0, this.ui.dom.thumbnailImg.width, this.ui.dom.thumbnailImg.height)
                dummyImg = null
            }
        }
        this._handleVolumeChange()
        this.setBtnsState()
        this.showVideoOverlay()
        this.pseudoVideo.src = this.video.src || this.video.currentSrc
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
            this.ui.dom.captionsBtn?.classList.add("T_M_G-video-control-disabled")
            if (this.ui.dom.captionsBtn) this.ui.dom.captionsBtn.title = "Captions/Subtitles Unavailable"
        } else {
            this.ui.dom.captionsBtn?.classList.remove("T_M_G-video-control-disabled")
            if (this.ui.dom.captionsBtn) this.ui.dom.captionsBtn.title = "Toggle Captions/Subtitles(c)"
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }                    
    }

    setFullScreenBtnState() {
    try {
        if (!this.settings.status.modes.fullScreen) {
            this.ui.dom.fullScreenBtn?.classList.add("T_M_G-video-control-hidden")
        } else {
            this.ui.dom.fullScreenBtn?.classList.remove("T_M_G-video-control-hidden")
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }                    
    }

    setTheaterBtnState() {
    try {
        if (!this.settings.status.modes.theater) {
            this.ui.dom.theaterBtn?.classList.add("T_M_G-video-control-hidden")
        } else {
            this.ui.dom.theaterBtn?.classList.remove("T_M_G-video-control-hidden")
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }                    
    }

    setPictureInPictureBtnState() {
    try {
        if (!this.settings.status.modes.pictureInPicture) {
            this.ui.dom.pictureInPictureBtn?.classList.add("T_M_G-video-control-hidden")
        } else {
            this.ui.dom.pictureInPictureBtn?.classList.remove("T_M_G-video-control-hidden")
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }                    
    }

    setPlaylistBtnsState() {
    try {
        if (this.#playlist) {
            this.ui.dom.mainPrevBtn?.classList.remove
            ("T_M_G-video-control-hidden")
            this.ui.dom.mainNextBtn?.classList.remove("T_M_G-video-control-hidden")
            if (!(this.currentPlaylistIndex > 0) && !(this.currentPlaylistIndex < this.#playlist?.length - 1)) {
                this.ui.dom.mainPrevBtn?.classList.add
                ("T_M_G-video-control-hidden")
                this.ui.dom.mainNextBtn?.classList.add("T_M_G-video-control-hidden")                
            } else {
                if (!(this.currentPlaylistIndex > 0)) {
                    this.ui.dom.mainPrevBtn?.classList.add("T_M_G-video-control-disabled")
                } else {
                    this.ui.dom.mainPrevBtn?.classList.remove("T_M_G-video-control-disabled")
                }
                if (!(this.currentPlaylistIndex < this.#playlist?.length - 1)) {
                    this.ui.dom.mainNextBtn?.classList.add("T_M_G-video-control-disabled")
                } else {
                    this.ui.dom.mainNextBtn?.classList.remove("T_M_G-video-control-disabled")
                }
            }
        } else {
            this.ui.dom.mainPrevBtn?.classList.add
            ("T_M_G-video-control-hidden")
            this.ui.dom.mainNextBtn?.classList.add("T_M_G-video-control-hidden")
        }
        if (!(this.currentPlaylistIndex > 0)) {
            this.ui.dom.prevBtn?.classList.add("T_M_G-video-control-hidden")
        } else {
            this.ui.dom.mainPrevBtn?.classList.remove("T_M_G-video-control-hidden")
            this.ui.dom.prevBtn?.classList.remove("T_M_G-video-control-hidden")
        }
        if (!(this.currentPlaylistIndex < this.#playlist?.length - 1)) {
            this.ui.dom.nextBtn?.classList.add("T_M_G-video-control-hidden")
        } else {
            this.ui.dom.nextBtn?.classList.remove("T_M_G-video-control-hidden")
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }                    
    }

    setAllEventListeners() {
    try { 
        this.setWindowEventListeners()
        this.setDocumentEventListeners()
        this.setVideoContainerEventListeners()
        this.setVideoEventListeners()
        this.setControlsEventListeners()
        this.setSettingsEventListeners()
    } catch(e) {
        this._log(e, "error", "swallow")
    }                    
    }

    setWindowEventListeners() {
    try {
        window.addEventListener('resize', this._handleWindowResize)
    } catch(e) {
        this._log(e, "error", "swallow")
    }            
    }

    setDocumentEventListeners() {
    try {
        document.addEventListener("visibilitychange", this._handleVisibilityChange)
        document.addEventListener("fullscreenchange", this._handleFullScreenChange)
        document.addEventListener("webkitfullscreenchange", this._handleFullScreenChange)
        document.addEventListener("mozfullscreenchange", this._handleFullScreenChange)
        document.addEventListener("msfullscreenchange", this._handleFullScreenChange)
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
        this.ui.dom.videoControlsContainer.addEventListener("contextmenu", this._handleRightClick)
        this.ui.dom.videoOverlayControlsContainer.addEventListener("contextmenu", this._handleRightClick)
        this.ui.dom.videoOverlayControlsContainer.addEventListener("click", this._handleHoverPointerDown, true)
        this.ui.dom.videoControlsContainer.addEventListener("click", this._handleHoverPointerDown, true)
        this.ui.dom.videoOverlayControlsContainer.addEventListener("pointermove", this._handleHoverPointerMove, true)
        this.ui.dom.videoControlsContainer.addEventListener("pointermove", this._handleHoverPointerMove, true)
        this.ui.dom.videoOverlayControlsContainer.addEventListener("mouseleave", this._handleHoverPointerOut, true)
        this.ui.dom.videoControlsContainer.addEventListener("mouseleave", this._handleHoverPointerOut, true)
        this.ui.dom.videoOverlayControlsContainer.addEventListener("click", this._handleClick, true)
        this.ui.dom.videoOverlayControlsContainer.addEventListener("dblclick", this._handleDoubleClick, true)
        this.ui.dom.videoOverlayControlsContainer.addEventListener("mousedown", this._handlePointerDown, true)
        this.ui.dom.videoOverlayControlsContainer.addEventListener("touchstart", this._handlePointerDown, {passive:true, useCapture:true})
    } catch(e) {
        this._log(e, "error", "swallow")
    }            
    }    

    setVideoEventListeners() {
    try {
        this.video.addEventListener("play", this._handlePlay)
        this.video.addEventListener("pause", this._handlePause)        
        this.video.addEventListener("waiting", this._handleBufferStart)
        this.video.addEventListener("playing", this._handleBufferStop)
        this.video.addEventListener("ratechange", this._handlePlaybackChange)      
        this.video.addEventListener("timeupdate", this._handleTimeUpdate)
        this.video.addEventListener("volumechange", this._handleVolumeChange)
        this.video.addEventListener("error", this._handleLoadedError)
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

    setControlsEventListeners() {
    try {
        //button event listeners 
        this.ui.dom.fullScreenOrientationBtn?.addEventListener("click", this.changeFullScreenOrientation)
        this.ui.dom.miniPlayerExpandBtn?.addEventListener("click", this.expandMiniPlayer)
        this.ui.dom.miniPlayerCancelBtn?.addEventListener("click", this.cancelMiniPlayer)        
        this.ui.dom.mainPrevBtn?.addEventListener("click", this.previousVideo)
        this.ui.dom.prevBtn?.addEventListener("click", this.previousVideo)
        this.ui.dom.mainNextBtn?.addEventListener("click", this.nextVideo)
        this.ui.dom.nextBtn?.addEventListener("click", this.nextVideo)
        this.ui.dom.playPauseBtn?.addEventListener("click", this.togglePlay)
        this.ui.dom.mainPlayPauseBtn?.addEventListener("click", this.togglePlay)
        this.ui.dom.playbackRateBtn?.addEventListener("click", this.changePlaybackRate)
        this.ui.dom.captionsBtn?.addEventListener("click", this.toggleCaptions)
        this.ui.dom.muteBtn?.addEventListener("click", this.toggleMute)
        this.ui.dom.theaterBtn?.addEventListener("click", this.toggleTheaterMode)
        this.ui.dom.fullScreenBtn?.addEventListener("click", this.toggleFullScreenMode)
        this.ui.dom.pictureInPictureBtn?.addEventListener("click", this.togglePictureInPictureMode)
        this.ui.dom.settingsBtn?.addEventListener("click", this.toggleSettingsView)

        //timeline contanier event listeners
        this.ui.dom.timelineContainer?.addEventListener("pointerdown", this._handleTimelineScrubbing)
        this.ui.dom.timelineContainer?.addEventListener("mouseover", this.showPreviewImages)
        this.ui.dom.timelineContainer?.addEventListener("mouseleave", this.hidePreviewImages)
        this.ui.dom.timelineContainer?.addEventListener("touchend", this.hidePreviewImages)
        this.ui.dom.timelineContainer?.addEventListener("mousemove", this._handleTimelineUpdate)
        this.ui.dom.timelineContainer?.addEventListener("focus", this._handleTimelineFocus)
        this.ui.dom.timelineContainer?.addEventListener("blur", this._handleTimelineBlur)

        //volume event listeners
        this.ui.dom.volumeSlider?.addEventListener("input", this._handleVolumeSliderInput)
        this.ui.dom.volumeSlider?.addEventListener("mousedown", this. _handleVolumeSliderMouseDown)
        this.ui.dom.volumeSlider?.addEventListener("mouseup", this._handleVolumeSliderMouseUp)
        this.ui.dom.volumeContainer?.addEventListener("mousemove", this._handleVolumeContainerMouseMove)
        this.ui.dom.volumeContainer?.addEventListener("mouseup", this._handleVolumeContainerMouseUp)

        //drag event listeners
        this.setDragEventListeners()

        //image event listeners 
        if (this.settings.status.ui.previewImages) {
        this.ui.dom.previewImg?.addEventListener("error", this._handleImgBreak)
        this.ui.dom.thumbnailImg?.addEventListener("error", this._handleImgBreak)
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
        this.ui.dom.draggableControls?.forEach(control => {
            control.draggable = true
        })
        this.ui.dom.draggableControls?.forEach(control => {
            control.addEventListener("dragstart", this._handleDragStart)
            control.addEventListener("drag", this._handleDrag)
            control.addEventListener("dragend", this._handleDragEnd)
        })
        this.ui.dom.draggableControlContainers?.forEach(container => {
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
        this.ui.dom.draggableControls.forEach(control => {
            control.draggable = false
        })
        this.ui.dom.draggableControls.forEach(control => {
            control.removeEventListener("dragstart", this._handleDragStart)
            control.removeEventListener("drag", this._handleDrag)
            control.removeEventListener("dragend", this._handleDragEnd)
        })
        this.ui.dom.draggableControlContainers.forEach(container => {
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
        this.ui.dom.settingsCloseBtn?.addEventListener("click", this.leaveSettingsView)
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }

    observePosition() {
    try {
        this.observer?.observe(this.ui.dom.videoContainer.parentElement)
        this.observer?.observe(this.video)      
    } catch(e) {
        this._log(e, "error", "swallow")
    }            
    }

    unobservePosition() {
    try {
        this.observer?.unobserve(this.ui.dom.videoContainer.parentElement)
        this.observer?.unobserve(this.video)      
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
        for (const control of this.ui.dom.focusableControls) {
            control.tabIndex = "0"
            control.dataset.focusableControl = true
        }
        } else {
        for (const control of this.ui.dom.focusableControls) {
            if (this.ui.dom.videoContainerContent.contains(control)) {
                control.tabIndex = "0"
                control.dataset.focusableControl = true
            }
        }}
    } catch(e) {
        this._log(e, "error", "swallow")
    }  
    }

    disableFocusableControls(all) {
    try {
        if (all === "all") {
        for (const control of this.ui.dom.focusableControls) {
            control.tabIndex = "-1"
            control.dataset.focusableControl = false
        }
        } else {
        for (const control of this.ui.dom.focusableControls) {
            if (this.ui.dom.videoContainerContent.contains(control)) {
                control.tabIndex = "-1"
                control.dataset.focusableControl = false
            }
        }
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }  
    }

    //resizing controls
    controlsResize() {           
    try {
        let controlsSize = 25
        this.ui.dom.svgs?.forEach(svg => {
            svg.setAttribute("preserveAspectRatio", "xMidYMid meet")
            if (!(svg.dataset.noResize === "true"))
                svg.setAttribute("viewBox", `0 0 ${controlsSize} ${controlsSize}`)
        })
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
            if (this.isScrubbing) this.stopTimelineScrubbing()
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }

    deactivate() {
    try {
        this.ui.dom.videoContainer.classList.add("T_M_G-video-unavailable")
        this.disableFocusableControls("all")
        this._log("TMG player deactivated", "swallow")
    } catch(e) {
        this._log(e, "error", "swallow")
    } 
    }

    reactivate() {
    try {
        if (this.ui.dom.videoContainer.classList.contains("T_M_G-video-unavailable") && this.loaded) {
            this.ui.dom.videoContainer.classList.remove("T_M_G-video-unavailable")
            this.enableFocusableControls("all")
            this._log("TMG player reactivated", "swallow")
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    } 
    }

    _handleLoadedError(e) {
    try {
        if (e) this._log(e, "swallow")
        this.deactivate()
        this.loaded = false
    } catch(e) {
        this._log(e, "error", "swallow")
    } 
    }

    _handleLoadedMetadata() {
    try {
        if (this.settings.status.allowOverride.startTime && this.loaded) this.video.currentTime = this.settings?.startTime || 0
        if (this.ui.dom.totalTimeElement) this.ui.dom.totalTimeElement.textContent = tmg.formatDuration(this.video.duration)
        this.aspectRatio = this.video.videoWidth / this.video.videoHeight
        this.videoAspectRatio = `${this.video.videoWidth} / ${this.video.videoHeight}`
        this.reactivate()
        this.loaded = true
    } catch(e) {
        this._log(e, "error", "swallow")
    }                   
    }

    //Loaded data
    _handleLoadedData() {
    try {
        if (this.ui.dom.totalTimeElement) this.ui.dom.totalTimeElement.textContent = tmg.formatDuration(this.video.duration)
    } catch(e) {
        this._log(e, "error", "swallow")
    }                
    }

    //Buffer Progress
    _handleLoadedProgress() {
    try {
        if (this.video.duration > 0) {
            for (let i = 0; i < this.video.buffered.length; i++) {
                if (this.video.buffered.start(this.video.buffered.length - 1 - i) < this.video.currentTime) {
                    this.videoCurrentLoadedPosition = (this.video.buffered.end(this.video.buffered.length - 1 - i) * 100) / this.video.duration
                    break
                }
            }
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }                    
    }    

    previousVideo() {
    try {
        if (this.#playlist && this.currentPlaylistIndex > 0) this.movePlaylistTo(this.currentPlaylistIndex - 1)
    } catch(e) {
        this._log(e, "error", "swallow")
    }                
    }

    nextVideo() {
    try {
        if (this.#playlist && this.currentPlaylistIndex < this.#playlist.length - 1) this.movePlaylistTo(this.currentPlaylistIndex + 1)
    } catch(e) {
        this._log(e, "error", "swallow")
    }                
    }

    movePlaylistTo(index) {
    try {
        if (this.video.currentTime < (this.video.duration - this.autoPlaylistCountdown) && this.video.currentTime > 0) {
            this.#playlist[this.currentPlaylistIndex].settings = this.#playlist[this.currentPlaylistIndex].settings ?? {}
            this.#playlist[this.currentPlaylistIndex].settings.startTime = this.video.currentTime
        }
        if (this.#playlist) {
            this.stall()
            this.currentPlaylistIndex = index
            const video = this.#playlist[index]
            if (video.media?.artwork) 
            if (video.media.artwork[0]?.src) 
                this.video.poster = video.media.artwork[0].src
            tmg.removeSources(this.video)
            tmg.removeTracks(this.video)
            if (video.src) {
                tmg.removeSources(this.video)
                this.video.setAttribute("src", video.src)
                this.src = video.src
            } else if (video.sources?.length > 0) {
                this.video.removeAttribute("src")
                tmg.addSources(video.sources, this.video) 
                this.sources = video.sources
            }
            if (video.tracks?.length > 0) {
                tmg.addTracks(video.tracks, this.video)
                this.tracks = video.tracks
            }
            this.media = video.media ? {...this.media, ...video.media} : video.media ?? null
            this.settings.startTime = video.settings?.startTime || null
            this.settings.endTime = video.settings?.endTime || null
            this.settings.previewImages = video.settings?.previewImages?.length > 0 ? {...this.settings.previewImages, ...video.settings.previewImages} : video.settings?.previewImages ?? null
            this.settings.status.ui.previewImages = (this.settings.previewImages?.address && this.settings.previewImages.fps) ? true : false
            if (this.settings.previewImages === false) videoContainer.setAttribute("data-previews", false) 
            this.setInitialStates()
            this.togglePlay(true)
        }        
    } catch(e) {
        this._log(e, "error", "swallow")
    }            
    }

    autoMovePlaylist() {
    try {        
        if (this.#playlist && !this.autoMovePlaylistActive && (this.currentPlaylistIndex < this.#playlist.length - 1) && !this.video.paused) {
            this.autoMovePlaylistActive = true
            const count = Math.floor(this.video.duration - this.video.currentTime)
            const {src, media: {title}} = this.#playlist[this.currentPlaylistIndex + 1]
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
                    ${title ?? null ? `<p class="T_M_G-video-playlist-next-video-title">${title}</p>` : ""}
                </span>
                <button title="Cancel" type="button" class="T_M_G-video-playlist-next-video-cancel-btn">&times;</button>            
            `   
            this.ui.dom.videoOverlayControlsContainer.append(playlistToastContainer)
            
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
            }

            const handleAutoPlaylistVisibilityChange = () => shouldUnPause = document.visibilityState === "visible"

            const autoNextVideo = () => {
                cleanUpPlaylistToast.call(this)
                setTimeout(() => this.nextVideo())
            }

            const cleanUpPlaylistToastWhenNeeded = () => {
                if (!(this.video.currentTime === this.video.duration)) cleanUpPlaylistToast()
            }

            const autoCleanUpPlaylistToast = () => {
                if (Math.floor(this.video.duration - this.video.currentTime) > this.autoPlaylistCountdown) cleanUpPlaylistToast()
            }

            const cleanUpPlaylistToast = e => {
                playlistToastContainer.remove()
                cancelAnimationFrame(nextVideoFrameId)
                document.removeEventListener("visibilitychange", handleAutoPlaylistVisibilityChange)
                this.video.removeEventListener("pause", cleanUpPlaylistToastWhenNeeded)
                this.video.removeEventListener("waiting", cleanUpPlaylistToastWhenNeeded)
                this.video.removeEventListener("timeupdate", autoCleanUpPlaylistToast)
                if (e) {
                    if (e.target.classList.contains("T_M_G-video-playlist-next-video-cancel-btn"))
                        setTimeout(() => this.autoMovePlaylistActive = false, ((this.video.duration - this.video.currentTime) * 1000))
                } else this.autoMovePlaylistActive = false
            }

            const playlistNextVideoPreviewWrapper = this.ui.dom.videoContainer.querySelector(".T_M_G-video-playlist-next-video-preview-wrapper"),
            playlistNextVideoCountdown = this.ui.dom.videoContainer.querySelector(".T_M_G-video-playlist-next-video-countdown"),
            playlistNextVideoCancelBtn = this.ui.dom.videoContainer.querySelector(".T_M_G-video-playlist-next-video-cancel-btn")

            let isPaused = false, 
            shouldUnPause,
            lastTime,
            constraint = 0,
            timeVisible = 0,
            nextVideoCountdown = count,
            nextVideoFrameId = requestAnimationFrame(updatePlaylistToast)

            document.addEventListener("visibilitychange", handleAutoPlaylistVisibilityChange)
            playlistToastContainer.addEventListener("mouseover", () => isPaused = true)
            playlistToastContainer.addEventListener("mouseleave", () => {if(!playlistToastContainer.matches(":hover")) setTimeout(() => isPaused = false)})
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

    //Play and Pause States
    togglePlay(bool) {
    try {        
        this.video.ended ? this.replay() : typeof bool == "boolean" ? bool ? this.video.play() : this.video.pause() : this.video.paused ? this.video.play() : this.video.pause()
    } catch(e) {
        this._log(e, "error", "swallow")
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
    
    //Buffering
    _handleBufferStart() {
    try {
        this.buffering = true
        this.showVideoOverlay()
        this.ui.dom.videoContainer.classList.add("T_M_G-video-buffering")
    } catch(e) {
        this._log(e, "error", "swallow")
    }                
    }

    _handleBufferStop() {
    try {        
        if (this.buffering) {
        this.buffering = false
        this.overlayRestraint()
        this.ui.dom.videoContainer.classList.remove("T_M_G-video-buffering")
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }                        
    }
    
    _handlePlay() {
    try {
        for (const media of document.querySelectorAll("video, audio")) {
            if (media !== this.video) media.pause()
        }
        this.overlayRestraint()
        this.ui.dom.videoContainer.classList.remove("T_M_G-video-paused")
        if ('mediaSession' in navigator) {
            if (this.media) navigator.mediaSession.metadata = new MediaMetadata(this.media)
            navigator.mediaSession.setActionHandler('play', () => this.togglePlay(true))
            navigator.mediaSession.setActionHandler('pause', () => this.togglePlay(false))
            navigator.mediaSession.setActionHandler("seekbackward", () => this.skip(-this.skipTime))
            navigator.mediaSession.setActionHandler("seekforward", () => this.skip(this.skipTime))
            navigator.mediaSession.setActionHandler("previoustrack", null)
            navigator.mediaSession.setActionHandler("nexttrack", null)
            if (this.#playlist) {
            if (this.currentPlaylistIndex > 0)
                navigator.mediaSession.setActionHandler("previoustrack", () => this.previousVideo())
            if (this.currentPlaylistIndex < this.#playlist?.length - 1)
                navigator.mediaSession.setActionHandler("nexttrack", () => this.nextVideo())
            }            
            navigator.mediaSession.playbackState = "playing"
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }
            
    _handlePause() {
    try {        
        this.showVideoOverlay()
        this.ui.dom.videoContainer.classList.add("T_M_G-video-paused")
        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = "paused"
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    _handleEnded() {
    try {        
        this.ui.dom.videoContainer.classList.add("T_M_G-video-replay")
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }  

    //Time Manipulation
    moveVideoTime(details) {
    try {        
        switch(details.to) {
            case "start":
                this.video.currentTime = 0
                break
            case "end":
                this.video.currentTime = this.video.duration
                break
            default:                        
                this.video.currentTime = (Number(details.to)/Number(details.max)) * this.video.duration
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    _handleTimelineScrubbing(e) {
    try {        
        this.ui.dom.timelineContainer?.setPointerCapture(e.pointerId)
        this.isScrubbing = true
        this.toggleScrubbing(e)
        this.ui.dom.timelineContainer?.addEventListener("pointermove", this._handleTimelineUpdate)
        this.ui.dom.timelineContainer?.addEventListener("pointerup", this.stopTimelineScrubbing, { once: true })
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    stopTimelineScrubbing(e) {
    try {
        this.isScrubbing = false
        if (e) this.toggleScrubbing(e)
        else this.ui.dom.videoContainer.classList.remove("T_M_G-video-scrubbing")
        this.ui.dom.timelineContainer?.removeEventListener("pointermove", this._handleTimelineUpdate)
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }
    
    toggleScrubbing(e) {
    try {        
        const rect = this.ui.dom.timelineContainer?.getBoundingClientRect()
        const percent = Math.min(Math.max(0, e.clientX - rect.x), rect.width) / rect.width
        this.ui.dom.videoContainer.classList.toggle("T_M_G-video-scrubbing", this.isScrubbing)
        if (this.isScrubbing) {
            const {width,height} = tmg.getRenderedBox(this.video)
            this.ui.dom.thumbnailImg.height = height + 1
            this.ui.dom.thumbnailImg.width = width + 1
            this.wasPaused = this.video.paused
            this.video.pause()
        } else {
            this.video.currentTime = percent * this.video.duration
            if (!this.wasPaused) this.video.play()
        }
        this._handleTimelineUpdate(e)
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }

    showPreviewImages() {
        this.ui.dom.videoContainer.classList.add("T_M_G-video-previewing")
    }

    hidePreviewImages() {
        setTimeout(() => this.ui.dom.videoContainer.classList.remove("T_M_G-video-previewing"))
    }

    _handleTimelineUpdate({clientX: x}) { 
    try {        
        if (this.timelineThrottleId !== null) return
        this.timelineThrottleId = setTimeout(() => this.timelineThrottleId = null, this.timelineThrottleDelay)

        const rect = this.ui.dom.timelineContainer?.getBoundingClientRect()
        const percent = tmg.clamp(x - rect.x, 0, rect.width) / rect.width
        const previewTime = tmg.formatDuration(percent * this.video.duration)
        const previewImgMin = (this.ui.dom.previewImgContainer.offsetWidth / 2) / rect.width
        const previewImgPercent = tmg.clamp(previewImgMin, percent, (1 - previewImgMin))
        this.videoCurrentPreviewPosition = percent
        this.videoCurrentPreviewImgPosition = previewImgPercent
        this.ui.dom.previewImgContainer.dataset.previewTime = previewTime  
        if (this.isScrubbing) {
            this.videoCurrentProgressPosition =  percent
            this.overlayRestraint()
        } 
        let previewImgSrc
        if (this.settings.status.ui.previewImages) {
            const previewImgNumber = Math.max(1, Math.floor((percent * this.video.duration) / this.settings.previewImages.fps))
            previewImgSrc = this.settings.previewImages.address.replace('$', previewImgNumber)
            if (this.settings.previewImages !== false && !tmg.queryMediaMobile()) this.ui.dom.previewImg.src = previewImgSrc
            if (this.isScrubbing) this.ui.dom.thumbnailImg.src = previewImgSrc
        } else if (this.settings.previewImages !== false) {
            this.pseudoVideo.currentTime = percent * this.video.duration
            if (this.settings.previewImages !== false && !tmg.queryMediaMobile()) this.ui.previewImgContext.drawImage(this.pseudoVideo, 0, 0, this.ui.dom.previewImg.width, this.ui.dom.previewImg.height)
            if (this.isScrubbing) this.ui.thumbnailImgContext.drawImage(this.pseudoVideo, 0, 0, this.ui.dom.thumbnailImg.width, this.ui.dom.thumbnailImg.height)
        }    
        let arrowPosition, arrowPositionMin = (((this.ui.dom.videoContainer.classList.contains("T_M_G-video-theater") && !this.ui.dom.videoContainer.classList.contains("T_M_G-video-mini-player")) || (this.ui.dom.videoContainer.classList.contains("T_M_G-video-full-screen")) && this.settings.previewImages !== false)) && !tmg.queryMediaMobile() ? 10 : 16.5
        if (percent < previewImgMin) {
            arrowPosition = `${Math.max(percent * rect.width, arrowPositionMin)}px`
        } else if (percent > (1 - previewImgMin)) {
            arrowPosition = `${Math.min(((this.ui.dom.previewImgContainer.offsetWidth/2 + (percent * rect.width) - this.ui.dom.previewImgContainer.offsetLeft)), this.ui.dom.previewImgContainer.offsetWidth - arrowPositionMin)}px`
        } else arrowPosition = "50%"
        this.videoCurrentPreviewImgArrowPosition = arrowPosition
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    _handleTimelineFocus() {
    try {        
        if (this.ui.dom.timelineContainer?.matches(":focus-visible")) {
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
                this.video.currentTime -= e.shiftKey ? 5 : 1
            break
            case "arrowright":
            case "arrowup":
                e.preventDefault()
                e.stopImmediatePropagation()
                this.video.currentTime += e.shiftKey ? 5 : 1
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
        const formattedTime = tmg.formatDuration(this.video.currentTime)
        const percent = isNaN(this.video.currentTime / this.video.duration) ? 0 : this.video.currentTime / this.video.duration
        this.videoCurrentProgressPosition = percent
        if (this.ui.dom.currentTimeElement) this.ui.dom.currentTimeElement.textContent = formattedTime
        if (this.ui.dom.playbackRateNotifier && this.speedCheck && this.speedToken === 1) this.ui.dom.playbackRateNotifier.dataset.currentTime = formattedTime
        this.skipVideoTime = this.video.currentTime
        if ((this.video.currentTime < this.video.duration) && this.ui.dom.videoContainer.classList.contains("T_M_G-video-replay")) this.ui.dom.videoContainer.classList.remove("T_M_G-video-replay")
        if (this.ui.dom.totalTimeElement) this.ui.dom.totalTimeElement.textContent = tmg.formatDuration(this.video.duration)
        if (Math.floor((this.settings?.endTime || this.video.duration) - this.video.currentTime) <= this.autoPlaylistCountdown && Math.round(this.video.duration - this.video.currentTime) >= 1) this.autoMovePlaylist()
    } catch(e) {
        this._log(e, "error", "swallow")
    }            
    }

    //Time Skips
    skip(duration, persist = false) {
    try {
        const notifier = duration > 0 ? this.ui.dom.fwdNotifier : this.ui.dom.bwdNotifier
        duration = Math.sign(duration) === 1 ? this.video.duration - this.video.currentTime > duration ? duration : this.video.duration - this.video.currentTime : Math.sign(duration) === -1 ? this.video.currentTime > Math.abs(duration) ? duration : -this.video.currentTime : 0
        duration = Math.trunc(duration)
        this.skipVideoTime += duration
        this.videoCurrentProgressPosition = this.skipVideoTime / this.video.duration
        this.video.currentTime += duration
        if (persist) {
            if (notifier != this.currentNotifier) {
                this.skipDuration = 0
                this.currentNotifier?.classList.remove("T_M_G-video-control-persist")
            }
            this.currentNotifier = notifier
            notifier.classList.add("T_M_G-video-control-persist")
            this.removeOverlay() 
            this.skipDuration += duration
            if (this.skipDurationId) clearTimeout(this.skipDurationId)
            this.skipDurationId = setTimeout(() => {
                this.skipDuration = 0
                notifier.classList.remove("T_M_G-video-control-persist")
                this.removeOverlay() 
            }, Number(this.videoArrowsTransitionTime.replace('ms', '')) + 10)
            notifier.dataset.skip = this.skipDuration
            return
        } 
        if ((this.video.currentTime === 0 && notifier.classList.contains("T_M_G-video-bwd-notifier")) || (this.video.currentTime === this.video.duration && notifier.classList.contains("T_M_G-video-fwd-notifier")))
            duration = 0
        notifier.dataset.skip = Math.abs(duration)
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }
            
    //Playback
    changePlaybackRate() {
    try {        
        let newPlaybackRate = this.video.playbackRate + .25
        if (newPlaybackRate > 2) newPlaybackRate = .25
        this.video.playbackRate = newPlaybackRate
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }
    
    _handlePlaybackChange() {
    try {        
        if (this.ui.dom.playbackRateBtn) this.ui.dom.playbackRateBtn.textContent = `${this.video.playbackRate}x`
        if (this.ui.dom.playbackRateNotifier) this.ui.dom.playbackRateNotifier.textContent = `${this.video.playbackRate}x`  
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }
    
    speedUp(pos) {
    try {        
        if (!this.speedCheck) {
            const rect = this.video.getBoundingClientRect()
            this.speedCheck = true
            this.wasPaused = this.video.paused
            if (pos && this.settings.status.beta.rewind) {
                pos === "left" ? this.rewind() : this.fastForward()
            } else this.fastForward()
            this.ui.dom.playbackRateNotifier.classList.add("T_M_G-video-control-active")
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }    
    }

    fastForward() {
        try {
            this.speedToken = 1
            this.previousRate = this.video.playbackRate
            this.video.playbackRate = 2    
            if (this.wasPaused) this.video.play()
        } catch(e) {
            this._log(e, "error", "swallow")
        }
    }

    rewind() {
        try {
            this.speedToken = 0
            this.ui.dom.notifiersContainer.querySelector(".T_M_G-video-playback-rate-notifier").textContent = '2x'
            this.ui.dom.playbackRateNotifier.classList.add("T_M_G-video-rewind")
            this.video.addEventListener("play", this.rewindReset)
            this.video.addEventListener("pause", this.rewindReset)
            this.speedVideoTime = this.video.currentTime
            this.speedIntervalId = setInterval(this.rewindVideo.bind(this), 20)
            setTimeout(() => {
                if (this.wasPaused) this.video.play()
            }, 1000)
        } catch(e) {
            this._log(e, "error", "swallow")
        }
    }        


    rewindVideo() {
    try {        
        this.speedVideoTime -= 0.04
        this.videoCurrentProgressPosition = this.speedVideoTime / this.video.duration
        if (this.ui.dom.playbackRateNotifier) this.ui.dom.playbackRateNotifier.dataset.currentTime = tmg.formatDuration(Math.max(this.speedVideoTime, 0))
        this.video.currentTime -= .04
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    rewindReset() {
    try {
        clearInterval(this.speedIntervalId)
        if(!this.video.paused) this.speedIntervalId = setInterval(this.rewindVideo.bind(this), 20)
    } catch(e) {
        this._log(e, "error", "swallow")
    }            
    }
    
    slowDown() {
    try {        
        if (this.speedCheck) {
            this.speedCheck = false
            if (this.wasPaused) this.video.pause()
            if (this.speedToken === 1) {
                this.video.playbackRate = this.previousRate
            } else if (this.speedToken === 0) {
                if (this.ui.dom.playbackRateNotifier) this.ui.dom.playbackRateNotifier.textContent = `${this.previousRate}x`
                this.ui.dom.playbackRateNotifier.classList.remove("T_M_G-video-rewind")
                this.video.removeEventListener("play", this.rewindReset)
                this.video.removeEventListener("pause", this.rewindReset)
                if (this.speedIntervalId) clearInterval(this.speedIntervalId)
            }
            this.ui.dom.playbackRateNotifier.classList.remove("T_M_G-video-control-active")
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }    
    }

    //Captions
    toggleCaptions() {
    try {        
        if (this.video.textTracks[this.textTrackIndex]) {
        const isHidden = this.video.textTracks[this.textTrackIndex].mode === "hidden"
        this.video.textTracks[this.textTrackIndex].mode = isHidden ? "showing" : "hidden"
        this.ui.dom.videoContainer.classList.toggle("T_M_G-video-captions", isHidden)
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }
            
    //Volume
    toggleMute() {
    try {
        this.video.muted = !this.video.muted
        if (this.video.volume == 0) this.video.volume = this.lastVolume
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    _handleVolumeSliderInput({target}) {
    try {                
        this.video.volume = target.value / 100
        this.video.muted = target.value === 0
        if (this.lastVolumeTimeoutId) clearTimeout(this.lastVolumeTimeoutId)
        if (this.video.volume > 0) this.lastVolumeTimeoutId = setTimeout(() => this.lastVolume = this.video.volume, 250)
        this.volumeActiveRestraint()            
        this.overlayRestraint()
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }

    _handleVolumeSliderMouseDown() {
        this.ui.dom.volumeSlider?.classList.add("T_M_G-video-control-active")
    }

    _handleVolumeSliderMouseUp() {
        this.ui.dom.volumeSlider?.classList.remove("T_M_G-video-control-active")
    }
                
    _handleVolumeChange() {
    try {
    if (this.ui.dom.volumeSlider) {
        let { min, max, value } = this.ui.dom.volumeSlider
        value = (this.video.volume * 100).toFixed()
        this.ui.dom.notifiersContainer.querySelector(".T_M_G-video-volume-notifier-content").dataset.volume = value
        let volumeLevel = ""
        if (this.video.muted || value == 0) {
            value = 0
            volumeLevel = "muted"
        } else if (value > (max/2)) 
            volumeLevel = "high"
        else 
            volumeLevel = "low"
        let volumePercent = (value-min) / (max - min)
        let volumeSliderPercent = `${12 + (volumePercent * 77)}%`
        this.ui.dom.volumeSlider.value = value
        this.ui.dom.volumeSlider.dataset.volume = `${value}`
        this.videoCurrentVolumeValuePosition = volumeSliderPercent
        this.videoCurrentVolumeSliderPosition = volumePercent
        this.ui.dom.videoContainer.dataset.volumeLevel = volumeLevel
    }
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    volumeChange(type, value) {
    try {
        const n = value / 100
        switch(type) {
            case "increment":
                if ((this.video.volume*100).toFixed() == 100-value) {
                    this.video.volume = 1
                    this.fire("volumeup")
                    break
                }
                if ((this.video.volume*100).toFixed() < 100) this.video.volume += ((this.video.volume*100).toFixed()%value) ? (n - this.video.volume%n).toFixed(2) : n 
                this.fire("volumeup")
                break
            case "decrement":
                if (this.video.volume == 0 || (this.video.volume*100).toFixed() == value) {
                    this.video.volume = 0
                    this.fire("volumemuted")
                    break
                }
                if (this.video.volume) this.video.volume -= ((this.video.volume*100).toFixed()%value) ? (this.video.volume%n) : n   
                this.fire("volumedown")
                break
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }

    _handleVolumeContainerMouseMove() {
    try {        
        if (this.volumeActiveId) clearTimeout(this.volumeActiveId)
        this.volumeActiveId = setTimeout(() => {
            if (this.ui.dom.volumeSlider?.parentElement.matches(':hover')) {
                this.ui.dom.volumeSlider?.parentElement.classList.add("T_M_G-video-control-active")
                this.volumeActiveRestraint()
            }
        }, 250)
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    volumeActiveRestraint() {
    try {
        if (this.volumeActiveRestraintId) clearTimeout(this.volumeActiveRestraintId)
        this.volumeActiveRestraintId = setTimeout(() => this.ui.dom.volumeSlider?.parentElement.classList.remove("T_M_G-video-control-active"), this.overlayRestraintTime)  
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }

    _handleVolumeContainerMouseUp() {
    try {
        if (this.volumeActiveId) clearTimeout(this.volumeActiveId)
    } catch(e) {
        this._log(e, "error", "swallow")
    }            
    }

    //theater mode
    toggleTheaterMode() {
    try {
        if (this.settings.status.modes.theater) this.ui.dom.videoContainer.classList.toggle("T_M_G-video-theater")
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }
    
    //full-screen mode
    inFullScreen() {
        return !!( document.fullscreenElement || document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement)
    }

    toggleFullScreenMode() {
    try {
        if (this.settings.status.modes.fullScreen) {
        if(!this.inFullScreen()) {
            if (document.pictureInPictureElement) document.exitPictureInPicture()
            if (this.ui.dom.videoContainer.requestFullscreen) this.ui.dom.videoContainer.requestFullscreen()
			else if (this.ui.dom.videoContainer.mozRequestFullScreen) this.ui.dom.videoContainer.mozRequestFullScreen()
			else if (this.ui.dom.videoContainer.webkitRequestFullScreen) video.webkitRequestFullScreen() || this.ui.dom.videoContainer.webkitRequestFullScreen()
			else if (this.ui.dom.videoContainer.msRequestFullscreen) this.ui.dom.videoContainer.msRequestFullscreen()
        } else {
            if (document.exitFullscreen) document.exitFullscreen()
			else if (document.mozCancelFullScreen) document.mozCancelFullScreen()
			else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen()
			else if (document.msExitFullscreen) document.msExitFullscreen()
        }
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    _handleFullScreenChange() {
    try {
        this.ui.dom.videoContainer.classList.toggle("T_M_G-video-full-screen", this.inFullScreen())  
        const lockOrientation = this.video.videoWidth > this.video.videoHeight ? "landscape" : "portrait"
        if (this.inFullScreen()) {
            if (screen.orientation && screen.orientation.lock) screen.orientation.lock(lockOrientation).then(() => this.ui.dom.fullScreenOrientationBtn.classList.remove("T_M_G-video-control-hidden")).catch(e => this._log(e, "error", "swallow"))
            this.toggleMiniPlayerMode(false)
        } else {
            if (screen.orientation && screen.orientation.lock) screen.orientation.unlock()
            this.ui.dom.fullScreenOrientationBtn.classList.add("T_M_G-video-control-hidden")
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

    //picture-in-picture mode
    togglePictureInPictureMode() {
    try {
        if (this.settings.status.modes.pictureInPicture) {
        this.ui.dom.videoContainer.classList.contains("T_M_G-video-picture-in-picture") ? document.exitPictureInPicture() : this.video.requestPictureInPicture()
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    } 

    _handleEnterPictureInPicture() {
    try {
        this.ui.dom.videoContainer.classList.add("T_M_G-video-picture-in-picture")
        this.toggleMiniPlayerMode(false)
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    _handleLeavePictureInPicture() {
    try {
        this.ui.dom.videoContainer.classList.remove("T_M_G-video-picture-in-picture")
        this.toggleMiniPlayerMode()
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }        

    //mini player mode
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
        const threshold = 240
        if (bool === false) {
            if (behaviour) {
                window.scrollTo({
                    top: this.ui.dom.videoContainer.parentNode.offsetTop,
                    left: 0,
                    behavior: behaviour,
                })      
            }
            this.removeMiniPlayer()
            return
        }
        if ((!this.ui.dom.videoContainer.classList.contains("T_M_G-video-mini-player") && !this.video.paused && window.innerWidth >= threshold && !document.pictureInPictureElement && !this.parentIntersecting && !this.inFullScreen()) || (bool === true)) {
            this.ui.dom.videoContainer.parentElement.insertBefore(this.pseudoVideoContainer, this.ui.dom.videoContainer)
            this.ui.dom.videoContainer.classList.add("T_M_G-video-mini-player")
            this.ui.dom.videoContainer.addEventListener("mousedown", this.moveMiniPlayer)
            this.ui.dom.videoContainer.addEventListener("touchstart", this.moveMiniPlayer, {passive: false})
            return
        } 
        if ((this.ui.dom.videoContainer.classList.contains("T_M_G-video-mini-player") && this.parentIntersecting) || (this.ui.dom.videoContainer.classList.contains("T_M_G-video-mini-player") && window.innerWidth < threshold)) this.removeMiniPlayer()
    }
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }                  

    removeMiniPlayer() {
        try {
            this.pseudoVideoContainer.remove()
            this.ui.dom.videoContainer.classList.remove("T_M_G-video-mini-player")
            this.ui.dom.videoContainer.removeEventListener("mousedown", this.moveMiniPlayer)
            this.ui.dom.videoContainer.removeEventListener("touchstart", this.moveMiniPlayer, {passive: false})
        } catch(e) {
            this._log(e, "error", "swallow")
        }
    }                

    moveMiniPlayer(e){
    try {
        if (this.ui.dom.videoContainer.classList.contains("T_M_G-video-mini-player")) {
        if (!this.ui.dom.videoControlsContainer.contains(e.target)) {
            this.miniPlayerInMotion = true
            this.ui.dom.videoContainer.classList.remove("T_M_G-video-overlay")
            this.ui.dom.videoContainerContent.classList.add("T_M_G-video-cursor-auto")
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
        this.miniPlayerInMotion = false
        this.showVideoOverlay()
        this.ui.dom.videoContainerContent.classList.remove("T_M_G-video-cursor-auto")
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
        e.preventDefault()
        if (this.miniPlayerThrottleId !== null) return
        this.miniPlayerThrottleId = setTimeout(() => this.miniPlayerThrottleId = null, this.miniPlayerThrottleDelay)

        let {innerWidth: ww, innerHeight: wh} = window,
        {offsetWidth: w, offsetHeight: h} = this.ui.dom.videoContainer
        const x = e.clientX ?? e.changedTouches[0].clientX,
        y = e.clientY ?? e.changedTouches[0].clientY,
        xR = 0,
        yR = 0,
        posX = tmg.clamp(xR, ww - x - w/2, ww - w - xR),
        posY = tmg.clamp(yR, wh - y - h/2, wh - h - yR)
        this.videoCurrentMiniPlayerX = `${Math.round(posX/ww * 100)}%`
        this.videoCurrentMiniPlayerY = `${Math.round(posY/wh * 100)}%`
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }    

    //Keyboard and General Accessibility Functions
    _handleClick({target}) {
    try {
        if (target === this.ui.dom.videoControlsContainer || target === this.ui.dom.videoOverlayControlsContainer) {
        if (tmg.queryMediaMobile() && !this.ui.dom.videoContainer.classList.contains("T_M_G-video-mini-player")) {
            if (!this.buffering) this.ui.dom.videoContainer.classList.toggle("T_M_G-video-overlay")
        } 
        if (tmg.queryMediaMobile() || this.ui.dom.videoContainer.classList.contains("T_M_G-video-mini-player")) return
        if (this.playId) clearTimeout(this.playId)
        this.playId = setTimeout(() => {
            if (!(this.speedCheck && this.playTriggerCounter < 1))  this.togglePlay()
                this.showVideoOverlay()
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

    _handleDoubleClick({clientX: x, target}) {
    try {
        if (target === this.ui.dom.videoControlsContainer || target === this.ui.dom.videoOverlayControlsContainer) {
        if (this.playId) clearTimeout(this.playId)
        const rect = this.video.getBoundingClientRect()
        if (((x-rect.left) > (this.video.offsetWidth*0.65))) {
            this.skip(this.dbcSkipTime, true)
        } else if ((x-rect.left) < (this.video.offsetWidth*0.35)) {
            this.skip(-this.dbcSkipTime, true)
        } else this.toggleFullScreenMode()
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    _handleHoverPointerMove() {
    try {
        if (!(tmg.queryMediaMobile() && !this.ui.dom.videoContainer.classList.contains("T_M_G-video-mini-player"))) this.showVideoOverlay()
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
        if (!tmg.queryMediaMobile() && !this.ui.dom.videoContainer.matches(":hover")) this.removeOverlay()
    } catch(e) {
        this._log(e, "error", "swallow")
    }                    
    }

    showVideoOverlay() {
    try {
        if (!this.miniPlayerInMotion) this.ui.dom.videoContainer.classList.add("T_M_G-video-overlay")
        this.overlayRestraint()
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }
    
    overlayRestraint() {
    try {        
        if (this.overlayRestraintId) clearTimeout(this.overlayRestraintId)
        if (!this.video.paused && !this.buffering) {
            this.overlayRestraintId = setTimeout(() => this.removeOverlay(), this.overlayRestraintTime)
        }
    } catch(e) {
        this._log(e, "error", "swallow")        
    }    
    }        

    removeOverlay() {
    try {
        if (!this.video.paused && !this.buffering) this.ui.dom.videoContainer.classList.remove("T_M_G-video-overlay")
    } catch(e) {
        this._log(e, "error", "swallow")
    }                    
    }

    _handlePointerDown(e) {
    try {
        if (e.target === this.ui.dom.videoControlsContainer || e.target === this.ui.dom.videoOverlayControlsContainer) {
        if (!this.ui.dom.videoContainer.classList.contains("T_M_G-video-mini-player")) {    
            //conditions to cancel the speed timeout
            //tm: if user moves finger before speedup is called like during scrolling
            this.ui.dom.videoContainer.addEventListener("touchmove", this._handleSpeedPointerUp)     
            this.ui.dom.videoContainer.addEventListener("mouseup", this._handleSpeedPointerUp)
            this.ui.dom.videoContainer.addEventListener("mouseleave", this._handleSpeedPointerOut)           
            this.ui.dom.videoContainer.addEventListener("touchend", this._handleSpeedPointerUp)
            this.speedPointerCheck = true
            const x = e.clientX ?? e.changedTouches[0].clientX
	        const rect = this.video.getBoundingClientRect()
            this.speedPosition = x - rect.left >= this.video.offsetWidth * 0.5 ? "right" : "left"
            if (this.speedTimeoutId) clearTimeout(this.speedTimeoutId)
            this.speedTimeoutId = setTimeout(() => {   
                //tm: removing listener since speedup is being called and user is not scrolling
                this.ui.dom.videoContainer.removeEventListener("touchmove", this._handleSpeedPointerUp)     
                if (this.settings.status.beta.rewind) {
                this.ui.dom.videoContainer.addEventListener("mousemove", this._handleSpeedPointerMove)
                this.ui.dom.videoContainer.addEventListener("touchmove", this._handleSpeedPointerMove, {passive: true})
                }
                this.speedUp(this.speedPosition)
            }, this.speedUpThreshold)
        }
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }   

    _handleSpeedPointerOut(e) {
    try {
        if (!this.ui.dom.videoContainer.matches(":hover")) this._handleSpeedPointerUp(e)
    } catch(e) {
        this._log(e, "error", "swallow")
    }          
    }
    
    _handleSpeedPointerMove(e) {
    try {
        if (this.speedThrottleId !== null) return
        this.speedThrottleId = setTimeout(() => this.speedThrottleId = null, this.speedThrottleDelay)
        
        const rect = this.video.getBoundingClientRect()
        const x = e.clientX ?? e.changedTouches[0].clientX
        const currPos = x - rect.left >= this.video.offsetWidth * 0.5 ? "right" : "left"
        if (currPos !== this.speedPosition) {
            this.speedPosition = currPos
            this.slowDown()
            setTimeout(this.speedUp.bind(this), 0, currPos)
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }
    }
        
    _handleSpeedPointerUp() {
    try {
        this.ui.dom.videoContainer.removeEventListener("mouseup", this._handleSpeedPointerUp)
        this.ui.dom.videoContainer.removeEventListener("mouseleave", this._handleSpeedPointerOut)      
        this.ui.dom.videoContainer.removeEventListener("touchend", this._handleSpeedPointerUp)
        if (this.settings.status.beta.rewind) {
        this.ui.dom.videoContainer.removeEventListener("mousemove", this._handleSpeedPointerMove)
        this.ui.dom.videoContainer.removeEventListener("touchmove", this._handleSpeedPointerMove, {passive: true})
        }
        this.speedPointerCheck = false
        if (this.speedTimeoutId) clearTimeout(this.speedTimeoutId)
        if (this.speedCheck && this.playTriggerCounter < 1) this.slowDown()     
    } catch(e) {
        this._log(e, "error", "swallow")                   
    }
    }

    _handleKeyDown(e) {
    try {
        const activeTagName = document.activeElement.tagName.toLowerCase()
        //early key returns
        if (activeTagName === "input") return

        if (this.isTimelineFocused)
            if (e.key.toString().toLowerCase().startsWith("arrow")) return

        //checking if the key is an arrow, home or end key
        if ([...Object.values(this.settings.keyShortcuts)].some(key => this.keyOverrideRegex.test(key.toLowerCase())) && this.keyOverrideRegex.test(e.key.toString().toLowerCase())) e.preventDefault()
        
        switch (e.key.toString().toLowerCase()) {
            case " ":
                if (activeTagName === "button") return
                e.preventDefault()
            case this.settings.keyShortcuts["playPause"]?.toString()?.toLowerCase():
                this.playTriggerCounter ++
                if (this.playTriggerCounter === 1) document.addEventListener("keyup", this._handlePlayTriggerUp)
                if (this.playTriggerCounter === 2 && !this.speedPointerCheck) e.shiftKey ? this.speedUp("left") : this.speedUp("right")
                break
            case this.settings.keyShortcuts["skipBwd"]?.toString()?.toLowerCase():
                e.shiftKey ? this.skip(-this.skipTime * 2) : this.skip(-this.skipTime)
                this.fire("bwd")
                break
            case this.settings.keyShortcuts["skipFwd"]?.toString()?.toLowerCase():
                e.shiftKey ? this.skip(this.skipTime * 2) : this.skip(this.skipTime)
                this.fire("fwd")
                break
            case this.settings.keyShortcuts["volumeUp"]?.toString()?.toLowerCase():
                this.volumeChange("increment", 5)
                break
            case this.settings.keyShortcuts["volumeDown"]?.toString()?.toLowerCase():
                this.volumeChange("decrement", 5)
                break   
            case this.settings.keyShortcuts["playbackRate"]?.toString()?.toLowerCase(): 
                this.changePlaybackRate()
                this.fire("playbackratechange")
                break
            case this.settings.keyShortcuts["prev"]?.toString()?.toLowerCase():
                if (e.shiftKey) this.previousVideo()
                break
            case this.settings.keyShortcuts["next"]?.toString()?.toLowerCase():
                if (e.shiftKey) this.nextVideo()
                break               
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }        

    _handleKeyUp(e) {
    try {
        //early key returns
        if (document.activeElement.tagName.toLowerCase() === "input") return

        if (this.isTimelineFocused)
            if (e.key.toString().toLowerCase().startsWith("arrow")) return

        //checking if the key is an arrow, home or end key
        if ([...Object.values(this.settings.keyShortcuts)].some(key => this.keyOverrideRegex.test(key.toLowerCase())) && this.keyOverrideRegex.test(e.key.toString().toLowerCase())) e.preventDefault()

        switch (e.key.toString().toLowerCase()) {                         
            case this.settings.keyShortcuts["fullScreen"]?.toString()?.toLowerCase():
                if (this.settings.status.modes.fullScreen) {
                this.toggleFullScreenMode()
                this.fire("fullScreen")
                }
                break
            case this.settings.keyShortcuts["theater"]?.toString()?.toLowerCase():
                if (!tmg.queryMediaMobile() && !this.ui.dom.videoContainer.classList.contains("T_M_G-video-mini-player") && !this.ui.dom.videoContainer.classList.contains("T_M_G-video-full-screen") && this.settings.status.modes.theater) {
                this.toggleTheaterMode()
                this.fire("theater")
                }
                break
            case this.settings.keyShortcuts["expandMiniPlayer"]?.toString()?.toLowerCase():
                if (this.ui.dom.videoContainer.classList.contains("T_M_G-video-mini-player")) {
                e.shiftKey ? this.toggleMiniPlayerMode(false, "smooth") : this.toggleMiniPlayerMode(false, "instant")
                }
                break
            case this.settings.keyShortcuts["removeMiniPlayer"]?.toString()?.toLowerCase():
                if (this.ui.dom.videoContainer.classList.contains("T_M_G-video-mini-player")) {
                e.shiftKey ? this.replay() : this.toggleMiniPlayerMode(false) 
                }
                break
            case this.settings.keyShortcuts["pictureInPicture"]?.toString()?.toLowerCase():
                if (this.settings.status.modes.pictureInPicture) {
                if (!e.shiftKey && !e.ctrlKey) this.togglePictureInPictureMode()
                }
                break
            case this.settings.keyShortcuts["mute"]?.toString()?.toLowerCase():
                this.toggleMute()
                this.video.muted ? this.fire("volumemuted") : this.fire("volumeup")
                break
            case this.settings.keyShortcuts["captions"]?.toString()?.toLowerCase():
                if (this.video.textTracks[this.textTrackIndex]) {
                this.toggleCaptions()
                this.fire("captions")
                }
                break
            case this.settings.keyShortcuts["settings"]?.toString()?.toLowerCase():
                this.toggleSettingsView() 
            break
            case this.settings.keyShortcuts["start"]?.toString()?.toLowerCase():
            case "0":
                this.moveVideoTime({to: "start"})
                break
            case this.settings.keyShortcuts["end"]?.toString()?.toLowerCase():
                this.moveVideoTime({to: "end"})
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
                    this.togglePlay()
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

    //drag and drop implementation
    _handleDragStart({target, dataTransfer}) {
    try {
        dataTransfer.effectAllowed = "move"
        target.classList.add("T_M_G-video-control-dragging")
        this.dragging = target === this.ui.dom.muteBtn ? target.parentElement : target
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
        this.showVideoOverlay()
        target.classList.remove("T_M_G-video-control-dragging")
        let controllerStructure = []
        controllerStructure.push(this.settings.controllerStructure.find(c => c.startsWith("timeline")))
        const leftSideStructure = this.settings.status.ui.leftSidedControls && this.ui.dom.leftSidedControlsWrapper.children ? Array.from(this.ui.dom.leftSidedControlsWrapper.children, el => el.dataset.controlId) : []
        const rightSideStructure = this.settings.status.ui.rightSidedControls && this.ui.dom.leftSidedControlsWrapper.children ? Array.from(this.ui.dom.rightSidedControlsWrapper.children, el => el.dataset.controlId) : []
        controllerStructure = controllerStructure.concat(leftSideStructure, ["spacer"], rightSideStructure)
        this.settings.controllerStructure = controllerStructure
    } catch(e) {
        this._log(e, "error", "swallow")
    }        
    }

    _handleDragEnter({target}) {
    try {
        if (target.dataset.dropzone) {
            target.classList.add("T_M_G-video-dragover")
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }                
    }

    _handleDragOver(e) {
    try {
        e.preventDefault()
        if (e.target.dataset.dropzone) {
            e.dataTransfer.dropEffect = "move"
            const afterControl = this.getControlAfterDragging(e.target, e.clientX)
            if (afterControl ?? false) {
                e.target.insertBefore(this.dragging, afterControl) 
            } else {
                e.target.appendChild(this.dragging) 
            }            
        }
    } catch(e) {
        this._log(e, "error", "swallow")
    }                
    }

    _handleDrop(e) {
    try {        
        e.preventDefault()
        if (e.target.dataset.dropzone) {
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
        const draggableControls = [...container.querySelectorAll("[draggable=true]:not(.T_M_G-video-control-dragging, .T_M_G-video-mute-btn), .T_M_G-video-volume-container:has([draggable=true])")]

        return draggableControls.reduce((closest, child) => {
            const box = child.getBoundingClientRect()
            const offset = x - box.left - (box.width / 2)
            if (offset < 0 && offset > closest.offset) 
                return {offset: offset, element: child}
            else 
                return closest
        }, {offset: Number.NEGATIVE_INFINITY}).element
    }
}

class _T_M_G_Media_Player extends _T_M_G_Video_Player {
    #active
    #medium
    #build
    constructor(customOptions) {
        super()
        this.#build = tmg.DEFAULT_VIDEO_BUILD
        this.builder(customOptions)
    }

    set userSettings(customOptions) {
        localStorage.tmgUserVideoOptions = customOptions
    }

    get userSettings() {
        if (localStorage.tmgUserVideoOptions) 
            return JSON.parse(localStorage.tmgUserVideoOptions)
        else 
            return this.#build.settings
    }
    
    set build(customOptions) {
        this.builder(customOptions)
    }

    get build() {
        return this.#build
    }   
    
    queryBuild() {
        if (this.#active) {
            console.error("TMG has already deployed the custom controls of your build configuration options")
            console.warn("Consider setting your build configuration before attaching your media element")
            if (this.#build.settings.allowOverride) {
                console.warn("You are only allowed to override the settings of the media player by calling the 'config' method")
            } else {
                console.warn("You cannot override any of the media player settings due to the build configuration")
            }
            return false
        } else {
            return true
        }
    }

    builder(customOptions) {
        if (this.queryBuild()) {
        if (typeof customOptions === "object") {
            this.#build = {...this.#build, ...customOptions}
            //The general settings and nested key shortcuts can either take the value of false to signify that they are not wanted or they can be given the value of true o use all the defaults or they can use the values passed down in the parameter, any other value like null or undefined will also pass down the default values
            this.#build.settings = this.#build.settings !== false ? (this.#build.settings ?? false) || !(this.#build.settings === true) ? {...tmg.DEFAULT_VIDEO_BUILD.settings, ...this.#build.settings} : tmg.DEFAULT_VIDEO_BUILD.settings : false
            this.#build.settings.keyShortcuts = this.#build.settings.keyShortcuts !== false ? (this.#build.settings.keyShortcuts ?? false) || !(this.#build.settings.keyShortcuts !== true) ? {...tmg.DEFAULT_VIDEO_BUILD.settings.keyShortcuts, ...this.#build.settings.keyShortcuts} : tmg.DEFAULT_VIDEO_BUILD.settings.keyShortcuts : false
        }
        }
    }

    attach(medium) {
        if (tmg.isIterable(medium)) {
            console.error("Please provide a single media element to the TMG media player")
            console.warn("Consider looping the iterable argument to get a single argument and instantiate a new 'tmg.Player' for each of them")
        } else {
            if (this.#active ?? false) {
                console.error("This TMG media player already has a viable media element attached")
                console.warn("Consider creating another instance of the 'TMG' class to attach your media")
            } else {
                this.#medium = medium
                this.#deploy()
            }
        }
    }

    #deploy() {
        if (this.#medium.tagName.toLowerCase() === "video") {
            if (this.#medium.controls) {
                console.error("TMG refused to override default video controls")
                console.warn("Please remove the 'controls' attribute to deploy the TMG video controller!")
                return                
            }
            this.#medium.classList.add("T_M_G-video")
            //making sure the video plays inline even on ios mobile
            this.#medium.setAttribute("playsinline", true)
            this.#medium.setAttribute("webkit-playsinline", true)
            //doing some cleanup to make sure no necessary settings were removed
            const settings = this.#build.settings.allowOverride ? {...this.#build.settings, ...this.userSettings} : this.#build.settings
            this.#build.video = this.#medium
            this.#build.mediaPlayer = 'TMG'
            this.#build.mediaType = 'video'
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
            const sources = this.#medium.querySelectorAll("source")
            const tracks = this.#medium.querySelectorAll("track[kind='captions'], track[kind='subtitles']")
            if (this.#build.src) {
                tmg.removeSources(this.#medium)
                this.#medium.setAttribute("src", this.#build.src)
            } else if (this.#build.sources) {
                this.#medium.removeAttribute("src")
                tmg.removeSources(this.#medium)
                tmg.addSources(this.#build.sources, this.#medium)
            } else if (this.#medium.src) {
                this.#build.src = this.#medium.src
            } else if (sources.length > 0) {
                this.#build.sources = []
                for (const source of sources) {
                    const obj = {} 
                    tmg.putSourceDetails(source, obj)
                    this.#build.sources.push(obj)
                }
            }
            if (this.#build.tracks) {
                tmg.removeTracks(this.#medium)
                tmg.addTracks(this.#build.tracks, this.#medium)
            } else if (tracks.length > 0) {
                this.#build.tracks = []
                for (const track of tracks) {
                    const obj = {}
                    tmg.putTrackDetails(track, obj)
                    this.#build.tracks.push(obj)
                }
            }
            this.#medium.autoplay = settings.autoplay = (settings.autoplay === true) ? settings.autoplay : this.#medium.autoplay
            this.#medium.loop = settings.loop = (settings.loop === true) ? settings.loop : this.#medium.loop
            this.#medium.muted = settings.muted = (settings.muted === true) ? settings.muted : this.#medium.muted
            //doing some more work setting boolean values to indicate the status of the player
            settings.status = {}
            settings.status.allowOverride = {
                beta: false,
                modes: false, 
                controllerStructure: false, 
                startTime: false,
                endTime: false,
                notifiers: false,
                progressBar: false, 
                persist: false,
                autoplay: false,
                loop: false, 
                muted: false, 
                previewImages: false,
                keyShortcuts: false
            }
            settings.status.beta = {
                rewind: false,
                draggableControls: false
            }          
            //beta and override can either be a boolean or an array of all the features that the developer specifies, if it is a boolean, the boolean is assigned to all props else the specified features are assigned so if value is truthy then, the props will not be assigned a false value which was assigned above except explicitly stated
            if (settings.allowOverride) {
                if (settings.allowOverride === true) {
                    Object.keys(settings.status.allowOverride).forEach(key => settings.status.allowOverride[key] = true)
                } else {
                    settings.status.allowOverride = {
                        beta: settings.allowOverride.includes("beta"),
                        modes: settings.allowOverride.includes("modes"),
                        controllerStructure: settings.allowOverride.includes("controllerStructure"),
                        startTime: settings.allowOverride.includes("startTime"),
                        endTime: settings.allowOverride.includes("endTime"),
                        notifiers: settings.allowOverride.includes("notifiers"),
                        progressBar: settings.allowOverride.includes("progressBar"),
                        persist: settings.allowOverride.includes("persist"),
                        autoplay: settings.allowOverride.includes("autoplay"),
                        loop: settings.allowOverride.includes("loop"),
                        muted: settings.allowOverride.includes("muted"),
                        previewImages: settings.allowOverride.includes("previewImages"),
                        keyShortcuts: settings.allowOverride.includes("keyShortcuts")
                    }
                }
            }
            if (settings.beta) {
                if (settings.beta === true) {
                    Object.keys(settings.status.beta).forEach(key => settings.status.beta[key] = true)
                } else {
                    settings.status.beta = {
                        rewind: settings.beta.includes("rewind"),
                        draggableControls: settings.beta.includes("draggableControls")
                    }
                }
            }
            settings.status.ui = {
                //notifiers would be in the UI if specified in the settings or if not specified but override is allowed
                notifiers: settings.notifiers || (!settings.notifiers && settings.status.allowOverride.notifiers),
                prev: settings.controllerStructure.includes("prev"),
                playPause: settings.controllerStructure.includes("playPause"),
                timeline: settings.controllerStructure.some(c => c.startsWith("timeline")),
                next: settings.controllerStructure.includes("next"),
                volume: settings.controllerStructure.includes("volume"),
                duration: settings.controllerStructure.includes("duration"),
                captions: settings.controllerStructure.includes("captions"),
                settings: settings.controllerStructure.includes("settings"),
                playbackRate: settings.controllerStructure.includes("playbackRate"),
                pictureInPicture: settings.controllerStructure.includes("pictureInPicture"),
                theater: settings.controllerStructure.includes("theater"),
                fullScreen: settings.controllerStructure.includes("fullScreen"),
                previewImages: (settings.previewImages?.address && settings.previewImages?.fps) ? true : false,
                leftSidedControls: settings.controllerStructure.indexOf("spacer") > -1 ? settings.controllerStructure.slice(0, settings.controllerStructure.indexOf("spacer")).length > 0 : true,
                rightSidedControls: settings.controllerStructure.indexOf("spacer") > -1 ? settings.controllerStructure.slice(settings.controllerStructure.indexOf("spacer") + 1).length > 0 : false,
                //draggable controls would be in the UI if there is a controller structure and if specified in the beta features and if override is allowed
                draggableControls: !!(settings.controllerStructure && settings.status.allowOverride.controllerStructure)
            }
            settings.status.modes = {
                fullScreen: settings.modes.includes("fullScreen") && !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullscreen || document.webkitFullscreenEnabled),
                theater: settings.modes.includes("theater"),
                pictureInPicture: settings.modes.includes("pictureInPicture") && document.pictureInPictureEnabled,
                miniPlayer: settings.modes.includes("miniPlayer")
            }  
            //Updating the build settings after the cleanup and modifications
            this.#build.settings = {...tmg.DEFAULT_VIDEO_BUILD.settings, ...settings}
            //commented out so drag and drop polyfill can be easily toggled
            //tmg.loadResource("/TMG_MEDIA_PROTOTYPE/prototype-2/drag-drop-touch-polyfill.js", "script")
            tmg.loadResource("/TMG_MEDIA_PROTOTYPE/prototype-2/prototype-2-video.css").then(() => this.buildVideoPlayer(this.#build)).then(() => this.#build = null).then(() => tmg.Players.push(this)).then(() => this.#active = true)
        } else {
            console.error(`TMG could not deploy custom controls on the '${this.#medium.tagName.toLowerCase()}' element as it is not supported`)
            console.warn("TMG only supports the 'video' element currently")
        }
    }      
}

if (typeof window === "undefined") {
    console.error("TMG Media Player cannot run in a terminal!")
    console.warn("Consider moving to a browser environment to use the TMG Media Player")
} else {
    window.tmg = {
        //some utilities that do not need replication
        media : document.querySelectorAll("[tmgcontrols]"),       
        DEFAULT_VIDEO_BUILD : {
            mediaPlayer: 'TMG',
            mediaType: 'video',
            media: null,
            activated: true,
            initialMode: "normal",
            initialState: true,
            debug: true,
            settings: {
                allowOverride: ["beta", "modes", "controllerStructure", "notifiers", "progressBar", "persist", "autocaptions", "autoplay", "loop", "muted", "previewImages", "keyShortcuts", "startTime", "endTime"],
                beta: ["rewind", "draggableControls"],
                modes: ["normal", "fullScreen", "theater", "pictureInPicture", "miniPlayer"],
                controllerStructure: ["timelineBottom", "prev", "playPause", "next", "volume", "duration", "spacer", "playbackRate", "captions", "settings", "pictureInPicture", "theater", "fullScreen"],
                startTime: null,
                endTime: null,
                notifiers: true,
                progressBar: false,
                persist: true,
                autocaptions: false,
                autoplay: false,
                loop: false,
                muted: false,
                previewImages: true,
                keyShortcuts: {
                    prev: "P", 
                    next: "N",
                    playPause : "k",
                    skipBwd: "arrowleft",
                    skipFwd: "arrowright",
                    volumeUp: "arrowup",
                    volumeDown: "arrowdown",
                    start: "home",
                    end: "end",
                    fullScreen: "f",
                    theater: "t",
                    expandMiniPlayer: "e",
                    removeMiniPlayer: "r",
                    pictureInPicture: "i",
                    mute: "m",
                    playbackRate: "s",
                    captions: "c",
                    settings: "?"
                },
            },
        },
        altImgSrc : "/TMG_MEDIA_PROTOTYPE/assets/icons/movie-tape.png",
        _styleCache : {},
        _scriptCache : {},
        loadResource : (src, type) => {
        switch (type) {
            case "script":
                tmg._scriptCache[src] = tmg._scriptCache[src] || new Promise(function (resolve, reject) {
                    let script = document.createElement("script")
                    script.src = src
    
                    script.onload = () => resolve(script)
                    script.onerror = () =>  reject(new Error(`Load error for TMG JavaScript file`))
    
                    document.body.append(script)
                })
    
                return tmg._scriptCache[src]
            default:
                tmg._styleCache[src] = tmg._styleCache[src] || new Promise(function (resolve, reject) {
                    let link = document.createElement("link")
                    link.href = src
                    link.rel = "stylesheet"
            
                    link.onload = () => resolve(link)

                    link.onerror = () =>  reject(new Error(`Load error for TMG CSSStylesheet`))
            
                    document.head.append(link)
                })
            
                return tmg._styleCache[src]
        }
        },
        addSources : function(sources, medium) {
            const addSource = (source, medium) => {
                const sourceElement = document.createElement("source")
                this.putSourceDetails(source, sourceElement)
                medium.appendChild(sourceElement)
            }
            if (this.isIterable(sources)) 
                for (const source of sources) {
                    addSource(source, medium)
                }
            else addSource(sources, medium)
        },
        putSourceDetails: function(source, sourceElement) {
            if (source.src) sourceElement.src = source.src
            if (source.type) sourceElement.type = source.type
            if (source.media) sourceElement.media = source.media
        },
        addTracks : function(tracks, medium) {
            const addTrack = (track, medium) => {
                const trackElement = document.createElement("track")
                this.putTrackDetails(track, trackElement)
                medium.appendChild(trackElement)
            }
            if (this.isIterable(tracks)) 
                for (const track of tracks) {
                    addTrack(track, medium)
                }
            else addTrack(tracks, medium)
        },
        putTrackDetails: function(track, trackElement) {
            if (track.kind) trackElement.kind = track.kind
            if (track.label) trackElement.label = track.label
            if (track.srclang) trackElement.srclang = track.srclang
            if (track.src) trackElement.src = track.src
            if (track.default) trackElement.default = track.default
            if (track.id) trackElement.id = track.id
        },
        removeSources: function(medium) {
            medium.querySelectorAll("source").forEach(source => source.remove())
        },
        removeTracks: function(medium) {
            medium.querySelectorAll("track").forEach(track => {
                if (track.kind == "subtitles" || track.kind == "captions") track.remove()
            })
        },
        //object deep clone
        modeMatcher : {
            normal: "normal",
            fullScreen: "full-screen",
            miniPlayer: "mini-player",
            pictureInPicture: "picture-in-picture",
            theater: "theater"
        },
        //mobile devices media query
        queryMediaMobile : () => {
            return window.matchMedia('(max-width: 480px), (max-width: 940px) and (max-height: 480px) and (orientation: landscape)').matches
        },
        //clamping values
        clamp : (min, amount, max) => {
            return Math.min(Math.max(amount, min), max)
        },
        formatDuration(time) {    
            if (!isNaN(time ?? NaN) && time !== Infinity) {
                const seconds = Math.floor(time % 60)
                const minutes = Math.floor(time / 60) % 60
                const hours = Math.floor(time / 3600)
                if (hours === 0) return `${minutes}:${tmg.leadingZeroFormatter.format(seconds)}`
                else return `${hours}:${tmg.leadingZeroFormatter.format(minutes)}:${tmg.leadingZeroFormatter.format(seconds)}`
            } else return '-:--'
        },
        leadingZeroFormatter : new Intl.NumberFormat(undefined, {minimumIntegerDigits: 2}),
        isIterable : function(obj) { 
            return obj !== null && obj !== undefined && typeof obj[Symbol.iterator] === 'function'
        },
        //camelizing strings
        camelize(str) {  
            return str  
                .toLowerCase()  
                .replace(/(?:^\w|\b\w)/g, (match, index) => index === 0 ? match.toLowerCase() : match.toUpperCase())  
                .replace(/\s+/g, '')  
        },  
        getRenderedBox(elem) {
            function getResourceDimensions(source) {
                if (source.videoWidth) {
                    return { width: source.videoWidth, height: source.videoHeight }
                }
                return null
            }
            function isRelative(length) {
                return length?.match?.(/%$/)
            }
            function parsePositionAsPx(str, bboxSize, objectSize) {
                const num = parseFloat(str)
                if (isRelative(str)) {
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
                    left: isRelative(objectPosition.split(" ")[0]) ? 0 : left,
                    top: isRelative(objectPosition.split(" ")[1]) ? 0 : top,
                    width: bbox.width,
                    height: bbox.height,
                }
            }
            if (objectFit === "cover") {
                const minRatio = Math.min(bbox.width / object.width, bbox.height / object.height)
                let width  = object.width  * minRatio
                let height = object.height * minRatio
                let outRatio  = 1
                if (width < bbox.width) outRatio = bbox.width / width
                if (Math.abs(outRatio - 1) < 1e-14 && height < bbox.height) outRatio = bbox.height / height
                width  *= outRatio
                height *= outRatio
                const { left, top } = parseObjectPosition(objectPosition, bbox, {width, height})
                return { left, top, width, height }
            }
        },
        //a wild card for deploying TMG controls to available media, returns a promise that resolves with an array referencing the media
        launch : async function(medium) {
            let promises = []
            if (arguments.length === 0) {
                if (tmg.media) {
                    for(const medium of tmg.media) {
                        if (!(medium.dataset?.tmgAutoLaunch === "false")) promises.push(tmg.launch(medium))
                    }
                    return Promise.all(promises)
                }
            } else {
                const v = medium.dataset, value = medium.getAttribute('tmgcontrols').toLowerCase()
                //building controls object
                let fetchedControls
                if (v.tmg?.includes('.json')) {
                    fetchedControls = fetch(v.tmg.toString()).then(res => {
                        if (!res.ok) throw new Error(`TMG could not find JSON file!. Status: ${res.status}`)
                        return res.json()
                    }).catch(({message: mssg}) => {
                        console.error(`${mssg} TMG requires a valid JSON file`)
                        fetchedControls = undefined
                    })
                } else if(v.tmg) {
                    console.error("File type must be in the '.json' format for TMG to read the custom settings")
                }
                return (async function buildControlOptions(v) {
                    const customOptions = await fetchedControls ??  {} 
                    if (customOptions && Object.keys(customOptions).length === 0) {
                            customOptions.settings = {}
                            if (v.tmgMediaTitle) {
                                customOptions.media ? customOptions.media.title = v.tmgMediaTitle : customOptions.media = {
                                    title: v.tmgMediaTitle
                                }
                                medium.removeAttribute("data-tmg-media-title")
                            }
                            if (v.tmgMediaArtwork ?? medium.poster) {
                                customOptions.media ? customOptions.media.artwork = [{src: v.tmgMediaArtwork ?? medium.poster}] : customOptions.media = {
                                    artwork: [{src: v.tmgMediaArtwork ?? medium.poster}]
                                }
                                medium.removeAttribute("data-tmg-media-artwork")
                            }                
                            if (v.tmgMediaArtist) {
                                customOptions.media ? customOptions.media.artist = v.tmgMediaArtist : customOptions.media = {
                                    artist: v.tmgMediaArtist
                                }
                                medium.removeAttribute("data-tmg-media-artist")
                            }
                            if (v.tmgMediaAlbum) {
                                customOptions.media ? customOptions.media.album = v.tmgMediaAlbum : customOptions.media = {
                                    album: v.tmgMediaAulbum
                                }
                                medium.removeAttribute("data-tmg-media-album")
                            }
                            if (v.tmgActivated) {
                                customOptions.activated = JSON.parse(v.tmgActivated)
                                medium.removeAttribute("data-tmg-activated")
                            }
                            if (v.tmgInitialMode) {
                                customOptions.initialMode = v.tmgInitialMode
                                medium.removeAttribute("data-tmg-initial-mode")
                            }                            
                            if (v.tmgInitialState) {
                                customOptions.initialState = JSON.parse(v.tmgInitialState)
                                medium.removeAttribute("data-tmg-initial-state")
                            }
                            if (v.tmgDebug) {
                                customOptions.debug = JSON.parse(v.tmgDebug)
                                medium.removeAttribute("data-tmg-debug")
                            }
                            if (v.tmgAllowOverride) {
                                customOptions.settings.allowOverride = /true|false/.test(v.tmgAllowOverride) ? JSON.parse(v.tmgAllowOverride) : v.tmgAllowOverride.replaceAll("'", "").replaceAll(" ", "").split(",")
                                medium.removeAttribute("data-tmg-allow-override")
                            }         
                            if (v.tmgBeta) {
                                customOptions.settings.beta = /true|false/.test(v.tmgBeta) ? JSON.parse(v.tmgBeta) : v.tmgBeta.replaceAll("'", "").replaceAll(" ", "").split(",")
                                medium.removeAttribute("data-tmg-beta")
                            }      
                            if (v.tmgModes) {
                                customOptions.settings.modes = v.tmgModes.replaceAll(" ", "").split(",")
                                medium.removeAttribute("data-tmg-modes")
                            }              
                            if (v.tmgControllerStructure) {
                                customOptions.settings.controllerStructure = v.tmgControllerStructure.replaceAll("'", "").replaceAll(" ", "").split(",")
                                medium.removeAttribute("data-tmg-controller-interface")
                            }              
                            if (v.tmgStartTime) {
                                customOptions.settings.startTime = JSON.parse(v.tmgStartTime)
                                medium.removeAttribute("data-tmg-start-time")
                            }
                            if (v.tmgStartTime) {
                                customOptions.settings.endTime = JSON.parse(v.tmgEndTime)
                                medium.removeAttribute("data-tmg-end-time")
                            }
                            if (v.tmgNotifiers) {
                                customOptions.settings.notifiers = JSON.parse(v.tmgNotifiers)
                                medium.removeAttribute("data-tmg-notifiers")
                            }    
                            if (v.tmgProgressBar) {
                                customOptions.settings.progressBar =  JSON.parse(v.tmgProgressBar)
                                medium.removeAttribute("data-tmg-progress-bar")
                            }
                            if (v.tmgPersist) {
                                customOptions.settings.persist = JSON.parse(v.tmgPersist)
                                medium.removeAttribute("data-tmg-persist")
                            }
                            if (v.tmgAutocaptions) {
                                customOptions.settings.autocaptions = JSON.parse(v.tmgAutocaptions)
                                medium.removeAttribute("data-tmg-autocaptions")
                            }
                            if (v.tmgAutoplay) {
                                customOptions.settings.autoplay = JSON.parse(v.tmgAutoplay)
                                medium.removeAttribute("data-tmg-autoplay")
                            }
                            if (v.tmgLoop) {
                                customOptions.settings.loop = JSON.parse(v.tmgLoop)
                                medium.removeAttribute("data-tmg-loop")
                            }
                            if (v.tmgMuted) {
                                customOptions.settings.muted = JSON.parse(v.tmgMuted)
                                medium.removeAttribute("data-tmg-muted")
                            }
                            if (v.tmgPreviewImagesAddress) {
                                customOptions.settings.previewImages ? customOptions.settings.previewImages.address = v.tmgPreviewImagesAddress : customOptions.settings.previewImages = {
                                    address: v.tmgPreviewImagesAddress
                                }
                                medium.removeAttribute("data-tmg-preview-images-address")
                            }
                            if (v.tmgPreviewImagesFps) {
                                customOptions.settings.previewImages ? customOptions.settings.previewImages.fps = v.tmgPreviewImagesFps : customOptions.settings.previewImages = {
                                    fps: Number(v.tmgPreviewImagesFps)
                                }
                                medium.removeAttribute("data-tmg-preview-images-fps")
                            } 
                            if (v.tmgPreviewImages) {
                                customOptions.settings.previewImages = JSON.parse(v.tmgPreviewImages)
                                medium.removeAttribute("data-tmg-preview-images")
                            }
                            if (v.tmgKeyShortcuts) {
                                customOptions.settings.keyShortcuts = JSON.parse(v.tmgKeyShortcuts)
                                medium.removeAttribute("data-tmg-key-shortcuts")
                            } else {
                                customOptions.settings.keyShortcuts = {}
                                if (v.tmgKeyShortcutPrev) {
                                    customOptions.settings.keyShortcuts.prev = v.tmgKeyShortcutPrev
                                    medium.removeAttribute("data-tmg-key-shortcut-prev")
                                }
                                if (v.tmgKeyShortcutNext) {
                                    customOptions.settings.keyShortcuts.next = v.tmgKeyShortcutNext
                                    medium.removeAttribute("data-tmg-key-shortcut-next")
                                }
                                if (v.tmgKeyShortcutPlayPause) {
                                    customOptions.settings.keyShortcuts.playPause = v.tmgKeyShortcutPlayPause
                                    medium.removeAttribute("data-tmg-key-shortcut-play-pause")
                                }
                                if (v.tmgKeyShortcutSkipBwd) {
                                    customOptions.settings.keyShortcuts.skipBwd = v.tmgKeyShortcutSkipBwd
                                    medium.removeAttribute("data-tmg-key-shortcut-skip-bwd")
                                }
                                if (v.tmgKeyShortcutSkipFwd) {
                                    customOptions.settings.keyShortcuts.skipFwd = v.tmgKeyShortcutSkipFwd
                                    medium.removeAttribute("data-tmg-key-shortcut-skip-fwd")
                                }
                                if (v.tmgKeyShortcutVolumeUp) {
                                    customOptions.settings.keyShortcuts.volumeUp = v.tmgKeyShortcutVolumeUp
                                    medium.removeAttribute("data-tmg-key-shortcut-volume-up")
                                }
                                if (v.tmgKeyShortcutVolumeUp) {
                                    customOptions.settings.keyShortcuts.volumeUp = v.tmgKeyShortcutVolumeUp
                                    medium.removeAttribute("data-tmg-key-shortcut-volume-up")
                                }                                
                                if (v.tmgKeyShortcutStart) {
                                    customOptions.settings.keyShortcuts.start = v.tmgKeyShortcutStart
                                    medium.removeAttribute("data-tmg-key-shortcut-start")
                                }
                                if (v.tmgKeyShortcutEnd) {
                                    customOptions.settings.keyShortcuts.end = v.tmgKeyShortcutEnd
                                    medium.removeAttribute("data-tmg-key-shortcut-end")
                                }
                                if (v.tmgKeyShortcutFullScreen) {
                                    customOptions.settings.keyShortcuts.fullScreen = v.tmgKeyShortcutFullScreen
                                    medium.removeAttribute("data-tmg-key-shortcut-full-screen")
                                }
                                if (v.tmgKeyShortcutTheater) {
                                    customOptions.settings.keyShortcuts.theater = v.tmgKeyShortcutTheater
                                    medium.removeAttribute("data-tmg-key-shortcut-theater")
                                }
                                if (v.tmgKeyShortcutExpandMiniPlayer) {
                                    customOptions.settings.keyShortcuts.expandMiniPlayer = v.tmgKeyShortcutExpandMiniPlayer
                                    medium.removeAttribute("data-tmg-key-shortcut-expand-mini-player")
                                }
                                if (v.tmgKeyShortcutRemoveMiniPlayer) {
                                    customOptions.settings.keyShortcuts.removeMiniPlayer = v.tmgKeyShortcutRemoveMiniPlayer
                                    medium.removeAttribute("data-tmg-key-shortcut-remove-mini-player")
                                }
                                if (v.tmgKeyShortcutPictureInPicture) {
                                    customOptions.settings.keyShortcuts.pictureInPicture = v.tmgKeyShortcutPictureInPicture
                                    medium.removeAttribute("data-tmg-key-shortcut-picture-in-picture")
                                }
                                if (v.tmgKeyShortcutMute) {
                                    customOptions.settings.keyShortcuts.mute = v.tmgKeyShortcutMute
                                    medium.removeAttribute("data-tmg-key-shortcut-mute")
                                }
                                if (v.tmgKeyShortcutPlaybackRate) {
                                    customOptions.settings.keyShortcuts.playbackRate = v.tmgKeyShortcutPlaybackRate
                                    medium.removeAttribute("data-tmg-key-shortcut-playback-rate")
                                }
                                if (v.tmgKeyShortcutCaptions) {
                                    customOptions.settings.keyShortcuts.captions = v.tmgKeyShortcutCaptions
                                    medium.removeAttribute("data-tmg-key-shortcut-captions")
                                }
                                if (v.tmgSettings) {
                                    customOptions.settings.keyShortcuts.settings = v.tmgKeyShortcutSettings 
                                    medium.removeAttribute("data-tmg-key-shortcut-settings")
                                }
                            }
                    }
                    if (value === '' || value === 'true') {
                        const player = new tmg.Player(customOptions)
                        player.attach(medium)
                        return player
                    } else {
                        console.error("TMG could not deploy custom controls so the Media Player was not rendered")
                        console.warn(`Consider removing the '${value}' value from the 'tmgcontrols' attribute`)
                    }
                })(v)
            }
        }, 
        //getting all methods of an object
        getAllProps : function(obj) {
            let props = []
            do {
                const o = Object.getOwnPropertyNames(obj)
                .concat(Object.getOwnPropertySymbols(obj).map(s => s.toString()))
                .sort()
                .filter((p, i, arr) => 
                    p !== "constructor" &&
                    (i == 0 || p !== arr[i - 1]) &&
                    props.indexOf(p) === -1
                )
                props = props.concat(o)
            } while (
                (obj = Object.getPrototypeOf(obj)) &&
                Object.getPrototypeOf(obj)
            )

            return props
        },
        //REFERENCES TO ALL THE DEPLOYED TMG MEDIA PLAYERS
        Players : [],
        //THE TMG MEDIA PLAYER BUILDER CLASS
        Player : _T_M_G_Media_Player
        //Video helpers to help the preview images always match the video
    }

    //deploying TMG controls to available media
    tmg.launch()
}