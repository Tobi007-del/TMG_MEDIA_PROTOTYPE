import type { VideoBuild } from "../types/build";
import reactify, { type Reactified } from "../mixins/reactified";

export class Controller {
  constructor(build: VideoBuild) {
    // this.config = reactified((this.buildCache = build));
  }
}

export interface Controller extends Reactified<VideoBuild> {}
