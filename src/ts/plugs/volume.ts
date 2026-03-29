import { BasePlug, type KeysPlug, type KeyMod } from ".";
import type { Controller } from "../core/controller";
import type { REvent } from "../types/reactor";
import type { CtlrConfig } from "../types/config";
import type { CtlrMedia } from "../types/contract";
import type { OptRange } from "../types/generics";
import { clamp } from "../utils";
import { AUDIO_CONTEXT, connectMediaToAudioManager } from "../tools/runtime";

export interface Volume extends OptRange {
  muted: boolean;
}

export interface VolumeState {
  aptVolume: number;
}

export class VolumePlug extends BasePlug<Volume, VolumeState> {
  public static readonly plugName: string = "volume";
  protected sliderAptVolume = 5;
  protected shouldMute = false;
  protected shouldSetLastVolume = false;
  protected audioSetup = false;
  protected gainNode?: GainNode;

  constructor(ctlr: Controller, config: Volume) {
    super(ctlr, config, { aptVolume: 0 });
  }

  get ctime(): number {
    return AUDIO_CONTEXT?.currentTime ?? 0;
  }
  public mount(): void {
    if (this.ctlr.state.audioContextReady) this.setupAudio();
    else this.ctlr.state.once("audioContextReady", this.setupAudio, { signal: this.signal });
  }

  public wire(): void {
    // Variables Assignment
    const configVolume = this.config.value ?? this.media.state.volume;
    this.state.aptVolume = clamp(this.config.min, configVolume, this.config.max);
    this.shouldMute = this.shouldSetLastVolume = this.media.element?.muted ?? false;
    this.config.value = this.shouldMute ? 0 : this.state.aptVolume;
    // Event Listeners
    this.media.element.addEventListener("volumechange", this.handleNativeVolumeChange, { signal: this.signal });
    // Ctlr Config Getters
    // this.ctlr.config.get("settings.volume.value", (value) => (this.gainNode ? Math.round(((this.gainNode.gain?.value ?? 2) / 2) * 100) : value), true);  // VIRTUAL: reliable return value
    // ----------- Setters
    this.ctlr.config.set("settings.volume.value", (value) => clamp(this.config.min, value, this.config.max), { signal: this.signal });
    // ----------- Watchers
    this.ctlr.config.watch("settings.volume.value", this.forwardVolume, { signal: this.signal, immediate: "auto" });
    this.ctlr.config.watch("settings.volume.muted", this.forwardMuted, { signal: this.signal, immediate: "auto" });
    // ---- Media Listeners
    this.media.on("intent.volume", this.handleVolumeIntent, { capture: true, signal: this.signal });
    this.media.on("intent.muted", this.handleMutedIntent, { capture: true, signal: this.signal });
    this.media.on("state.volume", this.handleVolumeState, { signal: this.signal });
    // ---- Config --------
    this.ctlr.config.on("settings.volume.min", this.handleMin, { signal: this.signal });
    this.ctlr.config.on("settings.volume.max", this.handleMax, { signal: this.signal });
    // Post Wiring
    this.media.tech.features.volume = true;
    const keys = this.ctlr.getPlug<KeysPlug>("keys");
    keys?.register("mute", this.handleKeyMute, { phase: "keyup" });
    keys?.register("volumeUp", this.handleKeyVolumeUp, { phase: "keydown" });
    keys?.register("volumeDown", this.handleKeyVolumeDown, { phase: "keydown" });
  }

  protected forwardVolume(value: number): void {
    this.media.intent.volume = value;
  }
  protected forwardMuted(value: boolean): void {
    this.media.intent.muted = value;
  }

  protected handleVolumeIntent(e: REvent<CtlrMedia, "intent.volume">): void {
    if (e.resolved) return;
    if (this.media.element !== this.media.tech.element) return e.reject(this.name);
    this.setVolumeState(e.value);
    this.media.state.volume = e.value;
    e.resolve(this.name);
  }

  protected handleMutedIntent(e: REvent<CtlrMedia, "intent.muted">): void {
    if (e.resolved) return;
    if (this.media.element !== this.media.tech.element) return e.reject(this.name);
    if (e.oldValue === e.value) return e.resolve(this.name);
    this.setMutedState(e.value);
    this.media.state.muted = e.value;
    e.resolve(this.name);
  }

  protected handleMin({ target }: REvent<CtlrConfig, "settings.volume.min">): void {
    const min = target.value;
    if (this.config.value < min) this.config.value = min;
    if (this.state.aptVolume < min) this.state.aptVolume = min;
  }

  protected handleMax({ target }: REvent<CtlrConfig, "settings.volume.max">): void {
    const max = target.value;
    if (this.config.value > max) this.config.value = max;
    if (this.state.aptVolume > max) this.state.aptVolume = max;
    this.ctlr.videoContainer.classList.toggle("tmg-video-volume-boost", max > 100);
    this.ctlr.settings.css.volumeSliderPercent = Math.round((100 / max) * 100);
    this.ctlr.settings.css.maxVolumeRatio = max / 100;
  }

  protected handleVolumeState({ value }: REvent<CtlrMedia, "state.volume">): void {
    const v = value,
      vLevel = v === 0 ? "muted" : v < 50 ? "low" : v <= 100 ? "high" : "boost",
      vPercent = (v - 0) / (this.config.max - 0);
    // JS: this.DOM.volumeNotifierContent.textContent = v + "%";
    this.ctlr.videoContainer.dataset.volumeLevel = vLevel;
    // JS: this.DOM.volumeSlider.value = v;
    // JS: this.DOM.volumeSlider?.parentElement.setAttribute("data-volume", v);
    // JS: this.DOM.touchVolumeContent.textContent = v + "%";
    this.ctlr.settings.css.currentVolumeTooltipPosition = `${10.5 + vPercent * 79.5}%`;
    if (this.config.max > 100) {
      if (v <= 100) {
        this.ctlr.settings.css.currentVolumeSliderPosition = (v - 0) / (100 - 0);
        this.ctlr.settings.css.currentVolumeSliderBoostPosition = 0;
        this.ctlr.settings.css.volumeSliderBoostPercent = 0;
      } else {
        this.ctlr.settings.css.currentVolumeSliderPosition = 1;
        this.ctlr.settings.css.currentVolumeSliderBoostPosition = (v - 100) / (this.config.max - 100);
        this.ctlr.settings.css.volumeSliderBoostPercent = this.ctlr.settings.css.volumeSliderPercent;
      }
    } else this.ctlr.settings.css.currentVolumeSliderPosition = vPercent;
  }

  protected setVolumeState(value: number): void {
    const v = clamp(this.shouldMute ? 0 : this.config.min, value, this.config.max);
    if (this.gainNode) this.gainNode.gain.setTargetAtTime((v / 100) * 2, this.ctime, 0.05);
    this.media.element.muted = this.media.element.defaultMuted = this.config.muted = v === 0;
  }

  protected setMutedState(muted: boolean): void {
    if (muted) {
      if (this.config.value) {
        this.state.aptVolume = this.config.value;
        this.shouldSetLastVolume = true;
      }
      this.shouldMute = true;
      if (this.config.value) this.media.intent.volume = 0;
    } else {
      const restore = this.shouldSetLastVolume ? this.state.aptVolume : this.config.value;
      this.media.intent.volume = restore ? restore : this.sliderAptVolume;
      this.shouldMute = this.shouldSetLastVolume = false;
    }
  }

  public toggleMute(option?: "auto"): void {
    if (option === "auto" && this.shouldSetLastVolume && !this.state.aptVolume) this.state.aptVolume = this.config.skip;
    this.config.muted = !this.config.muted;
  }

  public changeVolume(value: number): void {
    const sign = value >= 0 ? "+" : "-";
    value = Math.abs(value);
    let volume = this.shouldSetLastVolume ? this.state.aptVolume : this.config.value;
    if (sign === "-") {
      if (volume > this.config.min) volume -= volume % value ? volume % value : value;
      // JS: if (volume === 0) { this.notify("volumemuted"); break; }
      // JS: this.notify("volumedown");
    } else {
      if (volume < this.config.max) volume += volume % value ? value - (volume % value) : value;
      // JS: this.notify("volumeup");
    }
    // JS: if (this.shouldSetLastVolume) this.DOM.volumeNotifierContent.textContent = volume + "%";
    this.shouldSetLastVolume ? (this.state.aptVolume = volume) : (this.config.value = volume);
  }

  protected setupAudio(): void {
    if (this.audioSetup || connectMediaToAudioManager(this.media.element) === "unavailable") return;
    this.gainNode = (this.media.element as any)._tmgGainNode;
    const DCN = (this.media.element as any)._tmgDynamicsCompressorNode;
    if (DCN) ((DCN.threshold.value = -30), (DCN.knee.value = 20), (DCN.ratio.value = 12), (DCN.attack.value = 0.003), (DCN.release.value = 0.25));
    this.audioSetup = true;
  }

  protected cancelAudio(): void {
    this.media.intent.volume = clamp(this.config.min, ((this.gainNode?.gain?.value ?? 2) / 2) * 100, this.config.max);
    (this.media.element as any).mediaElementSourceNode?.disconnect();
    this.gainNode?.disconnect();
    this.audioSetup = false;
  }

  protected handleKeyMute(): void {
    this.toggleMute("auto");
    // JS: this.ctlr.config.stall(() => (this.config.value === 0 ? this.notify("volumemuted") : this.notify("volumeup")));
  }

  protected handleKeyVolumeUp(_: KeyboardEvent, mod: KeyMod): void {
    this.changeVolume(this.ctlr.getPlug<KeysPlug>("keys")!.getModded("volume", mod, this.config.skip));
  }

  protected handleKeyVolumeDown(_: KeyboardEvent, mod: KeyMod): void {
    this.changeVolume(-this.ctlr.getPlug<KeysPlug>("keys")!.getModded("volume", mod, this.config.skip));
  }

  public handleSliderInput(volume: number): void {
    this.shouldMute = this.shouldSetLastVolume = false;
    this.config.value = volume;
    if (volume > 5) this.sliderAptVolume = volume;
  }

  protected handleNativeVolumeChange(): void {
    this.media.element.volume = 1; // there are always edge cases even in advanced systems
    if (this.config.muted !== this.media.element.muted) this.toggleMute();
  }
}

export const VOLUME_BUILD: Partial<Volume> = { min: 0, max: 300, skip: 5 };
