import type { VideoOptions } from "../types/options";
import reactify, { type Reactified } from "../mixins/reactify";

export class Controller {
  constructor(videoOptions: VideoOptions) {
    reactify(videoOptions, this);
  }
}

export interface Controller extends Reactified<VideoOptions> {}
