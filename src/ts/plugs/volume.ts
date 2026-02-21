import { BasePlug } from ".";
import type { Event } from "../core/reactor";
import { VideoBuild } from "../types/build";
import { Media } from "../types/contract";
import type { OptRange } from "../types/generics";
import { clamp } from "../utils";
import { AUDIO_CONTEXT, connectMediaToAudioManager } from "../tools/runtime";

export interface Volume extends OptRange {
  muted: boolean;
}

export class VolumePlug extends BasePlug<Volume> {
  public static readonly plugName: string = "volume";
  protected lastVolume = 0;
  protected sliderAptVolume = 5;
  protected shouldMute = false;
  protected shouldSetLastVolume = false;
  protected audioSetup = false;
  protected gainNode?: GainNode;
  get ctime(): number {
    return AUDIO_CONTEXT?.currentTime ?? 0;
  }
  public mount(): void {
    if (this.ctl.state.audioContextReady) this.setupAudio();
    else this.ctl.state.once("audioContextReady", this.setupAudio, { signal: this.signal });
  }

  public wire(): void {
    this.ctl.config.set("settings.volume.value", (value) => clamp(this.config.min, value!, this.config.max), { signal: this.signal });
    this.ctl.media.element.addEventListener("volumechange", this.handleNativeVolumeChange, { signal: this.signal });
    const configVolume = this.config.value ?? this.ctl.media.state.volume * 100;
    this.lastVolume = clamp(this.config.min, configVolume, this.config.max);
    this.shouldMute = this.shouldSetLastVolume = this.ctl.media.element?.muted ?? false;
    this.config.value = this.shouldMute ? 0 : this.lastVolume;
    this.ctl.config.watch("settings.volume.value", this.forwardVolume, { signal: this.signal, immediate: true });
    this.ctl.config.watch("settings.volume.muted", this.forwardMuted, { signal: this.signal });
    this.ctl.media.on("intent.volume", this.handleVolumeIntent, { capture: true, signal: this.signal });
    this.ctl.media.on("intent.muted", this.handleMutedIntent, { capture: true, signal: this.signal });
    this.ctl.config.on("settings.volume.min", this.handleMinChange, { signal: this.signal });
    this.ctl.config.on("settings.volume.max", this.handleMaxChange, { signal: this.signal });
  }

  protected setupAudio(): void {
    if (this.audioSetup||connectMediaToAudioManager(this.ctl.media.element) === "unavailable") return;
    this.gainNode = (this.ctl.media.element as any)._tmgGainNode;
    const DCN = (this.ctl.media.element as any)._tmgDynamicsCompressorNode;
    if (DCN) ((DCN.threshold.value = -30), (DCN.knee.value = 20), (DCN.ratio.value = 12), (DCN.attack.value = 0.003), (DCN.release.value = 0.25));
    this.audioSetup = true;
  }

  protected cancelAudio(): void {
    this.ctl.media.intent.volume = clamp(0, (this.gainNode?.gain?.value ?? 2) / 2, 1);
    (this.ctl.media.element as any).mediaElementSourceNode?.disconnect();
    this.gainNode?.disconnect();
    this.audioSetup = false;
  }

  protected handleVolumeState(volume: number): void {
    const v = clamp(this.shouldMute ? 0 : this.config.min, volume * 100, this.config.max),
      vLevel = v === 0 ? "muted" : v < 50 ? "low" : v <= 100 ? "high" : "boost",
      vPercent = (v - 0) / (this.config.max - 0);
    if (this.gainNode) this.gainNode.gain.setTargetAtTime((v / 100) * 2, this.ctime, 0.05); // doubling for dat Android Feel
    this.ctl.media.element.muted = this.ctl.media.element.defaultMuted = this.config.muted = v === 0;
    this.ctl.videoContainer.dataset.volumeLevel = vLevel;
    this.ctl.config.settings.css.currentVolumeTooltipPosition = `${10.5 + vPercent * 79.5}%`;
    if (this.config.max > 100) {
      if (v <= 100) {
        this.ctl.config.settings.css.currentVolumeSliderPosition = (v - 0) / (100 - 0);
        this.ctl.config.settings.css.currentVolumeSliderBoostPosition = 0;
        this.ctl.config.settings.css.volumeSliderBoostPercent = 0;
      } else {
        this.ctl.config.settings.css.currentVolumeSliderPosition = 1;
        this.ctl.config.settings.css.currentVolumeSliderBoostPosition = (v - 100) / (this.config.max - 100);
        this.ctl.config.settings.css.volumeSliderBoostPercent = this.ctl.config.settings.css.volumeSliderPercent;
      }
    } else this.ctl.config.settings.css.currentVolumeSliderPosition = vPercent;
  }

  protected handleMutedState(muted: boolean): void {
    if (muted) {
      if (this.config.value) {
        this.lastVolume = this.config.value;
        this.shouldSetLastVolume = true;
      }
      this.shouldMute = true;
      if (this.config.value) this.ctl.media.intent.volume = 0;
    } else {
      const restore = this.shouldSetLastVolume ? this.lastVolume : this.config.value;
      this.ctl.media.intent.volume = (restore ? restore : this.sliderAptVolume) / 100;
      this.shouldMute = this.shouldSetLastVolume = false;
    }
  }

  protected forwardVolume(value?: number): void {
    this.ctl.media.intent.volume = value! / 100;
  }

  protected forwardMuted(value?: boolean): void {
    this.ctl.media.intent.muted = value!;
  }

  protected handleVolumeIntent(e: Event<Media, "intent.volume">): void {
    if (e.resolved) return;
    if (this.ctl.media.element !== this.ctl.media.tech.element) return;
    this.handleVolumeState(e.value!);
    this.ctl.media.state.volume = e.value!;
    e.resolve(this.name);
  }

  protected handleMutedIntent(e: Event<Media, "intent.muted">): void {
    if (e.resolved) return;
    if (this.ctl.media.element !== this.ctl.media.tech.element) return;
    if (e.oldValue === e.value) return e.resolve(this.name);
    this.handleMutedState(e.value!);
    this.ctl.media.state.muted = e.value!;
    e.resolve(this.name);
  }

  protected handleMinChange({ target }: Event<VideoBuild, "settings.volume.min">): void {
    const min = target.value!;
    if (this.config.value! < min) this.config.value = min;
    if (this.lastVolume < min) this.lastVolume = min;
  }

  protected handleMaxChange({ target }: Event<VideoBuild, "settings.volume.max">): void {
    const max = target.value!;
    if (this.config.value! > max) this.config.value = max;
    if (this.lastVolume > max) this.lastVolume = max;
    this.ctl.videoContainer.classList.toggle("tmg-video-volume-boost", max > 100);
    this.ctl.config.settings.css.volumeSliderPercent = Math.round((100 / max) * 100);
    this.ctl.config.settings.css.maxVolumeRatio = max / 100;
  }

  public toggleMute(option?: "auto"): void {
    if (option === "auto" && this.shouldSetLastVolume && !this.lastVolume) {
      this.lastVolume = this.config.skip;
    }
    this.config.muted = !this.config.muted;
  }

  public changeVolume(value: number): void {
    const sign = value >= 0 ? "+" : "-";
    value = Math.abs(value);
    let volume = this.shouldSetLastVolume ? this.lastVolume : this.config.value!;
    if (sign === "-") {
      if (volume > this.config.min) volume -= volume % value ? volume % value : value;
      // if (volume === 0) return this.ctl.notify("volumemuted");
      // this.ctl.notify("volumedown");
    } else {
      if (volume < this.config.max) volume += volume % value ? value - (volume % value) : value;
      // this.ctl.notify("volumeup");
    }
    this.shouldSetLastVolume ? (this.lastVolume = volume) : (this.config.value = volume);
  }

  public handleSliderInput(volume: number): void {
    this.shouldMute = this.shouldSetLastVolume = false;
    this.config.value = volume;
    if (volume > 5) this.sliderAptVolume = volume;
  }

  protected handleNativeVolumeChange = (): void => {
    this.ctl.media.element.volume = 1;
    if (this.config.muted !== this.ctl.media.element.muted) this.toggleMute();
  };
}
