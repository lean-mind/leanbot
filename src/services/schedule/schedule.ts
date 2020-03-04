import { scheduleJob } from 'node-schedule';

type CallbackFunction = () => void;

export class Schedule {

  constructor(
    private schedule = scheduleJob
  ) { }

  everyWeek(callback: CallbackFunction) {
    const allMondays = '0 0 9 * * 1';
    this.schedule(allMondays, callback)
  }

  everyDay(callback: CallbackFunction) {
    const allDays = '0 0 9 * * 1-5';
    this.schedule(allDays, callback)
  }
}