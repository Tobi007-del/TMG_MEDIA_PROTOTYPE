import { createEl } from "./dom";
import { isIter } from "./obj";

// ============ Video Utilities ============

// Types
interface Dimensions {
  width: number;
  height: number;
}

type SourceLike = { src?: string; type?: string; media?: string } | (HTMLSourceElement & Record<string, any>);
type TrackLike = { kind?: string; label?: string; srclang?: string; src?: string; default?: boolean; id?: string } | (HTMLTrackElement & Record<string, any>);

// Geometry
export const getRenderedBox = (elem: HTMLElement & { videoWidth?: number; videoHeight?: number }): Partial<Dimensions & { left: number; top: number }> => {
  const getResourceDimensions = (source: HTMLElement & { videoWidth?: number; videoHeight?: number }): Dimensions | null => (source.videoWidth && source.videoHeight ? { width: source.videoWidth, height: source.videoHeight } : null);
  const parsePositionAsPx = (str: string, bboxSize: number, objectSize: number): number => {
    const num = parseFloat(str);
    return !str.endsWith("%") ? num : bboxSize * (num / 100) - objectSize * (num / 100);
  };
  const parseObjectPosition = (position: string, bbox: DOMRect, object: Dimensions): { left: number; top: number } => {
    const [left, top] = position.split(" ");
    return { left: parsePositionAsPx(left, bbox.width, object.width), top: parsePositionAsPx(top, bbox.height, object.height) };
  };
  let { objectFit, objectPosition } = getComputedStyle(elem);
  const bbox = elem.getBoundingClientRect(),
    object = getResourceDimensions(elem);
  if (!object || !objectFit || !objectPosition) return {};
  if (objectFit === "scale-down") objectFit = bbox.width < object.width || bbox.height < object.height ? "contain" : "none";
  if (objectFit === "none") return { ...parseObjectPosition(objectPosition, bbox, object), ...object };
  else if (objectFit === "contain") {
    const objectRatio = object.height / object.width,
      bboxRatio = bbox.height / bbox.width,
      width = bboxRatio > objectRatio ? bbox.width : bbox.height / objectRatio,
      height = bboxRatio > objectRatio ? bbox.width * objectRatio : bbox.height;
    return { ...parseObjectPosition(objectPosition, bbox, { width, height }), width, height };
  } else if (objectFit === "fill") {
    const { left, top } = parseObjectPosition(objectPosition, bbox, object),
      objPosArr = objectPosition.split(" ");
    return { left: objPosArr[0].endsWith("%") ? 0 : left, top: objPosArr[1].endsWith("%") ? 0 : top, width: bbox.width, height: bbox.height };
  } else if (objectFit === "cover") {
    const minRatio = Math.min(bbox.width / object.width, bbox.height / object.height);
    let width = object.width * minRatio,
      height = object.height * minRatio,
      outRatio = 1;
    if (width < bbox.width) outRatio = bbox.width / width;
    if (Math.abs(outRatio - 1) < 1e-14 && height < bbox.height) outRatio = bbox.height / height;
    width *= outRatio;
    height *= outRatio;
    return { ...parseObjectPosition(objectPosition, bbox, { width, height }), width, height };
  }
  return {};
};

// Video Element Cloning
export const cloneVideo = (v: HTMLVideoElement & { tmgPlayer?: unknown; controlsList?: DOMTokenList }): HTMLVideoElement => {
  const newV = v.cloneNode(true) as HTMLVideoElement;
  (newV as HTMLVideoElement & { tmgPlayer?: unknown }).tmgPlayer = v.tmgPlayer;
  v.parentElement?.replaceChild(newV, v);
  if (v.currentTime) newV.currentTime = v.currentTime;
  if (v.playbackRate !== 1) newV.playbackRate = v.playbackRate;
  if (v.defaultPlaybackRate !== 1) newV.defaultPlaybackRate = v.defaultPlaybackRate;
  if (v.volume !== 1) newV.volume = v.volume;
  if (v.muted) newV.muted = true;
  if (v.defaultMuted) newV.defaultMuted = true;
  if (v.srcObject) newV.srcObject = v.srcObject;
  if (v.autoplay) newV.autoplay = true;
  if (v.loop) newV.loop = true;
  if (v.controls) newV.controls = true;
  if (v.crossOrigin) newV.crossOrigin = v.crossOrigin;
  if (v.playsInline) newV.playsInline = true;
  if ((v as HTMLVideoElement & { controlsList?: DOMTokenList }).controlsList?.length) (newV as HTMLVideoElement & { controlsList?: DOMTokenList }).controlsList = (v as HTMLVideoElement & { controlsList?: DOMTokenList }).controlsList;
  if (v.disablePictureInPicture) newV.disablePictureInPicture = true;
  if (!v.paused && newV.isConnected) newV.play();
  return newV;
};

// Source Management
export function putSourceDetails(source: SourceLike, sourceEl: HTMLSourceElement | Record<string, any>): void {
  if ((source as any).src) (sourceEl as any).src = (source as any).src;
  if ((source as any).type) (sourceEl as any).type = (source as any).type;
  if ((source as any).media) (sourceEl as any).media = (source as any).media;
}

export function addSources(sources: SourceLike | Iterable<SourceLike>, medium: HTMLElement): HTMLSourceElement | HTMLSourceElement[] {
  const addSource = (source: SourceLike, med: HTMLElement) => {
    const sourceEl = createEl("source");
    if (!sourceEl) return null as unknown as HTMLSourceElement;
    putSourceDetails(source, sourceEl);
    return med.appendChild(sourceEl);
  };
  return isIter(sources) ? Array.from(sources as Iterable<SourceLike>, (source) => addSource(source, medium)) : addSource(sources, medium);
}

export function getSources(medium: HTMLElement): SourceLike[] {
  const sources = medium.querySelectorAll<HTMLSourceElement>("source"),
    _sources: SourceLike[] = [];
  sources.forEach((source) => {
    const obj: Record<string, any> = {};
    putSourceDetails(source, obj);
    _sources.push(obj as SourceLike);
  });
  return _sources;
}

export const removeSources = (medium: HTMLElement): void => medium?.querySelectorAll("source")?.forEach((source) => source.remove());

// Track Management
export function putTrackDetails(track: TrackLike, trackEl: HTMLTrackElement | Record<string, any>): void {
  if ((track as any).kind) (trackEl as any).kind = (track as any).kind;
  if ((track as any).label) (trackEl as any).label = (track as any).label;
  if ((track as any).srclang) (trackEl as any).srclang = (track as any).srclang;
  if ((track as any).src) (trackEl as any).src = (track as any).src;
  if ((track as any).default) (trackEl as any).default = (track as any).default;
  if ((track as any).id) (trackEl as any).id = (track as any).id;
}

export function addTracks(tracks: TrackLike | Iterable<TrackLike>, medium: HTMLElement): HTMLTrackElement | HTMLTrackElement[] {
  const addTrack = (track: TrackLike, med: HTMLElement) => {
    const trackEl = createEl("track") as HTMLTrackElement | null;
    if (!trackEl) return null as unknown as HTMLTrackElement;
    putTrackDetails(track, trackEl);
    return med.appendChild(trackEl);
  };
  return isIter(tracks) ? Array.from(tracks as Iterable<TrackLike>, (track) => addTrack(track, medium)) : addTrack(tracks, medium);
}

export function getTracks(medium: HTMLElement): TrackLike[] {
  const tracks = medium.querySelectorAll<HTMLTrackElement>("track[kind='captions'], track[kind='subtitles']"),
    _tracks: TrackLike[] = [];
  tracks.forEach((track) => {
    const obj: Record<string, any> = {};
    putTrackDetails(track, obj);
    _tracks.push(obj as TrackLike);
  });
  return _tracks;
}

export const removeTracks = (medium: HTMLElement): void => medium.querySelectorAll("track")?.forEach((track) => (track.kind === "subtitles" || track.kind === "captions") && track.remove());

// ============ Caption/Subtitle Utilities ============

// Tag Utilities
export const stripTags = (text: string): string => text.replace(/<(\/)?([a-z0-9.:]+)([^>]*)>/gi, "");

// SRT/VTT Conversion
export function srtToVtt(srt: string, vttLines: string[] = ["WEBVTT", ""]): string {
  const input = srt.replace(/\r\n?/g, "\n").trim();
  for (const block of input.split(/\n{2,}/)) {
    const lines = block.split("\n");
    let idx = /^\d+$/.test(lines[0].trim()) ? 1 : 0;
    const timing = lines[idx]?.trim().replace(/\s+/g, " "),
      m = timing?.match(/(\d{1,2}:\d{2}:\d{2})(?:[.,](\d{1,3}))?\s*-->\s*(\d{1,2}:\d{2}:\d{2})(?:[.,](\d{1,3}))?/);
    if (!m) continue;
    const [, startHms, startMsRaw = "0", endHms, endMsRaw = "0"] = m,
      to3 = (ms: string) => ms.padEnd(3, "0").slice(0, 3);
    vttLines.push(`${startHms}.${to3(startMsRaw)} --> ${endHms}.${to3(endMsRaw)}`, ...lines.slice(idx + 1), "");
  }
  return vttLines.join("\n");
}

export function parseVttText(text: string): string {
  const state = { tag: /<(\/)?([a-z0-9.:]+)([^>]*)>/gi, o: "", l: 0, p: null as string | null, c: "" },
    esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
  let m: RegExpExecArray | null;
  while ((m = state.tag.exec(text))) {
    const chunk = text.slice(state.l, m.index);
    if (chunk) state.c += esc(chunk);
    const [_, cls, tag_n, rest] = m,
      low = tag_n.toLowerCase();
    if (/^[0-9]/.test(tag_n)) {
      state.o += state.p ? `<span data-part="timed" data-time="${state.p}">${state.c}</span>` : state.c;
      state.p = tag_n;
      state.c = "";
    } else {
      if (cls) state.c += ["c", "v", "lang"].includes(low) ? "</span>" : `</${low}>`;
      else if (["b", "i", "u", "ruby", "rt"].includes(low)) state.c += `<${low}>`;
      else if (low === "c") state.c += `<span class="vtt-c ${rest.replace(/\.([a-z0-9_-]+)/gi, "$1 ").trim()}">`;
      else if (low === "v") state.c += `<span data-part="voice"${rest.trim() ? ` title="${esc(rest.trim())}"` : ""}>`;
      else if (low === "lang") state.c += `<span lang="${esc(rest.trim())}">`;
    }
    state.l = state.tag.lastIndex;
  }
  const lChunk = text.slice(state.l);
  if (lChunk) state.c += esc(lChunk);
  return state.o + (state.p ? `<span data-part="timed" data-time="${state.p}">${state.c}</span>` : state.c);
}

export function formatVttLine(p: string, maxChars: number): string[] {
  const state = { tokens: p.match(/<[^>]+>|\S+/g) || [], stack: [] as string[], parts: [] as string[], line: "", len: 0, openStr: "", closeStr: "", timeTag: "", lastWasTag: false },
    updateTags = () => ((state.openStr = state.stack.map((n) => `<${n}>`).join("")), (state.closeStr = state.stack.reduceRight((a, n) => a + `</${n}>`, ""))),
    flush = () => state.line && (state.parts.push(state.line + state.closeStr), (state.line = (state.timeTag || "") + state.openStr), (state.len = 0), (state.lastWasTag = true));
  state.tokens.forEach((tok) => {
    const tag = tok[0] === "<",
      closeTag = tag && tok[1] === "/";
    if (tag) {
      if (state.line && !state.lastWasTag && !closeTag) state.line += " ";
      const m = tok.match(/^<\/?\s*([a-z0-9._:-]+)/i),
        n = m?.[1] || "",
        timing = /^\d/.test(n);
      if (timing) return ((state.timeTag = tok), (state.line += tok), (state.lastWasTag = true));
      if (!closeTag && !tok.endsWith("/>") && n) (state.stack.push(n), updateTags());
      if (closeTag && state.stack.length) (state.stack.pop(), updateTags());
      return ((state.lastWasTag = true), (state.line += tok));
    }
    const len = stripTags(tok).length,
      needSpace = state.line && !state.lastWasTag;
    if (state.len + (needSpace ? 1 : 0) + len > maxChars) flush();
    if (needSpace) ((state.line += " "), (state.len += 1));
    ((state.line += tok), (state.len += len), (state.lastWasTag = false));
  });
  return (flush(), state.parts);
}
