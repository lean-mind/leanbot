import { scheduleJob, Job } from "node-schedule"

type CallbackFunction = () => void

export class Schedule {
  private jobs: Job[] = []

  constructor(private schedule = scheduleJob) {}

  private add = (when: any) => (callback: CallbackFunction) => {
    this.jobs.push(this.schedule(when, callback))
  }

  everyMonday = this.add("0 8 * * 1")

  finish = () => {
    this.jobs.forEach((job: Job) => job.cancel())
    this.jobs = []
  }
}
