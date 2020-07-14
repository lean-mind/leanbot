import { Logger } from "../services/logger/logger"
import { Error, ErrorCode } from "../models/error"
import { onSocketExpired } from "./on-socket-expired";
import { Bot } from "../services/bot/bot";

export const onError = (bot: Bot, data: any) => {
  const error: Error = new Error(data.error);
  const errorHandler = {
    [ErrorCode.Undefined]: () => { Logger.onError(error) },
    [ErrorCode.SocketExpired]: () => { onSocketExpired(bot) },
    [ErrorCode.MessageNull]: () => { },
  }

  errorHandler[error.code]();
}