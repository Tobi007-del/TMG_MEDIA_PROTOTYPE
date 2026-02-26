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
  // add jobs, performs and reports sequentially; drop job: reports; cancel job: records, reports when about to perform
  private jobs: QueueJob[] = [];
  private running = false;

  private async handle(): Promise<void> {
    if (this.running) return;
    this.running = true;
    while (this.jobs.length > 0) {
      const job = this.jobs.shift();
      if (job) job.cancelled ? job.resolve({ success: false, cancelled: true, dropped: false }) : (job.preTask?.(), job.resolve(await job.task()));
    }
    this.running = false;
  }

  public add<T = any>(task: () => Promise<T>, id?: string, cancelled?: boolean, preTask?: () => void): Promise<QueueResult | T> {
    return new Promise((resolve) => (this.jobs.push({ task, id, preTask, cancelled, resolve }), this.handle()));
  }

  public drop(id: string): boolean {
    const job = this.jobs.find((j) => j.id === id);
    job?.resolve({ success: false, cancelled: true, dropped: true });
    return (job && this.jobs.splice(this.jobs.indexOf(job), 1), !!job); // stops immediately, cant't remove a running job
  }

  public cancel(id: string): boolean {
    const job = this.jobs.find((j) => j.id === id);
    return (job && (job.cancelled = true), !!job?.cancelled); // stops when it should have for metrics, can't cancel a running job
  }
}
