// building this file with just AI to test architectural soundness
import { BasePlug } from "./base";
import { Event } from "../core/reactor";
import { setTimeout, setAny, deleteAny } from "../utils";

/**
 * HISTORY ENTRY: The DNA of a specific moment in time.
 * Records the 'Desire' (Intent) or the 'Fact' (State).
 */
interface HistoryEntry {
  type: string; // Was it a 'set' or a 'delete' surgery?
  path: string; // The surgical address in the Reactor
  value: any; // The data payload at that moment
  phase: number; // Capture (Physician) or Bubble (Artist)
  rejected: string; // Did the Power Line disapprove?; why?
  timestamp: number; // For chronological re-enactment
}

export type TimeTravel = undefined;

/**
 * TIME TRAVEL PLUG: The Flight Recorder (Black Box).
 * Implements S.I.A. logic to allow playback, teleportation, and undos.
 */
export class TimeTravelPlug extends BasePlug<TimeTravel> {
  static plugName = "timeTraveller";
  protected history: HistoryEntry[] = [];
  protected initialState: any = null; // The "Genesis" snapshot (Raw Data)
  protected isReplaying = false; // Flag to prevent recursive recording
  protected stopRequested = false; // The emergency brake for playSession
  protected currentFrame = -1; // The manual playhead
  protected playbackTimer: any = null;

  protected onSetup() {
    // 1. Genesis: Capture the absolute truth before the first wish.
    // .snapshot() ensures we hold raw data, not reactive proxies.
    this.initialState = this.ctl.media.snapshot();
    const opts = { signal: this.signal, capture: false };
    // We listen to the BUBBLE phase of the ROOT (*)
    // to record the settled outcome of every wave.
    this.ctl.media.on("intent", (e) => this.record(e), opts);
    this.ctl.media.on("state", (e) => this.record(e), opts);
    this.ctl.media.on("settings", (e) => this.record(e), opts);
  }

  /**
   * RECORD: Chronicling the lifecycle of the system.
   */
  protected record(e: Event<any>) {
    if (this.isReplaying) return;
    this.history.push({ timestamp: Date.now(), path: e.target.path, type: e.staticType, value: e.value, phase: e.eventPhase, rejected: e.rejected });
  }

  public exportSession() {
    return JSON.stringify({ initial: this.initialState, data: this.history });
  }

  public loadSession(json: string) {
    try {
      const parsed = JSON.parse(json);
      this.pauseSession();
      this.history = parsed.data;
      this.initialState = parsed.initial;
      this.jumpTo(-1); // Resync the Tech and UI to the imported Genesis
    } catch (e) {
      this.ctl.log("Failed to load session", "error");
    }
  }

  /**
   * PLAY SESSION: Chronological re-enactment.
   * Replays the "Story" by respecting the delays between events.
   */
  public async playSession() {
    if (this.isReplaying && !this.stopRequested) return;
    this.isReplaying = true;
    this.stopRequested = false;
    for (let i = this.currentFrame + 1; i < this.history.length; i++) {
      if (this.stopRequested) break;
      const e = this.history[i],
        delay = this.history[i + 1] ? this.history[i + 1].timestamp - e.timestamp : 0;
      this.currentFrame = i;
      await new Promise((res) => {
        // We cap the delay at 2s to keep the "Dev Experience" snappy
        this.playbackTimer = setTimeout(() => (this.applyEntry(e), res(0)), Math.min(delay, 2000));
      });
    }
    if (!this.stopRequested) this.isReplaying = false;
  }

  public pauseSession() {
    this.stopRequested = true;
    clearTimeout(this.playbackTimer);
  }

  /**
   * JUMP TO (Teleport): Instant state reconstruction.
   * Collapses history into a single "Truth" map and injects it.
   */
  public jumpTo(index: number) {
    this.isReplaying = true;
    this.currentFrame = Math.max(-1, Math.min(index, this.history.length - 1));
    // Snapshot map avoids "flicker" by calculating the final value per path first
    const snapshot = new Map<string, { value: any; type: string }>();
    // 1. Establish the Floor (Genesis)
    const loadBase = (obj: any, prefix: string) => Object.keys(obj).forEach((p) => snapshot.set(`${prefix}.${p}`, { value: obj[p], type: "set" }));
    loadBase(this.initialState.intent, "intent");
    loadBase(this.initialState.state, "state");
    loadBase(this.initialState.settings, "settings");
    // 2. Overwrite Genesis with the Timeline up to target
    if (this.currentFrame !== -1) {
      for (let i = 0; i <= this.currentFrame; i++) {
        const e = this.history[i];
        snapshot.set(e.path, { value: e.value, type: e.type });
      }
    }
    // 3. Surgical Application: Direct-path injection into Reactors
    snapshot.forEach((entry, path) => {
      const isState = path.startsWith("state");
      entry.type === "delete" ? deleteAny(this.ctl.media, path as any) : setAny(this.ctl.media, path as any, entry.value);
      isState && this.ctl.media.tick(path.replace("state.", "") as any); //  Flush state to sync the Tech and UI instantly
    });
    this.isReplaying = false;
  }

  public step(forward = true) {
    this.pauseSession();
    forward ? this.jumpTo(this.currentFrame + 1) : this.jumpTo(this.currentFrame - 1);
  }

  /**
   * REWIND (The Ctrl+Z): Destructive undo.
   * Pops history entries and teleports the world to the new tail.
   */
  public rewind(steps = 1) {
    this.isReplaying = true;
    while (steps-- > 0 && this.history.length) this.history.pop();
    this.jumpTo(this.history.length - 1);
    this.isReplaying = false;
  }

  /**
   * APPLY ENTRY: Internal dispatcher for single-event re-enactment.
   */
  protected applyEntry(e: HistoryEntry) {
    const isState = e.path.startsWith("state");
    e.type === "delete" ? deleteAny(this.ctl.media, e.path as any) : setAny(this.ctl.media, e.path as any, e.value);
    // Only "Facts" (State) need immediate flush. Intents and Settings stay in the sky.
    isState && this.ctl.media.tick(e.path.replace("state.", "") as any);

    if (e.rejected) this.ctl.log(`Replaying REJECTED ${e.path}`, "warn");
  }
}
