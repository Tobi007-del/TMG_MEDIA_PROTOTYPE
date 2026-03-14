import { Controller } from "../../core/controller";
import { BasePlug } from "../";
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
  }

  public wire(): void {
    this.fullscreen.wire();
    this.theater.wire();
    this.pip.wire();
    this.miniplayer.wire();
  }

  protected override onDestroy(): void {
    super.onDestroy();
    this.fullscreen?.destroy();
    this.theater?.destroy();
    this.pip?.destroy();
    this.miniplayer?.destroy();
  }
}
