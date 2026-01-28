import { BasePlug } from "./base-plug";

export class TimeTravelPlug extends BasePlug {
  static plugName = "timeTraveller";
  private history: any[] = [];

  protected onSetup() {
    this.ctl.config.on("*", (e) => {
      this.history.push({
        time: Date.now(),
        path: e.target.path,
        value: e.value,
        event: e,
      });
    });
  }

  public exportSession() {
    return JSON.stringify(this.history);
  }

  public replaySession(json: string) {
    const events = JSON.parse(json);
    // Logic to re-apply events one by one...
  }
}
