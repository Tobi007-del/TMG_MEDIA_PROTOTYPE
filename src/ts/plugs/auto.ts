import { BasePlug } from ".";
import type { Event } from "../core/reactor";
import { VideoBuild } from "../types/build";
import { Media } from "../types/contract";
import type { AptAutoplayOption, PosterPreview } from "../types/generics";
import type { PlaylistPlug } from "./playlist";
import type { ToastsPlug } from "./toasts";
import type { TimePlug } from "./time";
import { clamp, addSources } from "../utils";

export interface Auto {
  play: boolean | AptAutoplayOption;
  pause: boolean | AptAutoplayOption;
  next: number; // -1 for false
  nextVideoPreview: PosterPreview;
}

export class AutoPlug extends BasePlug<Auto> {
  public static readonly plugName: string = "auto";
  protected nextVideoPreview: HTMLVideoElement | null = null;
  protected canAutoMovePlaylist = true;

  public wire(): void {
    this.ctl.config.watch("settings.auto.play", this.forwardAutoPlay, { signal: this.signal, immediate: true });
    this.ctl.state.on("mediaParentIntersecting", this.handleIntersectionChange, { signal: this.signal });
    this.ctl.media.on("state.currentTime", this.handleTimeUpdate, { signal: this.signal, immediate: true });
    this.ctl.config.on("settings.auto.nextVideoPreview.usePoster", this.handleUsePoster, { signal: this.signal });
    this.ctl.config.on("settings.auto.nextVideoPreview.tease", this.handleTease, { signal: this.signal });
    this.ctl.config.on("settings.auto.nextVideoPreview.time", this.handlePreviewTime, { signal: this.signal });
  }

  protected forwardAutoPlay(value?: boolean | AptAutoplayOption): void {
    this.ctl.media.element.autoplay = typeof value === "string" ? false : !!value;
  }

  protected handleIntersectionChange(): void {
    this.handleMediaAptAutoPlay(this.config.pause, false);
    this.handleMediaAptAutoPlay();
  }

  protected handleTimeUpdate({ target }: Event<Media, "state.currentTime">): void {
    const dur = this.ctl.media.status.duration,
      curr = target.value!;
    if (this.ctl.media.status.readyState && curr && Math.floor((this.ctl.config.settings.time.end ?? dur) - curr) <= this.config.next) this.autonextVideo();
  }

  protected handleUsePoster({ target: { value } }: Event<VideoBuild, "settings.auto.nextVideoPreview.usePoster">): void {
    if (!this.nextVideoPreview || (value && this.nextVideoPreview.poster)) return;
    if (this.config.nextVideoPreview.tease) this.ctl.config.settings.auto.nextVideoPreview.tease = this.config.nextVideoPreview.tease;
    else this.ctl.config.settings.auto.nextVideoPreview.time = this.config.nextVideoPreview.time;
  }

  protected handleTease({ target: { value } }: Event<VideoBuild, "settings.auto.nextVideoPreview.tease">): void {
    if (!this.nextVideoPreview) return;
    this.nextVideoPreview.ontimeupdate = () => this.nextVideoPreview && Number(this.nextVideoPreview.currentTime) >= this.config.nextVideoPreview.time && this.nextVideoPreview.pause();
    if (value && (!this.config.nextVideoPreview.usePoster || !this.nextVideoPreview.poster)) this.nextVideoPreview.play();
  }

  protected handlePreviewTime({ target: { value } }: Event<VideoBuild, "settings.auto.nextVideoPreview.time">): void {
    if (!this.nextVideoPreview || (this.config.nextVideoPreview.usePoster && this.nextVideoPreview.poster)) return;
    this.nextVideoPreview.currentTime = Number(value);
  }

  protected handleMediaAptAutoPlay(auto = this.config.play, bool = true, p = this.ctl.state.mediaParentIntersecting ? "in" : "out"): void {
    if (auto === `${p}-view-always`) this.ctl.media.intent.paused = !bool;
    else if (auto === `${p}-view` && this.ctl.state.readyState < 3) this.ctl.media.intent.paused = !bool;
  }

  protected autonextVideo = (): void => {
    if (!this.ctl.media.status.loadedMetadata || !this.ctl.config.playlist || this.config.next < 0 || !this.canAutoMovePlaylist || this.ctl.state.currentPlaylistIndex >= this.ctl.config.playlist.length - 1 || this.ctl.media.state.paused || this.ctl.media.status.waiting) return;
    this.canAutoMovePlaylist = false;
    const count = clamp(1, Math.round((this.ctl.config.settings.time.end ?? this.ctl.media.status.duration) - this.ctl.media.state.currentTime), this.config.next),
      v = this.ctl.config.playlist[this.ctl.state.currentPlaylistIndex + 1],
      toastsPlug = this.ctl.getPlug<ToastsPlug>("toasts"),
      timePlug = this.ctl.getPlug<TimePlug>("time");
    const nVTId = toastsPlug?.toast?.("", {
      autoClose: count * 1000,
      hideProgressBar: false,
      position: "bottom-right",
      bodyHTML: `<span title="Play next video" class="tmg-video-next-preview-wrapper">
        <button type="button"><svg viewBox="0 0 25 25"><path d="M8,5.14V19.14L19,12.14L8,5.14Z" /></svg></button>
        <video class="tmg-video-next-preview" poster="${v.media?.artwork?.[0]?.src}" src="${v.src || ""}" muted playsinline webkit-playsinline preload="metadata"></video>
        <p>${timePlug?.toTimeText(NaN) ?? "0:00"}</p>
      </span>
      <span class="tmg-video-next-info">
        <h2>Next Video in <span class="tmg-video-next-countdown">${count}</span></h2>
        ${v.media.title ? `<p class="tmg-video-next-title">${v.media.title}</p>` : ""}
      </span>`,
      onTimeUpdate: (time: number) => {
        const el = this.ctl.queryDOM(".tmg-video-next-countdown");
        if (el) el.textContent = String(Math.round((count * 1000 - time) / 1000) || 1);
      },
      onClose: (timeElapsed: boolean) => (removeListeners(), timeElapsed && this.ctl.getPlug<PlaylistPlug>("playlist")?.nextVideo()),
      tag: "tmg-anvi",
    });
    const cleanUp = (permanent = false) => (nVTId && window.t007?.toast.dismiss(nVTId, "instant"), (this.nextVideoPreview = null), (this.canAutoMovePlaylist = !permanent)),
      cleanUpWhenNeeded = () => !this.ctl.media.element.ended && cleanUp(),
      autoCleanUpToast = () => Math.floor((this.ctl.config.settings.time.end ?? this.ctl.media.status.duration) - this.ctl.media.state.currentTime) > this.config.next && cleanUp(),
      removeListeners = () => ["timeupdate", "pause", "waiting"].forEach((e, i) => this.ctl.media.element.removeEventListener(e, !i ? autoCleanUpToast : cleanUpWhenNeeded));
    ["timeupdate", "pause", "waiting"].forEach((e, i) => this.ctl.media.element.addEventListener(e, !i ? autoCleanUpToast : cleanUpWhenNeeded));
    const nVP = (this.nextVideoPreview = this.ctl.queryDOM<HTMLVideoElement>(".tmg-video-next-preview"))!;
    if (v.sources?.length) addSources(v.sources, nVP);
    ["loadedmetadata", "loaded", "durationchange"].forEach((e) => nVP?.addEventListener(e, ({ target: p }) => ((p as HTMLVideoElement).nextElementSibling!.textContent = timePlug?.toTimeText((p as HTMLVideoElement).duration) ?? "0:00")));
    this.ctl.config.settings.auto.nextVideoPreview = this.config.nextVideoPreview;
    nVP?.previousElementSibling?.addEventListener("click", () => (cleanUp(true), this.ctl.getPlug<PlaylistPlug>("playlist")?.nextVideo()), { capture: true });
  };
}
