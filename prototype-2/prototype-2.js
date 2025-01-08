"use strict"
/* 
TODO: 
    next and prev video
    editable settings: shortcut, beta, keyshortcuts, notifiers, progressbar, controllerStructure
*/

//running a runtime environment check
typeof window !== "undefined" ? console.log("%cTMG Media Player Available", "color: green") : console.log("TMG Media Player Not Available")

//The TMG Video Player Class
class _T_M_G_Video_Player {
    //CSS custom properties getters and setters
    get fontFamily() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-font-family")
    }

    set fontFamily(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-font-family", value)
    }

    get controlsSize() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-controls-size")
    }

    set controlsSize(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-controls-size", value)
    }

    get controlsGap() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-controls-gap")
    }

    set controlsGap(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-controls-gap", value)
    }

    get captionsSize() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-captions-size")
    }

    set captionsSize(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-captions-size", value)
    }

    get brandColor() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-brand-color")
    }

    set brandColor(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-brand-color", value)
    }

    get brandAccentColor() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-brand-accent-color")
    }

    set brandAccentColor(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-brand-accent-color", value)
    }    

    get lighterBrandColor() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-lighter-brand-color")
    }

    set lighterBrandColor(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-brand-color", value)
    }

    get focusColor() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-focus-color")
    }

    set focusColor(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-focus-color", value)
    }

    get backgroundColor() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-background-color")
    }

    set backgroundColor(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-background-color", value)
    }    

    get currentThemeColor() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-current-theme-color")
    }

    set currentThemeColor(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-current-theme-color", value)
    }

    get currentThemeAccentColor() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-current-theme-accent-color")
    }

    set currentThemeAccentColor(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-current-theme-accent-color", value)
    }    

    get currentThemeInverseColor() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-current-theme-inverse-color")
    }

    set currentThemeInverseColor(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-current-theme-inverse-color", value)
    }

    get currentThemeInverseAccentColor() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-current-theme-inverse-accent-color")
    }

    set currentThemeInverseAccentColor(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-current-theme-inverse-accent-color", value)
    }    

    get mainTimelineColor() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-main-timeline-color")
    }

    set mainTimelineColor(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-main-timeline-color", value)
    }

    get mainTimelineComplementColor() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-main-timeline-complement-color")
    }

    set mainTimelineComplementColor(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-main-timeline-complement-color", value)
    }    

    get timelineBaseColor() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-timeline-base-color")
    }

    set timelineBaseColor(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-timeline-base-color", value)
    }    

    get previewTimelineColor() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-preview-timeline-color")
    }

    set previewTimelineColor(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-preview-timeline-color", value)
    }    

    get loadedTimelineColor() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-loaded-timeline-color")
    }

    set loadedTimelineColor(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-loaded-timeline-color", value)
    }    

    get volumeSliderColor() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-volume-slider-color")
    }

    set volumeSliderColor(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-volume-slider-color", value)
    }

    get volumeSliderBaseColor() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-volume-slider-base-color")
    }

    set volumeSliderBaseColor(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-volume-slider-base-color", value)
    }

    get loaderSize() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-loader-size")
    }

    set loaderSize(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-loader-size", value)
    }

    get loaderWidth() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-loader-width").replace('px', '')
    }

    set loaderWidth(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-loader-width", value)
    }

    get loaderColor() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-loader-color").replace('px', '')
    }

    set loaderColor(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-loader-color", value)
    }

    get loaderBaseColor() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-loader-base-color")
    }

    set loaderBaseColor(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-loader-base-color", value)
    }

    get thumbIndicatorScale() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-thumb-indicator-scale")
    }

    set thumbIndicatorScale(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-thumb-indicator-scale", value)
    }

    get fadeTransition() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-fade-transition")
    }

    set fadeTransition(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-fade-transition", value)
    }

    get timelineFadeTransition() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-timeline-fade-transition")
    }

    set timelineFadeTransition(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-timeline-fade-transition", value)
    }

    get notifiersTransitionTime() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-transition-time")
    }

    set notifiersTransitionTime(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-transition-time", value)        
    }

    get notifierArrowsTransitionTime() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-arrows-transition-time")
    } 
    
    set notifierArrowsTransitionTime(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-arrows-transition-time", value)
    }

    get miniPlayerX() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-mini-player-x")
    }

    set miniPlayerX(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-mini-player-x", value)
    }        

    get miniPlayerY() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-mini-player-y")
    }

    set miniPlayerY(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-mini-player-y", value)
    }     
    
    get previewPosition() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-preview-position")
    }

    set previewPosition(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-preview-position", value)
    }

    get previewImgPosition() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-preview-img-position")
    }

    set previewImgPosition(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-preview-img-position", value)
    }

    get previewImgArrowPosition() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-preview-img-arrow-position")
    }

    set previewImgArrowPosition(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-preview-img-arrow-position", value)
    }
    
    get loadedPosition() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-loaded-position")
    }

    set loadedPosition(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-loaded-position", value)
    }

    get progressPosition() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-progress-position")
    }

    set progressPosition(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-progress-position", value)
    }

    get volumeSliderPosition() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-volume-slider-position")
    }

    set volumeSliderPosition(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-volume-slider-position", value)
    }

    get volumeValuePosition() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-volume-value-position")
    }

    set volumeValuePosition(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-volume-value-position", value)
    } 

    get dbcBlockOffset() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-dbc-block-offset")
    }

    set dbcBlockOffset(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-dbc-block-offset", value)
    } 

    get dbcInlineOffset() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-dbc-inline-offset")
    }

    set dbcInlineOffset(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-dbc-inline-offset", value)
    } 

    get dblClickBackdropWidth() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-dbl-click-backdrop-width")
    }

    set dblClickBackdropWidth(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-dbl-click-backdrop-width", value)
    } 

    get dblClickBackdropHeight() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-dbl-click-backdrop-height")
    }

    set dblClickBackdropHeight(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-dbl-click-backdrop-height", value)
    } 

    get previewBorderColor() {
        return getComputedStyle(this.ui.dom.videoContainer).getPropertyValue("--T_M_G-preview-border-color")
    }

    set previewBorderColor(value) {
        this.ui.dom.videoContainer.style.setProperty("--T_M_G-preview-border-color", value)
    } 

    get AllCSSCustomProperties() {
        return {
            fontFamily: this.fontFamily,
            controlsSize: this.controlsSize,
            controlsGap: this.controlsGap,
            captionsSize: this.captionsSize,
            brandColor: this.brandColor,
            brandAccentColor: this.brandAccentColor,
            lighterBrandColor: this.lighterBrandColor,
            focusColor: this.focusColor,
            backgroundColor: this.backgroundColor,
            currentThemeColor: this.currentThemeColor,
            currentThemeAccentColor: this.currentThemeAccentColor,
            currentThemeInverseColor: this.currentThemeInverseColor,
            currentThmeInverseAccentColor: this.currentThemeInverseAccentColor,
            mainTimelineColor: this.mainTimelineColor,
            mainTimelineComplementColor: this.mainTimelineComplementColor,
            timelineBaseColor: this.timelineBaseColor,
            previewTimelineColor: this.previewTimelineColor,
            loadedTimelineColor: this.loadedTimelineColor,
            volumeSliderColor: this.volumeSliderColor,
            volumeSliderBaseColor: this.volumeSliderBaseColor,
            loaderSize: this.loaderSize,
            loaderWidth: this.loaderWidth,
            loaderColor: this.loaderColor,
            loaderBaseColor: this.loaderBaseColor,
            thumbIndicatorScale: this.thumbIndicatorScale,
            fadeTransition: this.fadeTransition,
            timelineFadeTransition: this.timelineFadeTransition,
            notifiersTransitionTime: this.notifiersTransitionTime,
            notfierArrowsTransitionTime: this.notifierArrowsTransitionTime,
            miniPlayerX: this.miniPlayerX,
            miniPlayerY: this.miniPlayerY,
            previewPosition: this.previewPosition,
            previewImgPosition: this.previewImgPosition,
            previewImgArrowPosition: this.previewImgArrowPosition,
            loadedPosition: this.loadedPosition,
            progressPosition: this.progressPosition,
            volumeSliderPosition: this.volumeSliderPosition,
            volumeValuePosition: this.volumeValuePosition, 
            dbcBlockOffset: this.dbcBlockOffset, 
            dbcInlineOffset: this.dbcInlineOffset, 
            dblClickBackdropWidth: this.dblClickBackdropWidth,
            dblClickBackdropHeight: this.skipBackdropHeight,
            previewBorderColor: this.previewBorderColor
        }
    }

    initSettingsManager(settings) {
        // console.log("TMG Video Settings Manager started")
    }

    buildVideoPlayer(videoOptions) {
        //merging the video build with the Video Player Instance
        Object.entries(videoOptions).forEach(([key, value]) => this[key] = value)
        //inititalizing settings manager
        this.initSettingsManager(videoOptions.settings)
        //some general variables
        this.CSSCustomPropertiesCache
        this.wasPaused = !this.video.autoplay
        this.previousRate = this.video.playbackRate
        this.isScrubbing = false
        this.concerned = false
        this.parentIntersecting = true
        this.videoIntersecting = true
        this.buffering = false
        this.playId 
        this.overlayRestraintId
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
        this.skipVideoTime
        this.skipDurationId = null
        this.skipDuration = 0
        this.currentNotifier
        this.overlayRestraintTime = 3000
        this.transitionId        
        this.dragging  

        //Binding methods so they don't lose context of the media player instance
        //Binding Handlers
        this._handleError = this._handleError.bind(this)
        this._handleWindowResize = this._handleWindowResize.bind(this)
        this._handleFullScreenChange = this._handleFullScreenChange.bind(this)
        this._handleFullScreenChange = this._handleFullScreenChange.bind(this)
        this._handleKeyDown = this._handleKeyDown.bind(this)
        this._handleKeyUp = this._handleKeyUp.bind(this)
        this._handlePlay = this._handlePlay.bind(this)
        this._handlePause = this._handlePause.bind(this)
        this._handleBufferStart = this._handleBufferStart.bind(this)
        this._handleBufferStop = this._handleBufferStop.bind(this)
        this._handlePlaybackChange = this._handlePlaybackChange.bind(this)
        this._handleTimeUpdate = this._handleTimeUpdate.bind(this)
        this._handleVolumeChange = this._handleVolumeChange.bind(this)
        this._handleLoadedProgress = this._handleLoadedProgress.bind(this)
        this._handleLoadedData = this._handleLoadedData.bind(this)
        this._handleEnded = this._handleEnded.bind(this)
        this._handleHoverPointerMove = this._handleHoverPointerMove.bind(this)
        this._handleHoverPointerDown = this._handleHoverPointerDown.bind(this)
        this._handleHoverPointerOut = this._handleHoverPointerOut.bind(this)
        this._handlePointerDown = this._handlePointerDown.bind(this)
        this._handleSpeedPointerUp = this._handleSpeedPointerUp.bind(this)
        this._handleSpeedPointerMove = this._handleSpeedPointerMove.bind(this)
        this._handleRightClick = this._handleRightClick.bind(this)
        this._handleClick = this._handleClick.bind(this)
        this._handleDoubleClick = this._handleDoubleClick.bind(this)
        this._handleEnterPip = this._handleEnterPip.bind(this)
        this._handleLeavePip = this._handleLeavePip.bind(this)
        this._handleTimelineScrubbing = this._handleTimelineScrubbing.bind(this)
        this._handleTimelineUpdate = this._handleTimelineUpdate.bind(this)
        this._handleTimelineFocus = this._handleTimelineFocus.bind(this)
        this._handleTimelineFocus = this._handleTimelineFocus.bind(this)
        this._handleVolumeSliderInput = this._handleVolumeSliderInput.bind(this)
        this. _handleVolumeSliderMouseDown = this. _handleVolumeSliderMouseDown.bind(this)
        this._handleVolumeSliderMouseUp = this._handleVolumeSliderMouseUp.bind(this)
        this._handleVolumeContainerMouseMove = this._handleVolumeContainerMouseMove.bind(this)
        this._handleVolumeContainerMouseUp = this._handleVolumeContainerMouseUp.bind(this)
        this._handlePreventImgBreak = this._handlePreventImgBreak.bind(this)
        this._handleMiniPlayerPosition = this._handleMiniPlayerPosition.bind(this)
        this._handlePlayTriggerUp = this._handlePlayTriggerUp.bind(this)
        this._handleDragStart = this._handleDragStart.bind(this)
        this._handleDrag = this._handleDrag.bind(this)
        this._handleDragEnd = this._handleDragEnd.bind(this)
        this._handleDragEnter = this._handleDragEnter.bind(this)
        this._handleDragOver = this._handleDragOver.bind(this)
        this._handleDrop = this._handleDrop.bind(this)
        this._handleDragLeave = this._handleDragLeave.bind(this)
        //Binding Performers
        this.togglePlay = this.togglePlay.bind(this)
        this.showVideoOverlay = this.showVideoOverlay.bind(this)
        this.changePlaybackSpeed = this.changePlaybackSpeed.bind(this)
        this.toggleCaptions = this.toggleCaptions.bind(this)
        this.toggleMute = this.toggleMute.bind(this)
        this.toggleTheaterMode = this.toggleTheaterMode.bind(this)
        this.toggleFullScreenMode = this.toggleFullScreenMode.bind(this)
        this.togglePictureInPictureMode = this.togglePictureInPictureMode.bind(this)
        this.expandMiniPlayer = this.expandMiniPlayer.bind(this)
        this.cancelMiniPlayer = this.cancelMiniPlayer.bind(this)
        this.moveMiniPlayer = this.moveMiniPlayer.bind(this)
        this.emptyMiniPlayerListeners = this.emptyMiniPlayerListeners.bind(this)
        this.speedUp = this.speedUp.bind(this)
        this.slowDown = this.slowDown.bind(this)
        this.rewindVideo = this.rewindVideo.bind(this)
        this.rewindReset = this.rewindReset.bind(this)
        //other properties that need binding
        this.setInitialStates = this.setInitialStates.bind(this)
        this.initializeVideoControls = this.initializeVideoControls.bind(this)
        this.setInitialStates = this.setInitialStates.bind(this)

        //custom events for otifying user
        this.notifierEvents = this.settings.status.ui.notifiers ? ["videoplay","videopause","volumeup","volumedown","volumemuted","captions","speed","theater","fullScreen","fwd","bwd"] : null
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
                const transitionTime = e.type === "fwd" || e.type === "bwd" ? Number(this.self.notifierArrowsTransitionTime.replace('ms', '')) + 10 : Number(this.self.notifiersTransitionTime.replace('ms', '')) + 10
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
        this.videoObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.target != this.video) {
                    this.parentIntersecting = entry.isIntersecting
                    this.toggleMiniPlayerMode()
                } else {
                    this.videoIntersecting = entry.isIntersecting
                    this.videoIntersecting && this.settings.keyShortcuts ? this.setKeyEventListeners() : this.removeKeyEventListeners()
                }
            })
        }, {root: null, rootMargin: '0px', threshold: 0})           

        //building the Video Player interface
        this.buildVideoPlayerInterface()
    }

    //Custom Error Handling
    _handleError(error) {
        console.warn(`TMG silenced a rendering error: `, error)
    }

    //firing custom events
    fire(eventName, el = this.ui.dom.notifiersContainer, detail=null, bubbles=true, cancellable=true) {
        let evt = new CustomEvent(eventName, {detail, bubbles, cancellable})
        el.dispatchEvent(evt)
    }

    //prevent broken images
    _handlePreventImgBreak(e) {
        e.target.src = this.ui.altImgSrc
    }
    
    //dom builder and retreiver functions
    buildVideoPlayerInterface() {
        this.video.poster = this.initialState ? (this.video.poster || this.media.artwork[0].src) : ""
        const videoContainer = document.createElement('div')
        videoContainer.classList = "T_M_G-video-container"
        if (!this.video.autoplay) videoContainer.classList.add("T_M_G-video-paused")
        if (this.initialState) videoContainer.classList.add("T_M_G-video-initial")
        if (this.initialMode) {
            if (tmg.modeMatcher[this.initialMode]) videoContainer.classList.add(`T_M_G-video-${tmg.modeMatcher[this.initialMode]}`)
        }
        if (this.settings.status.ui.timeline) videoContainer.setAttribute("data-timeline-position", `${this.settings.controllerStructure.find(c => c.startsWith("timeline"))?.replace("timeline", "").toLowerCase()}`)
        if (this.settings.progressBar) videoContainer.setAttribute("data-progress-bar", this.settings.progressBar)
        if (!(this.settings.previewImages?.address && this.settings.previewImages?.fps)) videoContainer.setAttribute("data-previews", false) 
        this.video.parentNode.insertBefore(videoContainer, this.video)
    
        //building HTML for the Video Player
        videoContainer.innerHTML = 
        `
        <!-- Code injected by TMG -->
        <div class="T_M_G-video-overlay-controls-container">
        </div>
        <div class="T_M_G-video-controls-container">
        </div>
        <!-- Code injected by TMG ends -->
        `    

        //appending the video to the controller
        videoContainer.append(this.video)    

        this.buildVideoControllerStructure(videoContainer)
    }

    buildVideoControllerStructure(videoContainer) {     
        const controllerStructure = this.settings.controllerStructure.filter(c => !c.startsWith("timeline")),
        spacerIndex = controllerStructure.indexOf("spacer"),
        leftSidedControls = spacerIndex > -1 ? controllerStructure.slice(0, spacerIndex) : controllerStructure,
        rightSidedControls = spacerIndex > -1 ? controllerStructure.slice(spacerIndex + 1) : null
    
        //breaking HTML into smaller units to use as building blocks
        const videoOverlayControlsContainerBuild = videoContainer.querySelector(".T_M_G-video-overlay-controls-container"),
        videoControlsContainerBuild = videoContainer.querySelector(".T_M_G-video-controls-container"),
        notifiersContainerBuild = this.settings.status.ui.notifiers || this.initialState ? document.createElement("div") : null,
        overlayMainControlsWrapperBuild = document.createElement("div"),
        controlsWrapperBuild = document.createElement("div"),
        leftSidedControlsWrapperBuild = this.settings.status.ui.leftSidedControls ? document.createElement("div") : null,
        rightSidedControlsWrapperBuild = this.settings.status.ui.rightSidedControls ? document.createElement("div") : null,
        videoBufferHTML = 
        `
        <div class="T_M_G-video-buffer"></div>
        `,
        thumbnailImgHTML =
        `
        <img class="T_M_G-video-thumbnail-img" alt="movie-image" src="${tmg.DEFAULT_VIDEO_BUILD.media.artwork[0].src}">
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
                <svg data-tooltip-text="Closed Captions(c)" data-tooltip-position="top">
                    <path fill="currentColor" d="M18,11H16.5V10.5H14.5V13.5H16.5V13H18V14A1,1 0 0,1 17,15H14A1,1 0 0,1 13,14V10A1,1 0 0,1 14,9H17A1,1 0 0,1 18,10M11,11H9.5V10.5H7.5V13.5H9.5V13H11V14A1,1 0 0,1 10,15H7A1,1 0 0,1 6,14V10A1,1 0 0,1 7,9H10A1,1 0 0,1 11,10M19,4H5C3.89,4 3,4.89 3,6V18A2,2 0 0,0 5,20H19A2,2 0 0,0 21,18V6C21,4.89 20.1,4 19,4Z" />
                </svg>
            </div>
        ` : null,
        speedNotifierHTML = this.settings.status.ui.notifiers ? 
        `
            <div class="T_M_G-video-notifiers T_M_G-video-speed-notifier"></div>
        ` : null,
        theaterNotifierHTML = this.settings.status.ui.notifiers ?
        `
            <div class="T_M_G-video-notifiers T_M_G-video-theater-notifier">
                <svg class="T_M_G-video-tall" data-tooltip-text="Theater Mode(t)" data-tooltip-position="top">
                    <path fill="currentColor" d="M19 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H5V8h14v8z"/>
                </svg>
                <svg class="T_M_G-video-wide" data-tooltip-text="Normal Mode(t)" data-tooltip-position="top">
                    <path fill="currentColor" d="M19 7H5c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 8H5V9h14v6z"/>
                </svg>
            </div>
        ` : null,
        fullscreenNotifierHTML = this.settings.status.ui.notifiers ?
        `
            <div class="T_M_G-video-notifiers T_M_G-video-full-screen-notifier">
                <svg class="T_M_G-video-open" data-tooltip-text="Enter Full Screen(f)" data-tooltip-position="top">
                    <path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                </svg>
                <svg class="T_M_G-video-close" data-tooltip-text="Leave Full Screen(f)" data-tooltip-position="top">
                    <path fill="currentColor" d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
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
        miniPlayerExpandBtnHTML = this.settings.status.modes.miniPlayer ?
        `
        <div class="T_M_G-video-mini-player-expand-btn-wrapper">
            <button type="button" class="T_M_G-video-mini-player-expand-btn" title="Expand mini-player(e)">
                <svg class="T_M_G-video-mini-player-expand-icon" viewBox="0 -960 960 960" data-tooltip-text="Expand(e)" data-tooltip-position="top">
                    <path d="M120-120v-320h80v184l504-504H520v-80h320v320h-80v-184L256-200h184v80H120Z"/>
                </svg>
            </button>
        </div>    
        ` : null,
        miniPlayerCancelBtnHTML = this.settings.status.modes.miniPlayer ?
        `
        <div class="T_M_G-video-mini-player-cancel-btn-wrapper">
            <button type="button" class="T_M_G-video-mini-player-cancel-btn" title="Remove Mini-player(r)">
                <svg class="T_M_G-video-mini-player-cancel-icon" viewBox="0 -960 960 960" data-tooltip-text="Remove(r)" data-tooltip-position="top">
                    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                </svg>
            </button>
        </div>    
        ` : null,
        mainPrevBtnHTML = this.settings.status.ui.prev ?
        `
            <button type="button" class="T_M_G-video-main-prev-btn" title="Previous Video(Shift + p)">
                <svg class="T_M_G-video-prev-icon" data-tooltip-text="Previous Video(Shift + p)" data-tooltip-position="top">
                    <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                </svg>
            </button>       
        ` : null,
        mainPlayPauseBtnHTML = this.settings.status.ui.playPause ?
        `
            <button type="button" class="T_M_G-video-main-play-pause-btn" title="Play/Pause(p,l,a,y)">
                <svg class="T_M_G-video-play-icon" data-tooltip-text="Play(k)" data-tooltip-position="top">
                    <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                </svg>
                <svg class="T_M_G-video-pause-icon" data-tooltip-text="Pause(k)" data-tooltip-position="top">
                    <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
                </svg>
                <svg class="T_M_G-video-replay-icon" viewBox="0 -960 960 960" data-tooltip-text="Replay(shift + r)" data-tooltip-position="top">
                    <path d="M480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440h80q0 117 81.5 198.5T480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720h-6l62 62-56 58-160-160 160-160 56 58-62 62h6q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Z"/>
                </svg> 
            </button>            
        ` : null,
        mainNextBtnHTML = this.settings.status.ui.next ?
        `
            <button type="button" class="T_M_G-video-main-next-btn" title="Next Video(Shift + n)">
                <svg class="T_M_G-video-next-icon" data-tooltip-text="Next Video(Shift + n)" data-tooltip-position="top">
                    <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                </svg>
            </button>       
        ` : null,
        timelineHTML = this.settings.status.ui.timeline ?
        `
            <div class="T_M_G-video-timeline-container" title="'>' - 5s & Shift + '>' - 10s" tabindex="0" data-control-id="timeline">
                <div class="T_M_G-video-timeline">
                    <div class="T_M_G-video-loaded-timeline"></div>
                    <div class="T_M_G-video-preview-img-container">
                        <img class="T_M_G-video-preview-img" alt="Preview image" src="${tmg.DEFAULT_VIDEO_BUILD.media.artwork[0].src}">
                    </div>
                    <div class="T_M_G-video-thumb-indicator"></div>
                </div>
            </div>
        ` : null,
        prevBtnHTML = this.settings.status.ui.prev ?
        `
                <button type="button" class="T_M_G-video-prev-btn" title="Previous Video(Shift + p)" data-control-id="prev">
                    <svg class="T_M_G-video-prev-icon" data-tooltip-text="Previous Video(Shift + p)" data-tooltip-position="top">
                        <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                    </svg>
                </button>       
        ` : null,
        playPauseBtnHTML = this.settings.status.ui.playPause ?
        `
                <button type="button" class="T_M_G-video-play-pause-btn" title="Play/Pause(p,l,a,y)" data-draggable-control="${this.settings.beta ? true : false}" data-control-id="playPause">
                    <svg class="T_M_G-video-play-icon" data-tooltip-text="Play(p,l,a,y)" data-tooltip-position="top">
                        <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                    </svg>
                    <svg class="T_M_G-video-pause-icon" data-tooltip-text="Pause(p,l,a,y)" data-tooltip-position="top">
                        <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
                    </svg>
                    <svg class="T_M_G-video-replay-icon" viewBox="0 -960 960 960" data-tooltip-text="Replay(shift + r)" data-tooltip-position="top">
                        <path d="M480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440h80q0 117 81.5 198.5T480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720h-6l62 62-56 58-160-160 160-160 56 58-62 62h6q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Z"/>
                    </svg> 
                </button>    
        ` : null,
        nextBtnHTML = this.settings.status.ui.next ?
        `
                <button type="button" class="T_M_G-video-next-btn" title="Next Video(Shift + n)" data-draggable-control="${this.settings.beta ? true : false}" data-control-id="next">
                    <svg class="T_M_G-video-next-icon" data-tooltip-text="Next Video(Shift + n)" data-tooltip-position="top">
                        <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                    </svg>
                </button>    
        ` : null,
        volumeHTML = this.settings.status.ui.volume ?
        `
                <div class="T_M_G-video-volume-container" data-control-id="volume" data-control-id="volume">
                    <button type="button" class="T_M_G-video-mute-btn" title="Toggle Volume(m)" data-draggable-control="${this.settings.beta ? true : false}">
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
                    <input class="T_M_G-video-volume-slider" type="range" min="0" max="100" step="any" title="Adjust Volume - Vertical arrows">
                </div>
        ` : null,
        durationHTML = this.settings.status.ui.duration ?
        `
                <div class="T_M_G-video-duration-container" data-draggable-control="${this.settings.beta ? true : false}" data-control-id="duration">
                    <div class="T_M_G-video-current-time">0.00</div>
                    /
                    <div class="T_M_G-video-total-time">0.00</div>
                </div>    
        ` : null,
        captionsBtnHTML = this.settings.status.ui.captions ?
        `
                <button type="button" class="T_M_G-video-captions-btn" title="Toggle Closed Captions(c)" data-draggable-control="${this.settings.beta ? true : false}" data-control-id="captions">
                    <svg data-tooltip-text="Closed Captions(c)" data-tooltip-position="top">
                        <path fill="currentColor" d="M18,11H16.5V10.5H14.5V13.5H16.5V13H18V14A1,1 0 0,1 17,15H14A1,1 0 0,1 13,14V10A1,1 0 0,1 14,9H17A1,1 0 0,1 18,10M11,11H9.5V10.5H7.5V13.5H9.5V13H11V14A1,1 0 0,1 10,15H7A1,1 0 0,1 6,14V10A1,1 0 0,1 7,9H10A1,1 0 0,1 11,10M19,4H5C3.89,4 3,4.89 3,6V18A2,2 0 0,0 5,20H19A2,2 0 0,0 21,18V6C21,4.89 20.1,4 19,4Z" />
                    </svg>
                </button>
        ` : null,
        settingsBtnHTML = this.settings.status.ui.settings ?
        `
                <button type="button" class="T_M_G-video-settings-btn" title="Toggle Settings" data-draggable-control="${this.settings.beta ? true : false}" data-control-id="settings">
                    <svg class="T_M_G-video-settings-icon" viewBox="0 -960 960 960" data-tooltip-text="Settings(s)" data-tooltip-position="top">
                        <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/>
                    </svg>
                </button>        
        ` : null,
        speedBtnHTML = this.settings.status.ui.speed ? 
        `
                <button type="button" class="T_M_G-video-speed-btn T_M_G-video-wide-btn" title="Playback Speed(s)" data-draggable-control="${this.settings.beta ? true : false}" data-control-id="speed">1x</button>
        ` : null,
        pictureInPictureBtnHTML = this.settings.status.ui.pip ? 
        `
                <button type="button" class="T_M_G-video-picture-in-picture-btn" title="Toggle Picture-in-Picture(i)" data-draggable-control="${this.settings.beta ? true : false}" data-control-id="pictureInPicture">
                    <svg data-tooltip-text="Picture-in-Picture(i)" data-tooltip-position="top">
                        <path fill="currentColor" d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-10-7h9v6h-9z"/>
                    </svg>
                </button>    
        ` : null,  
        theaterBtnHTML = this.settings.status.ui.theater ?
        `
                <button type="button" class="T_M_G-video-theater-btn" title="Toggle Theater Mode(t)" data-draggable-control="${this.settings.beta ? true : false}" data-control-id="theater">
                    <svg class="T_M_G-video-tall" data-tooltip-text="Theater Mode(t)" data-tooltip-position="top">
                        <path fill="currentColor" d="M19 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H5V8h14v8z"/>
                    </svg>
                     <svg class="T_M_G-video-wide" data-tooltip-text="Normal Mode(t)" data-tooltip-position="top">
                        <path fill="currentColor" d="M19 7H5c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 8H5V9h14v6z"/>
                    </svg>
                </button>
        ` : null,
        fullScreenBtnHTML = this.settings.status.ui.fullScreen ?
        `
                <button type="button" class="T_M_G-video-full-screen-btn" title="Toggle Full Screen(f)" data-draggable-control="${this.settings.beta ? true : false}" data-control-id="fullScreen">
                    <svg class="T_M_G-video-open" data-tooltip-text="Enter Full Screen(f)" data-tooltip-position="top">
                        <path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                    </svg>
                    <svg class="T_M_G-video-close" data-tooltip-text="Leave Full Screen(f)" data-tooltip-position="top">
                        <path fill="currentColor" d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
                    </svg>
                </button>    
        ` : null
        
        //building and deploying video controls
        videoOverlayControlsContainerBuild.innerHTML = ``
        videoControlsContainerBuild.innerHTML = ``
        //builidng and deploying Notifiers HTML
        if (this.settings.status.ui.notifiers || this.initialState) {
            notifiersContainerBuild.classList = "T_M_G-video-notifiers-container"
            notifiersContainerBuild.dataset.currentNotifier = ""
            const notifiersContainerHTML =  ``.concat(playPauseNotifierHTML ?? "", captionsNotifierHTML ?? "", speedNotifierHTML ?? "", theaterNotifierHTML ?? "", fullscreenNotifierHTML ?? "", volumeNotifierHTML ?? "", fwdNotifierHTML ?? "", bwdNotiferHTML ?? "")
            notifiersContainerBuild.innerHTML += notifiersContainerHTML
            videoOverlayControlsContainerBuild.append(notifiersContainerBuild)
        }
    
        //building and deploying overlay general controls
        const overlayControlsHTML = ``.concat(videoBufferHTML ?? '', thumbnailImgHTML ?? '', miniPlayerExpandBtnHTML ?? '', miniPlayerCancelBtnHTML ?? '')
        videoOverlayControlsContainerBuild.innerHTML += overlayControlsHTML
    
        //building and deploying overlay main controls wrapper 
        const overlayMainControlsHTML = ``.concat(mainPrevBtnHTML ?? '', mainPlayPauseBtnHTML ?? '', mainNextBtnHTML ?? '')
        overlayMainControlsWrapperBuild.innerHTML += overlayMainControlsHTML
        overlayMainControlsWrapperBuild.classList = "T_M_G-video-overlay-main-controls-wrapper"
        videoOverlayControlsContainerBuild.append(overlayMainControlsWrapperBuild)

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
            speed: speedBtnHTML, 
            pictureInPicture: pictureInPictureBtnHTML,
            pip: pictureInPictureBtnHTML,
            theater: theaterBtnHTML, 
            fullScreen: fullScreenBtnHTML
        }
        if (this.settings.status.ui.leftSidedControls) {
            leftSidedControlsWrapperBuild.classList = "T_M_G-video-left-side-controls-wrapper"
            leftSidedControlsWrapperBuild.dataset.dropzone = this.settings.allowOverride ? true : false
            const leftSidedControlsHTMLArray = Array.from(leftSidedControls, el => allControlsHTML[el] ? allControlsHTML[el] : '')
            const leftSidedControlsHTML = ``.concat(...leftSidedControlsHTMLArray)
            leftSidedControlsWrapperBuild.innerHTML += leftSidedControlsHTML
            controlsWrapperBuild.append(leftSidedControlsWrapperBuild)
        }
        if (this.settings.status.ui.rightSidedControls) {
            rightSidedControlsWrapperBuild.classList = "T_M_G-video-right-side-controls-wrapper"
            rightSidedControlsWrapperBuild.dataset.dropzone = this.settings.allowOverride ? true : false
            const rightSidedControlsHTMLArray = Array.from(rightSidedControls, el => allControlsHTML[el] ? allControlsHTML[el] : '')
            const rightSidedControlsHTML = ``.concat(...rightSidedControlsHTMLArray)
            rightSidedControlsWrapperBuild.innerHTML += rightSidedControlsHTML
            controlsWrapperBuild.append(rightSidedControlsWrapperBuild)
        }

        videoControlsContainerBuild.innerHTML += timelineHTML ?? ""        
        controlsWrapperBuild.classList = "T_M_G-video-controls-wrapper"
        videoControlsContainerBuild.append(controlsWrapperBuild)  

        //retreiving elements from the document
        this.retreiveVideoPlayerDOM(videoContainer)
    }

    retreiveVideoPlayerDOM(videoContainer) {
        //Setting Up DOM Elements for easy access
        this.ui = {
            altImgSrc : "/TMG_MEDIA_PROTOTYPE/assets/icons/movie-tape.png",
            dom : {
                videoContainer : videoContainer,
                thumbnailImg : videoContainer.querySelector(".T_M_G-video-thumbnail-img"),
                videoBuffer : videoContainer.querySelector(".T_M_G-video-buffer"),
                notifiersContainer: this.settings.status.ui.notifiers || this.initialState ? videoContainer.querySelector(".T_M_G-video-notifiers-container") : null,
                playNotifier : this.settings.status.ui.notifiers || this.initialState ? videoContainer.querySelector(".T_M_G-video-play-notifier") : null,
                pauseNotifier : this.settings.status.ui.notifiers ? videoContainer.querySelector(".T_M_G-video-pause-notifier") : null,
                captionsNotifier : this.settings.status.ui.notifiers ? videoContainer.querySelector(".T_M_G-video-captions-notifier") : null,
                speedNotifier : this.settings.status.ui.notifiers ? videoContainer.querySelector(".T_M_G-video-speed-notifier") : null,
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
                speedBtn : this.settings.status.ui.speed ? videoContainer.querySelector(".T_M_G-video-speed-btn") : null,
                pictureInPictureBtn : this.settings.status.ui.pip ? videoContainer.querySelector(".T_M_G-video-picture-in-picture-btn") : null,
                theaterBtn : this.settings.status.ui.theater ? videoContainer.querySelector(".T_M_G-video-theater-btn") : null,
                fullScreenBtn : this.settings.status.ui.fullScreen ? videoContainer.querySelector(".T_M_G-video-full-screen-btn") : null,
                svgs : videoContainer.querySelectorAll("svg"),
                draggableControls: this.settings.beta && this.settings.allowOverride ? videoContainer.querySelectorAll(".T_M_G-video-controls-container [data-draggable-control]") : null,
                draggableControlContainers: this.settings.beta && this.settings.allowOverride ? videoContainer.querySelectorAll(".T_M_G-video-left-side-controls-wrapper, .T_M_G-video-right-side-controls-wrapper") : null
            }
        }
        //initializing controller
        this.initializeVideoPlayer()
    }

    initializeVideoPlayer() {
    try {
        this.controlsResize()
        if (this.activated) {
            if (this.initialState) {
                this.ui.dom.notifiersContainer?.addEventListener("click", () => this.togglePlay(true), {once:true})
                this.video.addEventListener("timeupdate", this.initializeVideoControls, {once:true})
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
        this.setInitialStates()
        this.setEventListeners()
        this.observeVideoPosition()
        this.loaded()
    } catch(e) {
        this._handleError(e)
    }        
    }

    setInitialStates() {
    try {
        this._handleVolumeChange()
        this.setBtnStates()
        if (this.ui.dom.totalTimeElement) this.ui.dom.totalTimeElement.textContent = tmg.formatDuration(this.video.duration)
        if (this.video.textTracks[0]) { 
            this.video.textTracks[0].mode = "hidden"
        }
        if (this.initialState) {
            this.ui.dom.playNotifier.classList.add("T_M_G-video-control-spin")
            this.ui.dom.playNotifier.addEventListener("animationend", () => this.ui.dom.playNotifier.classList.remove("T_M_G-video-control-spin"))
            if (!this.video.autoplay) this._handlePlay()
            this.ui.dom.videoContainer.classList.remove("T_M_G-video-initial")
        }
    } catch(e) {
        this._handleError(e)
    }    
    }

    setBtnStates() {
        if (!this.video.textTracks[0]) {
            this.ui.dom.captionsBtn?.classList.add("T_M_G-video-control-disabled")
        }
        if (!this.settings.status.modes.fullScreen) {
            this.ui.dom.fullScreenBtn?.classList.add("T_M_G-video-control-hidden")
        } 
        if (!this.settings.status.modes.theater) {
            this.ui.dom.theaterBtn?.classList.add("T_M_G-video-control-hidden")
        }
        if (!this.settings.status.modes.pip) {
            this.ui.dom.pictureInPictureBtn?.classList.add("T_M_G-video-control-hidden")
        }
    }

    setEventListeners() {
    try {        
        //Event Listeners
        //window event listeners
        window.addEventListener('resize', this._handleWindowResize)

        //document event listeners
        document.addEventListener("fullscreenchange", this._handleFullScreenChange)
        document.addEventListener("webkitfullscreenchange", this._handleFullScreenChange)

        //video event listeners
        this.video.addEventListener("play", this._handlePlay)
        this.video.addEventListener("pause", this._handlePause)        
        this.video.addEventListener("waiting", this._handleBufferStart)
        this.video.addEventListener("playing", this._handleBufferStop)
        this.video.addEventListener("ratechange", this._handlePlaybackChange)      
        this.video.addEventListener("timeupdate", this._handleTimeUpdate)
        this.video.addEventListener("volumechange", this._handleVolumeChange)
        this.video.addEventListener("progress", this._handleLoadedProgress)
        this.video.addEventListener("loadeddata", this._handleLoadedData)
        this.video.addEventListener("ended", this._handleEnded)
        this.video.addEventListener("mousedown", this._handlePointerDown)
        this.video.addEventListener("touchstart", this._handlePointerDown, {passive:true})
        this.video.addEventListener("contextmenu", this._handleRightClick)
        this.video.addEventListener("click", this._handleClick)
        this.video.addEventListener("dblclick", this._handleDoubleClick)
        this.video.addEventListener("enterpictureinpicture", this._handleEnterPip)
        this.video.addEventListener("leavepictureinpicture", this._handleLeavePip)

        //button event listeners 
        this.ui.dom.playPauseBtn?.addEventListener("click", this.togglePlay)
        this.ui.dom.mainPlayPauseBtn?.addEventListener("click", this.togglePlay)
        this.ui.dom.speedBtn?.addEventListener("click", this.changePlaybackSpeed)
        this.ui.dom.captionsBtn?.addEventListener("click", this.toggleCaptions)
        this.ui.dom.muteBtn?.addEventListener("click", this.toggleMute)
        this.ui.dom.theaterBtn?.addEventListener("click", this.toggleTheaterMode)
        this.ui.dom.fullScreenBtn?.addEventListener("click", this.toggleFullScreenMode)
        this.ui.dom.pictureInPictureBtn?.addEventListener("click", this.togglePictureInPictureMode)
        this.ui.dom.miniPlayerExpandBtn?.addEventListener("click", this.expandMiniPlayer)
        this.ui.dom.miniPlayerCancelBtn?.addEventListener("click", this.cancelMiniPlayer)        

        //videocontainer event listeners
        this.ui.dom.videoContainer.addEventListener("pointermove", this._handleHoverPointerMove, true)
        this.ui.dom.videoContainer.addEventListener("click", this._handleHoverPointerDown, true)
        this.ui.dom.videoContainer.addEventListener("mouseleave", this._handleHoverPointerOut, true)

        //timeline contanier event listeners
        this.ui.dom.timelineContainer?.addEventListener("pointerdown", this._handleTimelineScrubbing)
        this.ui.dom.timelineContainer?.addEventListener("mousemove", this._handleTimelineUpdate)
        this.ui.dom.timelineContainer?.addEventListener("focus", this._handleTimelineFocus)
        this.ui.dom.timelineContainer?.addEventListener("blur", this._handleTimelineFocus)

        //volume event listeners
        this.ui.dom.volumeSlider?.addEventListener("input", this._handleVolumeSliderInput)
        this.ui.dom.volumeSlider?.addEventListener("mousedown", this. _handleVolumeSliderMouseDown)
        this.ui.dom.volumeSlider?.addEventListener("mouseup", this._handleVolumeSliderMouseUp)
        this.ui.dom.volumeContainer?.addEventListener("mousemove", this._handleVolumeContainerMouseMove)
        this.ui.dom.volumeContainer?.addEventListener("mouseup", this._handleVolumeContainerMouseUp)

        //image event listeners 
        this.ui.dom.previewImg?.addEventListener("error", this._handlePreventImgBreak)
        this.ui.dom.thumbnailImg?.addEventListener("error", this._handlePreventImgBreak)

        //drag event listeners
        this.setDragEventListeners()

        //notifiers event listeners
        this.notify.init(this)
    } catch(e) {
        this._handleError(e)
    }                    
    }

    observeVideoPosition () {
        this.videoObserver?.observe(this.ui.dom.videoContainer.parentElement)
        this.videoObserver?.observe(this.video)      
    }

    unobserveVideoPosition () {
        this.videoObserver?.unobserve(this.ui.dom.videoContainer.parentElement)
        this.videoObserver?.unobserve(this.video)      
    }

    setKeyEventListeners() {
    try {        
        if (this.settings.keyShortcuts) {
        document.addEventListener("keydown", this._handleKeyDown)
        document.addEventListener("keyup", this._handleKeyUp)
        }
    } catch(e) {
        this._handleError(e)
    }        
    }

    removeKeyEventListeners() {
    try {        
        document.removeEventListener("keydown", this._handleKeyDown)
        document.removeEventListener("keyup", this._handleKeyUp)
    } catch(e) {
        this._handleError(e)
    }        
    }

    setDragEventListeners() {
    try {
    if (this.settings.controllerStructure) {
        if (this.settings.beta) {
            for (const btn of this.ui.dom.draggableControls) {
                btn.draggable=`${this.settings.allowOverride === true ? true : false}`
            }
        } else {
            return
        }
        for (const btn of this.ui.dom.draggableControls) {
            btn.addEventListener("dragstart", this._handleDragStart)
            btn.addEventListener("drag", this._handleDrag)
            btn.addEventListener("dragend", this._handleDragEnd)
        }
        for (const container of this.ui.dom.draggableControlContainers) {
            container.addEventListener("dragenter", this._handleDragEnter)
            container.addEventListener("dragover", this._handleDragOver)
            container.addEventListener("drop", this._handleDrop)
            container.addEventListener("dragleave", this._handleDragLeave)
        }
    }
    } catch(e) {
        this._handleError(e)
    }            
    }

    removeDragEventListeners() {
    try {        
    if (this.settings.controllerStructure) {
        for (const btn of this.ui.dom.draggableControls) {
                btn.draggable = false
        }
        for (const btn of this.ui.dom.draggableBtns) {
            btn.removeEventListener("dragstart", this._handleDragStart)
            btn.removeEventListener("drag", this._handleDrag)
            btn.removeEventListener("dragend", this._handleDragEnd)
        }
        for (const container of this.ui.dom.draggableBtnContainers) {
            container.removeEventListener("dragenter", this._handleDragEnter)
            container.removeEventListener("dragover", this._handleDragOver)
            container.removeEventListener("drop", this._handleDrop)
            container.removeEventListener("dragleave", this._handleDragLeave)
        }
    }
    } catch(e) {
        this._handleError(e)
    }            
    }

    loaded() {
        this.cache()
        this.fire("tmgload", this.video, {loaded: true})
    }

    cache() {
        //doing some caching when loading finishes 
        this.CSSCustomPropertiesCache = JSON.parse(JSON.stringify(this.AllCSSCustomProperties))
        this.settingsCache = JSON.parse(JSON.stringify(this.settings))
    }

    //resizing controls
    controlsResize() {           
    try {
        let controlsSize = 25
        this.ui.dom.svgs?.forEach(svg => {
            svg.setAttribute("preserveAspectRatio", "xMidYMid meet")
            if ((!svg.classList.contains("T_M_G-video-settings-icon")) && (!svg.classList.contains("T_M_G-video-mini-player-expand-icon")) && (!svg.classList.contains("T_M_G-video-mini-player-cancel-icon")) && (!svg.classList.contains("T_M_G-video-replay-icon")))
                svg.setAttribute("viewBox", `0 0 ${controlsSize} ${controlsSize}`)
        })
    } catch(e) {
        this._handleError(e)
    }        
    }       

    //window resizing
    _handleWindowResize() {
    try {        
        this.toggleMiniPlayerMode()
    } catch(e) {
        this._handleError(e)
    }        
    }

    //Buffer Progress
    _handleLoadedProgress() {
        if (this.video.duration > 0) {
            for (let i = 0; i < this.video.buffered.length; i++) {
                if (this.video.buffered.start(this.video.buffered.length - 1 - i) < this.video.currentTime) {
                    this.loadedPosition = (this.video.buffered.end(this.video.buffered.length - 1 - i) * 100) / this.video.duration
                    break
                }
            }
        }
    }

    //Loaded data
    _handleLoadedData() {
        this.ui.dom.totalTimeElement.textContent = formatDuration(this.video.duration)
    }

    //Play and Pause States
    togglePlay(bool) {
    try {        
        this.video.ended ? this.replay() : typeof bool == "boolean" ? bool ? this.video.play() : this.video.pause() : this.video.paused ? this.video.play() : this.video.pause()
    } catch(e) {
        this._handleError(e)
    }        
    }

    replay() {
        try {        
            this.ui.dom.playNotifier.classList.add("T_M_G-video-control-spin")
            this.moveVideoTime({action: "moveTo", details: {to: "start"}})
            this.video.play()
        } catch(e) {
            this._handleError(e)
        }        
    }    
    
    //Buffering
    _handleBufferStart() {
        this.buffering = true
        this.showVideoOverlay()
        this.ui.dom.videoContainer.classList.add("T_M_G-video-buffering")
    }

    _handleBufferStop() {
        this.buffering = false
        this.overlayRestraint()
        this.ui.dom.videoContainer.classList.remove("T_M_G-video-buffering")
    }
    
    _handlePlay() {
    try {
        for (const media of document.querySelectorAll("video, audio")) {
            if (media !== this.video) media.pause()
        }
        this.ui.dom.videoContainer.classList.remove("T_M_G-video-paused")
        this.playbackState = "playing"
        if ('mediaSession' in navigator) {
            if (this.media) navigator.mediaSession.metadata = new MediaMetadata(this.media)
            navigator.mediaSession.setActionHandler('play', () => this.togglePlay(true))
            navigator.mediaSession.setActionHandler('pause', () => this.togglePlay(false))
            navigator.mediaSession.setActionHandler('seekbackward', () => this.skip(-10))
            navigator.mediaSession.setActionHandler('seekforward', () => this.skip(10))
            navigator.mediaSession.playbackState = this.playbackState
        }            
    } catch(e) {
        this._handleError(e)
    }
    }
            
    _handlePause() {
    try {        
        this.showVideoOverlay()
        this.ui.dom.videoContainer.classList.add("T_M_G-video-paused")
        this.playbackState = "paused"
        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = this.playbackState
        }
    } catch(e) {
        this._handleError(e)
    }        
    }

    _handleEnded() {
    try {        
        this.ui.dom.videoContainer.classList.add("T_M_G-video-replay")
    } catch(e) {
        this._handleError(e)
    }        
    }  

    //Time Manipulation
    //Timeline
    moveVideoTime({action, details}) {
    try {        
        switch(action) {
            case "moveTo":                    
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
                break
        }
    } catch(e) {
        this._handleError(e)
    }        
    }

    _handleTimelineScrubbing(e) {
    try {        
        this.ui.dom.timelineContainer?.setPointerCapture(e.pointerId)
        this.isScrubbing = true
        this.toggleScrubbing(e)
        this.ui.dom.timelineContainer?.addEventListener("pointermove", this._handleTimelineUpdate)
        this.ui.dom.timelineContainer?.addEventListener("pointerup", e => {
            this.isScrubbing = false
            this.toggleScrubbing(e)
            this.ui.dom.timelineContainer?.removeEventListener("pointermove", this._handleTimelineUpdate)
            this.ui.dom.timelineContainer?.releasePointerCapture(e.pointerId)
        }, { once: true })
    } catch(e) {
        this._handleError(e)
    }        
    }
    
    toggleScrubbing(e) {
    try {        
        const rect = this.ui.dom.timelineContainer?.getBoundingClientRect()
        const percent = Math.min(Math.max(0, e.clientX - rect.x), rect.width) / rect.width
        this.ui.dom.videoContainer.classList.toggle("T_M_G-video-scrubbing", this.isScrubbing)
        if (this.isScrubbing) {
            this.wasPaused = this.video.paused
            this.video.pause()
        } else {
            this.video.currentTime = percent * this.video.duration
            if (!this.wasPaused) this.video.play()
        }
        this._handleTimelineUpdate(e)
    } catch(e) {
        this._handleError(e)
    }
    }

    _handleTimelineUpdate({clientX: x}) { 
    try {        
        const rect = this.ui.dom.timelineContainer?.getBoundingClientRect()
        const percent = tmg.clamp(x - rect.x, 0, rect.width) / rect.width
        const previewTime = tmg.formatDuration(percent * this.video.duration)
        const previewImgMin = (this.ui.dom.previewImgContainer.offsetWidth / 2) / rect.width
        const previewImgPercent = tmg.clamp(previewImgMin, percent, (1 - previewImgMin))
        this.previewPosition = percent
        this.previewImgPosition = previewImgPercent
        this.ui.dom.previewImgContainer.dataset.previewTime = previewTime  
        if (this.isScrubbing) {
            this.progressPosition =  percent
            this.overlayRestraint()
        } 
        if (this.settings.status.ui.previewImages) {
            const previewImgNumber = Math.max(1, Math.floor((percent * this.video.duration) / this.settings.previewImages.fps))
            const previewImgSrc = this.settings.previewImages.address.replace('$', previewImgNumber)
            this.ui.dom.previewImg.src = previewImgSrc
            if (this.isScrubbing) this.ui.dom.thumbnailImg.src = previewImgSrc
        }
        let arrowPosition, arrowDimension = Number(this.controlsSize.replace('px', ''))/1.6, arrowPositionMin = (((this.ui.dom.videoContainer.classList.contains("T_M_G-video-theater") && !this.ui.dom.videoContainer.classList.contains("T_M_G-video-mini-player")) || this.ui.dom.videoContainer.classList.contains("T_M_G-video-full-screen")) && this.settings.status.ui.previewImages) && !tmg.queryMediaMobile() ? Number(this.controlsSize.replace('px', ''))/3.25 : arrowDimension
        if (percent < previewImgMin) {
            arrowPosition = `${Math.max(percent * rect.width, arrowPositionMin)}px`
        } else if (percent > (1 - previewImgMin)) {
            arrowPosition = `${Math.min(((this.ui.dom.previewImgContainer.offsetWidth/2 + (percent * rect.width) - this.ui.dom.previewImgContainer.offsetLeft)), this.ui.dom.previewImgContainer.offsetWidth - arrowPositionMin - 2)}px`
        } else arrowPosition = "50%"
        this.previewImgArrowPosition = arrowPosition
    } catch(e) {
        this._handleError(e)
    }        
    }

    _handleTimelineFocus() {
    try {        
        if (this.ui.dom.timelineContainer?.matches(":focus-visible")) {
            this.removeKeyEventListeners()
            document.addEventListener("keydown", this._handleTimelineKeyDown)
        }
    } catch(e) {
        this._handleError(e)
    }        
    }

    _handleTimelineKeyDown(e) {
    try {        
        e.stopImmediatePropagation()
        switch (e.key.toString().toLowerCase()) {
            case "arrowleft":
            case "arrowdown":
                e.preventDefault()
                this.video.currentTime -= e.shiftKey ? 5 : 1
            break
            case "arrowright":
            case "arrowup":
                e.preventDefault()
                this.video.currentTime += e.shiftKey ? 5 : 1
            break
        }
    } catch(e) {
        this._handleError(e)
    }        
    }

    _handleTimelineBlur() { 
    try {
        document.removeEventListener('keydown', this._handleTimelineKeyDown)
        if(this.videoIntersecting && this.settings.keyShortcuts) this.setKeyEventListeners()
    } catch(e) {
        this._handleError(e)
    }            
    }

    _handleTimeUpdate() {
    try {        
        const percent = this.video.currentTime / this.video.duration
        this.progressPosition = percent
        if (this.ui.dom.currentTimeElement) this.ui.dom.currentTimeElement.textContent = tmg.formatDuration(this.video.currentTime)
        if (this.ui.dom.speedNotifier && this.speedCheck && this.speedToken === 1) this.ui.dom.speedNotifier.dataset.currentTime = tmg.formatDuration(this.video.currentTime)
        this.skipVideoTime = this.video.currentTime
        if ((this.video.currentTime < this.video.duration) && this.ui.dom.videoContainer.classList.contains("T_M_G-video-replay")) this.ui.dom.videoContainer.classList.remove("T_M_G-video-replay")
    } catch(e) {
        this._handleError(e)
    }            
    }

    //Time Skips
    skip(duration, persist = false) {
    try {
        const notifier = duration > 0 ? this.ui.dom.notifiersContainer?.querySelector(".T_M_G-video-fwd-notifier") : this.ui.dom.notifiersContainer?.querySelector(".T_M_G-video-bwd-notifier")
        duration = Math.sign(duration) === 1 ? this.video.duration - this.video.currentTime > duration ? duration : this.video.duration - this.video.currentTime : Math.sign(duration) === -1 ? this.video.currentTime > Math.abs(duration) ? duration : -this.video.currentTime : 0
        duration = Math.trunc(duration)
        this.skipVideoTime += duration
        this.progressPosition = this.skipVideoTime / this.video.duration
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
            }, Number(this.notifierArrowsTransitionTime.replace('ms', '')) + 10)
            notifier.dataset.skip = this.skipDuration
            return
        } 
        if ((this.video.currentTime === 0 && notifier.classList.contains("T_M_G-video-bwd-notifier")) || (this.video.currentTime === this.video.duration && notifier.classList.contains("T_M_G-video-fwd-notifier"))) {
            duration = 0
        }            
        notifier.dataset.skip = Math.abs(duration)
    } catch(e) {
        this._handleError(e)
    }        
    }
            
    //Playback
    changePlaybackSpeed() {
    try {        
        let newPlaybackRate = this.video.playbackRate + .25
        if (newPlaybackRate > 2) newPlaybackRate = .25
        this.video.playbackRate = newPlaybackRate
    } catch(e) {
        this._handleError(e)
    }        
    }
    
    _handlePlaybackChange() {
    try {        
        if (this.ui.dom.speedBtn) this.ui.dom.speedBtn.textContent = `${this.video.playbackRate}x`
        if (this.ui.dom.speedNotifier) this.ui.dom.speedNotifier.textContent = `${this.video.playbackRate}x`  
    } catch(e) {
        this._handleError(e)
    }        
    }
    
    speedUp(x) {
    try {        
        if (!this.speedCheck) {
            const rect = this.video.getBoundingClientRect()
            this.speedCheck = true
            this.wasPaused = this.video.paused
            if (x && this.settings.beta) {
                x - rect.left >= this.video.offsetWidth*0.5 ? this.fastForward() : this.rewind()
            } else this.fastForward()
            this.ui.dom.speedNotifier.classList.add("T_M_G-video-control-active")
        }
    } catch(e) {
        this._handleError(e)
    }    
    }

    fastForward() {
        try {
            this.speedToken = 1
            this.previousRate = this.video.playbackRate
            this.video.playbackRate = 2    
            if (this.wasPaused) this.video.play()
        } catch(e) {
            this._handleError(e)
        }
    }

    rewind() {
        try {
            this.speedToken = 0
            this.ui.dom.notifiersContainer.querySelector(".T_M_G-video-speed-notifier").textContent = '2x'
            this.ui.dom.speedNotifier.classList.add("T_M_G-video-rewind")
            this.video.addEventListener("play", this.rewindReset)
            this.video.addEventListener("pause", this.rewindReset)
            this.speedVideoTime = this.video.currentTime
            this.speedIntervalId = setInterval(this.rewindVideo.bind(this), 20)
            setTimeout(() => {
                if (this.wasPaused) this.video.play()
            }, 1000)
        } catch(e) {
            this._handleError(e)
        }
    }        


    rewindVideo() {
    try {        
        this.speedVideoTime -= 0.04
        this.progressPosition = this.speedVideoTime / this.video.duration
        if (this.ui.dom.speedNotifier) this.ui.dom.speedNotifier.dataset.currentTime = tmg.formatDuration(Math.max(this.speedVideoTime, 0))
        this.video.currentTime -= .04
    } catch(e) {
        this._handleError(e)
    }        
    }

    rewindReset() {
    try {
        clearInterval(this.speedIntervalId)
        if(!this.video.paused) this.speedIntervalId = setInterval(this.rewindVideo.bind(this), 20)
    } catch(e) {
        this._handleError(e)
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
                if (this.ui.dom.speedNotifier) this.ui.dom.speedNotifier.textContent = `${this.previousRate}x`
                this.ui.dom.speedNotifier.classList.remove("T_M_G-video-rewind")
                this.video.removeEventListener("play", this.rewindReset)
                this.video.removeEventListener("pause", this.rewindReset)
                if (this.speedIntervalId) clearInterval(this.speedIntervalId)
            }
            this.ui.dom.speedNotifier.classList.remove("T_M_G-video-control-active")
        }
    } catch(e) {
        this._handleError(e)
    }    
    }

    //Captions
    toggleCaptions() {
    try {        
        if (this.video.textTracks[0]) {
        const isHidden = this.video.textTracks[0].mode === "hidden"
        this.video.textTracks[0].mode = isHidden ? "showing" : "hidden"
        this.ui.dom.videoContainer.classList.toggle("T_M_G-video-captions", isHidden)
        }
    } catch(e) {
        this._handleError(e)
    }        
    }
            
    //Volume
    toggleMute() {
    try {
        this.video.muted = !this.video.muted
    } catch(e) {
        this._handleError(e)
    }        
    }

    _handleVolumeSliderInput({target}) {
    try {                
        this.video.volume = target.value / 100
        this.video.muted = target.value === 0
        this.volumeActiveRestraint()            
        this.overlayRestraint()
    } catch(e) {
        this._handleError(e)
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
        this.volumeValuePosition = volumeSliderPercent
        this.volumeSliderPosition = volumePercent
        this.ui.dom.videoContainer.dataset.volumeLevel = volumeLevel
    }
    } catch(e) {
        this._handleError(e)
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
        this._handleError(e)
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
        this._handleError(e)
    }        
    }

    volumeActiveRestraint() {
    try {
        if (this.volumeActiveRestraintId) clearTimeout(this.volumeActiveRestraintId)
        this.volumeActiveRestraintId = setTimeout(() => this.ui.dom.volumeSlider?.parentElement.classList.remove("T_M_G-video-control-active"), this.overlayRestraintTime)  
    } catch(e) {
        this._handleError(e)
    }
    }

    _handleVolumeContainerMouseUp() {
    try {
        if (this.volumeActiveId) clearTimeout(this.volumeActiveId)
    } catch(e) {
        this._handleError(e)
    }            
    }

    //theater mode
    toggleTheaterMode() {
    try {
        if (this.settings.status.modes.theater) {
        this.ui.dom.videoContainer.classList.toggle("T_M_G-video-theater")
        }
    } catch(e) {
        this._handleError(e)
    }        
    }
    
    //full-screen mode
    toggleFullScreenMode() {
    try {
        if (this.settings.status.modes.fullScreen) {
        if (!this.ui.dom.videoContainer.classList.contains("T_M_G-video-picture-in-picture")) {
            document.fullscreenElement == null ? this.ui.dom.videoContainer.requestFullscreen() : document.exitFullscreen()
        }    
        }
    } catch(e) {
        this._handleError(e)
    }        
    }

    _handleFullScreenChange() {
    try {
        if (document.fullscreenElement) {
            if (screen.orientation && screen.orientation.lock && screen.orientation.type.startsWith("portrait")) {  
                screen.orientation.lock('landscape')
                .catch(e => this._handleError(e))
            } 
        } else {
            if (screen.orientation && screen.orientation.lock)screen.orientation.unlock()
        }     
        this.ui.dom.videoContainer.classList.toggle("T_M_G-video-full-screen", document.fullscreenElement)            
        if (this.ui.dom.videoContainer.classList.contains("T_M_G-video-mini-player") && this.ui.dom.videoContainer.classList.contains("T_M_G-video-full-screen")) this.ui.dom.videoContainer.classList.remove("T_M_G-video-mini-player")
    } catch(e) {
        this._handleError(e)
    }            
    }        

    //picture-in-picture mode
    togglePictureInPictureMode() {
    try {
        if (this.settings.status.modes.pip) {
        this.ui.dom.videoContainer.classList.contains("T_M_G-video-picture-in-picture") ? document.exitPictureInPicture() : this.video.requestPictureInPicture()
        }
    } catch(e) {
        this._handleError(e)
    }        
    } 

    _handleEnterPip() {
    try {
        this.ui.dom.videoContainer.classList.add("T_M_G-video-picture-in-picture")
        this.toggleMiniPlayerMode(false)
    } catch(e) {
        this._handleError(e)
    }        
    }

    _handleLeavePip() {
    try {
        this.ui.dom.videoContainer.classList.remove("T_M_G-video-picture-in-picture")
        this.toggleMiniPlayerMode()
    } catch(e) {
        this._handleError(e)
    }        
    }        

    //mini player mode
    expandMiniPlayer() {
        this.toggleMiniPlayerMode(false, "instant")
    }

    cancelMiniPlayer() {
        this.toggleMiniPlayerMode(false)
    }

    toggleMiniPlayerMode(bool, behaviour) {
    try {
    if (this.settings.status.modes.miniPlayer) {
    const threshold = 240
    if (!document.fullscreenElement) {
        if (bool === false) {
            if (behaviour) {
                this.concerned = true
                window.scrollTo({
                    top: this.ui.dom.videoContainer.parentNode.offsetTop,
                    left: 0,
                    behavior: behaviour,
                })                    
            }
            this.removeMiniPlayer()
            return
        }
        if ((!this.ui.dom.videoContainer.classList.contains("T_M_G-video-mini-player") && !this.video.paused && window.innerWidth >= threshold && !document.pictureInPictureElement && !this.parentIntersecting) || (bool === true)) {
            this.ui.dom.videoContainer.classList.add("T_M_G-video-mini-player")
            this.ui.dom.videoContainer.addEventListener("mousedown", this.moveMiniPlayer)
            this.ui.dom.videoContainer.addEventListener("touchstart", this.moveMiniPlayer, {passive: false})
            return
        } 
        if ((this.ui.dom.videoContainer.classList.contains("T_M_G-video-mini-player") && this.parentIntersecting) || (this.ui.dom.videoContainer.classList.contains("T_M_G-video-mini-player") && window.innerWidth < threshold)) this.cleanUpMiniPlayer()
    }
    }
    } catch(e) {
        this._handleError(e)
    }
    }    

    removeMiniPlayer() {
        try {
            this.cleanUpMiniPlayer()
            if (!this.video.paused && !this.concerned) this.togglePlay(false)
            this.concerned = false
        } catch(e) {
            this._handleError(e)
        }
    }                

    cleanUpMiniPlayer() {
        try {
            this.ui.dom.videoContainer.classList.remove("T_M_G-video-mini-player")
            this.ui.dom.videoContainer.removeEventListener("mousedown", this.moveMiniPlayer)
            this.ui.dom.videoContainer.removeEventListener("touchstart", this.moveMiniPlayer, {passive: false})
        } catch(e) {
            this._handleError(e)
        }
    }                

    moveMiniPlayer(e){
    try {
        if (this.ui.dom.videoContainer.classList.contains("T_M_G-video-mini-player")) {
        if (!this.ui.dom.videoControlsContainer.contains(e.target)) {
            this.ui.dom.videoContainer.addEventListener("mousemove", this._handleMiniPlayerPosition)
            this.ui.dom.videoContainer.addEventListener("mouseup", this.emptyMiniPlayerListeners, {once: true})
            this.ui.dom.videoContainer.addEventListener("mouseleave", this.emptyMiniPlayerListeners, {once: true})
            this.ui.dom.videoContainer.addEventListener("touchmove", this._handleMiniPlayerPosition, {passive: false})
            this.ui.dom.videoContainer.addEventListener("touchend", this.emptyMiniPlayerListeners, {once: true, passive: false})
        }
    }        
    } catch(e) {
        this._handleError(e)
    }        
    }    

    emptyMiniPlayerListeners() {
        try {
            this.showVideoOverlay()
            this.ui.dom.videoContainer.removeEventListener("mousemove", this._handleMiniPlayerPosition)
            this.ui.dom.videoContainer.removeEventListener("mouseup", this.emptyMiniPlayerListeners, {once: true})
            this.ui.dom.videoContainer.removeEventListener("mouseleave", this.emptyMiniPlayerListeners, {once: true})
            this.ui.dom.videoContainer.removeEventListener("touchmove", this._handleMiniPlayerPosition, {passive: false})
            this.ui.dom.videoContainer.removeEventListener("touchend", this.emptyMiniPlayerListeners, {once: true, passive: false})
        } catch(e) {
            this._handleError(e)
        }
    }

    _handleMiniPlayerPosition(e) {
        try {
            e.preventDefault()
            this.ui.dom.videoContainer.classList.remove("T_M_G-video-overlay")
            const x = e.clientX ?? e.changedTouches[0].clientX,
            y = e.clientY ?? e.changedTouches[0].clientY,
            {innerWidth: ww, innerHeight: wh} = window,
            {offsetWidth: w, offsetHeight: h} = this.ui.dom.videoContainer,
            xR = 0,
            yR = 0,
            posX = tmg.clamp(xR, ww - x - w/2, ww - w - xR),
            posY = tmg.clamp(yR, wh - y - h/2, wh - h - yR)
            this.miniPlayerX = (posX/ww * 100).toFixed() + '%'
            this.miniPlayerY = (posY/wh * 100).toFixed() + '%'
        } catch(e) {
            this._handleError(e)
        }
    }    

    //Keyboard and General Accessibility Functions
    _handleClick() {
    try {
        if (tmg.queryMediaMobile() && !this.ui.dom.videoContainer.classList.contains("T_M_G-video-mini-player")) {
            if (!this.buffering) this.ui.dom.videoContainer.classList.toggle("T_M_G-video-overlay")
        } 
        if (tmg.queryMediaMobile() || this.ui.dom.videoContainer.classList.contains("T_M_G-video-mini-player")) return
        if (this.playId) clearTimeout(this.playId)
        this.playId = setTimeout(() => {
            if (!(this.speedCheck && this.playTriggerCounter < 1))  this.togglePlay()
                this.showVideoOverlay()
        }, 300)
    } catch(e) {
        this._handleError(e)
    }        
    }

    _handleRightClick(e) {
        e.preventDefault()
    }

    _handleDoubleClick({clientX: x}) {
    try {
        if (this.playId) clearTimeout(this.playId)
        const rect = this.video.getBoundingClientRect()
        if (((x-rect.left) > (this.video.offsetWidth*0.65))) {
            this.skip(10, true)
        } else if ((x-rect.left) < (this.video.offsetWidth*0.35)) {
            this.skip(-10, true)
        } else this.toggleFullScreenMode()
    } catch(e) {
        this._handleError(e)
    }        
    }

    _handleHoverPointerMove() {
        if (!(tmg.queryMediaMobile() && !this.ui.dom.videoContainer.classList.contains("T_M_G-video-mini-player"))) this.showVideoOverlay()
    }

    _handleHoverPointerDown() {
        this.overlayRestraint()
    }

    _handleHoverPointerOut() {
        if (!this.ui.dom.videoContainer.matches(":hover")) {
            if (!tmg.queryMediaMobile()) this.removeOverlay()
        }
    }

    showVideoOverlay() {
    try {
        this.ui.dom.videoContainer.classList.add("T_M_G-video-overlay")
        this.overlayRestraint()
    } catch(e) {
        this._handleError(e)
    }        
    }
    
    overlayRestraint() {
        try {        
            if (this.overlayRestraintId) clearTimeout(this.overlayRestraintId)
            if (!this.video.paused && !this.buffering) {
                this.overlayRestraintId = setTimeout(() => {
                    this.removeOverlay()
                }, this.overlayRestraintTime)
            }
        } catch(e) {
            this._handleError(e)
        }    
    }        

    removeOverlay() {
        if (!this.video.paused && !this.buffering) this.ui.dom.videoContainer.classList.remove("T_M_G-video-overlay")
    }

    _handlePointerDown(e) {
    try {
        if (!this.ui.dom.videoContainer.classList.contains("T_M_G-video-mini-player")) {
            this.ui.dom.videoContainer.addEventListener("mouseup", this._handleSpeedPointerUp)
            this.ui.dom.videoContainer.addEventListener("mouseleave", this._handleSpeedPointerUp)                
            this.ui.dom.videoContainer.addEventListener("touchend", this._handleSpeedPointerUp)
            if (this.settings.beta) {
            this.ui.dom.videoContainer.addEventListener("mousemove", this._handleSpeedPointerMove)
            this.ui.dom.videoContainer.addEventListener("touchmove", this._handleSpeedPointerMove, {passive: true})
            }
            this.speedPointerCheck = true
            const x = e.clientX ?? e.changedTouches[0].clientX
            this.speedTimeoutId = this.settings.beta ? setTimeout(this.speedUp.bind(this), this.speedUpThreshold, x) : setTimeout(this.speedUp.bind(this), this.speedUpThreshold)
            const rect = this.video.getBoundingClientRect()
            this.speedPosition = x - rect.left >= this.video.offsetWidth * 0.5 ? "right" : "left"
        }
    } catch(e) {
        this._handleError(e)
    }        
    }   
    
    _handleSpeedPointerMove(e) {
        try {
            if (this.settings.beta) {
            const rect = this.video.getBoundingClientRect()
            const x = e.clientX ?? e.changedTouches[0].clientX
            const currPos = x - rect.left >= this.video.offsetWidth * 0.5 ? "right" : "left"
            if (currPos !== this.speedPosition) {
                this.speedPosition = currPos
                this.slowDown()
                setTimeout(this.speedUp.bind(this), 0, x)
            }
            }
        } catch(e) {
            this._handleError(e)
        }
    }
        
    _handleSpeedPointerUp() {
        try {
            this.ui.dom.videoContainer.removeEventListener("mouseup", this._handleSpeedPointerUp)
            this.ui.dom.videoContainer.removeEventListener("mouseleave", this._handleSpeedPointerUp)      
            this.ui.dom.videoContainer.removeEventListener("touchend", this._handleSpeedPointerUp)
            if (this.settings.beta) {
            this.ui.dom.videoContainer.removeEventListener("mousemove", this._handleSpeedPointerMove)              
            this.ui.dom.videoContainer.removeEventListener("touchmove", this._handleSpeedPointerMove, {passive: true})
            }
            this.speedPointerCheck = false
            if (this.speedTimeoutId) clearTimeout(this.speedTimeoutId)
            if (this.speedCheck && this.playTriggerCounter < 1) this.slowDown()     
        } catch(e) {
            this._handleError(e)                   
        }
    }

    _handleKeyDown(e) {
    try {
        const tagName = document.activeElement.tagName.toLowerCase()

        if (tagName === "input") return
        
        switch (e.key.toString().toLowerCase()) {
            case " ":
                if (tagName === "button") return
                e.preventDefault()
            case this.settings.keyShortcuts["playPause"]:
                this.playTriggerCounter ++
                if (this.playTriggerCounter === 1) document.addEventListener("keyup", this._handlePlayTriggerUp)
                if (this.playTriggerCounter === 2 && !this.speedPointerCheck) this.speedUp()
                break
            case this.settings.keyShortcuts["skipBwd"]:
                e.preventDefault()
                e.shiftKey ? this.skip(-10) : this.skip(-5)
                this.fire("bwd")
                break
            case this.settings.keyShortcuts["skipFwd"]:
                e.preventDefault()
                e.shiftKey ? this.skip(10) : this.skip(5)
                this.fire("fwd")
                break
            case this.settings.keyShortcuts["volumeUp"]:
                e.preventDefault()
                this.volumeChange("increment", 5)
                break
            case this.settings.keyShortcuts["volumeDown"]:
                e.preventDefault()
                this.volumeChange("decrement", 5)
                break
            case this.settings.keyShortcuts["start"]:
                e.preventDefault()
            case "0":
                this.moveVideoTime({action: "moveTo", details: {to: "start"}})
                break
            case this.settings.keyShortcuts["end"]:
                e.preventDefault()
                this.moveVideoTime({action: "moveTo", details: {to: "end"}})
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
                this.moveVideoTime({action: "moveTo", details: {to: e.key, max: 9}})
                break                
        }
    } catch(e) {
        this._handleError(e)
    }        
    }        

    _handleKeyUp(e) {
    try {
        const tagName = document.activeElement.tagName.toLowerCase()

        if (tagName === "input") return

        switch (e.key.toString().toLowerCase()) {
            case this.settings.keyShortcuts["fullScreen"]:
                if (this.settings.status.modes.fullScreen) {
                this.toggleFullScreenMode()
                this.fire("fullScreen")
                }
                break
            case this.settings.keyShortcuts["theater"]:
                if (!tmg.queryMediaMobile() && !this.ui.dom.videoContainer.classList.contains("T_M_G-video-mini-player") && !this.ui.dom.videoContainer.classList.contains("T_M_G-video-full-screen") && this.settings.status.modes.theater) {
                this.toggleTheaterMode()
                this.fire("theater")
                }
                break
            case this.settings.keyShortcuts["expandMiniPlayer"]:
                if (this.ui.dom.videoContainer.classList.contains("T_M_G-video-mini-player")) {
                e.shiftKey ? this.toggleMiniPlayerMode(false, "smooth") : this.toggleMiniPlayerMode(false, "instant")
                }
                break
            case this.settings.keyShortcuts["removeMiniPlayer"]:
                if (this.ui.dom.videoContainer.classList.contains("T_M_G-video-mini-player")) {
                e.shiftKey ? this.replay() : this.toggleMiniPlayerMode(false) 
                }
                break
            case this.settings.keyShortcuts["pip"] ?? this.settings.keyShortcuts["pictureInPicture"]:
                if (this.settings.status.modes.pip) {
                if (!e.shiftKey && !e.ctrlKey) this.togglePictureInPictureMode()
                }
                break
            case this.settings.keyShortcuts["mute"]:
                this.toggleMute()
                this.video.muted ? this.fire("volumemuted") : this.fire("volumeup")
                break
            case this.settings.keyShortcuts["playbackRate"]: 
                this.changePlaybackSpeed()
                this.fire("speed")
                break
            case this.settings.keyShortcuts["captions"]:
                if (this.video.textTracks[0]) {
                this.toggleCaptions()
                this.fire("captions")
                }
                break
        }
    } catch(e) {
        this._handleError(e)
    }        
    }

    _handlePlayTriggerUp(e) {
    try {        
        const tagName = document.activeElement.tagName.toLowerCase()
        
        if (tagName === "input") return
        
        switch (e.key.toString().toLowerCase()) {
            case " ":
                if (tagName === "button") return
                e.preventDefault()                
            case this.settings.keyShortcuts["playPause"]:                        
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
        this._handleError(e)
    }        
    }    

    //drag and drop implementation
    _handleDragStart(e) {
    try {
        e.dataTransfer.effectAllowed = "move"
        e.target.classList.add("T_M_G-video-dragging")
        this.dragging = e.target === this.ui.dom.muteBtn ? e.target.parentElement : e.target
    } catch(e) {
        this._handleError(e)
    }                
    }

    _handleDrag() {
    try {
        this.overlayRestraint()
    } catch(e) {
        this._handleError(e)
    }                
    }

    _handleDragEnd(e) {
    try {
        this.showVideoOverlay()
        e.target.classList.remove("T_M_G-video-dragging")
        let controllerStructure = []
        controllerStructure.push(this.settings.controllerStructure.find(c => c.startsWith("timeline")))
        const leftSideStructure = this.settings.status.ui.leftSidedControls && this.ui.dom.leftSidedControlsWrapper.children ? Array.from(this.ui.dom.leftSidedControlsWrapper.children, el => el.dataset.controlId) : []
        const rightSideStructure = this.settings.status.ui.rightSidedControls && this.ui.dom.leftSidedControlsWrapper.children ? Array.from(this.ui.dom.rightSidedControlsWrapper.children, el => el.dataset.controlId) : []
        controllerStructure = controllerStructure.concat(leftSideStructure, ["spacer"], rightSideStructure)
        this.settings.controllerStructure = controllerStructure
    } catch(e) {
        this._handleError(e)
    }        
    }

    _handleDragEnter(e) {
    try {
        if (e.target.dataset.dropzone) {
            e.target.classList.add("T_M_G-video-dragover")
        }
    } catch(e) {
        this._handleError(e)
    }                
    }

    _handleDragOver(e) {
    try {
        e.preventDefault()
        if (e.target.dataset.dropzone) {
            e.dataTransfer.dropEffect = "move"
            const afterControl = this.getDraggingAfterControl(e.target, e.clientX)
            if (afterControl ?? false) {
                e.target.insertBefore(this.dragging, afterControl) 
            } else {
                e.target.appendChild(this.dragging) 
            }            
        }
    } catch(e) {
        this._handleError(e)
    }                
    }

    _handleDrop(e) {
    try {        
        e.preventDefault()
        if (e.target.dataset.dropzone) {
            e.target.classList.remove("T_M_G-video-dragover")
        }
    } catch(e) {
        this._handleError(e)
    }            
    }

    _handleDragLeave(e) {
    try {
        if (e.target.dataset.dropzone) {
            e.target.classList.remove("T_M_G-video-dragover")
        }
    } catch(e) {
        this._handleError(e)
    }        
    }

    getDraggingAfterControl(container, x) {
        const draggableControls = [...container.querySelectorAll("[draggable=true]:not(.T_M_G-video-dragging, .T_M_G-video-mute-btn), .T_M_G-video-volume-container:has([draggable=true])")]

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
                console.warn("You cannot override any of the media player settings")
            }
            return false
        } else {
            return true
        }
    }

    builder(customOptions) {
        if (this.queryBuild()) {
            this.#build = typeof customOptions === "object" ? {...this.#build, ...customOptions} : this.#build
            this.#build = {...tmg.DEFAULT_VIDEO_BUILD, ...this.#build} 
            this.#build.settings = this.#build.settings ?? false ? {...tmg.DEFAULT_VIDEO_BUILD.settings, ...this.#build.settings} : tmg.DEFAULT_VIDEO_BUILD.settings
            this.#build.settings.keyShortcuts = this.#build.settings.keyShortcuts !== false ? {...tmg.DEFAULT_VIDEO_BUILD.settings.keyShortcuts, ...this.#build.settings.keyShortcuts} : false
        }
    }

    attach(medium) {
        if (tmg.isIterable(medium)) {
            console.error("Please provide a single media element to the TMG media player")
            console.warn("Consider looping the iterable argument to get a single argument and create a new TMG player instance for each of them")
        } else {
            if (this.#active ?? false) {
                console.error("This TMG media player already has a viable media element attached")
                console.warn("Consider creating another instance of the 'TMG' class to attach your other media")
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
            this.#build.video = this.#medium
            this.#build.mediaType = 'video'
            this.#build.playbackState = this.#medium.autoplay ? 'playing' : 'paused'
            //doing some cleanup to make sure no necessary settings were removed
            this.builder()
            const settings = this.#build.settings.allowOverride ? {...this.#build.settings, ...this.userSettings} : this.#build.settings
            this.#medium.autoplay = settings.autoplay = (settings.autoplay === true) ? settings.autoplay : this.#medium.autoplay
            this.#medium.loop = settings.loop = (settings.loop === true) ? settings.loop : this.#medium.loop
            this.#medium.muted = settings.muted = (settings.muted === true) ? settings.muted : this.#medium.muted
            this.#build.settings = {...tmg.DEFAULT_VIDEO_BUILD.settings, ...settings}
            this.#build.settings.status = {
                ui: {
                    notifiers : this.#build.settings.notifiers || (!this.#build.settings.notifiers && this.#build.settings.allowOverride),
                    prev: this.#build.settings.controllerStructure.includes("prev"),
                    playPause: this.#build.settings.controllerStructure.includes("playPause"),
                    timeline: this.#build.settings.controllerStructure.some(c => c.startsWith("timeline")),
                    next: this.#build.settings.controllerStructure.includes("next"),
                    volume: this.#build.settings.controllerStructure.includes("volume"),
                    duration: this.#build.settings.controllerStructure.includes("duration"),
                    captions: this.#build.settings.controllerStructure.includes("captions"),
                    settings: this.#build.settings.controllerStructure.includes("settings"),
                    speed: this.#build.settings.controllerStructure.includes("speed"),
                    pip: this.#build.settings.controllerStructure.includes("pip") || this.#build.settings.controllerStructure.includes("pictureInPicture"),
                    theater: this.#build.settings.controllerStructure.includes("theater"),
                    fullScreen: this.#build.settings.controllerStructure.includes("fullScreen"),
                    previewImages: (this.#build.settings.previewImages?.address && this.#build.settings.previewImages?.fps) ? true : false,
                    leftSidedControls: this.#build.settings.controllerStructure.indexOf("spacer") > -1 ? this.#build.settings.controllerStructure.slice(0, this.#build.settings.controllerStructure.indexOf("spacer")).length > 0 : true,
                    rightSidedControls: this.#build.settings.controllerStructure.indexOf("spacer") > -1 ? this.#build.settings.controllerStructure.slice(this.#build.settings.controllerStructure.indexOf("spacer") + 1).length > 0 : false
                },
                modes: {
                    fullScreen: this.#build.settings.modes.includes("fullScreen") && document.fullscreenEnabled,
                    theater: this.#build.settings.modes.includes("theater"),
                    pip: (this.#build.settings.modes.includes("pictureInPicture") || this.#build.settings.modes.includes("pip")) && document.pictureInPictureEnabled,
                    miniPlayer: this.#build.settings.modes.includes("miniPlayer")
                }
            }   
            Object.freeze(this.#build)
            //commented out so drag and drop polyfill can be easily toggled
            //tmg.loadResource("/TMG_MEDIA_PROTOTYPE/prototype-2/drag-drop-touch-polyfill.js", "script")
            tmg.loadResource("/TMG_MEDIA_PROTOTYPE/prototype-2/prototype-2-video.css").then(() => this.buildVideoPlayer(this.#build)).then(() => tmg.Players.push(this))
            this.#active = true
            console.log(this.#build)
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
        //some utility functions that do not need replication
        media : document.querySelectorAll("[tmgcontrols]"),
        DEFAULT_VIDEO_BUILD : {
            mediaPlayer: 'TMG',
            mediaType: 'video',
            media: {
                artwork: [
                    {
                        src: "/TMG_MEDIA_PROTOTYPE/assets/icons/movie-tape.png"
                    }
                ]
            },
            activated: true,
            initialMode: "normal",
            initialState: true,
            playbackState: null,
            settings: {
                allowOverride: true,
                beta: false,
                modes: ["normal", "fullScreen", "theater", "pictureInPicture", "miniPlayer"],
                controllerStructure: ["timelineBottom", "playPause", "volume", "duration", "spacer", "captions", "settings", "speed", "pictureInPicture", "theater", "fullScreen"],
                notifiers: true,
                progressBar: false,
                persist: true,
                autoplay: null,
                loop: null,
                muted: null,
                previewImages: null,
                keyShortcuts: {
                    playPause : "k",
                    skipBwd: "arrowleft",
                    skipFwd: "arrowright",
                    volumeUp: "arrowup",
                    volumeDown: "arrowdown",
                    start: "home",
                    end: "end",
                    fullScreen: "f",
                    theater : "t",
                    expandMiniPlayer : "e",
                    removeMiniPlayer : "r",
                    pip : "i",
                    pictureInPicture: "i",
                    mute : "m",
                    playbackRate : "s",
                    captions : "c"
                },
            },
        },
        modeMatcher : {
            normal: "normal",
            fullScreen: "full-screen",
            miniPlayer: "mini-player",
            pip: "picture-in-picture",
            pictureInPicture: "picture-in-picture",
            theater: "theater"
        },
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
            break
            default:
                const firstStyleCache = JSON.stringify(tmg._styleCache) === "{}"
                tmg._styleCache[src] = tmg._styleCache[src] || new Promise(function (resolve, reject) {
                    let link = document.createElement("link")
                    link.href = src
                    link.rel = "stylesheet"
            
                    link.onload = () => {
                        if (firstStyleCache) {
                            const styles = document.querySelectorAll("style")
                            for (const style of styles) {
                                if (style.id === "T_M_G-video-pre-styling") style.remove()
                            }
                        }
                        resolve(link)
                    }
                    link.onerror = () =>  reject(new Error(`Load error for TMG CSSStylesheet`))
            
                    document.head.append(link)
                })
            
                return tmg._styleCache[src]
            break
        }
        },
        //mobile media query
        queryMediaMobile : () => {
            return window.matchMedia('(max-width: 480px), (max-width: 940px) and (max-height: 480px) and (orientation: landscape)').matches
        },
        //clamping values
        clamp : (min, amount, max) => {
            return Math.min(Math.max(amount, min), max)
        },
        formatDuration(time) {     
            const seconds = Math.floor(time % 60)
            const minutes = Math.floor(time / 60) % 60
            const hours = Math.floor(time / 3600)
            if (hours === 0) return `${minutes}:${tmg.leadingZeroFormatter.format(seconds)}`
            else return `${hours}:${tmg.leadingZeroFormatter.format(minutes)}:${tmg.leadingZeroFormatter.format(seconds)}`
        },
        leadingZeroFormatter : new Intl.NumberFormat(undefined, {minimumIntegerDigits: 2}),
        isIterable : obj => obj !== null && obj !== undefined && typeof obj[Symbol.iterator] === 'function',
        //a wild card for deploying TMG controls to available media, returns a promise that resolves with an array referencing the media
        launch : async function(medium) {
            let promises = []
            if (arguments.length === 0) {
                if (tmg.media) {
                    if (tmg.isIterable(tmg.media)) {
                        for(const medium of tmg.media) {
                            promises.push(tmg.launch(medium))
                        }
                        return Promise.all(promises)
                    }
                    else Promise.resolve(tmg.launch(tmg.media))
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
                        console.error(`${mssg} Please provide a valid JSON file`)
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
                            if (v.tmgAllowOverride) {
                                customOptions.settings.allowOverride = JSON.parse(v.tmgAllowOverride)
                                medium.removeAttribute("data-tmg-allow-override")
                            }         
                            if (v.tmgBeta) {
                                customOptions.settings.beta = JSON.parse(v.tmgBeta)
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
                            if (v.tmgKeyShortcuts) {
                                customOptions.settings.keyShortcuts = JSON.parse(v.tmgKeyShortcuts)
                                medium.removeAttribute("data-tmg-key-shortcuts")
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
        //getting all metods of an object
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
                console.log(props)
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
    }

    //hiding video when styles have not been loaded yet
    let style = document.createElement("style")
    style.id = "T_M_G-video-pre-styling"
    style.textContent = 
    `
        body [tmgcontrols] {
            display: none;
        }    
    `
    document.head.append(style)

    tmg.launch()
}
