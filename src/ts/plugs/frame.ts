import { BasePlug, type KeysPlug, type ToastsPlug } from ".";
import { createEl, clamp, parseCSSTime, formatMediaTime, getDominantColor, getRGBBri, getRGBSat, safeNum } from "../utils";

export interface Frame {
  disabled: boolean;
  fps: number;
  captureAutoClose: number;
}

export class FramePlug extends BasePlug<Frame> {
  public static readonly plugName: string = "frame";
  public exportCanvas: HTMLCanvasElement = createEl("canvas");
  public exportContext: CanvasRenderingContext2D = this.exportCanvas.getContext("2d", { willReadFrequently: true })!;

  public override wire(): void {
    // Post Wiring
    const keys = this.ctlr.plug<KeysPlug>("keys");
    keys?.register("capture", (e) => this.captureFrame(e.altKey ? "monochrome" : ""), { phase: "keyup" });
    keys?.register("stepFwd", () => this.moveFrame("forwards"), { phase: "keydown" });
    keys?.register("stepBwd", () => this.moveFrame("backwards"), { phase: "keydown" });
  }

  public async getFrame(display: any = "", time = safeNum(this.media.state.currentTime), raw = false, min = 0, video = this.ctlr.pseudoVideo): Promise<{ canvas: HTMLCanvasElement; context: CanvasRenderingContext2D } | { blob: Blob | false; url: string | false }> {
    if (video !== this.media.element) {
      await this.ctlr.state.frameReadyPromise; // wait for it to get set by last getter 5 lines below
      if (Math.abs(video.currentTime - time) > 0.01 || !video.readyState) {
        this.ctlr.state.frameReadyPromise ??= new Promise<null>((res) => video.addEventListener(video.readyState ? "timeupdate" : "loadeddata", () => res(null), { once: true, signal: this.signal }));
        video.currentTime = time; // small epsilon tolerance for video time comparison - 0.01(10ms)
      }
      this.ctlr.state.frameReadyPromise = await this.ctlr.state.frameReadyPromise;
    }
    ((this.exportCanvas.width = video.videoWidth || min), (this.exportCanvas.height = video.videoHeight || min));
    this.exportContext.filter = this.ctlr.settings.css.filter as string;
    display === "monochrome" && (this.exportContext.filter = `${this.exportContext.filter} grayscale(100%)`);
    this.exportContext.drawImage(video, 0, 0, this.exportCanvas.width, this.exportCanvas.height);
    this.exportContext.filter = "none";
    if (raw === true) return { canvas: this.exportCanvas, context: this.exportContext };
    const blob = (this.exportCanvas.width || this.exportCanvas.height) && (await new Promise<Blob | null>((res) => this.exportCanvas.toBlob(res)));
    return { blob: blob || false, url: blob ? URL.createObjectURL(blob) : false };
  }

  public async captureFrame(display: any = "", time = safeNum(this.media.state.currentTime)): Promise<void> {
    // JS: this.notify("capture");
    const toast = this.ctlr.plug<ToastsPlug>("toasts")?.toast,
      tTxt = formatMediaTime({ time, format: "human", showMs: true }),
      fTxt = `video frame ${display === "monochrome" ? "in b&w " : ""}at ${tTxt}`,
      frameToastId = toast?.loading(`Capturing ${fTxt}...`, { delay: parseCSSTime(this.ctlr.settings.css.notifiersAnimationTime), image: window.TMG_VIDEO_ALT_IMG_SRC, tag: `tmg-${this.ctlr.config.media.title ?? "Video"}fcpa${tTxt}${display}` }) as string,
      frame = (await this.getFrame(display, time, false, 0, this.media.element)) as { blob: Blob | false; url: string | false },
      filename = `${this.ctlr.config.media.title ?? "Video"}_${display === "monochrome" ? `black&white_` : ""}at_${tTxt}.png`.replace(/[\/:*?"<>|\s]+/g, "_"); // system filename safe
    const Save = () => {
      toast?.loading(frameToastId, { render: `Saving ${fTxt}`, actions: {} });
      createEl("a", { href: frame.url as string, download: filename })?.click?.();
      toast?.success(frameToastId, { delay: 1000, render: `Saved ${fTxt}`, actions: {} });
    };
    const Share = () => {
      toast?.loading(frameToastId, { render: `Sharing ${fTxt}`, actions: {} });
      navigator.share?.({ title: this.ctlr.config.media.title ?? "Video", text: `Captured ${fTxt}`, files: [new File([frame.blob as Blob], filename, { type: (frame.blob as Blob).type })] }).then(
        () => toast?.success(frameToastId, { render: `Shared ${fTxt}`, actions: {} }),
        () => toast?.error(frameToastId, { render: `Failed sharing ${fTxt}`, actions: { Save } })
      ) || toast?.warn(frameToastId, { delay: 1000, render: `Couldn't share ${fTxt}`, actions: { Save } });
    };
    frame?.url ? toast?.success(frameToastId, { render: `Captured ${fTxt}`, image: frame.url, autoClose: this.config.captureAutoClose, actions: { Save, Share }, onClose: () => URL.revokeObjectURL(frame.url as string) }) : toast?.error(frameToastId, { render: `Failed capturing ${fTxt}` });
  }

  public async findGoodTime({ time: t = safeNum(this.media.state.currentTime), secondsLimit: s = 25, saturation: sat = 12, brightness: bri = 40 } = {}): Promise<number | null> {
    const end = clamp(0, t + s, this.media.status.duration);
    for (; t <= end; t += 0.333) {
      const rgb = (await getDominantColor(((await this.getFrame("", t, true, 1)) as { canvas: HTMLCanvasElement }).canvas, "rgb", true)) as [number, number, number] | null;
      if (rgb && getRGBBri(rgb) > bri && getRGBSat(rgb) > sat) return t; // <= FIRST legit content frame
    }
    return null;
  }

  public async getMainColor(time?: number, poster = this.media.element.poster, config = {}): Promise<string | [number, number, number] | null> {
    return getDominantColor(poster ? poster : ((await this.getFrame("", time ? time : ((await this.findGoodTime(config)) ?? undefined), true, 1)) as { canvas: HTMLCanvasElement }).canvas);
  }

  public moveFrame(dir: "forwards" | "backwards" = "forwards"): void {
    this.media.state.paused && this.ctlr.throttle("frameStepping", () => (this.media.intent.currentTime = clamp(0, Math.round(this.media.state.currentTime * this.config.fps) + (dir === "backwards" ? -1 : 1), Math.floor(this.media.status.duration * this.config.fps)) / this.config.fps), Math.round(1000 / this.config.fps));
  }
}

export const FRAME_BUILD: Partial<Frame> = { disabled: false, fps: 30, captureAutoClose: 15000 };
