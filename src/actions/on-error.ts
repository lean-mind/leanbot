import { Logger } from "../services/logger/logger"
import { Error, ErrorCode } from "../models/error"
import { onSocketExpired } from "./on-socket-expired";
import { Bot } from "../services/bot/bot";

export const onError = (bot: Bot, data: any) => {
  const error: Error = new Error(data.error);

  switch (error.code) {
    case ErrorCode.SocketExpired:
      onSocketExpired(bot);
      break;
    case ErrorCode.MessageNull:
      break;
    default:
      Logger.onError(error)
  }
}