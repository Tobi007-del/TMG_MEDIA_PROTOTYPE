import { BaseComponent, ComponentState } from ".";
import { DeepPartial } from "sia-reactor";
import { capitalize, clamp, createEl, formatVttLine, isDef, isObj, isStr, parseIfPercent, parseVttText, safeNum, setTimeout } from "../utils";

export type CueLike = (TextTrackCue | { text: string }) & DeepPartial<{ id: string; text: string; align: string; region: { width: number; lines: number; viewportAnchorX: number; viewportAnchorY: number; scroll: string }; position: number | "auto"; positionAlign: string; line: number | string; lineAlign: string; snapToLines: boolean; size: number; vertical: "" | "lr" | "rl" }>;
type KaraokeNode = { el: HTMLElement; time: number };

export type CaptionsViewConfig = undefined;

export class CaptionsView extends BaseComponent<CaptionsViewConfig, ComponentState, HTMLDivElement> {
  public static readonly componentName: string = "captions";
  public static readonly isControl: boolean = false;
  protected isMain = false;
  protected lastCue: CueLike | null = null;
  protected karaokeNodes: KaraokeNode[] | null = null;
  protected lastPreview = "";
  protected previewTimeoutId = -1;
  protected charW = 0;
  protected lineHPx = 0;
  protected lastPosX = 0;
  protected lastPosY = 0;
  protected lastPtrX = 0;
  protected lastPtrY = 0;

  public override create(): HTMLDivElement {
    return (this.element = createEl("div", { className: "tmg-video-captions-container" }, { part: "region" }));
  }

  public override mount(): void {
    // DOM Injection
    this.ctlr.DOM.controlsContainer!.prepend(this.element);
  }

  public override wire(): void {
    //Variables Assignment
    this.isMain = this.element === this.ctlr.DOM.captionsContainer;
    // Event Listeners
    this.element.addEventListener("pointerdown", this.handleDragStart, { signal: this.signal });
    // Ctlr State Watchers
    this.ctlr.state.watch("dimensions.container.width", () => (this.syncSize(), this.preview("")), { signal: this.signal, immediate: true });
  }

  public syncSize(): void {
    this.element.style.setProperty("display", "block", "important");
    const measurer = createEl("span", { className: "tmg-video-captions-text", innerHTML: "abcdefghijklmnopqrstuvwxyz".repeat(2) }, {}, { visibility: "hidden" });
    this.element.append(measurer);
    this.charW = measurer.offsetWidth / 52;
    const { lineHeight, fontSize } = getComputedStyle(measurer);
    this.lineHPx = !safeNum(parseFloat(lineHeight), 0) ? safeNum(parseFloat(fontSize), 16) * 1.2 : parseFloat(lineHeight);
    (measurer.remove(), this.element.style.removeProperty("display"));
  }

  public preview(preview: CueLike | string = `${capitalize(this.ctlr.videoContainer.dataset.trackKind || "captions")} look like this`, flush = this.element.textContent.replace(/\s/g, "") === this.lastPreview?.replace(/\s/g, "")): void {
    const text = isStr(preview) ? preview : preview.text || "",
      should = flush || !this.ctlr.isUIActive("captions") || !this.element.textContent;
    should && this.ctlr.videoContainer.classList.add("tmg-video-captions-preview");
    this.render(should ? (isObj(preview) ? preview : { text: preview }) : this.lastCue);
    clearTimeout(this.previewTimeoutId);
    this.previewTimeoutId = setTimeout(
      (flush = this.element.textContent.replace(/\s/g, "") === text.replace(/\s/g, "")) => {
        this.ctlr.videoContainer.classList.remove("tmg-video-captions-preview");
        if (flush) this.element.innerHTML = "";
      },
      this.ctlr.settings.captions.previewTimeout,
      this.signal
    );
    this.lastPreview = text;
  }

  public render(cue: CueLike | null): void {
    const existing = this.element.querySelector<HTMLElement>(".tmg-video-captions-wrapper");
    if (!cue) return existing?.remove();
    const wrapper = existing ?? createEl("div", { className: "tmg-video-captions-wrapper", ariaLive: "off", ariaAtomic: "true" }, { part: "cue-display" }),
      { offsetWidth: vCWidth, offsetHeight: vCHeight } = this.ctlr.videoContainer,
      allowOverride = this.ctlr.settings.captions.allowVideoOverride || !this.isMain;
    ["style", "data-active", "data-scroll"].forEach((attr) => this.element.removeAttribute(attr));
    ((wrapper.innerHTML = ""), (cue.text ||= ""), (this.lastCue = cue));
    const lines = cue.text.replace(/(<br\s*\/>)|\\N/gi, "\n").split(/\n/);
    lines.forEach((p) => formatVttLine(p, Math.floor(vCWidth / this.charW)).forEach((l) => wrapper.append(createEl("div", { className: "tmg-video-captions-line" }, cue.id ? { part: "cue", id: cue.id } : { part: "cue" }, allowOverride && cue.align ? { textAlign: cue.align } : undefined)!.appendChild(createEl("span", { className: "tmg-video-captions-text", innerHTML: parseVttText(l) })!).parentElement!)));
    !existing && this.element.append(wrapper);
    const { offsetWidth: cWidth, offsetHeight: cHeight } = this.element;
    this.isMain ? (this.ctlr.settings.css.currentCaptionsContainerHeight = `${cHeight}px`) : this.element.style.setProperty("--tmg-video-current-captions-container-height", `${cHeight}px`);
    this.isMain ? (this.ctlr.settings.css.currentCaptionsContainerWidth = `${cWidth}px`) : this.element.style.setProperty("--tmg-video-current-captions-container-width", `${cWidth}px`);
    if (allowOverride) {
      if (cue.region) {
        this.element.setAttribute("data-active", "");
        const { width, lines: regionLines, viewportAnchorX: vpAnX, viewportAnchorY: vpAnY, scroll } = cue.region;
        if (isDef(vpAnX)) this.element.style.setProperty("--tmg-video-current-captions-x", `${vpAnX}%`);
        if (isDef(vpAnY)) this.element.style.setProperty("--tmg-video-current-captions-y", `${100 - Number(vpAnY)}%`);
        if (isDef(width)) this.element.style.maxWidth = `${width}%`;
        if (isDef(regionLines)) this.element.style.maxHeight = `${Number(regionLines) * ((this.lineHPx / vCHeight) * 100)}%`;
        if (scroll === "up") {
          this.element.style.maxHeight = `${regionLines! * ((this.lineHPx / vCHeight) * 100)}%`;
          this.element.dataset.scroll = scroll;
          this.ctlr.config.stall(() => (this.element.scrollTop = wrapper.scrollHeight));
        }
      } else {
        if (isDef(cue.position) && cue.position !== "auto") {
          const elHalfWPct = ((cWidth / vCWidth) * 100) / 2,
            posOffset = cue.positionAlign === "line-left" ? 0 : cue.positionAlign === "line-right" ? -2 * elHalfWPct : -elHalfWPct;
          this.element.style.setProperty("--tmg-video-current-captions-x", `calc(${cue.position}% + ${posOffset}% + ${elHalfWPct}%)`);
        }
        if (isDef(cue.line) && cue.line !== "auto") {
          const line = parseIfPercent(cue.line, 100),
            lhPct = (this.lineHPx / vCHeight) * 100,
            elHalfHPct = ((cHeight / vCHeight) * 100) / 2,
            lAlign = cue.lineAlign && cue.lineAlign !== "auto" ? cue.lineAlign : line < 0 ? "end" : "start",
            lineOffset = lAlign === "start" ? -2 * elHalfHPct : lAlign === "end" ? 0 : -elHalfHPct,
            bottomVal = cue.snapToLines ? (line < 0 ? (Math.abs(line) - 1) * lhPct : 100 - line * lhPct) : 100 - line;
          this.element.style.setProperty("--tmg-video-current-captions-y", `calc(${bottomVal}% + ${lineOffset}% + ${elHalfHPct}%)`);
        }
        if (isDef(cue.size) && cue.size !== 100) this.element.style.maxWidth = `${cue.size}%`;
      }
      if (cue.vertical) this.element.style.writingMode = cue.vertical === "lr" ? "vertical-lr" : "vertical-rl";
    }
    this.karaokeNodes = Array.from(wrapper.querySelectorAll<HTMLElement>("[data-part='timed']")).map((el) => {
      const [, m, s, ms] = (el.dataset.time || "").match(/(\d+):(\d+)\.(\d+)/) || [];
      return { el, time: m ? +m * 60 + +s + +ms / 1000 : 0 };
    });
    this.syncKaraoke();
  }

  public syncKaraoke(): void {
    if (!this.karaokeNodes) return;
    for (const { el, time } of this.karaokeNodes) {
      const isPast = this.media.state.currentTime > time;
      (el.toggleAttribute("data-past", isPast), el.toggleAttribute("data-future", !isPast));
    }
  }

  protected handleDragStart(e: PointerEvent): void {
    this.element.setPointerCapture(e.pointerId);
    const { left, bottom } = getComputedStyle(this.element);
    ((this.lastPosX = parseFloat(left)), (this.lastPosY = parseFloat(bottom)));
    ((this.lastPtrX = e.clientX), (this.lastPtrY = e.clientY));
    this.element.addEventListener("pointermove", this.handleDragging, { signal: this.signal });
    this.element.addEventListener("pointerup", this.handleDragEnd, { signal: this.signal });
  }

  protected handleDragging(e: PointerEvent): void {
    this.ctlr.videoContainer.classList.add("tmg-video-captions-dragging");
    this.ctlr.RAFLoop("captionsDragging", () => {
      const { offsetWidth: ww, offsetHeight: hh } = this.ctlr.videoContainer,
        { offsetWidth: w, offsetHeight: h } = this.element,
        posX = clamp(w / 2, this.lastPosX + (e.clientX - this.lastPtrX), ww - w / 2),
        posY = clamp(h / 2, this.lastPosY - (e.clientY - this.lastPtrY), hh - h / 2);
      this.isMain ? (this.ctlr.settings.css.currentCaptionsX = `${(posX / ww) * 100}%`) : this.element.style.setProperty("--tmg-video-current-captions-x", `${(posX / ww) * 100}%`);
      this.isMain ? (this.ctlr.settings.css.currentCaptionsY = `${(posY / hh) * 100}%`) : this.element.style.setProperty("--tmg-video-current-captions-y", `${(posY / hh) * 100}%`);
    });
  }

  protected handleDragEnd(): void {
    this.ctlr.cancelRAFLoop("captionsDragging");
    this.ctlr.videoContainer.classList.remove("tmg-video-captions-dragging");
    this.element.removeEventListener("pointermove", this.handleDragging);
    this.element.removeEventListener("pointerup", this.handleDragEnd);
  }
}
