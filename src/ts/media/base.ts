import { Controllable } from "../core/controllable";
import type { Controller } from "../core/controller";
import { Reactive } from "../tools/mixins/reactive";
import type { Media, MediaFeatures } from "../types/contract";

export type BaseTechConfig = Reactive<Media>; // Must extend to add more

export interface TechConstructor<T extends BaseTech = BaseTech> {
  new (ctl: Controller, config: any): T;
  techName: string;
  features: MediaFeatures;
  canPlaySource(src: string): boolean;
}

export abstract class BaseTech<Config extends BaseTechConfig = BaseTechConfig, El extends HTMLElement = HTMLElement> extends Controllable<Config> {
  public static readonly techName: string;
  public get name() {
    return (this.constructor as TechConstructor).techName;
  }
  public static readonly features: MediaFeatures = {};
  public get features() {
    return (this.constructor as TechConstructor).features;
  }
  public element!: HTMLElement;
  protected get el() {
    return this.element as El;
  }

  constructor(ctl: Controller, config: Config) {
    super(ctl, config);
    this.element = config.element; // must reassign if not using original
  }
  public onSetup() {
    this.mount();
    if (this.ctl.state.readyState) this.wire();
    else this.ctl.state.wonce("readyState", this.wire, { signal: this.signal }); // wire after all plugs setup
  }
  public onDestroy() {
    this.unmount();
  }

  public static canPlaySource(src: string): boolean {
    return false;
  }

  public mount() {
    this.element && this.element !== this.config.element && this.config.element.replaceWith(this.element);
  }
  public unmount() {
    this.element && this.config.element !== this.element && this.element.replaceWith(this.config.element);
  }

  // --- THE MANDATORY CORE 5 ---
  public wire() {
    this.wireSrc();
    this.wireCurrentTime();
    this.wireDuration();
    this.wirePaused();
    this.wireEnded();
    this.wireFeatures();
  }
  // --- The Core 5 (Media "Must Haves") ---
  protected abstract wireSrc(): void;
  protected abstract wireCurrentTime(): void;
  protected abstract wireDuration(): void;
  protected abstract wirePaused(): void;
  protected abstract wireEnded(): void;
  // --- THE EXTENSIONS ---
  protected wireFeatures() {
    const f = this.features;
    f.volume && this.wireVolume?.();
    f.muted && this.wireMuted?.();
    f.playbackRate && this.wirePlaybackRate?.();
    f.pictureInPicture && this.wirePictureInPicture?.();
    f.fullscreen && this.wireFullscreen?.();
    f.airplay && this.wireAirplay?.();
    f.chromecast && this.wireChromecast?.();
    f.xrSession && this.wireXRSession?.();
    f.xrMode && this.wireXRMode?.();
    f.xrReferenceSpace && this.wireXRReferenceSpace?.();
    f.projection && this.wireProjection?.();
    f.stereoMode && this.wireStereoMode?.();
    f.fieldOfView && this.wireFieldOfView?.();
    f.aspectRatio && this.wireAspectRatio?.();
    f.panningX && this.wirePanningX?.();
    f.panningY && this.wirePanningY?.();
    f.panningZ && this.wirePanningZ?.();
    f.xrInputSource && this.wireXRInputSource?.();
    f.currentTextTrack && this.wireCurrentTextTrack?.();
    f.currentAudioTrack && this.wireCurrentAudioTrack?.();
    f.currentVideoTrack && this.wireCurrentVideoTrack?.();
    f.autoLevel && this.wireAutoLevel?.();
    f.currentLevel && this.wireCurrentLevel?.();
    f.poster && this.wirePoster?.();
    f.autoplay && this.wireAutoplay?.();
    f.loop && this.wireLoop?.();
    f.preload && this.wirePreload?.();
    f.playsInline && this.wirePlaysInline?.();
    f.crossOrigin && this.wireCrossOrigin?.();
    f.controls && this.wireControls?.();
    f.controlsList && this.wireControlsList?.();
    f.disablePictureInPicture && this.wireDisablePictureInPicture?.();
    f.sources && this.wireSources?.();
    f.tracks && this.wireTracks?.();
  }
  // --- The Engine Inputs (Interceptable) ---
  protected wireVolume?(): void;
  protected wireMuted?(): void;
  protected wirePlaybackRate?(): void;
  // --- The Presentation Modes (Heavily Rejectable) ---
  protected wirePictureInPicture?(): void;
  protected wireFullscreen?(): void;
  // --- Casting (Connection Handshakes) ---
  protected wireAirplay?(): void;
  protected wireChromecast?(): void;
  // --- VR / XR (Spatial Realities) ---
  protected wireXRSession?(): void;
  protected wireXRMode?(): void;
  protected wireXRReferenceSpace?(): void;
  // --- Projection & Stereo (The "Content" Logic) ---
  protected wireProjection?(): void;
  protected wireStereoMode?(): void;
  // --- Camera & Viewport (The "Lens") ---
  protected wireFieldOfView?(): void;
  protected wireAspectRatio?(): void;
  // --- Orientation (The "Head/Camera" Pose) ---
  protected wirePanningX?(): void;
  protected wirePanningY?(): void;
  protected wirePanningZ?(): void;
  // --- Interaction (XR Controllers) ---
  protected wireXRInputSource?(): void;
  // --- Track Switching (Async Buffering/Streaming) ---
  protected wireAutoLevel?(): void;
  protected wireCurrentLevel?(): void;
  protected wireCurrentAudioTrack?(): void;
  protected wireCurrentVideoTrack?(): void;
  protected wireCurrentTextTrack?(): void;
  // --- HTML Attributes ---
  protected wirePoster?(): void;
  protected wireAutoplay?(): void;
  protected wireLoop?(): void;
  protected wirePreload?(): void;
  protected wirePlaysInline?(): void;
  protected wireCrossOrigin?(): void;
  protected wireControls?(): void;
  protected wireControlsList?(): void;
  protected wireDisablePictureInPicture?(): void;
  // --- HTML Lists ---
  protected wireSources?(): void;
  protected wireTracks?(): void;
}
