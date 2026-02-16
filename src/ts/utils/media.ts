import { DEFAULT_MEDIA_INTENT, DEFAULT_MEDIA_SETTINGS, DEFAULT_MEDIA_STATE, DEFAULT_MEDIA_STATUS } from "../consts/media-defaults";
import { MediaState, MediaReport } from "../types/contract";
import type { Source, Sources, Track, Tracks } from "../plugs";
import { createEl, isIter, isSameURL, loadResource, queryFullscreenEl } from ".";

// ============ Video Utilities ============

// Types
export type Dimensions = Record<"width" | "height", number>;

type SourceLike = Source | (HTMLSourceElement & Record<string, any>);
type TrackLike = Track | (HTMLTrackElement & Record<string, any>);

// Report Generation
export function getMediaReport(m: HTMLMediaElement): MediaReport {
  const txtTrackIdx = getTrackIdx(m, "Text");
  const report = {
    state: {
      src: m.src,
      currentTime: m.currentTime,
      paused: m.paused,
      volume: m.volume,
      muted: m.muted,
      playbackRate: m.playbackRate,
      pictureInPicture: document.pictureInPictureElement === m,
      fullscreen: queryFullscreenEl() === m,
      currentTextTrack: txtTrackIdx,
      currentAudioTrack: getTrackIdx(m, "Audio"),
      currentVideoTrack: getTrackIdx(m, "Video"),
      poster: m instanceof HTMLVideoElement ? m.poster : "",
      autoplay: m.autoplay,
      loop: m.loop,
      preload: m.preload,
      playsInline: m instanceof HTMLVideoElement ? m.playsInline : false,
      crossOrigin: m.crossOrigin,
      controls: m.controls,
      controlsList: m.getAttribute("controlsList") || "",
      disablePictureInPicture: m instanceof HTMLVideoElement ? m.disablePictureInPicture : false,
      sources: getSources(m),
      tracks: getTracks(m),
    },
    status: {
      readyState: m.readyState,
      networkState: m.networkState,
      error: m.error,
      seeking: m.seeking,
      buffered: m.buffered,
      played: m.played,
      seekable: m.seekable,
      duration: m.duration,
      ended: m.ended,
      loadedMetadata: m.readyState >= 1,
      loadedData: m.readyState >= 2,
      canPlay: m.readyState >= 3,
      canPlayThrough: m.readyState >= 4,
      videoWidth: m instanceof HTMLVideoElement ? m.videoWidth : 0,
      videoHeight: m instanceof HTMLVideoElement ? m.videoHeight : 0,
      textTracks: m.textTracks,
      audioTracks: (m as any).audioTracks,
      videoTracks: (m as any).videoTracks,
      activeCue: m.textTracks[txtTrackIdx]?.activeCues?.[0] || null,
    },
    settings: {
      defaultMuted: m.defaultMuted,
      defaultPlaybackRate: m.defaultPlaybackRate,
    },
  };
  return {
    state: { ...DEFAULT_MEDIA_STATE, ...report.state },
    intent: { ...DEFAULT_MEDIA_INTENT, ...report.state },
    status: { ...DEFAULT_MEDIA_STATUS, ...report.status },
    settings: { ...DEFAULT_MEDIA_SETTINGS, ...report.settings },
  };
}

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

export function getSizeTier(container: HTMLElement) {
  const { offsetWidth: w, offsetHeight: h } = container;
  return { width: w, height: h, tier: h <= 130 ? "xxxxx" : w <= 280 ? "xxxx" : w <= 380 ? "xxx" : w <= 480 ? "xx" : w <= 630 ? "x" : "" };
}

// Media Element Cloning
export const cloneMedia = <M extends HTMLMediaElement>(v: M): M => {
  const newV = v.cloneNode(true) as M;
  newV.tmgPlayer = v.tmgPlayer;
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
  if (v.controlsList?.length) newV.controlsList = v.controlsList;
  if (v.disablePictureInPicture) newV.disablePictureInPicture = true;
  if (!v.paused && newV.isConnected) newV.play();
  return newV;
};

// Source Management
export function putSourceDetails(source: any, el: HTMLSourceElement | Record<string, any>) {
  if (source.src) el.src = source.src;
  if (source.type) el.type = source.type;
  if (source.media) el.media = source.media;
}
export function addSources(sources: SourceLike | Iterable<SourceLike> = [], medium: HTMLElement): HTMLSourceElement | HTMLSourceElement[] {
  const addSource = (source: SourceLike, med: HTMLElement) => {
    const sourceEl = createEl("source");
    putSourceDetails(source, sourceEl);
    return med.appendChild(sourceEl);
  };
  return isIter(sources) ? Array.from(sources as Iterable<SourceLike>, (source) => addSource(source, medium)) : addSource(sources, medium);
}
export function getSources(medium: HTMLElement): MediaState["sources"] {
  const sources = medium.querySelectorAll<HTMLSourceElement>("source"),
    _sources: SourceLike[] = [];
  sources.forEach((source) => {
    const obj: Record<string, any> = {};
    putSourceDetails(source, obj);
    _sources.push(obj as SourceLike);
  });
  return _sources as MediaState["sources"];
}
export const removeSources = (medium: HTMLElement): void => medium?.querySelectorAll("source")?.forEach((source) => source.remove());
export function isSameSources(a?: Sources, b?: Sources): boolean {
  if (!a || !b || a.length !== b.length) return false;
  return a.every((s1) => b.some((s2) => isSameURL(s1.src, s2.src) && s1.type === s2.type && s1.media === s2.media));
}

// Track Management
export type TrackType = "Audio" | "Video" | "Text";
export function putTrackDetails(track: any, el: HTMLTrackElement | Record<string, any>) {
  if (track.id) el.id = track.id;
  if (track.kind) el.kind = track.kind;
  if (track.label) el.label = track.label;
  if (track.srclang) el.srclang = track.srclang;
  if (track.src) el.src = track.src;
  if (track.default) el.default = track.default;
}
export function addTracks(tracks: TrackLike | Iterable<TrackLike> = [], medium: HTMLElement): HTMLTrackElement | HTMLTrackElement[] {
  const addTrack = (track: TrackLike, med: HTMLElement) => {
    const trackEl = createEl("track");
    putTrackDetails(track, trackEl);
    return med.appendChild(trackEl);
  };
  return isIter(tracks) ? Array.from(tracks as Iterable<TrackLike>, (track) => addTrack(track, medium)) : addTrack(tracks, medium);
}
export function getTracks(medium: HTMLElement, cues = false): TrackLike[] {
  const tracks = medium.querySelectorAll<HTMLTrackElement>(!cues ? "track" : "track:is([kind='captions'], [kind='subtitles'])"),
    _tracks: TrackLike[] = [];
  tracks.forEach((track) => {
    const obj: Record<string, any> = {};
    putTrackDetails(track, obj);
    _tracks.push(obj as TrackLike);
  });
  return _tracks;
}
export const removeTracks = (medium: HTMLElement): void => medium.querySelectorAll("track")?.forEach((track) => (track.kind === "subtitles" || track.kind === "captions") && track.remove());
export function isSameTracks(a?: Tracks, b?: Tracks): boolean {
  if (!a || !b || a.length !== b.length) return false;
  return a.every((t1) => b.some((t2) => isSameURL(t1.src, t2.src) && t1.kind === t2.kind && t1.label === t2.label && t1.srclang === t2.srclang && t1.default === t2.default));
}
const isTrack = (type: TrackType, term: any) => `${type}Track` in window && term instanceof (window as any)[`${type}Track`];
export function getTrackIdx(medium: HTMLMediaElement, type: TrackType, term: any = "active"): number {
  if ("number" === typeof term) return term;
  const list = (medium as any)[`${type.toLowerCase()}Tracks`];
  if (term === "active") {
    if (type === "Text") for (let i = 0; i < +list?.length; i++) if (list[i].mode === "showing") return i;
    if (type === "Audio") for (let i = 0; i < +list?.length; i++) if (list[i].enabled) return i;
    if (type === "Video") return list.selectedIndex ?? -1;
  }
  if (isTrack(type, term)) return Array.prototype.indexOf.call(list, term);
  if ("string" === typeof term) {
    term = term.toLowerCase();
    return !isNaN(+term) ? +term : Array.prototype.findIndex.call(list, (t: any) => t.id.toLowerCase() === term || t.label.toLowerCase() === term || t.srclang.toLowerCase() === term || t.language.toLowerCase() === term || isSameURL(t.src, term));
  }
  return -1;
}
export function setCurrentTrack(medium: HTMLMediaElement, type: TrackType, term: any, flush = false): void {
  const list = (medium as any)[`${type.toLowerCase()}Tracks`],
    idx = getTrackIdx(medium, type, term);
  if (type !== "Video") for (let i = 0; i < list.length; i++) type === "Text" ? (list[i].mode = i === idx ? "showing" : flush ? "disabled" : "hidden") : (list[i].enabled = i === idx);
  else list[idx] && (list[idx].selected = true);
}

// ============ Caption/Subtitle Utilities ============
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
    vttLines.push(startHms + "." + to3(startMsRaw) + " --> " + endHms + "." + to3(endMsRaw));
    for (let i = idx + 1; i < lines.length; i++) vttLines.push(lines[i]);
    vttLines.push("");
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
