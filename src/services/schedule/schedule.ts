import { scheduleJob, Job } from 'node-schedule';

type CallbackFunction = () => void;

export class Schedule {
  private jobs: Job[] = []

  constructor(
    private schedule = scheduleJob
  ) { }

  private add = (when: string) => (callback: CallbackFunction) => {
    this.jobs.push(this.schedule(when, callback))
  }

  everyMonday = this.add('0 7 * * 1')

  finish = () => {
    this.jobs.forEach((job: Job) => job.cancel())
    this.jobs = []
  }
}