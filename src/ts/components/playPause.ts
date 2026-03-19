import { BaseComponent, ComponentState } from ".";
import { createEl, formatKeyForDisplay } from "../utils";

export type PlayPauseConfig = undefined;

export class PlayPause extends BaseComponent<PlayPauseConfig, ComponentState, HTMLButtonElement> {
  public static readonly componentName: string = "playPause";
  public static readonly isControl: boolean = true;

  public create() {
    return (this.element = createEl("button", { className: "tmg-video-play-pause-btn", innerHTML: this.getIcon("play") + this.getIcon("pause") + this.getIcon("replay") }, { draggableControl: "", controlId: this.name }));
  }

  public wire(): void {
    // Event Listeners
    this.el.addEventListener("click", this.togglePlay, { signal: this.signal });
    // Ctlr Media Listeners
    this.media.on("state.paused", this.updateUI, { signal: this.signal, immediate: true });
    this.media.on("status.ended", this.updateUI, { signal: this.signal });
    // ---- Config --------
    this.ctlr.config.on("settings.keys.shortcuts.playPause", this.updateARIA, { signal: this.signal });
  }

  protected updateUI() {
    this.updateARIA();
  }
  protected updateARIA() {
    this.state.label = this.media.status.ended ? "Replay" : this.media.state.paused ? "Play" : "Pause";
    this.state.cmd = formatKeyForDisplay(this.ctlr.settings.keys.shortcuts.playPause);
    this.el.title = this.state.label + this.state.cmd;
    this.setBtnARIA();
  }

  protected togglePlay() {
    if (this.media.status.ended) {
      this.media.intent.currentTime = 0;
      this.media.intent.paused = false;
    } else this.media.intent.paused = !this.media.state.paused;
  }
}
