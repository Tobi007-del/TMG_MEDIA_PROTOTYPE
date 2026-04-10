import { BasePlug } from ".";
import { type REvent, type PersistConfig, PersistPlugin, PERSIST_PLUGIN_BUILD } from "../sia-reactor";
import { CtlrConfig } from "../types/config";

export type Persist = PersistConfig<any>;

export class PersistPlug extends BasePlug<Persist> {
  public static readonly plugName: string = "persist";
  public plugin!: PersistPlugin<any>;

  public mount() {
    // Variables Assignment
    this.plugin = new PersistPlugin({ key: `TMG_${this.ctlr.id}_SETTINGS`, ...(this.config as any) });
    // Utility Injection
    this.ctlr.config.plugIn(this.plugin);
  }

  public wire() {
    // Ctlr Config Listeners
    this.ctlr.config.on("settings.persist", this.handlePersistChange, { signal: this.signal, immediate: false, depth: 1 });
  }

  protected handlePersistChange({ type, target: { key, value } }: REvent<CtlrConfig, "settings.persist">) {
    type === "update" ? ((this.plugin.config as any)[key] = value) : Object.assign(this.plugin.config, value); // plugin's config is non-volatile
  }
}

export const PERSIST_BUILD: Partial<Persist> = { ...PERSIST_PLUGIN_BUILD, paths: ["settings"] };
