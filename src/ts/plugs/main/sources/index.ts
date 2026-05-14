import { BasePlug, Src, Sources, SrcObject, Tracks, PlaysInline, PLAYS_INLINE_BUILD } from "../..";

export class SrcPlug extends BasePlug<Src> {
  public static readonly plugName: string = "src";
  public static readonly isMain: boolean = true;

  public override wire(): void {
    // Ctlr Config Getters
    this.ctlr.config.get("src", () => this.media.state.src, { signal: this.signal, lazy: true }); // #VIRTUAL: reliable return value
    // ----------- Watchers
    this.ctlr.config.watch("src", this.forwardSrc, { signal: this.signal, immediate: "auto" });
  }

  protected forwardSrc(value: string): void {
    this.media.intent.src = value;
  }
}

export class SourcesPlug extends BasePlug<Sources> {
  public static readonly plugName: string = "sources";
  public static readonly isMain: boolean = true;

  public override wire(): void {
    // Ctlr Config Getters
    this.ctlr.config.get("sources", () => this.media.state.sources, { signal: this.signal, lazy: true }); // #VIRTUAL: reliable return value
    // ----------- Watchers
    this.ctlr.config.watch("sources", this.forwardSources, { signal: this.signal, immediate: "auto" });
  }

  protected forwardSources(value: Sources): void {
    this.media.intent.sources = value;
  }
}

export class SrcObjectPlug extends BasePlug<SrcObject> {
  public static readonly plugName: string = "srcObject";
  public static readonly isMain: boolean = true;

  public override wire(): void {
    // Ctlr Config Getters
    this.ctlr.config.get("srcObject", () => this.media.settings.srcObject, { signal: this.signal, lazy: true }); // #VIRTUAL: reliable return value
    // ----------- Watchers
    this.ctlr.config.watch("srcObject", this.forwardSrcObject, { signal: this.signal, immediate: "auto" });
  }

  protected forwardSrcObject(value: SrcObject): void {
    this.media.settings.srcObject = value;
  }
}

export class TracksPlug extends BasePlug<Tracks> {
  public static readonly plugName: string = "tracks";
  public static readonly isMain: boolean = true;

  public override wire(): void {
    // Ctlr Config Getters
    this.ctlr.config.get("tracks", () => this.media.state.tracks, { signal: this.signal, lazy: true }); // #VIRTUAL: reliable return value
    // ----------- Watchers
    this.ctlr.config.watch("tracks", this.forwardTracks, { signal: this.signal, immediate: "auto" });
  }

  protected forwardTracks(value: Tracks): void {
    this.media.intent.tracks = value;
  }
}

export class PlaysInlinePlug extends BasePlug<PlaysInline> {
  public static readonly plugName: string = "playsInline";
  public static readonly isMain: boolean = true;
  public static readonly BUILD = PLAYS_INLINE_BUILD;

  public override wire(): void {
    // Ctlr Config Getters
    this.ctlr.config.get("settings.playsInline", () => this.media.state.playsInline, { signal: this.signal, lazy: true }); // #VIRTUAL: reliable return value
    // ----------- Watchers
    this.ctlr.config.watch("settings.playsInline", this.forwardPlaysInline, { signal: this.signal, immediate: "auto" });
  }

  protected forwardPlaysInline(value: boolean): void {
    this.media.intent.playsInline = value;
  }
}

export type * from "./types";
export * from "./build";
