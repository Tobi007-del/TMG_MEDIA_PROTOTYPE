"use strict"
/* 
TODO: 
    make codebase objective
    next and prev video
    keyboard shortcuts
    editable settings: shortcut, beta, keyshortcuts, notifiers, progressbar, controllerStructure
*/

//checking the current runtime environment
typeof window !== undefined ? window.tmg = {} : global.tmg = "TMG Media Controller Not Available"

if (typeof window === undefined) {
    console.error("TMG cannot run properly in a terminal")
    console.warn("Please move to a browser environment to use the TMG media controller")
} 

//global variables
const 
DEFAULT_VIDEO_SETTINGS = {
    mediaPlayer: 'TMG',
    mediaType: 'video/audio',
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
        controllerStructure: ["timelineBottom", "playPause", "volume", "duration", "spacer", "captions", "settings", "speed", "pip", "theater", "fullScreen"],
        notifiers: true,
        progressBar: false,
        keyShortcuts: true,
        persist: true,
        autoplay: null,
        loop: null,
        muted: null,
        previewImages: null
    }
},
media = document.querySelectorAll("[tmgcontrols]"),
mobileMediaQuery = () => window.matchMedia('(max-width: 480px), (max-width: 940px) and (max-height: 480px) and (orientation: landscape)').matches,
_styleCache = {},
//some general functions
loadCSSStyleSheet = src => {
    if (JSON.stringify(_styleCache) === '{}') {
        const styles = document.querySelectorAll("style")
        for (const style of styles) {
            if (style.className === "T_M_G-pre-styling") style.remove()
        }
    }
    _styleCache[src] = _styleCache[src] || new Promise(function (resolve, reject) {
        let link = document.createElement("link")
        link.href = src
        link.rel = "stylesheet"

        link.onload = () => resolve(true)
        link.onerror = () =>  reject(new Error(`Load error for TMG CSSStylesheet`))

        document.head.append(link)
    })

    return _styleCache[src]
},
clamp = (min, amount, max) => Math.min(Math.max(amount, min), max),
isIterable = obj => obj !== null && obj !== undefined && typeof obj[Symbol.iterator] === 'function',
leadingZeroFormatter = new Intl.NumberFormat(undefined, {minimumIntegerDigits: 2})

//deploying TMG controls to alll available media
if (media) {
    if (isIterable(media)) 
        for(const medium of media) {deployControls(medium)}
    else deployControls(media)
}

//controller functions
function deployControls(medium) {     
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
    (async function buildControlOptions(v) {
        const customControls = await fetchedControls ??  {} 
        let bool = () => {return customControls && Object.keys(customControls).length === 0}
        if (bool()) {
                customControls.settings = {}
                if (v.tmgPreviewImagesAddress) {
                    customControls.settings.previewImages ? customControls.settings.previewImages.address = v.tmgPreviewImagesAddress : customControls.settings.previewImages = {
                        address: v.tmgPreviewImagesAddress
                    }
                    medium.removeAttribute("data-tmg-preview-images-address")
                }
                if (v.tmgPreviewImagesFps) {
                    customControls.settings.previewImages ? customControls.settings.previewImages.fps = v.tmgPreviewImagesFps : customControls.settings.previewImages = {
                        fps: Number(v.tmgPreviewImagesFps)
                    }
                    medium.removeAttribute("data-tmg-preview-images-fps")
                } 
                if (v.tmgMediaTitle) {
                    customControls.media ? customControls.media.title = v.tmgMediaTitle : customControls.media = {
                        title: v.tmgMediaTitle
                    }
                    medium.removeAttribute("data-tmg-media-title")
                }
                if (v.tmgMediaArtwork ?? medium.poster) {
                    customControls.media ? customControls.media.artwork = [{src: v.tmgMediaArtwork ?? medium.poster}] : customControls.media = {
                        artwork: [{src: v.tmgMediaArtwork ?? medium.poster}]
                    }
                    medium.removeAttribute("data-tmg-media-artwork")
                }                
                if (v.tmgActivated) {
                    customControls.activated = JSON.parse(v.tmgActivated)
                    medium.removeAttribute("data-tmg-activated")
                }
                if (v.tmgInitialState) {
                    customControls.initialState = JSON.parse(v.tmgInitialState)
                    medium.removeAttribute("data-tmg-initial-state")
                }
                if (v.tmgInitialMode) {
                    customControls.initialMode = v.tmgInitialMode
                    medium.removeAttribute("data-tmg-initial-mode")
                }
                if (v.tmgModes) {
                    customControls.settings.modes = v.tmgModes.replaceAll(" ", "").split(",")
                    medium.removeAttribute("data-tmg-modes")
                }              
                if (v.tmgControllerStructure) {
                    customControls.settings.controllerStructure = v.tmgControllerStructure.replaceAll("'", "").replaceAll(" ", "").split(",")
                    medium.removeAttribute("data-tmg-controller-interface")
                }                  
                if (v.tmgProgressBar) {
                    customControls.settings.progressBar =  JSON.parse(v.tmgProgressBar)
                    medium.removeAttribute("data-tmg-progress-bar")
                }
                if (v.tmgNotifiers) {
                    customControls.settings.notifiers = JSON.parse(v.tmgNotifiers)
                    medium.removeAttribute("data-tmg-notifiers")
                }
                if (v.tmgInitialState) {
                    customControls.initialState = JSON.parse(v.tmgInitialState)
                    medium.removeAttribute("data-tmg-initial-state")
                }
                if (v.tmgBeta) {
                    customControls.settings.beta = JSON.parse(v.tmgBeta)
                    medium.removeAttribute("data-tmg-beta")
                }
                if (v.tmgAllowOverride) {
                    customControls.settings.allowOverride = JSON.parse(v.tmgAllowOverride)
                    medium.removeAttribute("data-tmg-allow-override")
                }
                if (v.tmgKeyShortcuts) {
                    customControls.settings.keyShortcuts = JSON.parse(v.tmgKeyShortcuts)
                    medium.removeAttribute("data-tmg-key-shortcuts")
                }
        }
        if (value === '' || value === 'true') {
            const player = new tmgPlayer(customControls)
            player.attach(medium)
        } else {
            console.error("TMG could not deploy custom controls so the video was not rendered")
            console.warn(`Consider removing the '${value}' value from the 'tmgcontrols' attribute`)
        }
    })(v)
}

//a class to handle the tmg Media Player
class tmgPlayer {
    //private variables
    #medium
    #customSettings
    constructor(customSettings) {
        this.#medium = null
        this.#customSettings = customSettings || null
        this.videoSettings = null
    }

    attach(medium) {
        if (isIterable(medium)) {
            console.error("Please provide a single media element to the tmg media player")
            console.warn("Consider looping the iterable argument to get a single argument and create a new tmg player instance for each of them")
        } else {
            if (this.#medium ?? false) {
                console.error("This tmg media player already has a media viable element attached")
                console.warn("Consider creating another instance of the 'tmgPlayer' class to attach your other media")
            } else {
                this.#medium = medium
                this.deployControls()
            }
        }
    }

    deployControls() {
        if (this.#medium.tagName.toLowerCase() === "video") {
            if (this.#medium.controls) {
                console.error("TMG refused to override default video controls")
                console.warn("Please remove the 'controls' attribute to deploy the TMG video controller!")
                return                
            }
            let bool = () => {return this.#customSettings && Object.keys(this.#customSettings).length === 0}
            this.videoSettings = bool() ? DEFAULT_VIDEO_SETTINGS : {...DEFAULT_VIDEO_SETTINGS, ...this.#customSettings} 
            this.videoSettings.video = this.#medium
            this.videoSettings.mediaType = 'video'
            this.videoSettings.playbackState = this.#medium.autoplay ? 'playing' : 'paused'
            const settings = this.videoSettings.allowOverride ? this.getUserSettings() : this.#customSettings.settings
            this.#medium.autoplay = settings.autoplay = settings.autoplay ? settings.autoplay : this.#medium.autoplay
            this.#medium.loop = settings.loop = settings.loop ? settings.loop : this.#medium.loop
            this.#medium.muted = settings.muted = settings.muted ? settings.muted : this.#medium.muted
            this.videoSettings.settings = {...DEFAULT_VIDEO_SETTINGS.settings, ...settings}
            this.videoSettings.settings.status = {
                ui: {
                    notifiers : this.videoSettings.settings.notifiers || (!this.videoSettings.settings.notifiers && this.videoSettings.allowOverride),
                    prev: this.videoSettings.settings.controllerStructure.includes("prev"),
                    playPause: this.videoSettings.settings.controllerStructure.includes("playPause"),
                    timeline: this.videoSettings.settings.controllerStructure.some(c => c.startsWith("timeline")),
                    next: this.videoSettings.settings.controllerStructure.includes("next"),
                    volume: this.videoSettings.settings.controllerStructure.includes("volume"),
                    duration: this.videoSettings.settings.controllerStructure.includes("duration"),
                    captions: this.videoSettings.settings.controllerStructure.includes("captions"),
                    settings: this.videoSettings.settings.controllerStructure.includes("settings"),
                    speed: this.videoSettings.settings.controllerStructure.includes("speed"),
                    pip: this.videoSettings.settings.controllerStructure.includes("pip") || this.videoSettings.settings.controllerStructure.includes("pictureInPicture"),
                    theater: this.videoSettings.settings.controllerStructure.includes("theater"),
                    fullScreen: this.videoSettings.settings.controllerStructure.includes("fullScreen"),
                    previewImages: (this.videoSettings.settings.previewImages?.address && this.videoSettings.settings.previewImages?.fps) ? true : false,
                    leftSidedControls: this.videoSettings.settings.controllerStructure.indexOf("spacer") > -1 ? this.videoSettings.settings.controllerStructure.slice(0, this.videoSettings.settings.controllerStructure.indexOf("spacer")).length > 0 : true,
                    rightSidedControls: this.videoSettings.settings.controllerStructure.indexOf("spacer") > -1 ? this.videoSettings.settings.controllerStructure.slice(this.videoSettings.settings.controllerStructure.indexOf("spacer") + 1).length > 0 : false
                },
                modes: {
                    fullScreen: this.videoSettings.settings.modes.includes("fullScreen") && document.fullscreenEnabled,
                    theater: this.videoSettings.settings.modes.includes("theater"),
                    pip: (this.videoSettings.settings.modes.includes("pictureInPicture") || this.videoSettings.settings.modes.includes("pip")) && document.pictureInPictureEnabled,
                    miniPlayer: this.videoSettings.settings.modes.includes("miniPlayer")
                }
            }          
            console.log(this.videoSettings)
            loadCSSStyleSheet("/TMG_MEDIA_PROTOTYPE/prototype-2/prototype-2-video.css").then(() => launchtmgVideoPlayer(this.videoSettings))
            !isIterable(media) ? window.tmg[`player${Object.keys(window.tmg).length + 1}`] = this.videoSettings : window.tmg = this.videoSettings      
        } else {
            console.error(`TMG could not deploy custom controls on the '${this.#medium.tagName.toLowerCase()}' element as it is not supported`)
            console.warn("TMG only supports the 'video' element currently")
        }
    }

    getUserSettings() {
        if (localStorage.tmgUserVideoSettings) 
            return JSON.parse(localStorage.tmgUserVideoSettings)
        else 
            return this.#customSettings.settings
    }
}

function launchtmgVideoPlayer(videoSettings) {
    //building the controller interface
    buildVideoPlayerInterface(videoSettings)

    //some general variables
    let 
    wasPaused = !videoSettings.video.autoplay, 
    previousRate = videoSettings.video.playbackRate,
    isScrubbing = false,
    concerned = false,
    parentIntersecting = true,
    videoIntersecting = true,
    playId,
    hoverId,
    restraintId,
    restraintIdTwo, 
    smCounter = 0, 
    smCheck = false,
    speedCheck = false, 
    speedToken,
    speedTimeoutId,
    speedIntervalId,
    rewindVideoTime,
    speedPosition,
    skipDurationId = null,
    skipDuration = 0,
    currentNotifier,
    transitionId

    const 
    getControlsSize = () => Number(getComputedStyle(videoSettings.ui.dom.videoContainer).getPropertyValue("--T_M_G-controls-size").replace('px', '')),
    restraintTime = 3000,
    getNotifiersTransitionTime = () => Number(getComputedStyle(videoSettings.ui.dom.notifiersContainer).getPropertyValue("--T_M_G-transition-time").replace('ms', '')) + 10,
    getNotifierArrowsTransitionTime = () => Number(getComputedStyle(videoSettings.ui.dom.notifiersContainer).getPropertyValue("--T_M_G-arrows-transition-time").replace('ms', '')) + 10,           
    //custom events for notifying user
    notifierEvents = videoSettings.settings.status.ui.notifiers ? ["videoplay","videopause","volumeup","volumedown","volumemuted","captions","speed","theater","fullScreen","fwd","bwd"] : null,
    notify = videoSettings.settings.status.ui.notifiers ? {
        init : function() {
        if (videoSettings.settings.notifiers) {
            for(const notifier of videoSettings.ui.dom.notifiersContainer?.children) {
                notifier.addEventListener('transitionend', this.resetNotifiers)
            }
            for (const event of notifierEvents) {
                videoSettings.ui.dom.notifiersContainer?.addEventListener(event, this)
            }
        }
        },

        handleEvent: function(e) {
        if (videoSettings.settings.notifiers) {
            const transitionTime = e.type === "fwd" || e.type === "bwd" ? getNotifierArrowsTransitionTime() : getNotifiersTransitionTime()
            if (transitionId) clearTimeout(transitionId)
            videoSettings.ui.dom.notifiersContainer.dataset.currentNotifier = e.type
            transitionId = setTimeout(this.resetNotifiers, transitionTime)
        }
        },

        resetNotifiers: function() {
        if (videoSettings.settings.notifiers) {
            videoSettings.ui.dom.notifiersContainer.dataset.currentNotifier = ''
        }
        }
    } : null,
    //Intersection Observer Setup to watch the vieo
    videoObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.target != videoSettings.video) {
                parentIntersecting = entry.isIntersecting
                toggleMiniPlayerMode()
            } else {
                videoIntersecting = entry.isIntersecting
                videoIntersecting && videoSettings.settings.keyShortcuts ? setKeyEventListeners() : removeKeyEventListeners()
            }
        })
    }, {root: null, rootMargin: '0px', threshold: 0})   
    
    //dom builder and retreiver functions
    function buildVideoPlayerInterface(videoSettings) {
        videoSettings.video.poster = videoSettings.initialState ? (videoSettings.video.poster || videoSettings.media.artwork[0].src) : ""
        const videoContainer = document.createElement('div')
        videoContainer.classList = "T_M_G-video-container"
        if (!videoSettings.video.autoplay) videoContainer.classList.add("T_M_G-paused")
        if (videoSettings.initialState) videoContainer.classList.add("T_M_G-initial")
        if (videoSettings.initialMode) videoContainer.classList.add(`T_M_G-${videoSettings.initialMode}`)
        if (videoSettings.settings.status.ui.timeline) videoContainer.setAttribute("data-tmg-timeline-position", `${videoSettings.settings.controllerStructure.find(c => c.startsWith("timeline"))?.replace("timeline", "").toLowerCase()}`)
        if (videoSettings.settings.progressBar) videoContainer.setAttribute("data-tmg-progress-bar", videoSettings.settings.progressBar)
        if (!(videoSettings.settings.previewImages?.address && videoSettings.settings.previewImages?.fps)) videoContainer.setAttribute("data-tmg-previews", false) 
        videoSettings.video.parentNode.insertBefore(videoContainer, videoSettings.video)
    
        //building HTML for the Video Controller
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
        videoContainer.append(videoSettings.video)    

        buildVideoControllerStructure(videoSettings, videoContainer)
    }

    function buildVideoControllerStructure(videoSettings, videoContainer) {     
        const controllerStructure = videoSettings.settings.controllerStructure.filter(c => !c.startsWith("timeline")),
        spacerIndex = controllerStructure.indexOf("spacer"),
        leftSidedControls = spacerIndex > -1 ? controllerStructure.slice(0, spacerIndex) : controllerStructure,
        rightSidedControls = spacerIndex > -1 ? controllerStructure.slice(spacerIndex + 1) : null
    
        //breaking HTML into smaller units to use as building blocks
        const videoOverlayControlsContainerBuild = videoContainer.querySelector(".T_M_G-video-overlay-controls-container"),
        videoControlsContainerBuild = videoContainer.querySelector(".T_M_G-video-controls-container"),
        notifiersContainerBuild = videoSettings.settings.status.ui.notifiers || videoSettings.initialState ? document.createElement("div") : null,
        overlayMainControlsWrapperBuild = document.createElement("div"),
        controlsWrapperBuild = document.createElement("div"),
        leftSidedControlsWrapperBuild = videoSettings.settings.status.ui.leftSidedControls ? document.createElement("div") : null,
        rightSidedControlsWrapperBuild = videoSettings.settings.status.ui.rightSidedControls ? document.createElement("div") : null,
        videoBufferHTML = 
        `
        <div class="T_M_G-video-buffer"></div>
        `,
        thumbnailImgHTML =
        `
        <img class="T_M_G-thumbnail-img" alt="movie-image" src="${DEFAULT_VIDEO_SETTINGS.media.artwork[0].src}">
        `,
        playPauseNotifierHTML = videoSettings.settings.status.ui.notifiers || videoSettings.initialState ?
        `
            <div class="T_M_G-notifiers T_M_G-play-notifier">
                <svg class="T_M_G-play-notifier-icon" data-tooltip-text="Play(k)" data-tooltip-position="top">
                    <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                </svg>
            </div>
            <div class="T_M_G-notifiers T_M_G-pause-notifier">
                <svg class="T_M_G-pause-notifier-icon" data-tooltip-text="Pause(k)" data-tooltip-position="top">
                    <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
                </svg>
            </div>    
        ` : null,
        captionsNotifierHTML = videoSettings.settings.status.ui.notifiers ?
        `
            <div class="T_M_G-notifiers T_M_G-captions-notifier">
                <svg data-tooltip-text="Closed Captions(c)" data-tooltip-position="top">
                    <path fill="currentColor" d="M18,11H16.5V10.5H14.5V13.5H16.5V13H18V14A1,1 0 0,1 17,15H14A1,1 0 0,1 13,14V10A1,1 0 0,1 14,9H17A1,1 0 0,1 18,10M11,11H9.5V10.5H7.5V13.5H9.5V13H11V14A1,1 0 0,1 10,15H7A1,1 0 0,1 6,14V10A1,1 0 0,1 7,9H10A1,1 0 0,1 11,10M19,4H5C3.89,4 3,4.89 3,6V18A2,2 0 0,0 5,20H19A2,2 0 0,0 21,18V6C21,4.89 20.1,4 19,4Z" />
                </svg>
            </div>
        ` : null,
        speedNotifierHTML = videoSettings.settings.status.ui.notifiers ? 
        `
            <div class="T_M_G-notifiers T_M_G-speed-notifier"></div>
        ` : null,
        theaterNotifierHTML = videoSettings.settings.status.ui.notifiers ?
        `
            <div class="T_M_G-notifiers T_M_G-theater-notifier">
                <svg class="T_M_G-tall" data-tooltip-text="Theater Mode(t)" data-tooltip-position="top">
                    <path fill="currentColor" d="M19 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H5V8h14v8z"/>
                </svg>
                <svg class="T_M_G-wide" data-tooltip-text="Normal Mode(t)" data-tooltip-position="top">
                    <path fill="currentColor" d="M19 7H5c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 8H5V9h14v6z"/>
                </svg>
            </div>
        ` : null,
        fullscreenNotifierHTML = videoSettings.settings.status.ui.notifiers ?
        `
            <div class="T_M_G-notifiers T_M_G-full-screen-notifier">
                <svg class="T_M_G-open" data-tooltip-text="Enter Full Screen(f)" data-tooltip-position="top">
                    <path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                </svg>
                <svg class="T_M_G-close" data-tooltip-text="Leave Full Screen(f)" data-tooltip-position="top">
                    <path fill="currentColor" d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
                </svg>
            </div>      
        ` : null,
        volumeNotifierHTML = videoSettings.settings.status.ui.notifiers ?
        `
            <div class="T_M_G-notifiers T_M_G-volume-notifier-content"></div>
            <div class="T_M_G-notifiers T_M_G-volume-up-notifier">
                <svg class="T_M_G-volume-up-notifier-icon" >
                    <path fill="currentColor" d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
                </svg>
            </div>
            <div class="T_M_G-notifiers T_M_G-volume-down-notifier">
                <svg class="T_M_G-volume-down-notifier-icon">
                    <path fill="currentColor" d="M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z" />
                </svg>
            </div>
            <div class="T_M_G-notifiers T_M_G-volume-muted-notifier">
                <svg class="T_M_G-volume-muted-notifier-icon">
                    <path fill="currentColor" d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z" />
                </svg>
            </div>
        ` : null,
        fwdNotifierHTML = videoSettings.settings.status.ui.notifiers ? 
        `
            <div class="T_M_G-notifiers T_M_G-fwd-notifier">
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
        bwdNotiferHTML = videoSettings.settings.status.ui.notifiers ?
        `
            <div class="T_M_G-notifiers T_M_G-bwd-notifier">
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
        miniPlayerExpandBtnHTML = videoSettings.settings.status.modes.miniPlayer ?
        `
        <div class="T_M_G-mini-player-expand-btn-wrapper">
            <button type="button" class="T_M_G-mini-player-expand-btn" title="Expand mini-player(e)">
                <svg class="T_M_G-mini-player-expand-icon" viewBox="0 -960 960 960" data-tooltip-text="Expand(e)" data-tooltip-position="top">
                    <path d="M120-120v-320h80v184l504-504H520v-80h320v320h-80v-184L256-200h184v80H120Z"/>
                </svg>
            </button>
        </div>    
        ` : null,
        miniPlayerCancelBtnHTML = videoSettings.settings.status.modes.miniPlayer ?
        `
        <div class="T_M_G-mini-player-cancel-btn-wrapper">
            <button type="button" class="T_M_G-mini-player-cancel-btn" title="Remove Mini-player(r)">
                <svg class="T_M_G-mini-player-cancel-icon" viewBox="0 -960 960 960" data-tooltip-text="Remove(r)" data-tooltip-position="top">
                    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                </svg>
            </button>
        </div>    
        ` : null,
        mainPrevBtnHTML = videoSettings.settings.status.ui.prev ?
        `
            <button type="button" class="T_M_G-main-prev-btn" title="Previous Video(Shift + p)">
                <svg class="T_M_G-prev-icon" data-tooltip-text="Previous Video(Shift + p)" data-tooltip-position="top">
                    <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                </svg>
            </button>       
        ` : null,
        mainPlayPauseBtnHTML = videoSettings.settings.status.ui.playPause ?
        `
            <button type="button" class="T_M_G-main-play-pause-btn" title="Play/Pause(p,l,a,y)">
                <svg class="T_M_G-play-icon" data-tooltip-text="Play(k)" data-tooltip-position="top">
                    <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                </svg>
                <svg class="T_M_G-pause-icon" data-tooltip-text="Pause(k)" data-tooltip-position="top">
                    <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
                </svg>
                <svg class="T_M_G-replay-icon" viewBox="0 -960 960 960" data-tooltip-text="Replay(shift + r)" data-tooltip-position="top">
                    <path d="M480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440h80q0 117 81.5 198.5T480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720h-6l62 62-56 58-160-160 160-160 56 58-62 62h6q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Z"/>
                </svg> 
            </button>            
        ` : null,
        mainNextBtnHTML = videoSettings.settings.status.ui.next ?
        `
            <button type="button" class="T_M_G-main-next-btn" title="Next Video(Shift + n)">
                <svg class="T_M_G-next-icon" data-tooltip-text="Next Video(Shift + n)" data-tooltip-position="top">
                    <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                </svg>
            </button>       
        ` : null,
        timelineHTML = videoSettings.settings.status.ui.timeline ?
        `
            <div class="T_M_G-timeline-container" title="'>' - 5s & Shift + '>' - 10s" tabindex="0">
                <div class="T_M_G-timeline">
                    <div class="T_M_G-network-timeline"></div>
                    <div class="T_M_G-preview-img-container">
                        <img class="T_M_G-preview-img" alt="Preview image" src="${DEFAULT_VIDEO_SETTINGS.media.artwork[0].src}">
                    </div>
                    <div class="T_M_G-thumb-indicator"></div>
                </div>
            </div>
        ` : null,
        prevBtnHTML = videoSettings.settings.status.ui.prev ?
        `
                <button type="button" class="T_M_G-prev-btn" title="Previous Video(Shift + p)">
                    <svg class="T_M_G-prev-icon" data-tooltip-text="Previous Video(Shift + p)" data-tooltip-position="top">
                        <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                    </svg>
                </button>       
        ` : null,
        playPauseBtnHTML = videoSettings.settings.status.ui.playPause ?
        `
                <button type="button" class="T_M_G-play-pause-btn" title="Play/Pause(p,l,a,y)">
                    <svg class="T_M_G-play-icon" data-tooltip-text="Play(p,l,a,y)" data-tooltip-position="top">
                        <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                    </svg>
                    <svg class="T_M_G-pause-icon" data-tooltip-text="Pause(p,l,a,y)" data-tooltip-position="top">
                        <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
                    </svg>
                    <svg class="T_M_G-replay-icon" viewBox="0 -960 960 960" data-tooltip-text="Replay(shift + r)" data-tooltip-position="top">
                        <path d="M480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440h80q0 117 81.5 198.5T480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720h-6l62 62-56 58-160-160 160-160 56 58-62 62h6q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Z"/>
                    </svg> 
                </button>    
        ` : null,
        nextBtnHTML = videoSettings.settings.status.ui.next ?
        `
                <button type="button" class="T_M_G-next-btn" title="Next Video(Shift + n)">
                    <svg class="T_M_G-next-icon" data-tooltip-text="Next Video(Shift + n)" data-tooltip-position="top">
                        <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                    </svg>
                </button>    
        ` : null,
        volumeHTML = videoSettings.settings.status.ui.volume ?
        `
                <div class="T_M_G-volume-container">
                    <button type="button" class="T_M_G-mute-btn" title="Toggle Volume(m)">
                        <svg class="T_M_G-volume-high-icon" data-tooltip-text="High Volume" data-tooltip-position="top">
                            <path fill="currentColor" d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
                        </svg>
                        <svg class="T_M_G-volume-low-icon" data-tooltip-text="Low Volume" data-tooltip-position="top">
                            <path fill="currentColor" d="M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z" />
                        </svg>
                        <svg class="T_M_G-volume-muted-icon" data-tooltip-text="Volume Muted" data-tooltip-position="top">
                            <path fill="currentColor" d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z" />
                        </svg>
                    </button>
                    <input class="T_M_G-volume-slider" type="range" min="0" max="100" step="any" title="Adjust Volume - Vertical arrows">
                </div>
        ` : null,
        durationHTML = videoSettings.settings.status.ui.duration ?
        `
                <div class="T_M_G-duration-container">
                    <div class="T_M_G-current-time">0.00</div>
                    /
                    <div class="T_M_G-total-time">0.00</div>
                </div>    
        ` : null,
        captionsBtnHTML = videoSettings.settings.status.ui.captions ?
        `
                <button type="button" class="T_M_G-captions-btn" title="Toggle Closed Captions(c)">
                    <svg data-tooltip-text="Closed Captions(c)" data-tooltip-position="top">
                        <path fill="currentColor" d="M18,11H16.5V10.5H14.5V13.5H16.5V13H18V14A1,1 0 0,1 17,15H14A1,1 0 0,1 13,14V10A1,1 0 0,1 14,9H17A1,1 0 0,1 18,10M11,11H9.5V10.5H7.5V13.5H9.5V13H11V14A1,1 0 0,1 10,15H7A1,1 0 0,1 6,14V10A1,1 0 0,1 7,9H10A1,1 0 0,1 11,10M19,4H5C3.89,4 3,4.89 3,6V18A2,2 0 0,0 5,20H19A2,2 0 0,0 21,18V6C21,4.89 20.1,4 19,4Z" />
                    </svg>
                </button>
        ` : null,
        settingsBtnHTML = videoSettings.settings.status.ui.settings ?
        `
                <button type="button" class="T_M_G-settings-btn" title="Toggle Settings">
                    <svg class="T_M_G-settings-icon" viewBox="0 -960 960 960" data-tooltip-text="Settings(s)" data-tooltip-position="top">
                        <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/>
                    </svg>
                </button>        
        ` : null,
        speedBtnHTML = videoSettings.settings.status.ui.speed ? 
        `
                <button type="button" class="T_M_G-speed-btn T_M_G-wide-btn" title="Playback Speed(s)">1x</button>
        ` : null,
        pictureInPictureBtnHTML = videoSettings.settings.status.ui.pip ? 
        `
                <button type="button" class="T_M_G-picture-in-picture-btn" title="Toggle Picture-in-Picture(i)">
                    <svg data-tooltip-text="Picture-in-Picture(i)" data-tooltip-position="top">
                        <path fill="currentColor" d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-10-7h9v6h-9z"/>
                    </svg>
                </button>    
        ` : null,  
        theaterBtnHTML = videoSettings.settings.status.ui.theater ?
        `
                <button type="button" class="T_M_G-theater-btn" title="Toggle Theater Mode(t)">
                    <svg class="T_M_G-tall" data-tooltip-text="Theater Mode(t)" data-tooltip-position="top">
                        <path fill="currentColor" d="M19 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H5V8h14v8z"/>
                    </svg>
                     <svg class="T_M_G-wide" data-tooltip-text="Normal Mode(t)" data-tooltip-position="top">
                        <path fill="currentColor" d="M19 7H5c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 8H5V9h14v6z"/>
                    </svg>
                </button>
        ` : null,
        fullScreenBtnHTML = videoSettings.settings.status.ui.fullScreen ?
        `
                <button type="button" class="T_M_G-full-screen-btn" title="Toggle Full Screen(f)">
                    <svg class="T_M_G-open" data-tooltip-text="Enter Full Screen(f)" data-tooltip-position="top">
                        <path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                    </svg>
                    <svg class="T_M_G-close" data-tooltip-text="Leave Full Screen(f)" data-tooltip-position="top">
                        <path fill="currentColor" d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
                    </svg>
                </button>    
        ` : null
        
        //building and deploying video controls
        videoOverlayControlsContainerBuild.innerHTML = ``
        videoControlsContainerBuild.innerHTML = ``
        //builidng and deploying Notifiers HTML
        if (videoSettings.settings.status.ui.notifiers || videoSettings.initialState) {
            notifiersContainerBuild.classList = "T_M_G-notifiers-container"
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
        overlayMainControlsWrapperBuild.classList = "T_M_G-overlay-main-controls-wrapper"
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
        if (videoSettings.settings.status.ui.leftSidedControls) {
            leftSidedControlsWrapperBuild.classList = "T_M_G-left-side-controls-wrapper"
            const leftSidedControlsHTMLArray = Array.from(leftSidedControls, el => allControlsHTML[el] ? allControlsHTML[el] : '')
            const leftSidedControlsHTML = ``.concat(...leftSidedControlsHTMLArray)
            leftSidedControlsWrapperBuild.innerHTML += leftSidedControlsHTML
            controlsWrapperBuild.append(leftSidedControlsWrapperBuild)
        }
        if (videoSettings.settings.status.ui.rightSidedControls) {
            rightSidedControlsWrapperBuild.classList = "T_M_G-right-side-controls-wrapper"
            const rightSidedControlsHTMLArray = Array.from(rightSidedControls, el => allControlsHTML[el] ? allControlsHTML[el] : '')
            const rightSidedControlsHTML = ``.concat(...rightSidedControlsHTMLArray)
            rightSidedControlsWrapperBuild.innerHTML += rightSidedControlsHTML
            controlsWrapperBuild.append(rightSidedControlsWrapperBuild)
        }

        videoControlsContainerBuild.innerHTML += timelineHTML ?? ""        
        controlsWrapperBuild.classList = "T_M_G-controls-wrapper"
        videoControlsContainerBuild.append(controlsWrapperBuild)  

        //retreiving elements from the document
        retreiveVideoPlayerDOM(videoSettings, videoContainer)
    }

    function retreiveVideoPlayerDOM(videoSettings, videoContainer) {
        //Setting Up DOM Elements for easy access
        videoSettings.ui = {
            altImgSrc : "/TMG_MEDIA_PROTOTYPE/assets/icons/movie-tape.png",
            dom : {
                videoContainer : videoContainer,
                thumbnailImg : videoContainer.querySelector(".T_M_G-thumbnail-img"),
                videoBuffer : videoContainer.querySelector(".T_M_G-video-buffer"),
                notifiersContainer: videoSettings.settings.status.ui.notifiers || videoSettings.initialState ? videoContainer.querySelector(".T_M_G-notifiers-container") : null,
                playNotifier : videoSettings.settings.status.ui.notifiers || videoSettings.initialState ? videoContainer.querySelector(".T_M_G-play-notifier") : null,
                pauseNotifier : videoSettings.settings.status.ui.notifiers ? videoContainer.querySelector(".T_M_G-pause-notifier") : null,
                captionsNotifier : videoSettings.settings.status.ui.notifiers ? videoContainer.querySelector(".T_M_G-captions-notifier") : null,
                speedNotifier : videoSettings.settings.status.ui.notifiers ? videoContainer.querySelector(".T_M_G-speed-notifier") : null,
                theaterNotifier : videoSettings.settings.status.ui.notifiers ? videoContainer.querySelector(".T_M_G-theater-notifier") : null,
                fullScreenNotifier : videoSettings.settings.status.ui.notifiers ? videoContainer.querySelector(".T_M_G-full-screen-notifier") : null,
                volumeNotifierContent : videoSettings.settings.status.ui.notifiers ?  videoContainer.querySelector(".T_M_G-volume-notifier-content") : null,
                volumeUpNotifier : videoSettings.settings.status.ui.notifiers ? videoContainer.querySelector(".T_M_G-volume-up-notifier") : null,
                volumeDownNotifier : videoSettings.settings.status.ui.notifiers ? videoContainer.querySelector(".T_M_G-volume-down-notifier") : null,
                volumeMutedNotifier : videoSettings.settings.status.ui.notifiers ? videoContainer.querySelector(".T_M_G-volume-muted-notifier") : null,
                fwdNotifier : videoSettings.settings.status.ui.notifiers ? videoContainer.querySelector(".T_M_G-fwd-notifier") : null,
                bwdNotifier : videoSettings.settings.status.ui.notifiers ? videoContainer.querySelector(".T_M_G-bwd-notifier") : null,
                videoOverlayControlsContainer: videoContainer.querySelector(".T_M_G-video-overlay-controls-container"),
                videoControlsContainer : videoContainer.querySelector(".T_M_G-video-controls-container"),
                leftSidedControlsWrapper : videoSettings.settings.status.ui.leftSidedControls ? videoContainer.querySelector(".T_M_G-left-side-controls-wrapper") : null,
                rightSidedControlsWrapper : videoSettings.settings.status.ui.rightSidedControls ? videoContainer.querySelector(".T_M_G-right-side-controls-wrapper") : null,
                miniPlayerExpandBtn : videoSettings.settings.status.modes.miniPlayer ? videoContainer.querySelector(".T_M_G-mini-player-expand-btn") : null,
                miniPlayerCancelBtn : videoSettings.settings.status.modes.miniPlayer ? videoContainer.querySelector(".T_M_G-mini-player-cancel-btn") : null,
                mainPrevBtn : videoSettings.settings.status.ui.prev ? videoContainer.querySelector(".T_M_G-main-prev-btn") : null,
                mainPlayPauseBtn : videoSettings.settings.status.ui.playPause ? videoContainer.querySelector(".T_M_G-main-play-pause-btn") : null,
                mainNextBtn : videoSettings.settings.status.ui.next ? videoContainer.querySelector(".T_M_G-main-next-btn") : null,
                timelineContainer : videoSettings.settings.status.ui.timeline ? videoContainer.querySelector(".T_M_G-timeline-container") : null,
                previewImgContainer : videoSettings.settings.status.ui.timeline ? videoContainer.querySelector(".T_M_G-preview-img-container") : null,
                previewImg : videoSettings.settings.status.ui.timeline ? videoContainer.querySelector(".T_M_G-preview-img") : null,
                prevBtn : videoSettings.settings.status.ui.prev ? videoContainer.querySelector(".T_M_G-prev-btn") : null,
                playPauseBtn : videoSettings.settings.status.ui.playPause ? videoContainer.querySelector(".T_M_G-play-pause-btn") : null,
                nextBtn : videoSettings.settings.status.ui.next ? videoContainer.querySelector(".T_M_G-next-btn") : null,
                volumeContianer : videoSettings.settings.status.ui.volume ? videoContainer.querySelector(".T_M_G-volume-container") : null,
                volumeSlider : videoSettings.settings.status.ui.volume ? videoContainer.querySelector(".T_M_G-volume-slider") : null,
                durationContainer : videoSettings.settings.status.ui.duration ? videoContainer.querySelector(".T_M_G-duration-container") : null,
                currentTimeElement : videoSettings.settings.status.ui.duration ? videoContainer.querySelector(".T_M_G-current-time") : null,
                totalTimeElement : videoSettings.settings.status.ui.duration ? videoContainer.querySelector(".T_M_G-total-time") : null,
                muteBtn : videoSettings.settings.status.ui.volume ? videoContainer.querySelector(".T_M_G-mute-btn") : null,
                captionsBtn : videoSettings.settings.status.ui.captions ?  videoContainer.querySelector(".T_M_G-captions-btn") : null,
                settingsBtn : videoSettings.settings.status.ui.settings ? videoContainer.querySelector(".T_M_G-settings-btn") : null,
                speedBtn : videoSettings.settings.status.ui.speed ? videoContainer.querySelector(".T_M_G-speed-btn") : null,
                pictureInPictureBtn : videoSettings.settings.status.ui.pip ? videoContainer.querySelector(".T_M_G-picture-in-picture-btn") : null,
                theaterBtn : videoSettings.settings.status.ui.theater ? videoContainer.querySelector(".T_M_G-theater-btn") : null,
                fullScreenBtn : videoSettings.settings.status.ui.fullScreen ? videoContainer.querySelector(".T_M_G-full-screen-btn") : null,
                svgs : videoContainer.querySelectorAll("svg")
            }
        }

        //initializing controller
        initializeVideoPlayer()
    }

    //function to fire custom events
    function fire(eventName, el = videoSettings.ui.dom.notifiersContainer, detail=null, bubbles=true, cancellable=true) {
        let evt = new CustomEvent(eventName, {detail, bubbles, cancellable})
        el.dispatchEvent(evt)
    }

    //function to prevent broken images
    function preventImgBreak(e) {
        e.target.src = videoSettings.ui.altImgSrc
    }

    //initializing video state
    function initializeVideoPlayer() {
    try {
        controlsResize()
        if (videoSettings.activated) {
            if (videoSettings.initialState) {
                videoSettings.ui.dom.notifiersContainer?.addEventListener("click", () => togglePlay(true), {once:true})
                videoSettings.video.addEventListener("timeupdate", initializeVideoControls, {once:true})
            } else initializeVideoControls()        
        } else {
            console.warn("You have to activate the TMG controller to access the custom controls")
            setInitialStates()
        }
    } catch(e) {
        console.error('TMG silent rendering error: ', e)
    }
    }

    function initializeVideoControls() {
    try {        
        setInitialStates()
        videoObserver.observe(videoSettings.ui.dom.videoContainer.parentElement)
        videoObserver.observe(videoSettings.video)      
        setEventListeners()
        videoSettings.settings.status.ui.keys = {
            p: true,
            l: true,
            a: true, 
            y: true,
            k: true,
            arrowleft: true,
            arrowright: true,
            arrowup: true,
            arrowdown: true,
            home: true,
            end: true,
            f: videoSettings.settings.status.modes.fullScreen,
            t: !mobileMediaQuery() && !videoSettings.ui.dom.videoContainer.classList.contains("T_M_G-mini-player") && !videoSettings.ui.dom.videoContainer.classList.contains("T_M_G-full-screen") && videoSettings.settings.status.modes.theater,
            e: videoSettings.ui.dom.videoContainer.classList.contains("mini-player"),
            r: videoSettings.ui.dom.videoContainer.classList.contains("mini-player"),
            i: videoSettings.settings.status.modes.pip,
            m: true,
            s: true,
            c: videoSettings.video.textTracks[0] ? true : false
        } 
        for (let i = 0; i < 10; i ++) {
            videoSettings.settings.status.ui.keys[i] = true
        }
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }        
    }

    function setInitialStates() {
    try {
        handleVolumeChange()
        setBtnStates()
        if (videoSettings.ui.dom.totalTimeElement) videoSettings.ui.dom.totalTimeElement.textContent = formatDuration(videoSettings.video.duration)
        if (videoSettings.video.textTracks[0]) { 
            videoSettings.video.textTracks[0].mode = "hidden"
        }
        if (videoSettings.initialState) {
            videoSettings.ui.dom.playNotifier.classList.add("T_M_G-spin")
            videoSettings.ui.dom.playNotifier.addEventListener("animationend", () => videoSettings.ui.dom.playNotifier.classList.remove("T_M_G-spin"), {once: true})
            if (!videoSettings.video.autoplay) handlePlay()
            videoSettings.ui.dom.videoContainer.classList.remove("T_M_G-initial")
        }
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }    
    }

    function setBtnStates() {
        if (!videoSettings.video.textTracks[0]) {
            videoSettings.ui.dom.captionsBtn?.classList.add("T_M_G-disabled")
        }
        if (!videoSettings.settings.status.modes.fullScreen) {
            videoSettings.ui.dom.fullScreenBtn?.classList.add("T_M_G-hidden")
        } 
        if (!videoSettings.settings.status.modes.theater) {
            videoSettings.ui.dom.theaterBtn?.classList.add("T_M_G-hidden")
        }
        if (!videoSettings.settings.status.modes.pip) {
            videoSettings.ui.dom.pictureInPictureBtn?.classList.add("T_M_G-hidden")
        }
    }

    function setEventListeners() {
    try {        
        //Event Listeners
        //window event listeners
        window.addEventListener('resize', handleResize)

        //document event listeners
        document.addEventListener("fullscreenchange", handleFullScreenChange)
        document.addEventListener("webkitfullscreenchange", handleFullScreenChange)

        //video event listeners
        videoSettings.video.addEventListener("play", handlePlay)
        videoSettings.video.addEventListener("pause", handlePause)        
        videoSettings.video.addEventListener("contextmenu", e => e.preventDefault())
        videoSettings.video.addEventListener("waiting", () => videoSettings.ui.dom.videoContainer.classList.add("T_M_G-buffer"))
        videoSettings.video.addEventListener("playing", () => videoSettings.ui.dom.videoContainer.classList.remove("T_M_G-buffer"))
        videoSettings.video.addEventListener("ratechange", handlePlaybackChange)      
        videoSettings.video.addEventListener("timeupdate", handleTimeUpdate)
        videoSettings.video.addEventListener("volumechange", handleVolumeChange)
        videoSettings.video.addEventListener("loadeddata", () => videoSettings.ui.dom.totalTimeElement.textContent = formatDuration(videoSettings.video.duration))
        videoSettings.video.addEventListener("ended", handleEnded)
        videoSettings.video.addEventListener("mousedown", handlePointerDown)
        videoSettings.video.addEventListener("touchstart", handlePointerDown, {passive:true})
        videoSettings.video.addEventListener("click", handleClick)
        videoSettings.video.addEventListener("dblclick", handleDoubleClick)
        videoSettings.video.addEventListener("enterpictureinpicture", handleEnterPip)
        videoSettings.video.addEventListener("leavepictureinpicture", handleLeavePip)

        //button event listeners 
        videoSettings.ui.dom.playPauseBtn?.addEventListener("click", () => togglePlay())
        videoSettings.ui.dom.mainPlayPauseBtn?.addEventListener("click", () => togglePlay())
        videoSettings.ui.dom.speedBtn?.addEventListener("click", changePlaybackSpeed)
        videoSettings.ui.dom.captionsBtn?.addEventListener("click", toggleCaptions)
        videoSettings.ui.dom.muteBtn?.addEventListener("click", toggleMute)
        videoSettings.ui.dom.theaterBtn?.addEventListener("click", toggleTheaterMode)
        videoSettings.ui.dom.fullScreenBtn?.addEventListener("click", toggleFullScreenMode)
        videoSettings.ui.dom.pictureInPictureBtn?.addEventListener("click", togglePictureInPictureMode)
        videoSettings.ui.dom.miniPlayerExpandBtn?.addEventListener("click", () => toggleMiniPlayerMode(false, "instant"))
        videoSettings.ui.dom.miniPlayerCancelBtn?.addEventListener("click", () => toggleMiniPlayerMode(false))        

        //videoSettings.ui.dom.videocontainer event listeners
        videoSettings.ui.dom.videoContainer.addEventListener("pointermove", handleMouseMove)

        //timeline contanier event listeners
        videoSettings.ui.dom.timelineContainer?.addEventListener("pointerdown", handleTimelineScrubbing)
        videoSettings.ui.dom.timelineContainer?.addEventListener("mousemove", handleTimelineUpdate)
        videoSettings.ui.dom.timelineContainer?.addEventListener("focus", handleTimelineFocus)
        videoSettings.ui.dom.timelineContainer?.addEventListener("blur", handleTimelineBlur)

        //volume event listeners
        videoSettings.ui.dom.volumeSlider?.addEventListener("input", handleSliderInput)
        videoSettings.ui.dom.volumeSlider?.addEventListener("mousedown", () => videoSettings.ui.dom.volumeSlider?.classList.add("T_M_G-active"))
        videoSettings.ui.dom.volumeSlider?.addEventListener("mouseup", () => videoSettings.ui.dom.volumeSlider?.classList.remove("T_M_G-active"))
        videoSettings.ui.dom.volumeSlider?.parentElement.addEventListener("mousemove", handleVolumeMouseMove)
        videoSettings.ui.dom.volumeSlider?.parentElement.addEventListener("mouseup", handleVolumeMouseUp)

        //image event listeners 
        videoSettings.ui.dom.previewImg?.addEventListener("error", preventImgBreak)
        videoSettings.ui.dom.thumbnailImg?.addEventListener("error", preventImgBreak)

        //notifiers event listeners
        notify.init()
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }                    
    }

    function setKeyEventListeners() {
    try {        
        if (videoSettings.settings.keyShortcuts) {
        document.addEventListener("keydown", handleKeyDown)
        document.addEventListener("keyup", handleKeyUp)
        }
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }        
    }

    function removeKeyEventListeners() {
    try {        
        document.removeEventListener("keydown", handleKeyDown)
        document.removeEventListener("keyup", handleKeyUp)
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }        
    }

    //resizing controls
    function controlsResize() {           
    try {
        let controlsSize = 25
        videoSettings.ui.dom.svgs?.forEach(svg => {
            svg.setAttribute("preserveAspectRatio", "xMidYMid meet")
            if ((!svg.classList.contains("T_M_G-settings-icon")) && (!svg.classList.contains("T_M_G-mini-player-expand-icon")) && (!svg.classList.contains("T_M_G-mini-player-cancel-icon")) && (!svg.classList.contains("T_M_G-replay-icon")))
                svg.setAttribute("viewBox", `0 0 ${controlsSize} ${controlsSize}`)
        })
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }        
    }       

    //window resizing
    function handleResize() {
    try {        
        toggleMiniPlayerMode()
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }        
    }

    //Play and Pause States
    function togglePlay(bool) {
    try {        
        videoSettings.video.ended ? handleReplay() : bool ?? videoSettings.video.paused ? videoSettings.video.play() : videoSettings.video.pause()
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }        
    }
    
    function handlePlay() {
    try {
        for (const media of document.querySelectorAll("video, audio")) {
            if (media !== videoSettings.video) media.pause()
        }
        videoSettings.ui.dom.videoContainer.classList.remove("T_M_G-paused")
        videoSettings.playbackState = "playing"
        if ('mediaSession' in navigator) {
            if (videoSettings.media) navigator.mediaSession.metadata = new MediaMetadata(videoSettings.media)
            navigator.mediaSession.setActionHandler('play', () => togglePlay(true))
            navigator.mediaSession.setActionHandler('pause', () => togglePlay(false))
            navigator.mediaSession.setActionHandler('seekbackward', () => skip(-10))
            navigator.mediaSession.setActionHandler('seekforward', () => skip(10))
            navigator.mediaSession.playbackState = videoSettings.playbackState
        }            
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }
    }
            
    function handlePause() {
    try {        
        videoSettings.ui.dom.videoContainer.classList.add("T_M_G-paused")
        videoSettings.playbackState = "paused"
        if ('mediaSession' in navigator) navigator.mediaSession.playbackState = videoSettings.playbackState
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }        
    }

    function handleReplay() {
    try {        
        moveVideoTime({action: "moveTo", details: {to: "start"}})
        videoSettings.video.play()
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }        
    }

    function handleEnded() {
    try {        
        videoSettings.ui.dom.videoContainer.classList.add("T_M_G-replay")
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }        
    }

    function restraint() {
    try {        
        if (restraintId) clearTimeout(restraintId)
        restraintId = setTimeout(() => videoSettings.ui.dom.videoContainer.classList.remove("T_M_G-hover"), restraintTime)
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }    
    }                

    //Time Manipulation
    //Timeline
    function moveVideoTime({action, details}) {
    try {        
        switch(action) {
            case "moveTo":                    
                switch(details.to) {
                    case "start":
                        videoSettings.video.currentTime = 0
                        break
                    case "end":
                        videoSettings.video.currentTime = videoSettings.video.duration
                        break
                    default:                        
                        videoSettings.video.currentTime = (Number(details.to)/Number(details.max)) * videoSettings.video.duration
                }
                break
        }
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }        
    }

    function handleTimelineScrubbing(e) {
    try {        
        videoSettings.ui.dom.timelineContainer?.setPointerCapture(e.pointerId)
        isScrubbing = true
        toggleScrubbing(e)
        videoSettings.ui.dom.timelineContainer?.addEventListener("pointermove", handleTimelineUpdate)
        videoSettings.ui.dom.timelineContainer?.addEventListener("pointerup", e => {
            isScrubbing = false
            toggleScrubbing(e)
            videoSettings.ui.dom.timelineContainer?.removeEventListener("pointermove", handleTimelineUpdate)
            videoSettings.ui.dom.timelineContainer?.releasePointerCapture(e.pointerId)
        }, { once: true })
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }        
    }
    
    function toggleScrubbing(e) {
    try {        
        const rect = videoSettings.ui.dom.timelineContainer?.getBoundingClientRect()
        const percent = Math.min(Math.max(0, e.clientX - rect.x), rect.width) / rect.width
        videoSettings.ui.dom.videoContainer.classList.toggle("T_M_G-scrubbing", isScrubbing)
        if (isScrubbing) {
            wasPaused = videoSettings.video.paused
            togglePlay(false)
        } else {
            videoSettings.video.currentTime = percent * videoSettings.video.duration
            if (!wasPaused) togglePlay(true)     
        }
        handleTimelineUpdate(e)
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }
    }

    function handleTimelineUpdate({clientX: x}) { 
    try {        
        const rect = videoSettings.ui.dom.timelineContainer?.getBoundingClientRect()
        const percent = clamp(x - rect.x, 0, rect.width) / rect.width
        const previewTime = formatDuration(percent * videoSettings.video.duration)
        const previewImgMin = (videoSettings.ui.dom.previewImgContainer.offsetWidth / 2) / rect.width
        const previewImgPercent = clamp(previewImgMin, percent, (1 - previewImgMin))
        videoSettings.ui.dom.timelineContainer?.style.setProperty("--T_M_G-preview-position", previewImgPercent)
        videoSettings.ui.dom.timelineContainer?.style.setProperty("--T_M_G-preview-img-position", previewImgPercent)
        videoSettings.ui.dom.previewImgContainer.dataset.previewTime = previewTime  
        if (isScrubbing) videoSettings.ui.dom.timelineContainer?.style.setProperty("--T_M_G-progress-position", percent)
        if (videoSettings.settings.status.ui.previewImages) {
            const previewImgNumber = Math.max(1, Math.floor((percent * videoSettings.video.duration) / videoSettings.settings.previewImages.fps))
            const previewImgSrc = videoSettings.settings.previewImages.address.replace('$', previewImgNumber)
            videoSettings.ui.dom.previewImg.src = previewImgSrc
            if (isScrubbing) videoSettings.ui.dom.thumbnailImg.src = previewImgSrc
        }
        let arrowPosition, arrowPositionMin = (videoSettings.ui.dom.videoContainer.classList.contains("T_M_G-theater") || videoSettings.ui.dom.videoContainer.classList.contains("T_M_G-full-screen")) && !mobileMediaQuery() ? getControlsSize()/3.25 : getControlsSize()/1.5 
        if (percent < previewImgMin) {
            arrowPosition = `${Math.max(percent * rect.width, arrowPositionMin)}px`
        } else if (percent > (1 - previewImgMin)) {
            arrowPosition = `${Math.min((videoSettings.ui.dom.previewImgContainer.offsetWidth/2 + (percent * rect.width) - videoSettings.ui.dom.previewImgContainer.offsetLeft), videoSettings.ui.dom.previewImgContainer.offsetWidth - arrowPositionMin - 2)}px`
        } else arrowPosition = '50%'
        videoSettings.ui.dom.previewImgContainer.style.setProperty("--T_M_G-preview-img-arrow-position", arrowPosition)
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }        
    }

    function handleTimelineFocus() {
    try {        
        if (videoSettings.ui.dom.timelineContainer?.matches(":focus-visible")) {
            removeKeyEventListeners()
            document.addEventListener("keydown", handleTimelineKeyDown)
        }
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }        
    }

    function handleTimelineKeyDown(e) {
    try {        
        e.stopImmediatePropagation()
        switch (e.key.toString().toLowerCase()) {
            case "arrowleft":
            case "arrowdown":
                e.preventDefault()
                videoSettings.video.currentTime -= e.shiftKey ? 5 : 1
            break
            case "arrowright":
            case "arrowup":
                e.preventDefault()
                videoSettings.video.currentTime += e.shiftKey ? 5 : 1
            break
        }
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }        
    }

    function handleTimelineBlur() { 
    try {
        document.removeEventListener('keydown', handleTimelineKeyDown)
        if(videoIntersecting && videoSettings.settings.keyShortcuts) setKeyEventListeners()
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }            
    }

    function handleTimeUpdate() {
    try {        
        if (videoSettings.ui.dom.currentTimeElement) videoSettings.ui.dom.currentTimeElement.textContent = formatDuration(videoSettings.video.currentTime)
        const percent = videoSettings.video.currentTime / videoSettings.video.duration
        videoSettings.ui.dom.timelineContainer?.style.setProperty("--T_M_G-progress-position", percent)
        if ((videoSettings.video.currentTime < videoSettings.video.duration) && videoSettings.ui.dom.videoContainer.classList.contains("T_M_G-replay")) videoSettings.ui.dom.videoContainer.classList.remove("T_M_G-replay")
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }            
    }

    function formatDuration(time) {
    try {        
        const seconds = Math.floor(time % 60)
        const minutes = Math.floor(time / 60) % 60
        const hours = Math.floor(time / 3600)
        if (hours === 0) return `${minutes}:${leadingZeroFormatter.format(seconds)}`
        else return `${hours}:${leadingZeroFormatter.format(minutes)}:${leadingZeroFormatter.format(seconds)}`
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }        
    }

    //Time Skips
    function skip(duration, persist = false) {
    try {
        videoSettings.video.currentTime += duration
        const notifier = duration > 0 ? videoSettings.ui.dom.notifiersContainer?.querySelector(".T_M_G-fwd-notifier") : videoSettings.ui.dom.notifiersContainer?.querySelector(".T_M_G-bwd-notifier")
        if (persist) {
            if (notifier != currentNotifier) {
                skipDuration = 0
                currentNotifier?.classList.remove("T_M_G-persist")
            }
            currentNotifier = notifier
            notifier.classList.add("T_M_G-persist")
            videoSettings.ui.dom.videoContainer.classList.remove("T_M_G-hover") 
            videoSettings.ui.dom.videoContainer.classList.add("T_M_G-movement")
            if ((videoSettings.video.currentTime !== 0 && notifier.classList.contains("T_M_G-bwd-notifier")) || (videoSettings.video.currentTime !== videoSettings.video.duration && notifier.classList.contains("T_M_G-fwd-notifier"))) {
                skipDuration += duration
            }
            if (skipDurationId) clearTimeout(skipDurationId)
            skipDurationId = setTimeout(() => {
                skipDuration = 0
                notifier.classList.remove("T_M_G-persist")
                videoSettings.ui.dom.videoContainer.classList.remove("T_M_G-hover") 
                videoSettings.ui.dom.videoContainer.classList.remove("T_M_G-movement")
            }, getNotifierArrowsTransitionTime())
            notifier.dataset.skip = skipDuration
            return
        } 
        if ((videoSettings.video.currentTime === 0 && notifier.classList.contains("T_M_G-bwd-notifier")) || (videoSettings.video.currentTime === videoSettings.video.duration && notifier.classList.contains("T_M_G-fwd-notifier"))) {
            duration = 0
        }            
        notifier.dataset.skip = Math.abs(duration)
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }        
    }
            
    //Playback
    function changePlaybackSpeed() {
    try {        
        let newPlaybackRate = videoSettings.video.playbackRate + .25
        if (newPlaybackRate > 2) newPlaybackRate = .25
        videoSettings.video.playbackRate = newPlaybackRate
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }        
    }
    
    function handlePlaybackChange() {
    try {        
        if (videoSettings.ui.dom.speedBtn) videoSettings.ui.dom.speedBtn.textContent = `${videoSettings.video.playbackRate}x`
        if (videoSettings.ui.dom.speedNotifier) videoSettings.ui.dom.speedNotifier.textContent = `${videoSettings.video.playbackRate}x`  
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }        
    }
    
    function speedUp(x) {
    try {        
        if (!speedCheck) {
            const rect = videoSettings.video.getBoundingClientRect()
            speedCheck = true
            wasPaused = videoSettings.video.paused
            if (wasPaused) togglePlay(true)
            if (x && videoSettings.settings.beta) {
                x - rect.left >= videoSettings.video.offsetWidth*0.5 ? fastForward() : rewind()
            } else fastForward()
            function fastForward() {
            try {
                speedToken = 1
                previousRate = videoSettings.video.playbackRate
                videoSettings.video.playbackRate = 2    
            } catch(e) {
                console.error(`TMG silent rendering error: `, e)
            }
            }
            function rewind() {
            try {
                speedToken = 0
                videoSettings.ui.dom.notifiersContainer.querySelector(".T_M_G-speed-notifier").textContent = '2x'
                videoSettings.ui.dom.speedNotifier.classList.add("T_M_G-rewind")
                videoSettings.video.addEventListener("play", rewindReset)
                videoSettings.video.addEventListener("pause", rewindReset)
                rewindVideoTime = videoSettings.video.currentTime
                speedIntervalId = setInterval(rewindVideo, 20)
            } catch(e) {
                console.error(`TMG silent rendering error: `, e)
            }
            }        
            videoSettings.ui.dom.speedNotifier.classList.add("T_M_G-active")
            videoSettings.ui.dom.videoContainer.classList.add("T_M_G-movement")
            if(videoSettings.settings.beta) videoSettings.ui.dom.videoContainer.setAttribute("data-tmg-progress-bar", videoSettings.settings.progressBar)
        }
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }    
    }

    function rewindVideo() {
    try {        
        rewindVideoTime -= .04
        videoSettings.ui.dom.timelineContainer?.style.setProperty("--T_M_G-progress-position",  rewindVideoTime/videoSettings.video.duration)
        videoSettings.video.currentTime -= .04
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }        
    }

    function rewindReset() {
    try {
        clearInterval(speedIntervalId)
        if(!videoSettings.video.paused) speedIntervalId = setInterval(rewindVideo, 20)
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }            
    }
    
    function slowDown() {
    try {        
        if (speedCheck) {
            speedCheck = false
            if (wasPaused) togglePlay(false)
            if (speedToken === 1) {
                videoSettings.video.playbackRate = previousRate
            } else if (speedToken === 0) {
                if (videoSettings.ui.dom.speedNotifier) videoSettings.ui.dom.speedNotifier.textContent = `${previousRate}x`
                videoSettings.ui.dom.speedNotifier.classList.remove("T_M_G-rewind")
                videoSettings.video.removeEventListener("play", rewindReset)
                videoSettings.video.removeEventListener("pause", rewindReset)
                if (speedIntervalId) clearInterval(speedIntervalId)
            }
            videoSettings.ui.dom.speedNotifier.classList.remove("T_M_G-active")
            videoSettings.ui.dom.videoContainer.classList.remove('T_M_G-movement')
            if(videoSettings.settings.beta) videoSettings.ui.dom.videoContainer.removeAttribute("data-tmg-progress-bar", videoSettings.settings.progressBar)
        }
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }    
    }

    //Captions
    function toggleCaptions() {
    try {        
        if (videoSettings.video.textTracks[0]) {
        const isHidden = videoSettings.video.textTracks[0].mode === "hidden"
        videoSettings.video.textTracks[0].mode = isHidden ? "showing" : "hidden"
        videoSettings.ui.dom.videoContainer.classList.toggle("T_M_G-captions", isHidden)
        }
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }        
    }
            
    //Volume
    function toggleMute() {
    try {
        videoSettings.video.muted = !videoSettings.video.muted
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }        
    }

    function handleSliderInput({target}) {
    try {        
        volumeHoverState()            
        restraint()
        videoSettings.video.volume = target.value / 100
        videoSettings.video.muted = target.value === 0
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }
    }
                
    function handleVolumeChange() {
    try {
    if (videoSettings.ui.dom.volumeSlider) {
        let { min, max, value } = videoSettings.ui.dom.volumeSlider
        value = (videoSettings.video.volume * 100).toFixed()
        videoSettings.ui.dom.notifiersContainer.querySelector(".T_M_G-volume-notifier-content").dataset.volume = value
        let volumeLevel = ""
        if (videoSettings.video.muted || value == 0) {
            value = 0
            volumeLevel = "muted"
        } else if (value > (max/2)) 
            volumeLevel = "high"
        else 
            volumeLevel = "low"
        let volumePercent = (value-min) / (max - min)
        let volumeSliderPercent = `${12 + (volumePercent * 77)}%`
        videoSettings.ui.dom.volumeSlider.value = value
        videoSettings.ui.dom.volumeSlider.dataset.volume = `${value}`
        videoSettings.ui.dom.volumeSlider?.style.setProperty("--T_M_G-volume-slider-percent", volumeSliderPercent)
        videoSettings.ui.dom.videoContainer.style.setProperty("--T_M_G-volume-percent", volumePercent)
        videoSettings.ui.dom.videoContainer.dataset.volumeLevel = volumeLevel
    }
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }        
    }

    function volumeChange(type, value) {
    try {
        const n = value / 100
        switch(type) {
            case "increment":
                if ((videoSettings.video.volume*100).toFixed() == 100-value) {
                    videoSettings.video.volume = 1
                    fire("volumeup")
                    break
                }
                if ((videoSettings.video.volume*100).toFixed() < 100) videoSettings.video.volume += ((videoSettings.video.volume*100).toFixed()%value) ? (n - videoSettings.video.volume%n).toFixed(2) : n 
                fire("volumeup")
                break
            case "decrement":
                if (videoSettings.video.volume == 0 || (videoSettings.video.volume*100).toFixed() == value) {
                    videoSettings.video.volume = 0
                    fire("volumemuted")
                    break
                }
                if (videoSettings.video.volume) videoSettings.video.volume -= ((videoSettings.video.volume*100).toFixed()%value) ? (videoSettings.video.volume%n) : n   
                fire("volumedown")
                break
        }
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }
    }

    function handleVolumeMouseMove() {
    try {        
        if (hoverId) clearTimeout(hoverId)
        hoverId = setTimeout(() => {
            if (videoSettings.ui.dom.volumeSlider?.parentElement.matches(':hover')) {
                videoSettings.ui.dom.volumeSlider?.parentElement.classList.add("T_M_G-hover")
                volumeHoverState()
            }
        }, 250)
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }        
    }

    function volumeHoverState() {
    try {
        if (restraintIdTwo) clearTimeout(restraintIdTwo)
        restraintIdTwo = setTimeout(() => videoSettings.ui.dom.volumeSlider?.parentElement.classList.remove("T_M_G-hover"), restraintTime)  
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }
    }

    function handleVolumeMouseUp() {
    try {
        if (hoverId) clearTimeout(hoverId)
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }            
    }

    //theater mode
    function toggleTheaterMode() {
    try {
        videoSettings.ui.dom.videoContainer.classList.toggle("T_M_G-theater")
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }        
    }
    
    //full-screen mode
    function toggleFullScreenMode() {
    try {
        if (!videoSettings.ui.dom.videoContainer.classList.contains("T_M_G-picture-in-picture")) {
            if (document.fullscreenElement == null) {
                if (screen.orientation && screen.orientation.lock && screen.orientation.type.startsWith("portrait")) {  
                    screen.orientation.lock('landscape')
                    .then(() => console.log('Video was changed to fullscreen so orientation was locked to landscape.'))
                    .catch(error => console.error('Failed to lock orientation:', error))
                }  
                videoSettings.ui.dom.videoContainer.requestFullscreen()
            } else {
                if (screen.orientation && screen.orientation.lock)
                    screen.orientation.unlock()
                document.exitFullscreen()
            }    
        }
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }        
    }

    function handleFullScreenChange() {
    try {
        videoSettings.ui.dom.videoContainer.classList.toggle("T_M_G-full-screen", document.fullscreenElement)            
        if (videoSettings.ui.dom.videoContainer.classList.contains("T_M_G-mini-player") && videoSettings.ui.dom.videoContainer.classList.contains("T_M_G-full-screen")) videoSettings.ui.dom.videoContainer.classList.remove("T_M_G-mini-player")
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }            
    }        

    //picture-in-picture mode
    function togglePictureInPictureMode() {
    try {
        videoSettings.ui.dom.videoContainer.classList.contains("T_M_G-picture-in-picture") ? document.exitPictureInPicture() : videoSettings.video.requestPictureInPicture()
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }        
    } 

    function handleEnterPip() {
    try {
        videoSettings.ui.dom.videoContainer.classList.add("T_M_G-picture-in-picture")
        toggleMiniPlayerMode(false)
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }        
    }

    function handleLeavePip() {
    try {
        videoSettings.ui.dom.videoContainer.classList.remove("T_M_G-picture-in-picture")
        toggleMiniPlayerMode()
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }        
    }        

    //mini player mode
    function toggleMiniPlayerMode(bool, behaviour) {
    try {
    if (videoSettings.settings.status.modes.miniPlayer) {
    const threshold = 240
    if (!document.fullscreenElement) {
        if (bool === false) {
            if (behaviour) {
                concerned = true
                window.scrollTo({
                    top: videoSettings.ui.dom.videoContainer.parentNode.offsetTop,
                    left: 0,
                    behavior: behaviour,
                })                    
            }
            removeMiniPlayer()
            return
        }
        if ((!videoSettings.ui.dom.videoContainer.classList.contains("T_M_G-mini-player") && !videoSettings.video.paused && window.innerWidth >= threshold && !document.pictureInPictureElement && !parentIntersecting) || (bool === true)) {
            videoSettings.ui.dom.videoContainer.classList.add("T_M_G-mini-player")
            videoSettings.ui.dom.videoContainer.addEventListener("mousedown", moveMiniPlayer)
            videoSettings.ui.dom.videoContainer.addEventListener("touchstart", moveMiniPlayer, {passive: false})
            return
        } 
        if ((videoSettings.ui.dom.videoContainer.classList.contains("T_M_G-mini-player") && parentIntersecting) || (videoSettings.ui.dom.videoContainer.classList.contains("T_M_G-mini-player") && window.innerWidth < threshold)) cleanUpMiniPlayer()
        function removeMiniPlayer() {
        try {
            cleanUpMiniPlayer()
            if (!videoSettings.video.paused && !concerned) togglePlay(false)
            concerned = false
        } catch(e) {
            console.error(`TMG silent rendering error: `, e)
        }
        }                
        function cleanUpMiniPlayer() {
        try {
            videoSettings.ui.dom.videoContainer.classList.remove("T_M_G-mini-player")
            videoSettings.ui.dom.videoContainer.removeEventListener("mousedown", moveMiniPlayer)
            videoSettings.ui.dom.videoContainer.removeEventListener("touchstart", moveMiniPlayer, {passive: false})
        } catch(e) {
            console.error(`TMG silent rendering error: `, e)
        }
        }            
    }
    }
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }
    }    

    function moveMiniPlayer(e){
    try {
        if (videoSettings.ui.dom.videoContainer.classList.contains("T_M_G-mini-player")) {
        if (!e.target.classList.contains("T_M_G-timeline-container") && !e.target.classList.contains("T_M_G-timeline") && !e.target.classList.contains("T_M_G-timeline-container") && e.target.tagName.toLowerCase() != "button" && e.target.tagName.toLowerCase() != "input") {
            videoSettings.ui.dom.videoContainer.addEventListener("mousemove", handleMiniPlayerPosition)
            videoSettings.ui.dom.videoContainer.addEventListener("mouseup", emptyListeners, {once: true})
            videoSettings.ui.dom.videoContainer.addEventListener("mouseleave", emptyListeners, {once: true})
            videoSettings.ui.dom.videoContainer.addEventListener("touchmove", handleMiniPlayerPosition, {passive: false})
            videoSettings.ui.dom.videoContainer.addEventListener("touchend", emptyListeners, {once: true, passive: false})
        }

        function emptyListeners() {
        try {
            videoSettings.ui.dom.videoContainer.classList.remove("T_M_G-movement")
            videoSettings.ui.dom.videoContainer.classList.add("T_M_G-hover")
            restraint()
            videoSettings.ui.dom.videoContainer.removeEventListener("mousemove", handleMiniPlayerPosition)
            videoSettings.ui.dom.videoContainer.removeEventListener("mouseup", emptyListeners, {once: true})
            videoSettings.ui.dom.videoContainer.removeEventListener("mouseleave", emptyListeners, {once: true})
            videoSettings.ui.dom.videoContainer.removeEventListener("touchmove", handleMiniPlayerPosition, {passive: false})
            videoSettings.ui.dom.videoContainer.removeEventListener("touchend", emptyListeners, {once: true, passive: false})
        } catch(e) {
            console.error(`TMG silent rendering error: `, e)
        }
        }

        function handleMiniPlayerPosition(e) {
        try {
            e.preventDefault()
            videoSettings.ui.dom.videoContainer.classList.add("T_M_G-movement")
            const x = e.clientX ?? e.changedTouches[0].clientX,
            y = e.clientY ?? e.changedTouches[0].clientY,
            {innerWidth: ww, innerHeight: wh} = window,
            {offsetWidth: w, offsetHeight: h} = videoSettings.ui.dom.videoContainer,
            xR = 0,
            yR = 0,
            posX = clamp(xR, ww - x - w/2, ww - w - xR),
            posY = clamp(yR, wh - y - h/2, wh - h - yR)
            videoSettings.ui.dom.videoContainer.style.setProperty("--T_M_G-mouse-x", `${(posX/ww * 100).toFixed()}%`)
            videoSettings.ui.dom.videoContainer.style.setProperty("--T_M_G-mouse-y", `${(posY/wh * 100).toFixed()}%`)
        } catch(e) {
            console.error(`TMG silent rendering error: `, e)
        }
        }
    }        
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }        
    }        

    //Keyboard and General Accessibility Functions
    function handleClick() {
    try {
        if (!mobileMediaQuery()) {
        if (playId) clearTimeout(playId)
        playId = setTimeout(() => {
            if (!(speedCheck && smCounter < 1))  togglePlay()
            handleMouseMove()
        }, 300)
        }
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }        
    }

    function handleDoubleClick({clientX: x}) {
    try {
        if (playId) clearTimeout(playId)
        const rect = videoSettings.video.getBoundingClientRect()
        if (((x-rect.left) > (videoSettings.video.offsetWidth*0.65))) {
            skip(10, true)
        } else if ((x-rect.left) < (videoSettings.video.offsetWidth*0.35)) {
            skip(-10, true)
        } else toggleFullScreenMode()
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }        
    }

    function handleMouseMove() {
    try {
        videoSettings.ui.dom.videoContainer.classList.add("T_M_G-hover")
        restraint()
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }        
    }

    function handleKeyDown(e) {
    try {
        const tagName = document.activeElement.tagName.toLowerCase()

        if (tagName === "input") return

        if (videoSettings.settings.status.ui.keys[e.key.toString().toLowerCase()] === false) return

        switch (e.key.toString().toLowerCase()) {
            case " ":
                if (tagName === "button") return
                e.preventDefault()
            case "p":
            case "l":
            case "a":
            case "y":
            case "k":
                smCounter ++
                if (smCounter === 1) document.addEventListener("keyup", playTriggerUp)
                if (smCounter === 2 && !smCheck) speedUp()
                break
            case "arrowleft":
                e.preventDefault()
                e.shiftKey ? skip(-10) : skip(-5)
                fire("bwd")
                break
            case "arrowright":
                e.preventDefault()
                e.shiftKey ? skip(10) : skip(5)
                fire("fwd")
                break
            case "arrowup":
                e.preventDefault()
                volumeChange("increment", 5)
                break
            case "arrowdown":
                e.preventDefault()
                volumeChange("decrement", 5)
                break
            case "home":
                e.preventDefault()
            case "0":
                moveVideoTime({action: "moveTo", details: {to: "start"}})
                break
            case "end":
                e.preventDefault()
                moveVideoTime({action: "moveTo", details: {to: "end"}})
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
                moveVideoTime({action: "moveTo", details: {to: e.key, max: 9}})
                break                
        }
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }        
    }        

    function handleKeyUp(e) {
    try {
        const tagName = document.activeElement.tagName.toLowerCase()

        if (tagName === "input") return

        if (videoSettings.settings.status.ui.keys[e.key.toString().toLowerCase()] === false) return

        switch (e.key.toString().toLowerCase()) {
            case "f":
                toggleFullScreenMode()
                fire("fullScreen")
                break
            case "t":
                toggleTheaterMode()
                fire("theater")
                break
            case "e":
                e.shiftKey ?  toggleMiniPlayerMode(false, "smooth") : toggleMiniPlayerMode(false, "instant")
                break
            case "r":
                e.shiftKey ? handleReplay() : toggleMiniPlayerMode(false) 
                break
            case "i":
                if (!e.shiftKey)togglePictureInPictureMode()
                break
            case "m":
                toggleMute()
                videoSettings.video.muted ? fire("volumemuted") : fire("volumeup")
                break
            case "s": 
                changePlaybackSpeed()
                fire("speed")
                break
            case "c":
                toggleCaptions()
                fire("captions")
                break
        }
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }        
    }

    function playTriggerUp(e) {
    try {        
        const tagName = document.activeElement.tagName.toLowerCase()
        
        if (tagName === "input") return
        
        switch (e.key.toString().toLowerCase()) {
            case " ":
                if (tagName === "button") return
                e.preventDefault()                
            case "p":
            case "l":
            case "a":
            case "y":
            case "k":                        
                e.stopImmediatePropagation()
                if (smCounter === 1) {
                    togglePlay()
                    videoSettings.video.paused ? fire("videopause") : fire("videoplay") 
                }
            default:
                if (speedCheck && smCounter > 1 && !smCheck) slowDown()
                smCounter = 0
        }
        document.removeEventListener("keyup", playTriggerUp)
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }        
    }     

    function handlePointerDown(e) {
    try {
        if (!videoSettings.ui.dom.videoContainer.classList.contains("T_M_G-mini-player")) {
            videoSettings.ui.dom.videoContainer.addEventListener("mouseup", handlePointerUp)
            videoSettings.ui.dom.videoContainer.addEventListener("mouseleave", handlePointerUp)                
            videoSettings.ui.dom.videoContainer.addEventListener("touchend", handlePointerUp)
            if (videoSettings.settings.beta) {
            videoSettings.ui.dom.videoContainer.addEventListener("mousemove", handlePointerMove)
            videoSettings.ui.dom.videoContainer.addEventListener("touchmove", handlePointerMove, {passive: true})
            }
            smCheck = true
            const x = e.clientX ?? e.changedTouches[0].clientX
            speedTimeoutId = videoSettings.settings.beta ? setTimeout(speedUp, 1000, x) : setTimeout(speedUp, 1000)
            const rect = videoSettings.video.getBoundingClientRect()
            speedPosition = x - rect.left >= videoSettings.video.offsetWidth * 0.5 ? "right" : "left"
            function handlePointerMove(e) {
            try {
                if (videoSettings.settings.beta) {
                const x = e.clientX ?? e.changedTouches[0].clientX
                const currPos = x - rect.left >= videoSettings.video.offsetWidth * 0.5 ? "right" : "left"
                if (currPos !== speedPosition) {
                    speedPosition = currPos
                    slowDown()
                    setTimeout(speedUp, 0, x)
                }
                }
            } catch(e) {
                console.error(`TMG silent rendering error: `, e)
            }
            }
            function handlePointerUp() {
            try {
                videoSettings.ui.dom.videoContainer.removeEventListener("mouseup", handlePointerUp)
                videoSettings.ui.dom.videoContainer.removeEventListener("mouseleave", handlePointerUp)      
                videoSettings.ui.dom.videoContainer.removeEventListener("touchend", handlePointerUp)
                if (videoSettings.settings.beta) {
                videoSettings.ui.dom.videoContainer.removeEventListener("mousemove", handlePointerMove)              
                videoSettings.ui.dom.videoContainer.removeEventListener("touchmove", handlePointerMove, {passive: true})
                }
                smCheck = false
                if (speedTimeoutId) clearTimeout(speedTimeoutId)
                if (speedCheck && smCounter < 1) slowDown()     
            } catch(e) {
                console.error(`TMG silent rendering error: `, e)                   
            }
            }
        }
    } catch(e) {
        console.error(`TMG silent rendering error: `, e)
    }        
    }    
}