import { BasePlug, TIME_TRAVEL_BUILD, TimeTravel } from "../..";
import { type REvent } from "sia-reactor";
import { TimeTravelModule } from "sia-reactor/modules";
import { CtlrConfig } from "../../../types/config";
import { TimeTravelOverlay } from "sia-reactor/adapters/vanilla";
import { Controllers } from "../../../super";

export class TimeTravelPlug extends BasePlug<TimeTravel> {
  public static readonly plugName: string = "timeTravel";
  public static readonly BUILD = TIME_TRAVEL_BUILD;
  public module!: TimeTravelModule<any>;
  public overlay!: TimeTravelOverlay;

  public override mount(): void {
    // Variables Assignment
    this.module = new TimeTravelModule(this.config.module);
    this.overlay = new TimeTravelOverlay(this.module, { title: `TMG Controller Tape ${Controllers.indexOf(this.ctlr)}`, ...(this.config.overlay as Partial<TimeTravel["overlay"]>) });
    // Utility Injection
    this.media.use(this.module);
  }

  public override wire(): void {
    // Ctlr Config Watchers
    this.ctlr.config.watch("settings.css.brandColor", (v) => (this.overlay.config.color = v as string), { signal: this.signal, immediate: true });
    // ---------- Listeners
    this.ctlr.config.on("settings.timeTravel.module", this.handleModule, { signal: this.signal, immediate: false, depth: 1 });
    this.ctlr.config.on("settings.timeTravel.overlay", this.handleOverlay, { signal: this.signal, immediate: false, depth: 1 });
  }

  protected handleModule(e: REvent<CtlrConfig, "settings.timeTravel.module", 1>): void {
    e.type === "update" ? (this.module.config[e.target.key] = e.value as any) : Object.assign(this.module.config, e.value); // plugin's config is non-volatile
  }
  protected handleOverlay(e: REvent<CtlrConfig, "settings.timeTravel.overlay", 1>): void {
    e.type === "update" ? (this.overlay.config[e.target.key] = e.value as never) : Object.assign(this.overlay.config, e.value); // plugin's config is non-volatile
  }

  protected override onDestroy(): void {
    this.overlay.destroy(), this.module.destroy();
  }
}

export type * from "./types";
export * from "./build";
