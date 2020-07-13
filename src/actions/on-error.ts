import { Logger } from "../services/logger/logger"

export const onError = (error: any) => {
  Logger.onError(error)
}