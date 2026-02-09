import { BasePlug } from ".";

export type Src = string;

export interface Source {
  src: string;
  type: string;
  media: string;
}

export type Sources = Source[];
export type SrcObject = MediaSource | null;

export interface Track {
  kind: string;
  label: string;
  srclang: string;
  src: string;
  default: boolean;
  id: string;
}

export type Tracks = Track[];

export class SrcPlug extends BasePlug {
  static plugName = "src";
  static isCore = true;

  public wire() {
    this.ctl.config.watch("src", this.forwardSrc, { signal: this.signal, immediate: true });
  }
  protected forwardSrc(value?: string) {
    this.ctl.media.intent.src = value!;
  }
}

export class SourcesPlug extends BasePlug {
  static plugName = "sources";
  static isCore = true;

  public wire() {
    this.ctl.config.watch("sources", this.forwardSources, { signal: this.signal, immediate: true });
  }
  protected forwardSources(value?: Sources) {
    this.ctl.media.intent.sources = value!;
  }
}

export class SrcObjectPlug extends BasePlug {
  static plugName = "srcObject";
  static isCore = true;

  public wire() {
    this.ctl.config.watch("srcObject", this.forwardSrcObject, { signal: this.signal, immediate: true });
  }
  protected forwardSrcObject(value?: SrcObject) {
    this.ctl.media.settings.srcObject = value!;
  }
}

export class TracksPlug extends BasePlug {
  static plugName = "tracks";
  static isCore = true;

  public wire() {
    this.ctl.config.watch("tracks", this.forwardTracks, { signal: this.signal, immediate: true });
  }
  protected forwardTracks(value?: Tracks) {
    this.ctl.media.intent.tracks = value!;
  }
}
