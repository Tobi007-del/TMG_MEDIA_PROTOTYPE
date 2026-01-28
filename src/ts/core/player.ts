import { Controller } from "./controller";
import { Controllers } from "./runtime";
import { uid, loadResource, mergeObjs, parseAnyObj, isIter, assignHTMLConfig, cleanKeyCombo, isObj, supportsFullscreen, supportsPictureInPicture, assignAny } from "../utils";
import { DEFAULT_VIDEO_BUILD, DEFAULT_VIDEO_ITEM_BUILD } from "../consts/config-defaults";
import type { VideoBuild } from "../types/build";
import { DeepPartial, Paths, PathValue } from "../types/obj";

const modes: Record<string, boolean> = {
  fullScreen: supportsFullscreen(),
  pictureInPicture: supportsPictureInPicture(),
};

export type BuildPaths = Paths<VideoBuild>;
export type BuildArg = DeepPartial<VideoBuild> & Record<BuildPaths, PathValue<VideoBuild, BuildPaths>>;

export class Player {
  private medium: HTMLMediaElement | null = null;
  private active: boolean = false;
  private _controller: Controller | null = null;
  private _build: VideoBuild = structuredClone(DEFAULT_VIDEO_BUILD as VideoBuild);

  constructor(customBuild: BuildArg = {} as BuildArg) {
    this.configure({ ...customBuild, id: customBuild.id ?? uid() });
  }

  public get build(): VideoBuild {
    return this._build;
  }
  public get Controller() {
    return this._controller;
  }

  public set build(customBuild: BuildArg) {
    this.configure(customBuild);
  }

  private queryBuild(): boolean {
    return (!this.active ? true : this.notice({ error: "Already deployed the custom controls of your build configuration", help: "Consider setting your build configuration before attaching your media element" }), false);
  }

  public configure(customBuild: BuildArg): void {
    if (!this.queryBuild() || !isObj(customBuild)) return;
    this._build = mergeObjs(this._build, parseAnyObj(customBuild));
    const keys = this._build.settings.keys;
    if (!keys) return;
    Object.entries(keys.shortcuts || {}).forEach(([k, v]) => ((keys.shortcuts as any)[k] = cleanKeyCombo(v)));
    ["blocks", "overrides"].forEach((k) => ((keys as any)[k] = cleanKeyCombo((keys as any)[k])));
  }

  public async attach(medium: HTMLMediaElement) {
    if (isIter(medium)) return this.notice({ error: "An iterable argument cannot be attached to the TMG media player", help: "Consider looping the iterable argument to get a single argument and instantiate a new 'tmg.Player' for each" });
    if (this.active) return medium;
    medium.tmgPlayer?.detach();
    medium.tmgPlayer = this;
    this.medium = medium;
    await this.fetchCustomOptions();
    await this.deployController();
    return (this._controller?.fire("tmgattached", this._controller.payload), medium);
  }

  public detach() {
    if (!this.active) return;
    const medium = this._controller?.destroy() ?? null;
    this._controller && Controllers.splice(Controllers.indexOf(this._controller), 1);
    medium && ((medium.tmgcontrols = false), (medium.tmgPlayer = null));
    this.active = false;
    this._controller?.fire("tmgdetached");
    this._controller = this.medium = null;
    return medium;
  }

  public async fetchCustomOptions() {
    if (!this.medium) return;
    if (this.medium.getAttribute("tmg")?.includes(".json")) {
      await fetch(this.medium.getAttribute("tmg")!)
        .then((res) => {
          if (!res.ok) throw new Error(`JSON file not found at provided URL!. Status: ${res.status}`);
          return res.json();
        })
        .then((json) => this.configure(json))
        .catch(({ message }) => this.notice({ error: message, help: "A valid JSON file is required for parsing your build configuration" }));
    }
    const customBuild = {} as BuildArg,
      attributes = this.medium.getAttributeNames().filter((attr) => attr.startsWith("tmg--"));
    attributes?.forEach((attr) => assignHTMLConfig<BuildArg>(customBuild, attr as `tmg--${BuildPaths}`, this.medium!.getAttribute(attr)!));
    if (this.medium instanceof HTMLVideoElement && this.medium.poster) this.configure({ "media.artwork[0].src": this.medium.poster } as any);
    this.configure(customBuild);
  }

  private async deployController() {
    if (this.active || !this.medium?.isConnected) return;
    if (this._build.playlist?.[0]) this.configure(mergeObjs(DEFAULT_VIDEO_ITEM_BUILD as BuildArg, parseAnyObj(this._build.playlist[0] as BuildArg)));
    if (!(this.medium instanceof HTMLVideoElement)) return this.notice({ error: `Could not deploy custom controls on the '${this.medium.tagName}' element as it is not supported`, warning: "Only the 'VIDEO' element is currently supported", help: "" });
    (this.medium as any).tmgcontrols = true;
    this.active = true;
    this.medium.controls = false;
    this.medium.classList.add("tmg-video", "tmg-media");
    const s = this._build.settings;
    Object.entries(s.modes).forEach(([k, v]) => (s.modes[k as keyof typeof s.modes] = (v && (modes[`${k}`] ?? true) ? v : false) as any));
    await Promise.all([loadResource(window?.TMG_VIDEO_CSS_SRC), loadResource(window?.T007_TOAST_JS_SRC, "script", { module: true })]);
    this._controller = new Controller(this.medium, this._build);
    Controllers.push(this._controller);
  }

  private notice({ error, warning, help }: Partial<Record<"error" | "warning" | "help", string>>) {
    error && console.error(`[TMG Player] ${error}`);
    warning && console.warn(`[TMG Player] ${warning}`);
    help && console.info(`[TMG Player] ${help}`);
  }
}
