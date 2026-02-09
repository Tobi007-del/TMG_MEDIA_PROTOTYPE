import { RangeSlider, type RangeConfig, type RangeState } from "./";
import { createEl, clamp, safeNum, setTimeout, formatMediaTime, getRenderedBox, IS_MOBILE } from "../utils";
import type { Controller } from "../core/controller";
import type { Event } from "../types/reactor";
import type { Media } from "../types/contract";
import type { TimePlug } from "../plugs";

export type PreviewConfig =
  | boolean
  | {
      address?: string;
      cols?: number;
      rows?: number;
      spf?: number;
      type?: "sprite" | "image" | "canvas" | "none";
    };

export interface TimelineConfig extends RangeConfig {
  previews: PreviewConfig;
}

export class Timeline extends RangeSlider<TimelineConfig> {
  public static readonly componentName: string = "timeline";
  public static readonly isControl: boolean = true;
  protected plug?: TimePlug;
  protected timeline!: HTMLElement;
  protected previewContainer!: HTMLElement;
  protected previewImg!: HTMLElement;
  protected previewCanvas!: HTMLCanvasElement;
  protected thumbnailImg!: HTMLElement;
  protected thumbnailCanvas!: HTMLCanvasElement;
  protected bufferedBar!: HTMLElement;
  protected previewBar!: HTMLElement;
  protected previewContext: CanvasRenderingContext2D | null = null;
  protected thumbnailContext: CanvasRenderingContext2D | null = null;

  constructor(ctl: Controller, options: Partial<TimelineConfig> = {}) {
    super(ctl, { label: "Video timeline", ...{ ...options, previews: options.previews } });
  }

  public override create() {
    const element = super.create();
    this.thumbnailImg = createEl("div", { className: "tmg-video-thumbnail" });
    this.thumbnailCanvas = createEl("canvas", { className: "tmg-video-thumbnail" });
    this.timeline = createEl("div", { className: "tmg-video-timeline" });
    this.bufferedBar = createEl("div", { className: "tmg-video-bar tmg-video-buffered-bar" });
    this.previewBar = createEl("div", { className: "tmg-video-bar tmg-video-preview-bar" });
    this.previewContainer = createEl("div", { className: "tmg-video-preview-container" });
    this.previewImg = createEl("div", { className: "tmg-video-preview" });
    this.previewCanvas = createEl("canvas", { className: "tmg-video-preview" });
    this.previewContainer.append(this.previewImg, this.previewCanvas);
    this.barsWrapper.append(this.bufferedBar, this.previewBar);
    this.barsWrapper.replaceWith(this.timeline);
    this.timeline.append(this.barsWrapper, this.previewContainer);
    this.container.dataset.controlId = this.name;
    return element;
  }

  public mount(): void {
    this.ctl.DOM.controlsContainer?.prepend(this.thumbnailImg, this.thumbnailCanvas);
    this.previewContext = this.previewCanvas.getContext("2d");
    this.thumbnailContext = this.thumbnailCanvas.getContext("2d");
  }

  public override wire(): void {
    super.wire();
    this.plug = this.ctl.getPlug<TimePlug>("time");
    this.ctl.media.on("status.loadedMetadata", this.handleLoadedMetadata, { signal: this.signal, immediate: true });
    this.ctl.media.on("state.currentTime", this.handleTimeUpdate, { signal: this.signal, immediate: true });
    this.ctl.media.on("status.buffered", this.handleProgress, { signal: this.signal, immediate: true });
    this.ctl.media.on("status.duration", this.handleDurationChange, { signal: this.signal, immediate: true });
    this.ctl.state.on("dimensions.container", this.syncThumbnailSize, { signal: this.signal, immediate: true });
    this.ctl.config.on("settings.time.format", this.updatePreviewTime, { signal: this.signal, immediate: true });
    this.ctl.config.on("settings.time.mode", this.updatePreviewTime, { signal: this.signal });
    this.ctl.config.watch("settings.time.previews", (value) => (this.config.previews = value!), { signal: this.signal, immediate: true });
    this.ctl.config.watch("settings.time.seekSync", (value) => (this.config.scrub.sync = value!), { signal: this.signal, immediate: true });
    this.ctl.config.on("settings.css.currentThumbnailWidth", ({ value }) => (this.thumbnailCanvas.width = Number(value)), { signal: this.signal, immediate: true });
    this.ctl.config.on("settings.css.currentThumbnailHeight", ({ value }) => (this.thumbnailCanvas.height = Number(value)), { signal: this.signal, immediate: true });
    this.state.on("scrubbing", this.handleScrubbingChange, { signal: this.signal });
    this.config.on("previewValue", this.updatePreviewTime, { signal: this.signal });
    this.config.on("previews", this.handlePreviewChange, { signal: this.signal, immediate: true });
  }
  protected override seek(value: number): void {
    super.seek(value);
    this.ctl.media.intent.currentTime = safeNum((value / 100) * this.ctl.media.status.duration);
  }

  protected handleLoadedMetadata(): void {
    this.ctl.pseudoVideo.addEventListener("timeupdate", (e) => ((e.target as any).ontimeupdate = this.syncCanvasPreviews), { signal: this.signal, once: true }); // anonymous low cost
  }
  protected handleTimeUpdate({ target }: Event<Media, "state.currentTime">): void {
    if (this.state.scrubbing) return;
    const duration = safeNum(this.ctl.media.status.duration, 60);
    this.config.value = safeNum(target.value! / duration) * 100;
    this.container.ariaValueText = `${formatMediaTime({ time: target.value, format: "human-long" })} out of ${formatMediaTime({ time: duration, format: "human-long" })}`;
  }
  protected handleProgress(): void {
    const buffered = this.ctl.media.status.buffered;
    for (let i = 0; i < buffered.length; i++) {
      if (buffered.start(buffered.length - 1 - i) < this.ctl.media.state.currentTime) {
        this.bufferedBar.style.width = `${safeNum(buffered.end(buffered.length - 1 - i) / this.ctl.media.status.duration) * 100}%`;
        break;
      }
    }
  }
  protected handleDurationChange({ target }: Event<Media, "status.duration">): void {
    this.container.ariaValueMax = String(Math.floor(target.value!));
  }

  protected handleScrubbingChange({ target }: Event<RangeState, "scrubbing">): void {
    this.ctl.videoContainer.classList.toggle("tmg-video-scrubbing", target.value);
    if (!target.value) this.stopPreview();
  }
  protected handlePreviewChange({ target }: Event<TimelineConfig, "previews">): void {
    const value = target.value === true ? {} : target.value;
    if (!value) return void (this.ctl.videoContainer.dataset.previewType = "none");
    const manual = value.address && (value.spf || (value.cols && value.rows)),
      type = manual ? (value.cols && value.rows ? "sprite" : "image") : "canvas";
    this.ctl.videoContainer.dataset.previewType = type;
    if (type === "sprite" && value.address) this.ctl.config.settings.css.currentPreviewUrl = this.ctl.config.settings.css.currentThumbnailUrl = `url(${value.address})`;
    else this.ctl.config.settings.css.currentPreviewPosition = this.ctl.config.settings.css.currentThumbnailPosition = "center";
    if (this.ctl.media.status.loadedMetadata) return;
    (this.ctl.setCanvasFallback(this.previewCanvas, this.previewContext!), this.ctl.setCanvasFallback(this.thumbnailCanvas, this.thumbnailContext!));
    this.ctl.pseudoVideo.ontimeupdate = null;
  }

  public override stopScrubbing(): void {
    if (!this.state.scrubbing) return;
    if (!this.state.shouldCancelScrub) this.ctl.media.intent.currentTime = this.config.value;
    super.stopScrubbing();
  }
  protected stopPreview(): void {
    setTimeout(() => this.ctl.videoContainer.classList.remove("tmg-video-previewing"), 0, this.signal);
  }

  protected onInput(e: MouseEvent | PointerEvent, pos: number): void {
    this.ctl.videoContainer.classList.add("tmg-video-previewing");
    const { offsetLeft: pLeft, offsetWidth: pWidth } = this.previewContainer,
      previewImgMin = pWidth / 2 / this.rect.width;
    const previewImgPos = clamp(previewImgMin, pos, 1 - previewImgMin);
    this.previewContainer.style.left = `${previewImgPos * 100}%`;
    const arrowBW = 5,
      arrowPositionMin = Math.max(arrowBW / 5, 5),
      arrowPos = pos < previewImgMin ? `${Math.max(pos * this.rect.width, arrowPositionMin + arrowBW / 2 + 1)}px` : pos > 1 - previewImgMin ? `${Math.min(pWidth / 2 + pos * this.rect.width - pLeft, pWidth - arrowPositionMin - arrowBW - 1)}px` : "50%";
    this.previewContainer.style.setProperty("--arrow-position", arrowPos);
    this.previewBar.style.width = `${pos * 100}%`;

    const previewConfig = this.config.previews,
      type = this.ctl.videoContainer.dataset.previewType;
    if (type === "sprite" && previewConfig && typeof previewConfig !== "boolean" && previewConfig.cols && previewConfig.rows) {
      const duration = this.ctl.media.status.duration,
        spf = previewConfig.spf || 1,
        frameIndex = Math.floor((pos * (duration || 0)) / spf) || 1,
        { cols, rows } = previewConfig,
        clampedI = Math.min(frameIndex, cols * rows - 1),
        xPercent = ((clampedI % cols) * 100) / (cols - 1 || 1),
        yPercent = (Math.floor(clampedI / cols) * 100) / (rows - 1 || 1);
      if (!IS_MOBILE) this.ctl.config.settings.css.currentPreviewPosition = `${xPercent}% ${yPercent}%`;
      if (this.state.scrubbing) this.ctl.config.settings.css.currentThumbnailPosition = `${xPercent}% ${yPercent}%`;
    } else if (type === "image" && previewConfig && typeof previewConfig !== "boolean" && previewConfig.address) {
      const duration = this.ctl.media.status.duration,
        spf = previewConfig.spf || 1,
        frameIndex = Math.floor((pos * (duration || 0)) / spf) || 1,
        url = `url(${previewConfig.address.replace("$", String(frameIndex))})`;
      if (!IS_MOBILE) this.ctl.config.settings.css.currentPreviewUrl = url;
      if (this.state.scrubbing) this.ctl.config.settings.css.currentThumbnailUrl = url;
    } else if (previewConfig && !this.ctl.state.frameReadyPromise && this.ctl.pseudoVideo) {
      const duration = this.ctl.media.status.duration;
      this.ctl.pseudoVideo.currentTime = pos * (duration || 0);
    }
  }

  protected updatePreviewTime(): void {
    if (this.plug) this.previewContainer.dataset.previewTime = this.plug.toTimeText(this.config.previewValue, true);
  }
  protected syncCanvasPreviews(): void {
    if (!this.ctl.media.status.loadedData || !this.ctl.pseudoVideo) return;
    this.ctl.throttle(
      "canvasPreviewSync",
      () => {
        const pseudoVideo = this.ctl.pseudoVideo;
        if (!pseudoVideo || !this.previewContext || !this.thumbnailContext) return;
        this.previewCanvas.width = this.previewCanvas.offsetWidth || this.previewCanvas.width;
        this.previewCanvas.height = this.previewCanvas.offsetHeight || this.previewCanvas.height;
        this.previewContext.drawImage(pseudoVideo, 0, 0, this.previewCanvas.width, this.previewCanvas.height);
        if (this.state.scrubbing) this.thumbnailContext.drawImage(pseudoVideo, 0, 0, this.thumbnailCanvas.width, this.thumbnailCanvas.height);
      },
      33
    );
  }
  protected syncThumbnailSize(): void {
    if (!this.thumbnailCanvas || !this.thumbnailImg) return;
    const { width = this.ctl.videoContainer.offsetWidth, height = this.ctl.videoContainer.offsetHeight } = getRenderedBox(this.ctl.media.element);
    this.ctl.config.settings.css.currentThumbnailHeight = height + 1 + "px";
    this.ctl.config.settings.css.currentThumbnailWidth = width + 1 + "px";
  }
}
