import { Controller } from "../../../core/controller";
import { BasePlug, type KeysPlug, ModesFullscreenPin, ModesTheaterPin, ModesPictureInPicturePin, ModesMiniplayerPin, Modes, MODES_BUILD } from "../..";

export class ModesPlug extends BasePlug<Modes> {
  public static readonly plugName: string = "modes";
  public static readonly BUILD = MODES_BUILD;
  public fullscreen!: ModesFullscreenPin;
  public theater!: ModesTheaterPin;
  public pip!: ModesPictureInPicturePin;
  public miniplayer!: ModesMiniplayerPin;

  constructor(ctlr: Controller, config: Modes) {
    super(ctlr, config);
    // Variables Assignment
    this.fullscreen = new ModesFullscreenPin(this.ctlr, this.config.fullscreen).setup();
    this.theater = new ModesTheaterPin(this.ctlr, this.config.theater).setup();
    this.pip = new ModesPictureInPicturePin(this.ctlr, this.config.pictureInPicture).setup();
    this.miniplayer = new ModesMiniplayerPin(this.ctlr, this.config.miniplayer).setup();
    if (this.ctlr.config.initialMode) this.media.intent[this.ctlr.config.initialMode] = true; // one-time courtesy, use for theater mode maybe
  }

  public override wire(): void {
    // Utility Injection
    this.fullscreen.wire();
    this.theater.wire();
    this.pip.wire();
    this.miniplayer.wire();
    // Post Wiring
    const keys = this.ctlr.plug<KeysPlug>("keys");
    keys?.register("fullscreen", () => (this.media.intent.fullscreen = !this.media.state.fullscreen), { phase: "keyup" });
    keys?.register("theater", () => !this.ctlr.isUIActive("fullscreen") && !this.ctlr.isUIActive("miniplayer") && !this.ctlr.isUIActive("floatingPlayer") && (this.media.intent.theater = !this.media.state.theater), { phase: "keyup" });
    keys?.register("pictureInPicture", () => (this.media.intent.pictureInPicture = !this.media.state.pictureInPicture), { phase: "keyup" });
  }

  protected override onDestroy(): void {
    super.onDestroy();
    this.fullscreen?.destroy();
    this.theater?.destroy();
    this.pip?.destroy();
    this.miniplayer?.destroy();
  }
}

export type * from "./types";
export * from "./build";
export * from "./fullscreen";
export * from "./theater";
export * from "./pictureInPicture";
export * from "./miniplayer";
