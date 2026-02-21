const bbState = {
  audio: {
    volume: { min: 0, value: 50, max: 300, muted: false }, // Range: 0 to 100 (or 200 if boost is on); dummy though
    pan: 0, // -1 (Left), 0 (Center), 1 (Right)
    boost: false, // true = allows volume > 100
    moveMode: "3d", // "2d" (Translate X/Y) or "3d" (Rotate X/Y)
    paused: true, // true = media is paused; dummy though
    vibe: 0.35, // 0 - 100 representing analyser perceived loudness
    vibeDisabled: false, // Toggle for the viber
  }, // the volume and muted will not be treated seriously as they are already implemented in main environment
  transform: {
    x: 0, // Percentage (%) offset from center
    y: 0, // Percentage (%) offset from center
    z: 1, // Scale multiplier (Depth)
    rotateX: 0, // Degrees (Tilt up/down)
    rotateY: 0, // Degrees (Spin left/right)
  },
};
class Boombox {
  get ctime() {
    return this.context?.currentTime ?? 0;
  }
  get bbOverflow() {
    return this.bbSens.overflow * this.state.transform.z; // Since OffsetWidth doesn't change with transform, we have to account for it
  }
  constructor() {
    tmg.bindMethods(this);
    this.state = reactive(structuredClone(bbState));
    this.media = new Audio("/TMG_MEDIA_PROTOTYPE/assets/outfoxing.mp3");
    this.media.loop = true;
    this.bbSens = { translate: 1.2, rotate: 0.4, zoom: 2.4, overflow: 70 }; // S.I.A. configuration
    this.eS = { lastX: 0, lastY: 0, isZSliding: false, auxDown: false }; // event store
    this.bbEl = document.querySelector(".tmg-boombox");
    this.boundsEl = this.bbEl.closest(".tmg-video-container") || document.documentElement;
    this.bbBody = this.bbEl.querySelector(".tmg-boombox-body");
    this.stereoLeftBtn = this.bbEl.querySelector(".tmg-bbfm-stereo-left");
    this.stereoRightBtn = this.bbEl.querySelector(".tmg-bbfm-stereo-right");
    this.stereoCenterBtn = this.bbEl.querySelector(".tmg-bbfm-stereo-center");
    this.volumeSlider = this.bbEl.querySelector(".tmg-bbfm-volume-slider");
    this.volumeText = this.volumeSlider.nextElementSibling;
    this.muteBtn = this.bbEl.querySelector(".tmg-bbfm-mute");
    this.boostBtn = this.bbEl.querySelector(".tmg-bbfm-boost");
    this.moveModeBtn = this.bbEl.querySelector(".tmg-bbfm-move-mode");
    this.playBtn = this.bbEl.querySelector(".tmg-bbfs-play");
    this.resetBtn = document.querySelector(".tmg-bbb-reset");
    ((this.bbPtrs = new Map()), (this.rafLoopMap = new Map()), (this.rafLoopFnMap = new Map()));
  }
  wire() {
    // State Listeners: using watchers for forwarded intents so it doesn't take two microtasks, listeners otherwise
    this.state.watch("audio.volume.value", this.onVolumeChange, { immediate: true });
    this.state.on("audio.volume.value", this.handleVolumeChange, { immediate: true });
    this.state.on("audio.volume.min", this.handleMinChange, { immediate: true });
    this.state.on("audio.volume.max", this.handleMaxChange, { immediate: true });
    this.state.watch("audio.volume.muted", this.onMuted, { immediate: true });
    this.state.on("audio.volume.muted", this.handleMutedChange, { immediate: true });
    this.state.on("audio.pan", this.handlePanChange, { immediate: true });
    this.state.watch("audio.paused", this.onPaused, { immediate: true });
    this.state.on("audio.paused", this.handlePausedChange, { immediate: true });
    this.state.on("audio.boost", this.handleBoostChange, { immediate: true });
    this.state.on("audio.moveMode", this.handleMoveModeChange, { immediate: true });
    this.state.on("audio.vibe", this.handleVibeChange, { immediate: true });
    this.state.on("audio.vibeDisabled", this.handleVibeDisabledChange, { immediate: true });
    this.state.on("transform", this.handleTransformChange, { immediate: true });
    this.state.set("transform.x", this.setTransformX); // UI Guard: prevents out of bounds behaviour with respect to overflow
    this.state.set("transform.y", this.setTransformY); // UI Guard: ---------------------------------------------------------
    this.state.set("transform.z", (v) => tmg.clamp(0.1, v, 2)); // UI Guard: We clamp it at 0.1 so it can never pass through the listener's head.
    // DOM Listeners
    this.media.addEventListener("play", () => this.state.audio.paused && (this.state.audio.paused = false)); // dummy cuz real system handles this elsewhere, S.I.A solved state sync wars after all
    this.media.addEventListener("pause", () => !this.state.audio.paused && (this.state.audio.paused = true)); // dummy
    document.addEventListener("click", this.setupAudio, { once: true });
    this.bbEl.addEventListener("pointerdown", this.handlePointerDown);
    this.bbEl.addEventListener("wheel", this.handleWheel, { passive: false });
    this.bbEl.addEventListener("auxclick", (e) => e.preventDefault()); // Prevent middle-click auto-scroll
    this.bbEl.addEventListener("mousedown", this.handleAuxDown);
    this.bbEl.addEventListener("mouseup", this.handleAuxUp);
    [this.stereoLeftBtn, this.stereoRightBtn, this.stereoCenterBtn].forEach((btn) => btn.addEventListener("click", () => (this.state.audio.pan = Number(btn.dataset.pan))));
    this.volumeSlider.addEventListener("input", (e) => (this.state.audio.volume.value = this.lastVolume = Number(e.target.value)));
    this.muteBtn.addEventListener("click", () => (this.state.audio.volume.muted = !this.state.audio.volume.muted));
    this.boostBtn.addEventListener("click", () => (this.state.audio.boost = !this.state.audio.boost));
    this.moveModeBtn.addEventListener("click", () => (this.state.audio.moveMode = this.state.audio.moveMode === "2d" ? "3d" : "2d"));
    this.playBtn.addEventListener("click", () => (this.state.audio.paused = !this.state.audio.paused));
    this.resetBtn?.addEventListener("click", this.resetPos);
  }
  setupAudio() {
    if (this.mediaSetup || tmg.connectMediaToAudioManager(this.media) === "unavailable") return;
    this.context = tmg._audioContext;
    this.source = this.media.mediaElementSourceNode;
    this.compressor = this.media._tmgDynamicsCompressorNode;
    this.compressor.threshold.value = -30;
    this.compressor.knee.value = 20;
    this.compressor.ratio.value = 12;
    this.compressor.attack.value = 0.003;
    this.compressor.release.value = 0.25;
    this.gainer = this.media._tmgGainNode;
    this.stereoPanner = this.context.createStereoPanner();
    this.panner = this.context.createPanner();
    this.panner.panningModel = "HRTF"; // High-fidelity human ear routing
    this.panner.distanceModel = "inverse";
    this.panner.refDistance = 1;
    this.panner.maxDistance = 10_000;
    this.panner.rolloffFactor = 1;
    this.panner.coneInnerAngle = 90; // 100% volume anywhere in front of it
    this.panner.coneOuterAngle = 270; // Smooth volume fade as it turns sideways
    this.panner.coneOuterGain = 0.4; // Drops to 40% ONLY when facing the physical back wall
    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = 256;
    this.freqData = new Uint8Array(this.analyser.frequencyBinCount);
    this.wireAudioGraph();
    this.mediaSetup = true; // Applying initials now
    this.state.audio.pan = this.state.audio.pan;
    this.state.audio.volume.value = this.state.audio.volume.value;
    this.state.transform = this.state.transform;
  }
  wireAudioGraph() {
    // Lock the listener at the center of the universe
    const listener = this.context.listener;
    // Position: Dead center
    listener.positionX.value = 0;
    listener.positionY.value = 0;
    listener.positionZ.value = 0;
    // Orientation: Looking straight down the -Z axis (at the Boombox)
    listener.forwardX.value = 0;
    listener.forwardY.value = 0;
    listener.forwardZ.value = -1;
    // Up Vector: Top of the head points to +Y
    listener.upX.value = 0;
    listener.upY.value = 1;
    listener.upZ.value = 0;
    // 1. DISCONNECT TVP'S DEFAULT ROUTING
    // TVP standard: source -> compressor -> gain -> limiter
    this.source.disconnect();
    this.compressor.disconnect();
    this.gainer.disconnect();
    // 2. RE-ROUTE THROUGH BOOMBOX
    // source -> compressor -> gain -> 3dPanner -> stereoPanner -> analyser -> limiter -> destination
    this.source.connect(this.compressor);
    this.compressor.connect(this.gainer);
    this.gainer.connect(this.panner);
    this.panner.connect(this.stereoPanner);
    this.stereoPanner.connect(this.analyser);
    // We connect back to TVP's limiter so we don't blow out the user's speakers
    this.analyser.connect(tmg._limiter);
  }
  handlePanChange({ target: { value } }) {
    this.stereoPanner?.pan.setTargetAtTime(Number(value), this.ctime, 0.02);
    [this.stereoLeftBtn, this.stereoRightBtn, this.stereoCenterBtn].forEach((btn) => btn.classList.toggle("activated", btn.dataset.pan == value));
  }
  onVolumeChange(value) {
    this.gainer?.gain.setTargetAtTime((value / 100) * 2, this.ctime, 0.02); // dummy: doubling for dat anroid feel btw, real one does it too
    this.state.audio.volume.muted = value === 0;
    // this.ctl.media.intent.volume = value; // real
  }
  handleVolumeChange({ target: { value } }) {
    this.volumeText.textContent = `${(this.volumeSlider.value = value)}%`;
  }
  handleMinChange({ target: { value } }) {
    if (value >= this.state.audio.volume.value) this.state.audio.volume.value = value;
    this.volumeSlider.min = value;
  }
  handleMaxChange({ target: { value } }) {
    if (value <= this.state.audio.volume.value) this.state.audio.volume.value = value;
    this.volumeSlider.max = value;
  }
  onMuted(muted, { target: { oldValue } }) {
    if (muted === oldValue) return TERMINATOR;
    if (muted) {
      this.lastVolume = this.state.audio.volume.value;
      this.state.audio.volume.value = 0;
    } else if (tmg.isValidNum(this.lastVolume)) this.state.audio.volume.value = this.lastVolume; // dummy
    // this.ctl.media.intent.muted = muted; // real
  }
  handleMutedChange({ target: { value: muted } }) {
    this.muteBtn.classList.toggle("activated", muted);
  }
  handleBoostChange({ target: { value: boost } }) {
    if (!boost) {
      this.lastMax = this.state.audio.volume.max;
      this.state.audio.volume.max = tmg.clamp(this.state.audio.volume.min, this.state.audio.volume.max, boost ? Infinity : 100);
    } else if (tmg.isValidNum(this.lastMax)) this.state.audio.volume.max = this.lastMax; // dummy
    // no real yet but likely same
    this.boostBtn.classList.toggle("activated", boost);
  }
  handleMoveModeChange({ target: { value: moveMode } }) {
    this.moveModeBtn.classList.toggle("activated", moveMode === "3d");
  }
  onPaused(paused) {
    !paused ? this.media.play().catch((e) => console.error("Failed to play audio:", e)) : this.media.pause(); // dummy
    // this.ctl.media.intent.paused = paused; // real
  }
  handlePausedChange({ target: { value: paused } }) {
    this.bbEl.classList.toggle("paused", paused);
    this.playBtn.classList.toggle("activated", !paused);
  }
  handleVibeChange({ target: { value: vibe } }) {
    this.bbEl.style.setProperty("--bb-vibe", vibe * 0.007); // most natural plus 7's my fav
  }
  handleVibeDisabledChange({ target: { value: disabled } }) {
    !disabled ? this.RAFLoop("vibing", this.startVibing) : this.cancelRAFLoop("vibing");
  }
  handleTransformChange() {
    const { x, y, z, rotateX, rotateY } = this.state.transform,
      // --- POSITION MATH ---
      // WebAudio space is much smaller than screen pixels.
      // We map your CSS % to an n-unit grid. CSS Y is down (+), WebAudio Y is up (+), so we invert Y.
      audioX = ((x / 100) * 1.2) / z,
      audioY = (-(y / 100) * 0.6) / z,
      // Depth: We start the boombox at Z = -1 (in front of the listener's face).
      // As scale (z) gets smaller, we push it further into negative space.
      audioZ = -1 / z,
      // --- ROTATION MATH ---
      radX = rotateX * (Math.PI / 180),
      radY = rotateY * (Math.PI / 180),
      // To face the listener, the boombox must point towards Positive Z.
      // CSS positive RotateY turns the front left (-X). CSS positive RotateX points the front down (-Y).
      vecX = -Math.sin(radY) * Math.cos(radX),
      vecY = -Math.sin(radX),
      vecZ = Math.cos(radY) * Math.cos(radX);
    // console.log(audioX, audioY, audioZ, vecX, vecY, vecZ, this.ctime); // DEBUG
    this.panner?.positionX.setTargetAtTime(audioX, this.ctime, 0.02);
    this.panner?.positionY.setTargetAtTime(audioY, this.ctime, 0.02);
    this.panner?.positionZ.setTargetAtTime(audioZ, this.ctime, 0.02);
    this.panner?.orientationX.setTargetAtTime(vecX, this.ctime, 0.02);
    this.panner?.orientationY.setTargetAtTime(vecY, this.ctime, 0.02);
    this.panner?.orientationZ.setTargetAtTime(vecZ, this.ctime, 0.02);
    // UI Update
    (this.bbEl.style.setProperty("--bb-x", `${x}%`), this.bbEl.style.setProperty("--bb-y", `${y}%`), this.bbEl.style.setProperty("--bb-z", z));
    (this.bbEl.style.setProperty("--bb-rx", `${rotateX}deg`), this.bbEl.style.setProperty("--bb-ry", `${rotateY}deg`));
  }
  setTransformX(v) {
    if (!this.bbEl) return v;
    const { bounds: b = this.boundsEl.getBoundingClientRect(), rect: r = this.bbEl.getBoundingClientRect() } = this.eS,
      growth = (r.width * this.state.transform.z - r.width) / 2,
      limLeft = Math.max(0, ((r.left - b.left - growth) / r.width) * 100) + this.bbOverflow,
      limRight = Math.max(0, ((b.right - r.right - growth) / r.width) * 100) + this.bbOverflow;
    return tmg.clamp(-limLeft, v, limRight);
  }
  setTransformY(v) {
    if (!this.bbEl) return v;
    const { bounds: b = this.boundsEl.getBoundingClientRect(), rect: r = this.bbEl.getBoundingClientRect() } = this.eS,
      growth = (r.height * this.state.transform.z - r.height) / 2,
      limitUp = Math.max(0, ((r.top - b.top - growth) / r.height) * 100) + this.bbOverflow,
      limitDown = Math.max(0, ((b.bottom - r.bottom - growth) / r.height) * 100) + this.bbOverflow;
    return tmg.clamp(-limitUp, v, limitDown);
  }
  resetPos(e) {
    this.bbBody.style.transition = "transform 0.8s cubic-bezier(0.1, 0, 0, 1)"; // Adds a snnapy transition for the reset
    this.bbBody.ontransitionend = () => this.bbBody.style.removeProperty("transition");
    Object.assign(this.state.transform, bbState.transform); // Smoothly reset the state to the defaults
    this.eS = { lastX: 0, lastY: 0, isZSliding: false, auxDown: false }; // Reset the event store to prevent jumps
  }
  startVibing() {
    if (!this.analyser || this.media.paused) return;
    this.analyser.getByteFrequencyData(this.freqData);
    // 1. ISOLATE THE KICK DRUM: Only grab the first 2 bins (0Hz to ~344Hz).
    let bassSum = 0;
    const bassBins = 2;
    for (let i = 0; i < bassBins; i++) bassSum += this.freqData[i];
    const averageBass = bassSum / bassBins,
      // 2. SHAPE THE TRANSIENT (The "Punch" curve): Normalize to 0.0 - 1.0
      normalized = averageBass / 255,
      // By cubing the value (x * x * x), a continuous background bass hum of 50% (0.5)
      // gets crushed down to 12.5%. But a heavy kick drum hit of 100% (1.0) stays at 100%.
      vibeIntensity = normalized * normalized * normalized * 100; // This creates a sharp, physical "snap" instead of a muddy wobble.
    // Mutate the state
    this.state.audio.vibe = vibeIntensity;
  }
  handlePointerDown(e) {
    if (e.target.closest("button, input, .tmg-bbfm-master")) return;
    e.preventDefault();
    this.bbBody.style.removeProperty("transition");
    this.bbBody.setPointerCapture(e.pointerId);
    this.bbPtrs.set(e.pointerId, e);
    this.eS.bounds = this.boundsEl.getBoundingClientRect();
    this.eS.rect = this.bbEl.getBoundingClientRect();
    if (this.bbPtrs.size === 1) {
      this.eS.lastX = e.clientX;
      this.eS.lastY = e.clientY;
      this.eS.isZSliding = false;
    } else if (this.bbPtrs.size === 2) {
      const pts = Array.from(this.bbPtrs.values());
      this.eS.lastY = (pts[0].clientY + pts[1].clientY) / 2;
      this.eS.isZSliding = true;
    }
    this.bbBody.addEventListener("pointermove", this.handlePointerMove);
    ["pointerup", "pointercancel", "pointerleave"].forEach((ev) => this.bbBody.addEventListener(ev, this.handlePointerUp));
  }
  handlePointerMove(e) {
    if (this.bbPtrs.has(e.pointerId)) this.bbPtrs.set(e.pointerId, e); // Just update the map; the RAFLoop does the math
    this.RAFLoop("bbDragging", () => {
      if (this.bbPtrs.size === 1 && !this.eS.isZSliding) {
        // --- 1 FINGER: 2D Move OR 3D Spin ---
        const ptr = Array.from(this.bbPtrs.values())[0],
          deltaX = ptr.clientX - this.eS.lastX,
          deltaY = ptr.clientY - this.eS.lastY;
        if (this.state.audio.moveMode === "2d") {
          this.state.transform.x += (deltaX / this.bbEl.offsetWidth) * 100 * this.bbSens.translate;
          this.state.transform.y += (deltaY / this.bbEl.offsetHeight) * 100 * this.bbSens.translate;
        } else {
          this.state.transform.rotateY += deltaX * this.bbSens.rotate;
          this.state.transform.rotateX -= deltaY * this.bbSens.rotate;
        }
        this.eS.lastX = ptr.clientX;
        this.eS.lastY = ptr.clientY;
      } else if (this.bbPtrs.size === 2) {
        // --- 2 FINGERS: Z-Space Push/Pull ---
        const pts = Array.from(this.bbPtrs.values()),
          currentMidY = (pts[0].clientY + pts[1].clientY) / 2,
          deltaY = currentMidY - this.eS.lastY;
        // Push up = move away (smaller Z). Pull down = bring closer (larger Z).
        this.state.transform.z = this.state.transform.z + (deltaY / this.bbEl.offsetHeight) * this.bbSens.zoom;
        this.eS.lastY = currentMidY;
      }
    });
  }
  handlePointerUp(e) {
    (this.cancelRAFLoop("bbDragging"), this.bbPtrs.delete(e.pointerId));
    this.eS.bounds = this.eS.rect = undefined;
    if (this.bbPtrs.size === 0) this.eS.isZSliding = false;
    else if (this.bbPtrs.size === 1) {
      const ptr = Array.from(this.bbPtrs.values())[0]; // Prevent jumping when releasing the 2nd finger
      this.eS.lastX = ptr.clientX;
      this.eS.lastY = ptr.clientY;
    }
  }
  handleWheel(e) {
    e.preventDefault();
    const dY = e.shiftKey ? 0 : e.deltaY,
      dX = e.shiftKey ? e.deltaY : e.deltaX;
    if (this.eS.auxDown) {
      this.state.transform.z = this.state.transform.z + (dY / this.bbEl.offsetHeight) * (this.bbSens.zoom * 0.1);
      return;
    }
    if (this.state.audio.moveMode === "2d") {
      this.state.transform.x -= (dX / this.bbEl.offsetWidth) * 100 * this.bbSens.translate;
      this.state.transform.y -= (dY / this.bbEl.offsetHeight) * 100 * this.bbSens.translate;
    } else {
      this.state.transform.rotateY -= dX * (this.bbSens.rotate * 0.1);
      this.state.transform.rotateX += dY * (this.bbSens.rotate * 0.1);
    }
  }
  handleAuxDown(e) {
    if (e.button === 1) this.eS.auxDown = true;
  }
  handleAuxUp(e) {
    if (e.button === 1) this.eS.auxDown = false;
  }
  // Borrowed these from Controller for Convenience
  RAFLoop(key, fn) {
    this.rafLoopFnMap.set(key, fn);
    const loop = () => (this.rafLoopFnMap.get(key)?.(), this.rafLoopMap.set(key, requestAnimationFrame(loop)));
    !this.rafLoopMap.has(key) && this.rafLoopMap.set(key, requestAnimationFrame(loop)); // taps into that RAF power quite tersely
  }
  cancelRAFLoop = (key) => (cancelAnimationFrame(this.rafLoopMap.get(key)), this.rafLoopFnMap.delete(key), this.rafLoopMap.delete(key));
}
(window.NinoBoombox = new Boombox()).wire();
