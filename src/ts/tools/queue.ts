export interface QueueJob<T = any> {
  task: () => Promise<T>;
  id?: string;
  preTask?: () => void;
  cancelled?: boolean;
  resolve: (value: any) => void;
}

export interface QueueResult {
  success: boolean;
  cancelled: boolean;
  dropped: boolean;
}

// for ffmpeg future tasks
export class AsyncQueue {
  private jobs: QueueJob[] = [];
  private running = false;

  private async _handle(): Promise<void> {
    if (this.running) return;
    this.running = true;
    while (this.jobs.length > 0) {
      const job = this.jobs.shift();
      if (job) {
        job.cancelled ? job.resolve({ success: false, cancelled: true, dropped: false }) : (job.preTask?.(), job.resolve(await job.task()));
      }
    }
    this.running = false;
  }

  add = <T = any>(task: () => Promise<T>, id?: string, cancelled?: boolean, preTask?: () => void): Promise<QueueResult | T> => new Promise((resolve) => (this.jobs.push({ task, id, preTask, cancelled, resolve }), this._handle()));

  drop(id: string): boolean {
    const job = this.jobs.find((j) => j.id === id);
    job?.resolve({ success: false, cancelled: true, dropped: true });
    return job ? (this.jobs.splice(this.jobs.indexOf(job), 1), true) : false;
  }

  cancel(id: string): boolean {
    const job = this.jobs.find((j) => j.id === id);
    return job ? ((job.cancelled = true), !!job.cancelled) : false;
  }
}
