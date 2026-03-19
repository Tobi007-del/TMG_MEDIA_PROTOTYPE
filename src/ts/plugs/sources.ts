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

export type PlaysInline = boolean;

export class SrcPlug extends BasePlug<Src> {
  public static readonly plugName: string = "src";
  public static readonly isCore: boolean = true;

  public wire() {
    // Ctlr Config Watchers
    this.ctlr.config.watch("src", this.forwardSrc, { signal: this.signal, immediate: "auto" });
  }

  protected forwardSrc(value: string) {
    this.media.intent.src = value;
  }
}

export class SourcesPlug extends BasePlug<Sources> {
  public static readonly plugName: string = "sources";
  public static readonly isCore: boolean = true;

  public wire() {
    this.ctlr.config.watch("sources", this.forwardSources, { signal: this.signal, immediate: "auto" });
  }

  protected forwardSources(value: Sources) {
    this.media.intent.sources = value;
  }
}

export class SrcObjectPlug extends BasePlug<SrcObject> {
  public static readonly plugName: string = "srcObject";
  public static readonly isCore: boolean = true;

  public wire() {
    // Ctlr Config Watchers
    this.ctlr.config.watch("srcObject", this.forwardSrcObject, { signal: this.signal, immediate: "auto" });
  }

  protected forwardSrcObject(value: SrcObject) {
    this.media.settings.srcObject = value;
  }
}

export class TracksPlug extends BasePlug<Tracks> {
  public static readonly plugName: string = "tracks";
  public static readonly isCore: boolean = true;

  public wire() {
    // Ctlr Config Watchers
    this.ctlr.config.watch("tracks", this.forwardTracks, { signal: this.signal, immediate: "auto" });
  }

  protected forwardTracks(value: Tracks) {
    this.media.intent.tracks = value;
  }
}

export class PlaysInlinePlug extends BasePlug<PlaysInline> {
  public static readonly plugName: string = "playsInline";

  public wire() {
    // Ctlr Config Watchers
    this.ctlr.config.watch("settings.playsInline", this.forwardPlaysInline, { signal: this.signal, immediate: true });
  }

  protected forwardPlaysInline(value: boolean) {
    this.media.intent.playsInline = value;
  }
}
