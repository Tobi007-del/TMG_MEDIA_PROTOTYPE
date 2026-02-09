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
    window.addEventListener("beforeunload", this.onDestroy, { signal: this.signal });
    this.ctl.state.on("docVisibilityState", ({ value }) => value === "hidden" && this.onDestroy(), { signal: this.signal });
    // 1. Adapter Lifecycle (Init + Hot Swap)
    this.ctl.config.on("settings.persist.adapter", this.handleAdapterChange, { signal: this.signal, immediate: true });
    // 2. Persistence Lifecycle (Init + Toggle)
    this.ctl.config.on("settings.persist.disabled", this.handleDisabledChange, { signal: this.signal, immediate: true });
  }

  protected handleAdapterChange({ value }: Event<VideoBuild, "settings.persist.adapter">) {
    if (this.adapter && value === this.adapter.constructor) return; // No change
    this.adapter?.remove("settings"); // Cleanup old adapter storage, disabled will handle refresh
    this.adapter = new (value || LocalStorageAdapter)(this.ctl.id);
    const saved = this.adapter.get("settings"); // Hydration: Restore saved state immediately
    if (saved) this.ctl.config.settings = mergeObjs(this.ctl.config.settings, saved); // this.ctl.log("Settings hydrated from storage", "log")
  }

  protected handleDisabledChange({ value }: Event<VideoBuild, "settings.persist.disabled">) {
    this.ctl.config.off("settings", this.throttleSave); // Always unbind first to be safe (prevent double-binding)
    if (value) {
      this.adapter?.remove("settings"); // Disabled: Clear stored data
    } else {
      this.ctl.config.on("settings", this.throttleSave, { signal: this.signal, immediate: true }); // Enabled: Start listening
    }
  }

  protected throttleSave({ root: { settings } }: Event<VideoBuild, "settings">) {
    // We use the root 'settings' object from the event context
    this.ctl.throttle("persist_save", () => this.adapter.set("settings", settings), this.config.throttle ?? 5000);
  }

  protected onDestroy() {
    // One last save before the lights go out or rather; plane crashes
    !this.config.disabled && this.adapter?.set("settings", this.ctl.config.settings);
  }
}
