import { Schedule } from "../services/schedule/schedule"
import { Logger } from "../services/logger/logger"
import { sendGratitudeSummaries } from "../actions/thanks"

export const scheduler = (): void => {
  const schedule = new Schedule()

  schedule.everyMonday(() => sendGratitudeSummaries())

  Logger.onScheduleStart()
}