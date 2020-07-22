import { scheduleJob, Job } from 'node-schedule';

type CallbackFunction = () => void;

export class Schedule {
  private jobs: Job[] = []

  constructor(
    private schedule = scheduleJob
  ) { }

  everyFirstDayOfMonth(callback: CallbackFunction) {
    this.add('0 7 * 1 *', callback);
  }

  everyMonday(callback: CallbackFunction) {
    this.add('0 7 * * 1', callback);
  }

  everyFriday(callback: CallbackFunction) {
    this.add('0 7 * * 5', callback);
  }

  everyWorkingDay(callback: CallbackFunction) {
    this.add('0 6 * * 1-5', callback);
  }

  private add(when: string, callback: CallbackFunction) {
    this.jobs.push(this.schedule(when, callback));
  }

  finish() {
    this.jobs.forEach((job: Job) => {
      job.cancel();
    });
    this.jobs = [];
  }
}