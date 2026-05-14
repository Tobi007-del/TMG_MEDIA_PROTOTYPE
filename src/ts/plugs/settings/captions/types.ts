import { DeepPartial } from "sia-reactor";
import { OptRange } from "../../../types/generics";
import { UISettings, UIOption } from "../../../types/UIOptions";

export interface Captions {
  visible: boolean;
  font: {
    family: UISettings<string>;
    size: OptRange & { options: UIOption<number>[] };
    color: UISettings<string>;
    opacity: UISettings<number>;
    weight: UISettings<string | number>;
    variant: UISettings<string>;
  };
  window: {
    color: UISettings<string>;
    opacity: UISettings<number>;
  };
  background: {
    color: UISettings<string>;
    opacity: UISettings<number>;
  };
  characterEdgeStyle: UISettings<"none" | "raised" | "depressed" | "outline" | "drop-shadow">;
  textAlignment: UISettings<"left" | "center" | "right">;
  allowMediaOverride: boolean;
  previewTimeout: 1500;
}
export type CueLike = (TextTrackCue | { text: string }) &
  DeepPartial<{
    id: string;
    text: string;
    align: string;
    region: { width: number; lines: number; viewportAnchorX: number; viewportAnchorY: number; scroll: string };
    position: number | "auto";
    positionAlign: string;
    line: number | string;
    lineAlign: string;
    snapToLines: boolean;
    size: number;
    vertical: "" | "lr" | "rl";
  }>;
