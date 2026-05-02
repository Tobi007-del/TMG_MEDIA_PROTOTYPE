// File Size Formatting
export { formatSize } from "@t007/utils";

// Extension Helpers
export function getExtension(fn: string): string {
  return fn.slice(fn.lastIndexOf(".") + 1).toLowerCase() ?? "";
}

export function noExtension(fn: string): string {
  return fn.replace(/(?:\.(?:mp4|mkv|avi|mov|webm|flv|wmv|m4v|mpg|mpeg|3gp|ogv|ts))+$/i, "");
}

// MIME Type Resolution
export function getMimeTypeFromExtension(fn: string): string {
  return ({ m3u8: "application/vnd.apple.mpegurl", mpd: "application/dash+xml", avi: "video/x-msvideo", mp4: "video/mp4", mkv: "video/x-matroska", mov: "video/quicktime", flv: "video/x-flv", webm: "video/webm", ogg: "video/ogg", wmv: "video/x-ms-wmv", "3gp": "video/3gpp", "3g2": "video/3gpp2", mpeg: "video/mpeg", ts: "video/mp2t", m4v: "video/x-m4v" } as Record<string, string>)[getExtension(fn)] || "application/octet-stream";
}
