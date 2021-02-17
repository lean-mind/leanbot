import { Schedule } from "../services/schedule/schedule";
import { Logger } from "../services/logger/logger";
import { sendGratitudeSummaries } from "../actions/thanks";

export const scheduler = () => {
  const schedule = new Schedule();

  schedule.everyMonday(() => sendGratitudeSummaries())

  Logger.onScheduleStart();
}