import { RangeSlider, type RangeConfig, type RangeState } from "./";
import { createEl, clamp, safeNum, setTimeout, formatMediaTime, getRenderedBox, IS_MOBILE } from "../utils";
import type { Controller } from "../core/controller";
import type { REvent } from "../types/reactor";
import type { CtlrMedia } from "../types/contract";
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
  public timeline!: HTMLElement;
  public bufferedBar!: HTMLElement;
  public previewBar!: HTMLElement;
  public previewContainer!: HTMLElement;
  public previewImg!: HTMLElement;
  public previewCanvas!: HTMLCanvasElement;
  public thumbnailImg!: HTMLElement;
  public thumbnailCanvas!: HTMLCanvasElement;
  public previewContext: CanvasRenderingContext2D | null = null;
  public thumbnailContext: CanvasRenderingContext2D | null = null;
  protected plug?: TimePlug;
  protected wasPaused = false;
  protected scrubbingId = -1;

  constructor(ctlr: Controller, options: Partial<TimelineConfig> = {}) {
    super(ctlr, { label: "Video timeline", ...options });
  }

  public override create() {
    // Variables Assignments
    const element = super.create();
    this.timeline = createEl("div", { className: "tmg-video-timeline" });
    this.bufferedBar = createEl("div", { className: "tmg-video-bar tmg-video-buffered-bar" });
    this.previewBar = createEl("div", { className: "tmg-video-bar tmg-video-preview-bar" });
    this.previewContainer = createEl("div", { className: "tmg-video-preview-container" });
    this.previewImg = createEl("div", { className: "tmg-video-preview" });
    this.previewCanvas = createEl("canvas", { className: "tmg-video-preview" });
    this.thumbnailImg = createEl("div", { className: "tmg-video-thumbnail" });
    this.thumbnailCanvas = createEl("canvas", { className: "tmg-video-thumbnail" });
    this.container.dataset.controlId = this.name;
    // DOM Injection
    this.previewContainer.append(this.previewImg, this.previewCanvas);
    this.barsWrapper.append(this.bufferedBar, this.previewBar);
    this.barsWrapper.replaceWith(this.timeline);
    this.timeline.append(this.barsWrapper, this.previewContainer);
    return element;
  }

  public mount(): void {
    // Variables Assignments
    this.previewContext = this.previewCanvas.getContext("2d");
    this.thumbnailContext = this.thumbnailCanvas.getContext("2d");
    // DOM Injection
    this.ctlr.DOM.controlsContainer?.prepend(this.thumbnailImg, this.thumbnailCanvas);
  }

  public override wire(): void {
    super.wire();
    // Variables Assignments
    this.plug = this.ctlr.getPlug<TimePlug>("time");
    // State Listeners
    this.state.on("scrubbing", this.handleScrubbingChange, { signal: this.signal });
    // Config --------
    this.config.on("previewValue", this.updatePreviewTime, { signal: this.signal });
    this.config.on("previews", this.handlePreviewChange, { signal: this.signal });
    // Ctlr Config Watchers
    this.ctlr.config.watch("settings.time.previews", (value) => (this.config.previews = value!), { signal: this.signal, immediate: true });
    this.ctlr.config.watch("settings.time.seekSync", (value) => (this.config.scrub.sync = value!), { signal: this.signal, immediate: true });
    // ---- Media Listeners
    this.media.on("state.paused", this.handlePausedState, { signal: this.signal, immediate: true });
    this.media.on("state.currentTime", this.handleCurrentTimeState, { signal: this.signal, immediate: true });
    this.media.on("status.loadedMetadata", this.handleLoadedMetadataStatus, { signal: this.signal, immediate: true });
    this.media.on("status.buffered", this.handleBufferedStatus, { signal: this.signal, immediate: true });
    this.media.on("status.duration", this.handleDurationStatus, { signal: this.signal, immediate: true });
    this.media.on("status.error", this.handleErrorStatus, { signal: this.signal, immediate: true });
    // ---- State ---------
    this.ctlr.state.on("dimensions.container", this.syncThumbnailSize, { signal: this.signal, immediate: true });
    // ---- Config --------
    this.ctlr.config.on("settings.time.format", this.updatePreviewTime, { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.time.mode", this.updatePreviewTime, { signal: this.signal });
    this.ctlr.config.on("settings.css.currentThumbnailWidth", ({ value }) => (this.thumbnailCanvas.width = Number(value)), { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.css.currentThumbnailHeight", ({ value }) => (this.thumbnailCanvas.height = Number(value)), { signal: this.signal, immediate: true });
  }
  protected override seek(value: number): void {
    super.seek(value);
    this.media.intent.currentTime = safeNum((value / 100) * this.media.status.duration);
  }

  protected handlePausedState({ value }: REvent<CtlrMedia, "state.paused">): void {
    !value ? this.ctlr.RAFLoop("timelineUpdating", this.handleTimeUpdateLoop) : this.ctlr.cancelRAFLoop("timelineUpdating");
  }
  protected handleCurrentTimeState({ target }: REvent<CtlrMedia, "state.currentTime">): void {
    if (this.state.scrubbing) return;
    if (this.media.state.paused) this.handleTimeUpdateLoop(false);
    this.container.ariaValueText = `${formatMediaTime({ time: target.value, format: "human-long" })} out of ${formatMediaTime({ time: this.media.status.duration, format: "human-long" })}`;
  }
  protected handleLoadedMetadataStatus(): void {
    this.ctlr.pseudoVideo.addEventListener("timeupdate", (e) => ((e.target as any).ontimeupdate = this.syncCanvasPreviews), { signal: this.signal, once: true }); // anonymous low cost
  }
  protected handleBufferedStatus(): void {
    const buffered = this.media.status.buffered;
    for (let i = 0; i < buffered.length; i++) {
      if (buffered.start(buffered.length - 1 - i) < this.media.state.currentTime) {
        this.bufferedBar.style.width = `${safeNum(buffered.end(buffered.length - 1 - i) / this.media.status.duration) * 100}%`;
        break;
      }
    }
  }
  protected handleDurationStatus({ value }: REvent<CtlrMedia, "status.duration">): void {
    this.container.ariaValueMax = String(Math.floor(value));
  }
  protected handleErrorStatus({ value }: REvent<CtlrMedia, "status.error">): void {
    if (value) this.bufferedBar.style.width = "0";
  }
  protected handleTimeUpdateLoop(optimize = true): void {
    if (optimize && !this.ctlr.state.mediaIntersecting) return;
    const duration = safeNum(this.media.status.duration, 60);
    if (!this.state.scrubbing) this.config.value = safeNum(this.media.state.currentTime / duration) * 100;
  }

  protected handleScrubbingChange({ value }: REvent<RangeState, "scrubbing">): void {
    if (!value) {
      this.media.intent.paused = this.wasPaused;
      cancelAnimationFrame(this.scrubbingId);
      this.ctlr.videoContainer.classList.remove("tmg-video-scrubbing");
      // this.ctlr.DOM.scrubNotifier?.classList.remove("tmg-video-control-active");
    } else {
      this.wasPaused = this.media.state.paused;
      this.scrubbingId = requestAnimationFrame(() => {
        this.media.intent.paused = true;
        this.ctlr.videoContainer.classList.add("tmg-video-scrubbing");
        // IS_MOBILE && this.ctlr.DOM.scrubNotifier?.classList.add("tmg-video-control-active");
      });
    }
    this.ctlr.videoContainer.classList.toggle("tmg-video-scrubbing", value);
    if (!value) this.stopPreview();
  }
  protected handlePreviewChange({ target }: REvent<TimelineConfig, "previews">): void {
    const value = target.value === true ? {} : target.value;
    if (!value) return void (this.ctlr.videoContainer.dataset.previewType = "none");
    const manual = value.address && (value.spf || (value.cols && value.rows)),
      type = manual ? (value.cols && value.rows ? "sprite" : "image") : "canvas";
    this.ctlr.videoContainer.dataset.previewType = type;
    if (type === "sprite" && value.address) this.ctlr.settings.css.currentPreviewUrl = this.ctlr.settings.css.currentThumbnailUrl = `url(${value.address})`;
    else this.ctlr.settings.css.currentPreviewPosition = this.ctlr.settings.css.currentThumbnailPosition = "center";
    if (this.media.status.loadedMetadata) return;
    (this.ctlr.setCanvasFallback(this.previewCanvas, this.previewContext!), this.ctlr.setCanvasFallback(this.thumbnailCanvas, this.thumbnailContext!));
    this.ctlr.pseudoVideo.ontimeupdate = null;
  }

  public override stopScrubbing(): void {
    if (!this.state.scrubbing) return;
    if (!this.state.shouldCancelScrub) this.media.intent.currentTime = this.config.value;
    super.stopScrubbing();
  }
  protected stopPreview(): void {
    setTimeout(() => this.ctlr.videoContainer.classList.remove("tmg-video-previewing"), 0, this.signal);
  }

  protected onInput(e: MouseEvent | PointerEvent, pos: number): void {
    this.ctlr.videoContainer.classList.add("tmg-video-previewing");
    const previewImgMin = this.previewContainer.offsetWidth / 2 / this.rect.width,
      previewImgPos = clamp(previewImgMin, pos, 1 - previewImgMin);
    this.previewContainer.style.left = `${previewImgPos * 100}%`;
    this.previewBar.style.width = `${pos * 100}%`;

    const previewConfig = this.config.previews,
      type = this.ctlr.videoContainer.dataset.previewType;
    if (type === "sprite" && previewConfig && typeof previewConfig !== "boolean" && previewConfig.cols && previewConfig.rows) {
      const duration = this.media.status.duration,
        spf = previewConfig.spf || 1,
        frameIndex = Math.floor((pos * (duration || 0)) / spf) || 1,
        { cols, rows } = previewConfig,
        clampedI = Math.min(frameIndex, cols * rows - 1),
        xPercent = ((clampedI % cols) * 100) / (cols - 1 || 1),
        yPercent = (Math.floor(clampedI / cols) * 100) / (rows - 1 || 1);
      if (!IS_MOBILE) this.ctlr.settings.css.currentPreviewPosition = `${xPercent}% ${yPercent}%`;
      if (this.state.scrubbing) this.ctlr.settings.css.currentThumbnailPosition = `${xPercent}% ${yPercent}%`;
    } else if (type === "image" && previewConfig && typeof previewConfig !== "boolean" && previewConfig.address) {
      const duration = this.media.status.duration,
        spf = previewConfig.spf || 1,
        frameIndex = Math.floor((pos * (duration || 0)) / spf) || 1,
        url = `url(${previewConfig.address.replace("$", String(frameIndex))})`;
      if (!IS_MOBILE) this.ctlr.settings.css.currentPreviewUrl = url;
      if (this.state.scrubbing) this.ctlr.settings.css.currentThumbnailUrl = url;
    } else if (previewConfig && !this.ctlr.state.frameReadyPromise && this.ctlr.pseudoVideo) {
      const duration = this.media.status.duration;
      this.ctlr.pseudoVideo.currentTime = pos * (duration || 0);
    }
  }

  protected updatePreviewTime(): void {
    if (this.plug) this.previewContainer.dataset.previewTime = this.plug.toTimeText(this.config.previewValue, true);
  }
  protected syncCanvasPreviews(): void {
    if (!this.media.status.loadedData || this.ctlr.state.frameReadyPromise || !this.ctlr.pseudoVideo) return;
    this.ctlr.throttle(
      "canvasPreviewSync",
      () => {
        const pseudoVideo = this.ctlr.pseudoVideo;
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
    const { width = this.ctlr.videoContainer.offsetWidth, height = this.ctlr.videoContainer.offsetHeight } = getRenderedBox(this.media.element);
    this.ctlr.settings.css.currentThumbnailHeight = height + 1 + "px";
    this.ctlr.settings.css.currentThumbnailWidth = width + 1 + "px";
  }
}
