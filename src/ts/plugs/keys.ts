import { BasePlug, type FastPlayPlug, type GesturePlug, type ModesPlug, type OverlayPlug, type TimePlug, type VolumePlug } from ".";
import type { KeyShortcutAction, ModdedKeyShortcutAction } from "../types/generics";
import type { DeepPartial } from "sia-reactor";
import { keysBlocks, keysWhitelist } from "../consts/generics";
import { formatKeyShortcutsForDisplay, isArr, keyEventAllowed as allowed, keysSettings } from "../utils";

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

export interface Keys extends Required<keysSettings> {
  shortcuts: Record<KeyShortcutAction, string | string[]>;
  mods: { disabled: boolean } & Record<ModdedKeyShortcutAction, Partial<Record<Exclude<KeyMod, "">, number>>>;
  _handlers: Record<KeyPhase, Record<string, KeyHook>>;
}

export class KeysPlug extends BasePlug<Keys> {
  public static readonly plugName: string = "keys";
  protected playTriggerCounter = 0;

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
    (options.phase ? (isArr(options.phase) ? options.phase : [options.phase]) : ["keyup"]).forEach((phase) => (this.config._handlers[phase as KeyPhase][action] = { fn: handler, zen: !!options.zen }));
    if (options.shortcut && ((this.config.shortcuts as any)[action] == null || options.overwrite)) (this.config.shortcuts as any)[action] = options.shortcut;
  }

  public unregister(action: string, phase?: KeyPhase): void {
    if (phase) return void delete this.config._handlers[phase][action];
    (delete this.config._handlers.keydown[action], delete this.config._handlers.keyup[action]);
  }

  protected syncKeyEventListeners(): void {
    this.setKeyEventListeners(this.shouldListen() ? "add" : "remove");
  }

  protected handleKeyDown(e: KeyboardEvent, action = allowed(e, this.ctlr.settings.keys), mod = this.getMod(e)): void {
    if (action === false) return;
    action && this.ctlr.plug<OverlayPlug>("overlay")?.show();
    this.ctlr.throttle("keyDown", () => this.config._handlers.keydown[action]?.fn(e, mod), 30);
  }

  protected handleKeyUp(e: KeyboardEvent, zen = false, action = allowed(e, this.ctlr.settings.keys), mod = this.getMod(e)): void {
    if (action === false) return;
    action && this.ctlr.plug<OverlayPlug>("overlay")?.show();
    const hook = this.config._handlers.keyup[action];
    hook && (!zen || hook.zen) && hook.fn(e, mod);
  }
  protected handleZenKeyUp(e: KeyboardEvent): void {
    this.handleKeyUp(e, true);
  }

  protected handlePlayTriggerDown(e: KeyboardEvent): void {
    this.playTriggerCounter++;
    this.playTriggerCounter === 1 && (e.currentTarget as Window | null)?.addEventListener("keyup", this.handlePlayTriggerUp, { signal: this.signal });
    this.playTriggerCounter === 2 && this.ctlr.settings.fastPlay.key && this.ctlr.plug<FastPlayPlug>("fastPlay")?.fastPlay(e.shiftKey ? "backwards" : "forwards");
  }

  protected handlePlayTriggerUp(e: KeyboardEvent, action = allowed(e, this.ctlr.settings.keys)): void {
    action && this.ctlr.plug<OverlayPlug>("overlay")?.show();
    if (action !== false && [" ", "playpause"].includes(action)) {
      e.stopImmediatePropagation();
      if (this.playTriggerCounter === 1) this.media.intent.paused = !this.media.state.paused;
      // JS: this.media.state.paused ? this.notify("videopause") : this.notify("videoplay");
    }
    if (this.playTriggerCounter > 1 && this.ctlr.plug<FastPlayPlug>("fastPlay")?.speedCheck) this.ctlr.plug<FastPlayPlug>("fastPlay")?.slowDown();
    this.playTriggerCounter = 0;
    (e.currentTarget as Window | null)?.removeEventListener("keyup", this.handlePlayTriggerUp);
  }

  protected handleEscape(): void {
    this.ctlr.isUIActive("miniplayer") && (this.media.intent.miniplayer = false);
    (this.ctlr.isUIActive("pictureInPicture") || this.ctlr.isUIActive("floatingPlayer")) && (this.media.intent.pictureInPicture = false);
  }

  protected handleArrowLeft(_: KeyboardEvent, mod: KeyMod): void {
    this.ctlr.plug<GesturePlug>("gesture")?.general?.deactivateSkipPersist();
    this.ctlr.plug<TimePlug>("time")?.skip(-this.getModded("skip", mod, 5));
    // JS: this.notify("bwd");
  }
  protected handleArrowRight(_: KeyboardEvent, mod: KeyMod): void {
    this.ctlr.plug<GesturePlug>("gesture")?.general?.deactivateSkipPersist();
    this.ctlr.plug<TimePlug>("time")?.skip(this.getModded("skip", mod, 5));
    // JS: this.notify("fwd");
  }
  protected handleArrowUp(_: KeyboardEvent, mod: KeyMod): void {
    this.ctlr.plug<VolumePlug>("volume")?.changeVolume(this.getModded("volume", mod, 5));
    // JS: this.notify("volumeup");
  }
  protected handleArrowDown(_: KeyboardEvent, mod: KeyMod): void {
    this.ctlr.plug<VolumePlug>("volume")?.changeVolume(-this.getModded("volume", mod, 5));
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
    const floating = this.ctlr.plug<ModesPlug>("modes")?.pip?.floatingWindow;
    return floating ? [floating, window] : [window];
  }
  protected getMod(e: KeyboardEvent): KeyMod {
    return this.config.mods.disabled ? "" : e.ctrlKey ? "ctrl" : e.altKey ? "alt" : e.shiftKey ? "shift" : "";
  }
  public getModded(action: ModdedKeyShortcutAction, mod: KeyMod, fallback: number): number {
    return mod ? (this.config.mods[action]?.[mod] ?? fallback) : fallback;
  }
}

export const KEYS_BUILD: DeepPartial<Keys> = {
  disabled: false,
  strictMatches: false,
  overrides: [" ", "ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Home", "End"],
  shortcuts: {
    prev: "Shift+p",
    next: "Shift+n",
    playPause: "k",
    mute: "m",
    dark: "d",
    skipBwd: "j",
    skipFwd: "l",
    stepFwd: ".",
    stepBwd: ",",
    volumeUp: "ArrowUp",
    volumeDown: "ArrowDown",
    brightnessUp: "y",
    brightnessDown: "h",
    playbackRateUp: ">",
    playbackRateDown: "<",
    timeFormat: "z",
    timeMode: "q",
    capture: "s",
    objectFit: "a",
    pictureInPicture: "i",
    theater: "t",
    fullscreen: "f",
    captions: "c",
    captionsFontSizeUp: ["+", "="],
    captionsFontSizeDown: ["-", "_"],
    captionsFontFamily: "u",
    captionsFontWeight: "g",
    captionsFontVariant: "v",
    captionsFontOpacity: "o",
    captionsBackgroundOpacity: "b",
    captionsWindowOpacity: "w",
    captionsCharacterEdgeStyle: "e",
    captionsTextAlignment: "x",
    settings: "?",
  },
  blocks: keysBlocks,
  whitelist: keysWhitelist,
  mods: { disabled: false, skip: { ctrl: 60, shift: 10 }, volume: { ctrl: 50, shift: 10 }, brightness: { ctrl: 50, shift: 10 }, playbackRate: { ctrl: 1 }, captionsFontSize: {} },
  _handlers: { keydown: {}, keyup: {} },
};
