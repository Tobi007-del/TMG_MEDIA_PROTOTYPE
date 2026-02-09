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
    this.el.addEventListener("click", this.togglePlay, { signal: this.signal });
    this.ctl.media.on("state.paused", this.updateUI, { signal: this.signal, immediate: true });
    this.ctl.media.on("status.ended", this.updateUI, { signal: this.signal });
    this.ctl.config.on("settings.keys.shortcuts.playPause", this.updateARIA, { signal: this.signal });
  }

  protected updateUI() {
    this.updateARIA();
  }
  protected updateARIA() {
    this.state.label = this.ctl.media.status.ended ? "Replay" : this.ctl.media.state.paused ? "Play" : "Pause";
    this.state.cmd = formatKeyForDisplay(this.ctl.config.settings.keys.shortcuts.playPause);
    this.el.title = this.state.label + this.state.cmd;
    this.setBtnARIA();
  }

  protected togglePlay() {
    if (this.ctl.media.status.ended) {
      this.ctl.media.intent.currentTime = 0;
      this.ctl.media.intent.paused = false;
    } else this.ctl.media.intent.paused = !this.ctl.media.state.paused;
  }
}
