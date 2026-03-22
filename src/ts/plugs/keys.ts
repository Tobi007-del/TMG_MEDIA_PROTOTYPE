import { BasePlug, type FastPlayPlug, type GesturePlug, type ModesPlug, type OverlayPlug, type TimePlug, type VolumePlug } from ".";
import type { KeyShortcutAction, ModdedKeyShortcutAction } from "../types/generics";
import { cleanKeyCombo, formatKeyShortcutsForDisplay, isArr, keyEventAllowed } from "../utils";

export type KeyPhase = "keydown" | "keyup";
export type KeyMod = "" | "ctrl" | "alt" | "shift";
export type KeyHook = { fn: KeyHandler; zen?: boolean };
export type KeyHandler = (e: KeyboardEvent, mod: KeyMod) => void;
export type KeyRegOptions = {
  phase?: KeyPhase | readonly KeyPhase[];
  shortcut?: string | string[];
  overwrite?: boolean;
  zen?: boolean; // an isolated mode where only flagged keys work, made for 3d flipped settings view
};

export interface Keys {
  disabled: boolean;
  strictMatches: boolean;
  overrides: string[];
  blocks: string[];
  shortcuts: Record<KeyShortcutAction, string | string[]>;
  mods: { disabled: boolean } & Record<ModdedKeyShortcutAction, Partial<Record<Exclude<KeyMod, "">, number>>>;
}

export class KeysPlug extends BasePlug<Keys> {
  public static readonly plugName: string = "keys";
  protected playTriggerCounter = 0;
  protected handlers: Record<KeyPhase, Map<string, KeyHook>> = { keydown: new Map(), keyup: new Map() };

  public wire(): void {
    // Ctlr Config Listeners
    this.ctlr.config.on("settings.keys.disabled", this.syncKeyEventListeners, { signal: this.signal, immediate: true });
    this.ctlr.config.on("disabled", this.syncKeyEventListeners, { signal: this.signal });
    this.ctlr.config.on("settings.locked.disabled", this.syncKeyEventListeners, { signal: this.signal });
    // ---- State --------
    this.ctlr.state.on("readyState", this.syncKeyEventListeners, { signal: this.signal });
    this.ctlr.state.on("mediaParentIntersecting", this.syncKeyEventListeners, { signal: this.signal });
    // Post Wiring
    this.register(" ", this.handlePlayTriggerDown, { phase: "keydown" });
    this.register("escape", this.handleEscape, { phase: "keydown" });
    this.register("arrowleft", this.handleArrowLeft, { phase: "keydown" });
    this.register("arrowright", this.handleArrowRight, { phase: "keydown" });
    this.register("arrowup", this.handleArrowUp, { phase: "keydown" });
    this.register("arrowdown", this.handleArrowDown, { phase: "keydown" });
    this.register("home", () => (this.media.intent.currentTime = 0), { phase: "keyup" });
    this.register("0", () => (this.media.intent.currentTime = 0), { phase: "keyup" });
    this.register("end", () => (this.media.intent.currentTime = this.media.status.duration), { phase: "keyup" });
    "123456789".split("").forEach((n) => this.register(n, () => (this.media.intent.currentTime = (+n / 10) * this.media.status.duration), { phase: "keyup" }));
    this.register("playpause", this.handlePlayTriggerDown, { phase: "keydown" });
    // JS: this.register("settings", () => this.toggleSettingsView(), { phase: "keyup", zen: true });
  }

  public register(action: string, handler: KeyHandler, options: KeyRegOptions = {}): void {
    (options.phase ? (isArr(options.phase) ? options.phase : [options.phase]) : ["keyup"]).forEach((phase) => this.handlers[phase as KeyPhase].set(action, { fn: handler, zen: !!options.zen }));
    if (options.shortcut && ((this.config.shortcuts as any)[action] == null || options.overwrite)) (this.config.shortcuts as any)[action] = cleanKeyCombo(options.shortcut);
  }

  public unregister(action: string, phase?: KeyPhase): void {
    if (phase) return void this.handlers[phase].delete(action);
    (this.handlers.keydown.delete(action), this.handlers.keyup.delete(action));
  }

  protected syncKeyEventListeners(): void {
    this.setKeyEventListeners(this.shouldListen() ? "add" : "remove");
  }

  protected handleKeyDown(e: KeyboardEvent): void {
    const action = keyEventAllowed(e, this.ctlr.settings),
      mod = this.getMod(e);
    if (action === false) return;
    action && this.ctlr.getPlug<OverlayPlug>("overlay")?.show();
    this.ctlr.throttle("keyDown", () => this.handlers.keydown.get(action)?.fn(e, mod), 30);
  }

  protected handleKeyUp(e: KeyboardEvent, zen = false): void {
    const action = keyEventAllowed(e, this.ctlr.settings),
      mod = this.getMod(e);
    if (action === false) return;
    action && this.ctlr.getPlug<OverlayPlug>("overlay")?.show();
    const hook = this.handlers.keyup.get(action);
    hook && (!zen || hook.zen) && hook.fn(e, mod);
  }

  protected handleZenKeyUp(e: KeyboardEvent): void {
    this.handleKeyUp(e, true);
  }

  protected handlePlayTriggerDown(e: KeyboardEvent): void {
    this.playTriggerCounter++;
    this.playTriggerCounter === 1 && (e.currentTarget as Window | null)?.addEventListener("keyup", this.handlePlayTriggerUp, { signal: this.signal });
    this.playTriggerCounter === 2 && this.ctlr.settings.fastPlay.key && this.ctlr.getPlug<FastPlayPlug>("fastPlay")?.fastPlay(e.shiftKey ? "backwards" : "forwards");
  }

  protected handlePlayTriggerUp(e: KeyboardEvent): void {
    const action = keyEventAllowed(e, this.ctlr.settings);
    action && this.ctlr.getPlug<OverlayPlug>("overlay")?.show();
    if (action !== false && [" ", "playpause"].includes(action)) {
      e.stopImmediatePropagation();
      if (this.playTriggerCounter === 1) this.media.intent.paused = !this.media.state.paused;
      // JS: this.media.state.paused ? this.notify("videopause") : this.notify("videoplay");
    }
    if (this.playTriggerCounter > 1 && this.ctlr.getPlug<FastPlayPlug>("fastPlay")?.speedCheck) this.ctlr.getPlug<FastPlayPlug>("fastPlay")?.slowDown();
    this.playTriggerCounter = 0;
    (e.currentTarget as Window | null)?.removeEventListener("keyup", this.handlePlayTriggerUp);
  }

  protected handleEscape(): void {
    this.ctlr.isUIActive("miniplayer") && (this.media.intent.miniplayer = false);
    (this.ctlr.isUIActive("pictureInPicture") || this.ctlr.isUIActive("floatingPlayer")) && (this.media.intent.pictureInPicture = false);
  }

  protected handleArrowLeft(_: KeyboardEvent, mod: KeyMod): void {
    this.ctlr.getPlug<GesturePlug>("gesture")?.general?.deactivateSkipPersist();
    this.ctlr.getPlug<TimePlug>("time")?.skip(-this.getModded("skip", mod, 5));
    // JS: this.notify("bwd");
  }

  protected handleArrowRight(_: KeyboardEvent, mod: KeyMod): void {
    this.ctlr.getPlug<GesturePlug>("gesture")?.general?.deactivateSkipPersist();
    this.ctlr.getPlug<TimePlug>("time")?.skip(this.getModded("skip", mod, 5));
    // JS: this.notify("fwd");
  }

  protected handleArrowUp(_: KeyboardEvent, mod: KeyMod): void {
    this.ctlr.getPlug<VolumePlug>("volume")?.changeVolume(this.getModded("volume", mod, 5));
    // JS: this.notify("volumeup");
  }

  protected handleArrowDown(_: KeyboardEvent, mod: KeyMod): void {
    this.ctlr.getPlug<VolumePlug>("volume")?.changeVolume(-this.getModded("volume", mod, 5));
    // JS: this.settings.volume.value === 0 ? this.notify("volumemuted") : this.notify("volumedown");
  }

  public setKeyEventListeners(action: "add" | "remove" = "add", zen = this.ctlr.isUIActive("settings")): void {
    const ws = this.getWindows();
    ws.forEach((w) => (w.removeEventListener("keydown", this.handleKeyDown), w.removeEventListener("keyup", this.handleKeyUp), w.removeEventListener("keyup", this.handleZenKeyUp)));
    if (action === "remove" || !this.shouldListen()) return;
    !zen && ws.forEach((w) => w.addEventListener("keydown", this.handleKeyDown, { signal: this.signal }));
    ws.forEach((w) => w.addEventListener("keyup", !zen ? this.handleKeyUp : this.handleZenKeyUp, { signal: this.signal }));
  }

  protected shouldListen(): boolean {
    return this.ctlr.state.readyState > 1 && this.ctlr.state.mediaParentIntersecting && !this.ctlr.config.disabled && !this.config.disabled && this.ctlr.settings.locked.disabled;
  }

  protected getWindows(): Window[] {
    const floating = this.ctlr.getPlug<ModesPlug>("modes")?.pip?.floatingWindow;
    return floating ? [floating, window] : [window];
  }

  protected getMod(e: KeyboardEvent): KeyMod {
    return this.config.mods.disabled ? "" : e.ctrlKey ? "ctrl" : e.altKey ? "alt" : e.shiftKey ? "shift" : "";
  }

  public getModded(action: ModdedKeyShortcutAction, mod: KeyMod, fallback: number): number {
    return mod ? (this.config.mods[action]?.[mod] ?? fallback) : fallback;
  }

  public fetchKeyShortcutsForDisplay(): Record<string, string> {
    return formatKeyShortcutsForDisplay(this.config.shortcuts as any);
  }
}
