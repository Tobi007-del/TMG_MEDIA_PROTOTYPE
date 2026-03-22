import { BasePlug, type KeysPlug } from ".";
import type { CtlrMedia, MediaState } from "../types/contract";
import type { REvent } from "../types/reactor";
import { rotate } from "../utils";

const objectFits = ["contain", "cover", "fill"] as const;

export type ObjectFit = (typeof objectFits)[number];

export class ObjectFitPlug extends BasePlug<ObjectFit> {
  public static readonly plugName: string = "objectFit";

  public wire(): void {
    // Ctlr Config Getters
    // this.ctlr.config.get("settings.objectFit", () => this.ctlr.settings.css.objectFit, { signal: this.signal, lazy: true }); // VIRTUAL: reliable return value
    // ----------- Watchers
    this.ctlr.config.watch("settings.objectFit", (value) => (this.config = value), { signal: this.signal }); // #COMPUTED: config can lose reference
    this.ctlr.config.watch("settings.objectFit", this.forwardObjectFit, { signal: this.signal, immediate: "auto" });
    // ---- Media Listeners
    this.media.on("intent.objectFit", this.handleObjectFitIntent, { capture: true, signal: this.signal });
    this.media.on("state.objectFit", this.handleObjectFitState, { signal: this.signal, immediate: true });
    // Post Wiring
    this.media.tech.features.objectFit = true;
    this.ctlr.getPlug<KeysPlug>("keys")?.register("objectFit", () => this.rotateObjectFit(), { phase: "keydown" });
  }

  protected forwardObjectFit(value: ObjectFit): void {
    this.media.intent.objectFit = value;
  }

  protected handleObjectFitIntent(e: REvent<CtlrMedia, "intent.objectFit">): void {
    if (e.resolved) return;
    this.media.state.objectFit = this.ctlr.settings.css.objectFit = e.value || "contain";
    e.resolve(this.name);
  }

  protected handleObjectFitState({ value: fit }: REvent<CtlrMedia, "state.objectFit">): void {
    this.ctlr.videoContainer.dataset.objectFit = fit;
    this.ctlr.settings.css.bgSafeObjectFit = fit === "fill" ? "cover" : fit;
  }

  public rotateObjectFit(dir: "forwards" | "backwards" = "forwards"): void {
    this.media.intent.objectFit = rotate<MediaState["objectFit"]>(this.media.state.objectFit, objectFits, dir);
    // JS: this.ctlr.getPlug<NotifiersPlug>("notifiers")?.notify(`objectfit${this.media.intent.objectFit}`);
  }
}
