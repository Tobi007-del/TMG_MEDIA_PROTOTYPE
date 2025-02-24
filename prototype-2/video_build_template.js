const _VIDEO_BUILD_TEMPLATE = {
    mediaPlayer: "",
    mediaType: "",
    media: {
        artist: [{
            src: ""
        }],
        album: "",
        artwork: "",
    },
    activated: true,
    initialMode: "",
    initialState: true,
    src: "",
    sources: [],
    tracks: [],
    playlist: [{
        media: {
            artist: [{
                src: ""
            }],
            album: "",
            artwork: "",
        },
        src: "", 
        sources: [], 
        tracks: [], 
        settings: {
            previewImages: {
                address: "", 
                fps: 0
            } || true,
            startTime: 0,
            endTime: 0,
        }
    }],
    debug: true,
    settings: {
        allowOverride: [] || true,
        previewImages: {
            address: "", 
            fps: 0
        } || true,
        beta: [],
        modes: [],
        controllerStructure: [] || true,
        timelinePosition: "",
        volumeBoost: true,
        maxVolume: 0,
        notifiers: true,
        progressBar: true,
        persist: true,
        skipTime: 0,
        startTime: 0,
        endTime: 0,
        automove: true,
        automoveCountdown: 0,
        autocaptions: true,
        autoplay: true,
        loop: true,
        muted: true,
        playsInline: true,
        overlayRestraintTime: 0,
        keyOverrides: [],
        shiftKeys: [],
        altKeys: [],
        ctrlKeys: [],
        keyShortcuts: {
            prev: "", 
            next: "",
            playPause: "",
            skipBwd: "",
            skipFwd: "",
            objectFit: "",
            fullScreen: "",
            theater: "",
            expandMiniPlayer: "",
            removeMiniPlayer: "",
            pictureInPicture: "",
            mute: "",
            playbackRate: "",
            captions: "",
            settings: ""
        },
    },
}