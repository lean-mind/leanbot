import { Schedule } from "../services/schedule/schedule";
import { Logger } from "../services/logger/logger";
import { sendThanksSummary } from "../actions/thanks";

export const scheduler = () => {
  const schedule = new Schedule();

  schedule.everyMonday(sendThanksSummary)

  Logger.onScheduleStart();
}