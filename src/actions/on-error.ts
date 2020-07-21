import { Logger } from "../services/logger/logger"
import { Error, ErrorCode } from "../models/error"
import { Bot } from "../services/bot/bot";

export const onError = (bot: Bot, data: any) => {
  const error: Error = new Error(data.error);
  const errorHandler = {
    [ErrorCode.Undefined]: () => { Logger.onError(error) },
    [ErrorCode.MessageNull]: () => { },
  }

  errorHandler[error.code]();
}