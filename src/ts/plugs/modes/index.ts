import { Controller } from "../../core/controller";
import { BasePlug, type KeysPlug } from "../";
import { FullscreenModule, type FullscreenModuleConfig } from "./fullscreen";
import { TheaterConfig, TheaterModule } from "./theater";
import { PictureInPictureModule, type PictureInPictureModuleConfig } from "./pictureInPicture";
import { MiniplayerModule, type MiniplayerModeConfig } from "./miniplayer";
export * from "./fullscreen";
export * from "./theater";
export * from "./pictureInPicture";
export * from "./miniplayer";

export interface Modes {
  fullscreen: FullscreenModuleConfig;
  theater: TheaterConfig;
  pictureInPicture: PictureInPictureModuleConfig;
  miniplayer: MiniplayerModeConfig;
}

export class ModesPlug extends BasePlug<Modes> {
  public static readonly plugName = "modes";
  public fullscreen!: FullscreenModule;
  public theater!: TheaterModule;
  public pip!: PictureInPictureModule;
  public miniplayer!: MiniplayerModule;

  constructor(ctlr: Controller, config: Modes) {
    super(ctlr, config);
    this.fullscreen = new FullscreenModule(this.ctlr, this.config.fullscreen);
    this.theater = new TheaterModule(this.ctlr, this.config.theater);
    this.pip = new PictureInPictureModule(this.ctlr, this.config.pictureInPicture);
    this.miniplayer = new MiniplayerModule(this.ctlr, this.config.miniplayer);
    if (this.ctlr.config.initialMode) this.media.intent[this.ctlr.config.initialMode] = true; // one-time courtesy, use for theater mode maybe
  }

  public wire(): void {
    this.fullscreen.wire();
    this.theater.wire();
    this.pip.wire();
    this.miniplayer.wire();
    // Post Wiring
    const keys = this.ctlr.getPlug<KeysPlug>("keys");
    keys?.register("pictureInPicture", () => (this.media.intent.pictureInPicture = !this.media.state.pictureInPicture), { phase: "keyup" });
    keys?.register("theater", () => !this.ctlr.isUIActive("fullscreen") && !this.ctlr.isUIActive("miniplayer") && !this.ctlr.isUIActive("floatingPlayer") && (this.media.intent.theater = !this.media.state.theater), { phase: "keyup" });
    keys?.register("fullscreen", () => (this.media.intent.fullscreen = !this.media.state.fullscreen), { phase: "keyup" });
  }

  protected override onDestroy(): void {
    super.onDestroy();
    this.fullscreen?.destroy();
    this.theater?.destroy();
    this.pip?.destroy();
    this.miniplayer?.destroy();
  }
}
