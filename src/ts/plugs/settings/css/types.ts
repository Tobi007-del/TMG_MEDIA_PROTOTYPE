export type Css = Record<string, string | number> & {
  captionsCharacterEdgeStyle: "none" | "raised" | "depressed" | "outline" | "drop-shadow";
  captionsTextAlignment: "left" | "center" | "right";
  syncWithMedia: Record<string, boolean>; // not a live synced key
};