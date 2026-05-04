import { BaseComponent, ComponentState } from ".";
import { IconRegistry } from "../core/registry";
import { createEl, formatKeyForDisplay } from "../utils";

export type BigPlayPauseConfig = undefined;

export class BigPlayPauseButton extends BaseComponent<BigPlayPauseConfig, ComponentState, HTMLButtonElement> {
  public static readonly componentName: string = "bigplaypause";
  public static readonly isControl: boolean = true;

  public override create() {
    return (this.element = createEl("button", { className: "tmg-video-big-play-pause-btn", type: "button", innerHTML: IconRegistry.get("play") + IconRegistry.get("pause") + IconRegistry.get("replay") }, { draggableControl: "", dragId: "big", controlId: this.name }));
  }

  public override wire(): void {
    // Event Listeners
    this.el.addEventListener("click", this.handleClick, { signal: this.signal });
    // Ctlr Media Listeners
    this.media.on("state.paused", this.syncARIA, { signal: this.signal, immediate: true });
    this.media.on("status.ended", this.syncARIA, { signal: this.signal });
    // ---- Config --------
    this.ctlr.config.on("settings.keys.shortcuts.playPause", this.syncARIA, { signal: this.signal });
  }

  protected handleClick() {
    this.media.intent.paused = !this.media.state.paused;
  }

  public syncARIA() {
    this.state.label = this.media.status.ended ? "Replay" : this.media.state.paused ? "Play" : "Pause";
    this.state.cmd = formatKeyForDisplay(this.ctlr.settings.keys.shortcuts.playPause);
    this.el.title = this.state.label + this.state.cmd;
    this.setBtnARIA();
  }
}
