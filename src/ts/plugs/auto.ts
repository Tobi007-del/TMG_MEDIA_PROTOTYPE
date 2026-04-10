import { BasePlug, PlaylistPlug, ToastsPlug, TimePlug } from ".";
import { type REvent, type DeepPartial } from "../sia-reactor";
import { CtlrConfig } from "../types/config";
import { CtlrMedia } from "../types/contract";
import type { AptAutoplayOption, PosterPreview } from "../types/generics";
import { isStr, clamp, addSources } from "../utils";

export interface Auto {
  play: boolean | AptAutoplayOption;
  pause: boolean | AptAutoplayOption;
  next: {
    value: number; // -1 for false
    preview: PosterPreview;
  };
}

export class AutoPlug extends BasePlug<Auto> {
  public static readonly plugName: string = "auto";
  protected nextVideoPreview: HTMLVideoElement | null = null;
  protected canAutoMovePlaylist = true;

  public wire(): void {
    // Ctlr Config Getters
    this.ctlr.config.get("settings.auto.play", () => this.media.state.autoplay, { signal: this.signal, lazy: true }); // VIRTUAL: reliable return value
    // ----------- Watchers
    this.ctlr.config.watch("settings.auto.play", this.forwardAutoPlay, { signal: this.signal, immediate: "auto" });
    // ---- Media Listeners
    this.media.on("state.currentTime", this.handleTimeUpdate, { signal: this.signal, immediate: true });
    // ---- State ---------
    this.ctlr.state.on("mediaParentIntersecting", this.handleIntersectionChange, { signal: this.signal });
    // ---- Config --------
    this.ctlr.config.on("settings.auto.next.preview.usePoster", this.handlePreviewUsePoster, { signal: this.signal });
    this.ctlr.config.on("settings.auto.next.preview.tease", this.handlePreviewTease, { signal: this.signal });
    this.ctlr.config.on("settings.auto.next.preview.time", this.handlePreviewTime, { signal: this.signal });
  }

  protected forwardAutoPlay(value?: boolean | AptAutoplayOption): void {
    this.media.intent.autoplay = isStr(value) ? false : !!value;
  }

  protected handleTimeUpdate({ value: curr }: REvent<CtlrMedia, "state.currentTime">): void {
    if (this.media.status.readyState && curr && this.ctlr.state.readyState > 1 && Math.floor((this.ctlr.settings.time.end ?? this.media.status.duration) - curr) <= this.config.next.value) this.autonextVideo();
  }

  protected handleIntersectionChange(): void {
    (this.mediaAptAutoplay(this.config.pause, false), this.mediaAptAutoplay());
  }

  protected handlePreviewUsePoster({ target: { value, object } }: REvent<CtlrConfig, "settings.auto.next.preview.usePoster">): void {
    if (!this.nextVideoPreview || (value && this.nextVideoPreview.poster)) return;
    if (object.tease) this.ctlr.settings.auto.next.preview.tease = true;
    else this.nextVideoPreview.currentTime = object.time;
  }

  protected handlePreviewTease({ target: { value, object } }: REvent<CtlrConfig, "settings.auto.next.preview.tease">): void {
    if (!this.nextVideoPreview) return;
    this.nextVideoPreview.ontimeupdate = () => this.nextVideoPreview && Number(this.nextVideoPreview.currentTime) >= object.time && this.nextVideoPreview.pause();
    if (value && (!object.usePoster || !this.nextVideoPreview.poster)) this.nextVideoPreview.play();
  }

  protected handlePreviewTime({ target: { value, object } }: REvent<CtlrConfig, "settings.auto.next.preview.time">): void {
    if (!this.nextVideoPreview || (object.usePoster && this.nextVideoPreview.poster)) return;
    this.nextVideoPreview.currentTime = Number(value);
  }

  protected mediaAptAutoplay(auto = this.config.play, bool = true, p = this.ctlr.state.mediaParentIntersecting ? "in" : "out"): void {
    if (auto === `${p}-view-always`) this.media.intent.paused = !bool;
    else if (auto === `${p}-view` && this.ctlr.state.readyState < 3) this.media.intent.paused = !bool;
  }

  protected autonextVideo = (): void => {
    if (!this.media.status.loadedMetadata || !this.ctlr.config.playlist || this.config.next.value < 0 || !this.canAutoMovePlaylist || this.ctlr.plug<PlaylistPlug>("playlist")!.currentIndex >= this.ctlr.config.playlist.length - 1 || this.media.state.paused || this.media.status.waiting) return;
    this.canAutoMovePlaylist = false;
    const count = clamp(1, Math.round((this.ctlr.settings.time.end ?? this.media.status.duration) - this.media.state.currentTime), this.config.next.value),
      v = this.ctlr.config.playlist[this.ctlr.plug<PlaylistPlug>("playlist")!.currentIndex + 1],
      toastsPlug = this.ctlr.plug<ToastsPlug>("toasts"),
      timePlug = this.ctlr.plug<TimePlug>("time");
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
      onClose: (timeElapsed) => (removeListeners(), timeElapsed && this.ctlr.plug<PlaylistPlug>("playlist")?.nextVideo()),
      tag: "tmg-anvi",
    });
    const cleanUp = (permanent = false) => (nVTId && window.t007?.toast.dismiss(nVTId, "instant"), (this.nextVideoPreview = null), (this.canAutoMovePlaylist = !permanent)),
      cleanUpWhenNeeded = () => !this.media.element.ended && cleanUp(),
      autoCleanUpToast = () => Math.floor((this.ctlr.settings.time.end ?? this.media.status.duration) - this.media.state.currentTime) > this.config.next.value && cleanUp(),
      removeListeners = () => ["timeupdate", "pause", "waiting"].forEach((e, i) => this.media.element.removeEventListener(e, !i ? autoCleanUpToast : cleanUpWhenNeeded));
    ["timeupdate", "pause", "waiting"].forEach((e, i) => this.media.element.addEventListener(e, !i ? autoCleanUpToast : cleanUpWhenNeeded));
    const nVP = (this.nextVideoPreview = this.ctlr.queryDOM<HTMLVideoElement>(".tmg-video-next-preview"))!;
    if (v.sources?.length) addSources(v.sources, nVP);
    ["loadedmetadata", "loaded", "durationchange"].forEach((e) => nVP?.addEventListener(e, ({ target: p }) => ((p as HTMLVideoElement).nextElementSibling!.textContent = timePlug?.toTimeText((p as HTMLVideoElement).duration) ?? "0:00")));
    this.ctlr.settings.auto.next.preview = this.config.next.preview; // force update
    nVP?.previousElementSibling?.addEventListener("click", () => (cleanUp(true), this.ctlr.plug<PlaylistPlug>("playlist")?.nextVideo()), { capture: true });
  };
}

export const AUTO_BUILD: DeepPartial<Auto> = {
  next: { value: 20, preview: { usePoster: true, time: 4, tease: true } },
};
