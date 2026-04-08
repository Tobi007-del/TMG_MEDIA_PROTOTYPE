import { Controller } from "../core/controller";
import { Controllers } from "./runtime";
import { loadResource, isIter, setHTMLConfig, isObj, supportsFullscreen, supportsPictureInPicture, luid } from "../utils";
import { CONFIG_BUILD } from "../consts";
import { PLAYLIST_ITEM_BUILD } from "../plugs";
import type { CtlrConfig } from "../types/config";
import { DeepPartial, Paths, PathValue, mergeObjs, parseAnyObj, setAny } from "../sia-reactor";

export type BuildPaths = Paths<CtlrConfig>;
export type BuildParam = DeepPartial<CtlrConfig> & Record<BuildPaths, PathValue<CtlrConfig, BuildPaths>>;

export class Player {
  private medium: HTMLMediaElement | null = null;
  private active: boolean = false;
  private controller: Controller | null = null;
  private _build: CtlrConfig = structuredClone(CONFIG_BUILD) as CtlrConfig;

  constructor(customBuild: BuildParam = {} as BuildParam) {
    this.configure({ ...customBuild, id: customBuild.id ?? `${luid()}_Controller_${Controllers.length + 1}` });
  }

  public get Controller() {
    return this.controller;
  }

  public get build(): CtlrConfig {
    return this._build;
  }
  public set build(customBuild: BuildParam) {
    this.configure(customBuild);
  }
  private queryBuild(): boolean {
    return (!this.active ? true : this.notice({ error: "Already deployed the custom controls of your build configuration", tip: "Consider setting your build configuration before attaching your media element" }), false);
  }

  public configure(customBuild: BuildParam): void {
    if (!this.queryBuild() || !isObj(customBuild)) return;
    this._build = mergeObjs(this._build, parseAnyObj(customBuild));
  }

  public async attach(medium: HTMLMediaElement) {
    if (isIter(medium)) return this.notice({ error: "An iterable argument cannot be attached to the TMG media player", tip: "Consider looping the iterable argument to instantiate a new 'tmg.Player' for each" });
    if (this.active) return medium;
    medium.tmgPlayer?.detach();
    Controllers.push(this._build.id as any); // dummy for sync
    medium.tmgPlayer = this;
    this.medium = medium;
    (await this.fetchCustomOptions(), await this.deployController());
    return (this.controller?.fire("tmgattached", this.controller.payload), medium);
  }

  public detach() {
    if (!this.active) return;
    const medium = this.controller?.destroy() ?? ({} as any);
    this.controller && Controllers.splice(Controllers.indexOf(this.controller), 1);
    medium?.classList?.remove(`tmg-${medium?.tagName.toLowerCase()}`, "tmg-media");
    medium.tmgcontrols = this.active = false;
    this.controller?.fire("tmgdetached", this.controller.payload);
    return ((medium.tmgPlayer = this.controller = this.medium = null), medium);
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
        .catch(({ message }) => this.notice({ error: message, tip: "A valid JSON file is required for parsing your build configuration" }));
    }
    const customBuild = {} as BuildParam,
      attributes = this.medium.getAttributeNames().filter((attr) => attr.startsWith("tmg--"));
    attributes?.forEach((attr) => setHTMLConfig<BuildParam>(customBuild, attr as `tmg--${BuildPaths}`, this.medium!.getAttribute(attr)!));
    if (this.medium instanceof HTMLVideoElement && this.medium.poster) this.configure({ "media.artwork[0].src": this.medium.poster } as any);
    this.configure(customBuild);
  }

  private async deployController() {
    if (this.active || !this.medium?.isConnected) return;
    if (this._build.playlist?.[0]) this.configure(mergeObjs(structuredClone(PLAYLIST_ITEM_BUILD), parseAnyObj(this._build.playlist[0])) as BuildParam);
    if (!(this.medium instanceof HTMLVideoElement)) return this.notice({ error: `Could not deploy custom controls on the '${this.medium.tagName}' element as it is not supported`, warning: "Only the 'VIDEO' element is currently supported", tip: "" });
    this.medium.controls = false;
    this.medium.tmgcontrols = this.active = true;
    this.medium.classList.add(`tmg-${this.medium.tagName.toLowerCase()}`, "tmg-media");
    const modes: Record<string, boolean> = { fullScreen: supportsFullscreen(), pictureInPicture: supportsPictureInPicture() };
    Object.keys(this._build.settings.modes).forEach((k) => ((this._build.settings.modes as any)[k] = (this._build.settings.modes as any)[k] && (modes[String(k)] ?? true) ? (this._build.settings.modes as any)[k] : false));
    await Promise.all([loadResource(window.TMG_VIDEO_CSS_SRC!), loadResource(window.T007_TOAST_JS_SRC!, "script", { module: true }), loadResource(window.T007_INPUT_JS_SRC!, "script")]);
    Controllers[Controllers.indexOf(this._build.id as any)] = this.controller = new Controller(this.medium, this._build);
  }

  private notice({ error, warning, tip }: Partial<Record<"error" | "warning" | "tip", string>>) {
    (error && console.error(`[TMG Player] ${error}`), warning && console.warn(`[TMG Player] ${warning}`), tip && console.info(`[TMG Player] ${tip}`));
  }
}
