import { BasePlug } from ".";
import { type REvent } from "sia-reactor";
import { type PersistConfig, PersistModule, PERSIST_MODULE_BUILD } from "sia-reactor/modules";
import { CtlrConfig } from "../types/config";

export type Persist = PersistConfig<any>;

export class PersistPlug extends BasePlug<Persist> {
  public static readonly plugName: string = "persist";
  public module!: PersistModule<any>;

  public override mount() {
    // Variables Assignment
    this.module = new PersistModule({ key: `TMG_${this.ctlr.id}_SETTINGS`, ...(this.config as Partial<Persist>) });
    // Utility Injection
    this.ctlr.config.use(this.module);
  }

  public override wire() {
    // Ctlr Config Listeners
    this.ctlr.config.on("settings.persist", this.handle, { signal: this.signal, immediate: false, depth: 1 });
  }

  protected handle(e: REvent<CtlrConfig, "settings.persist", 1>) {
    e.type === "update" ? (this.module.config[e.target.key] = e.value as never) : Object.assign(this.module.config, e.value); // module's config is non-volatile
  }
}

export const PERSIST_BUILD: Partial<Persist> = { ...PERSIST_MODULE_BUILD, whitelist: ["settings"] };
