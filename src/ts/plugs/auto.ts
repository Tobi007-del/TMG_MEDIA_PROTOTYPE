import { BasePlug } from ".";
import type { Event } from "../core/reactor";
import { VideoBuild } from "../types/build";
import { CMedia } from "../types/contract";
import type { AptAutoplayOption, PosterPreview } from "../types/generics";
import type { PlaylistPlug } from "./playlist";
import type { ToastsPlug } from "./toasts";
import type { TimePlug } from "./time";
import { clamp, addSources } from "../utils";

export interface Auto {
  play: boolean | AptAutoplayOption;
  pause: boolean | AptAutoplayOption;
  next: {
    value: number; // -1 for false
    videoPreview: PosterPreview;
  };
}

export class AutoPlug extends BasePlug<Auto> {
  public static readonly plugName: string = "auto";
  protected nextVideoPreview: HTMLVideoElement | null = null;
  protected canAutoMovePlaylist = true;

  public wire(): void {
    this.ctlr.config.watch("settings.auto.play", this.forwardAutoPlay, { signal: this.signal, immediate: true });
    this.ctlr.state.on("mediaParentIntersecting", this.handleIntersectionChange, { signal: this.signal });
    this.ctlr.media.on("state.currentTime", this.handleTimeUpdate, { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.auto.next.videoPreview.usePoster", this.handleUsePoster, { signal: this.signal });
    this.ctlr.config.on("settings.auto.next.videoPreview.tease", this.handleTease, { signal: this.signal });
    this.ctlr.config.on("settings.auto.next.videoPreview.time", this.handlePreviewTime, { signal: this.signal });
  }

  protected forwardAutoPlay(value?: boolean | AptAutoplayOption): void {
    this.ctlr.media.element.autoplay = typeof value === "string" ? false : !!value;
  }

  protected handleIntersectionChange(): void {
    this.handleMediaAptAutoPlay(this.config.pause, false);
    this.handleMediaAptAutoPlay();
  }

  protected handleTimeUpdate({ target }: Event<CMedia, "state.currentTime">): void {
    const dur = this.ctlr.media.status.duration,
      curr = target.value!;
    if (this.ctlr.media.status.readyState && curr && Math.floor((this.ctlr.config.settings.time.end ?? dur) - curr) <= this.config.next.value) this.autonextVideo();
  }

  protected handleUsePoster({ target: { value } }: Event<VideoBuild, "settings.auto.next.videoPreview.usePoster">): void {
    if (!this.nextVideoPreview || (value && this.nextVideoPreview.poster)) return;
    if (this.config.next.videoPreview.tease) this.ctlr.config.settings.auto.next.videoPreview.tease = this.config.next.videoPreview.tease;
    else this.ctlr.config.settings.auto.next.videoPreview.time = this.config.next.videoPreview.time;
  }

  protected handleTease({ target: { value } }: Event<VideoBuild, "settings.auto.next.videoPreview.tease">): void {
    if (!this.nextVideoPreview) return;
    this.nextVideoPreview.ontimeupdate = () => this.nextVideoPreview && Number(this.nextVideoPreview.currentTime) >= this.config.next.videoPreview.time && this.nextVideoPreview.pause();
    if (value && (!this.config.next.videoPreview.usePoster || !this.nextVideoPreview.poster)) this.nextVideoPreview.play();
  }

  protected handlePreviewTime({ target: { value } }: Event<VideoBuild, "settings.auto.next.videoPreview.time">): void {
    if (!this.nextVideoPreview || (this.config.next.videoPreview.usePoster && this.nextVideoPreview.poster)) return;
    this.nextVideoPreview.currentTime = Number(value);
  }

  protected handleMediaAptAutoPlay(auto = this.config.play, bool = true, p = this.ctlr.state.mediaParentIntersecting ? "in" : "out"): void {
    if (auto === `${p}-view-always`) this.ctlr.media.intent.paused = !bool;
    else if (auto === `${p}-view` && this.ctlr.state.readyState < 3) this.ctlr.media.intent.paused = !bool;
  }

  protected autonextVideo = (): void => {
    if (!this.ctlr.media.status.loadedMetadata || !this.ctlr.config.playlist || this.config.next.value < 0 || !this.canAutoMovePlaylist || this.ctlr.state.currentPlaylistIndex >= this.ctlr.config.playlist.length - 1 || this.ctlr.media.state.paused || this.ctlr.media.status.waiting) return;
    this.canAutoMovePlaylist = false;
    const count = clamp(1, Math.round((this.ctlr.config.settings.time.end ?? this.ctlr.media.status.duration) - this.ctlr.media.state.currentTime), this.config.next.value),
      v = this.ctlr.config.playlist[this.ctlr.state.currentPlaylistIndex + 1],
      toastsPlug = this.ctlr.getPlug<ToastsPlug>("toasts"),
      timePlug = this.ctlr.getPlug<TimePlug>("time");
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
        const el = this.ctlr.queryDOM(".tmg-video-next-countdown");
        if (el) el.textContent = String(Math.round((count * 1000 - time) / 1000) || 1);
      },
      onClose: (timeElapsed: boolean) => (removeListeners(), timeElapsed && this.ctlr.getPlug<PlaylistPlug>("playlist")?.nextVideo()),
      tag: "tmg-anvi",
    });
    const cleanUp = (permanent = false) => (nVTId && window.t007?.toast.dismiss(nVTId, "instant"), (this.nextVideoPreview = null), (this.canAutoMovePlaylist = !permanent)),
      cleanUpWhenNeeded = () => !this.ctlr.media.element.ended && cleanUp(),
      autoCleanUpToast = () => Math.floor((this.ctlr.config.settings.time.end ?? this.ctlr.media.status.duration) - this.ctlr.media.state.currentTime) > this.config.next.value && cleanUp(),
      removeListeners = () => ["timeupdate", "pause", "waiting"].forEach((e, i) => this.ctlr.media.element.removeEventListener(e, !i ? autoCleanUpToast : cleanUpWhenNeeded));
    ["timeupdate", "pause", "waiting"].forEach((e, i) => this.ctlr.media.element.addEventListener(e, !i ? autoCleanUpToast : cleanUpWhenNeeded));
    const nVP = (this.nextVideoPreview = this.ctlr.queryDOM<HTMLVideoElement>(".tmg-video-next-preview"))!;
    if (v.sources?.length) addSources(v.sources, nVP);
    ["loadedmetadata", "loaded", "durationchange"].forEach((e) => nVP?.addEventListener(e, ({ target: p }) => ((p as HTMLVideoElement).nextElementSibling!.textContent = timePlug?.toTimeText((p as HTMLVideoElement).duration) ?? "0:00")));
    this.ctlr.config.settings.auto.next.videoPreview = this.config.next.videoPreview; // force update
    nVP?.previousElementSibling?.addEventListener("click", () => (cleanUp(true), this.ctlr.getPlug<PlaylistPlug>("playlist")?.nextVideo()), { capture: true });
  };
}
