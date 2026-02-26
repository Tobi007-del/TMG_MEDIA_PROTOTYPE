import { BasePlug } from ".";
import { StorageAdapter, LocalStorageAdapter, type StorageAdapterConstructor } from "../core/storage";
import { mergeObjs } from "../utils";
import type { Event } from "../core/reactor";
import { VideoBuild } from "../types/build";

export interface Persist {
  disabled: boolean;
  adapter: StorageAdapterConstructor;
  throttle: number;
}

export class PersistPlug extends BasePlug<Persist> {
  public static readonly plugName: string = "persist";
  protected adapter!: StorageAdapter;

  public wire() {
    window.addEventListener("pagehide", this.onDestroy, { signal: this.signal });
    this.ctlr.state.on("docVisibilityState", ({ value }) => value === "hidden" && this.onDestroy(), { signal: this.signal });
    // 1. Adapter Lifecycle (Init + Hot Swap)
    this.ctlr.config.on("settings.persist.adapter", this.handleAdapterChange, { signal: this.signal, immediate: true });
    // 2. Persistence Lifecycle (Init + Toggle)
    this.ctlr.config.on("settings.persist.disabled", this.handleDisabledChange, { signal: this.signal, immediate: true });
  }

  protected handleAdapterChange({ value }: Event<VideoBuild, "settings.persist.adapter">) {
    if (this.adapter && value === this.adapter.constructor) return; // No change
    this.adapter?.remove("settings"); // Cleanup old adapter storage, disabled will handle refresh
    this.adapter = new (value || LocalStorageAdapter)(this.ctlr.id);
    const saved = this.adapter.get("settings"); // Hydration: Restore saved state immediately
    if (saved) this.ctlr.config.settings = mergeObjs(this.ctlr.config.settings, saved); // this.ctlr.log("Settings hydrated from storage", "log")
  }

  protected handleDisabledChange({ value }: Event<VideoBuild, "settings.persist.disabled">) {
    this.ctlr.config.off("settings", this.throttleSave); // Always unbind first to be safe (prevent double-binding)
    if (value) this.adapter?.remove("settings");
    else this.ctlr.config.on("settings", this.throttleSave, { signal: this.signal, immediate: true }); // Enabled: Start listening
  }

  protected throttleSave({ root: { settings } }: Event<VideoBuild, "settings">) {
    // We use the root 'settings' object from the event context
    this.ctlr.throttle("persist_save", () => this.adapter.set("settings", settings), this.config.throttle ?? 5000);
  }

  protected onDestroy() {
    // One last save before the lights go out or rather; plane crashes
    !this.config.disabled && this.adapter?.set("settings", this.ctlr.config.settings);
  }
}
