import { Controller } from "../core/controller";
import { Controllers } from "./runtime";
import { loadResource, mergeObjs, parseAnyObj, isIter, assignHTMLConfig, cleanKeyCombo, isObj, supportsFullscreen, supportsPictureInPicture, setAny, luid } from "../utils";
import { DEFAULT_VIDEO_BUILD, DEFAULT_VIDEO_ITEM_BUILD } from "../consts/config-defaults";
import type { VideoBuild } from "../types/build";
import { DeepPartial, Paths, PathValue } from "../types/obj";

const modes: Record<string, boolean> = { fullScreen: supportsFullscreen(), pictureInPicture: supportsPictureInPicture() };

export type BuildPaths = Paths<VideoBuild>;
export type BuildParam = DeepPartial<VideoBuild> & Record<BuildPaths, PathValue<VideoBuild, BuildPaths>>;

export class Player {
  #medium: HTMLMediaElement | null = null;
  #active: boolean = false;
  #controller: Controller | null = null;
  #build: VideoBuild = structuredClone(DEFAULT_VIDEO_BUILD as VideoBuild);

  constructor(customBuild: BuildParam = {} as BuildParam) {
    this.configure({ ...customBuild, id: customBuild.id ?? `${luid("tmg_Controller_")}_${Controllers.length + 1}` });
  }

  public get Controller() {
    return this.#controller;
  }

  public get build(): VideoBuild {
    return this.#build;
  }
  public set build(customBuild: BuildParam) {
    this.configure(customBuild);
  }
  private queryBuild(): boolean {
    return (!this.#active ? true : this.notice({ error: "Already deployed the custom controls of your build configuration", tip: "Consider setting your build configuration before attaching your media element" }), false);
  }

  private notice({ error, warning, tip }: Partial<Record<"error" | "warning" | "tip", string>>) {
    error && console.error(`[TMG Player] ${error}`);
    warning && console.warn(`[TMG Player] ${warning}`);
    tip && console.info(`[TMG Player] ${tip}`);
  }

  public configure(customBuild: BuildParam): void {
    if (!this.queryBuild() || !isObj(customBuild)) return;
    this.#build = mergeObjs(this.#build, parseAnyObj(customBuild));
    const keys = this.#build.settings.keys;
    if (!keys) return;
    Object.keys(keys.shortcuts || {}).forEach((k) => ((keys.shortcuts as any)[k] = cleanKeyCombo((keys.shortcuts as any)[k])));
    ["blocks", "overrides"].forEach((k) => ((keys as any)[k] = cleanKeyCombo((keys as any)[k])));
  }

  public async attach(medium: HTMLMediaElement) {
    if (isIter(medium)) return this.notice({ error: "An iterable argument cannot be attached to the TMG media player", tip: "Consider looping the iterable argument to instantiate a new 'tmg.Player' for each" });
    if (this.#active) return medium;
    medium.tmgPlayer?.detach();
    medium.tmgPlayer = this;
    this.#medium = medium;
    await this.fetchCustomOptions();
    await this.deployController();
    return (this.#controller?.fire("tmgattached", this.#controller.payload), medium);
  }

  public detach() {
    if (!this.#active) return;
    const medium = this.#controller?.destroy() ?? null;
    this.#controller && Controllers.splice(Controllers.indexOf(this.#controller), 1);
    medium?.classList.remove(`tmg-${medium?.tagName.toLowerCase()}`, "tmg-media");
    if (medium) ((medium.tmgcontrols = false), (medium.tmgPlayer = null));
    this.#active = false;
    this.#controller?.fire("tmgdetached");
    this.#controller = this.#medium = null;
    return medium;
  }

  public async fetchCustomOptions() {
    if (!this.#medium) return;
    if (this.#medium.getAttribute("tmg")?.includes(".json")) {
      await fetch(this.#medium.getAttribute("tmg")!)
        .then((res) => {
          if (!res.ok) throw new Error(`JSON file not found at provided URL!. Status: ${res.status}`);
          return res.json();
        })
        .then((json) => this.configure(json))
        .catch(({ message }) => this.notice({ error: message, tip: "A valid JSON file is required for parsing your build configuration" }));
    }
    const customBuild = {} as BuildParam,
      attributes = this.#medium.getAttributeNames().filter((attr) => attr.startsWith("tmg--"));
    attributes?.forEach((attr) => assignHTMLConfig<BuildParam>(customBuild, attr as `tmg--${BuildPaths}`, this.#medium!.getAttribute(attr)!));
    if (this.#medium instanceof HTMLVideoElement && this.#medium.poster) this.configure({ "media.artwork[0].src": this.#medium.poster } as any);
    this.configure(customBuild);
  }

  private async deployController() {
    if (this.#active || !this.#medium?.isConnected) return;
    if (this.#build.playlist?.[0]) this.configure(mergeObjs(DEFAULT_VIDEO_ITEM_BUILD as BuildParam, parseAnyObj(this.#build.playlist[0] as BuildParam)));
    if (!(this.#medium instanceof HTMLVideoElement)) return this.notice({ error: `Could not deploy custom controls on the '${this.#medium.tagName}' element as it is not supported`, warning: "Only the 'VIDEO' element is currently supported", tip: "" });
    this.#medium.tmgcontrols = this.#active = true;
    this.#medium.controls = false;
    this.#medium.classList.add(`tmg-${this.#medium.tagName.toLowerCase()}`, "tmg-media");
    const s = this.#build.settings;
    type Mode = keyof typeof s.modes;
    Object.keys(s.modes).forEach((k) => (s.modes[k as Mode] = (s.modes[k as Mode] && (modes[String(k)] ?? true) ? s.modes[k as Mode] : false) as any));
    await Promise.all([loadResource(window?.TMG_VIDEO_CSS_SRC), loadResource(window?.T007_TOAST_JS_SRC, "script", { module: true })]);
    Controllers.push((this.#controller = new Controller(this.#medium, this.#build)));
  }
}
