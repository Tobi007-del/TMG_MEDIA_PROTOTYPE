// File Size Formatting
export function formatSize(size: number, decimals = 3, base = 1e3): string {
  if (size < base) return `${size} byte${size == 1 ? "" : "s"}`;
  const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    exponent = Math.min(Math.floor(Math.log(size) / Math.log(base)), units.length - 1);
  return `${(size / Math.pow(base, exponent)).toFixed(decimals).replace(/\.0+$/, "")} ${units[exponent]}`;
}

// Extension Helpers
export function getExtension(fn: string): string {
  return fn.split(".").pop()?.toLowerCase() ?? "";
}

export function noExtension(fn: string): string {
  return fn.replace(/(?:\.(?:mp4|mkv|avi|mov|webm|flv|wmv|m4v|mpg|mpeg|3gp|ogv|ts))+$/i, "");
}
// MIME Type Resolution

export function getMimeTypeFromExtension(fn: string): string {
  return (
    (
      {
        avi: "video/x-msvideo",
        mp4: "video/mp4",
        mkv: "video/x-matroska",
        mov: "video/quicktime",
        flv: "video/x-flv",
        webm: "video/webm",
        ogg: "video/ogg",
        wmv: "video/x-ms-wmv",
        "3gp": "video/3gpp",
        "3g2": "video/3gpp2",
        mpeg: "video/mpeg",
        ts: "video/mp2t",
        m4v: "video/x-m4v",
      } as Record<string, string>
    )[getExtension(fn)] || "application/octet-stream"
  );
}
