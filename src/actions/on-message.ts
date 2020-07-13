import { Bot } from "../services/bot/bot";
import { Message, MessageType } from "../models/message";
import { Error, ErrorCode } from "../models/error";
import { onGratitude } from "./on-gratitude";
import { onSocketExpired } from "./on-socket-expired";
import { onError } from "./on-error";

const isMessage = (data: any) => {
  return data.type === 'message'
    && data.subtype !== 'bot_message'
    && data.subtype !== 'message_changed'
    && data.bot_id === undefined
}

const isError = (data: any) => {
  return data.type === 'error' && data.error !== undefined
}

export const onMessage = (bot: Bot, data: any) => {
  if (isError(data)) {
    const error: Error = new Error(data.error);
    switch (error.code) {
      case ErrorCode.SocketExpired:
        onSocketExpired(bot);
        break;
      case ErrorCode.MessageNull:
        break;
      default:
        onError(error)
    }
  }

  if (isMessage(data)) {
    const message: Message = new Message(data);
    switch (message.type) {
      case MessageType.Gratitude:
        onGratitude(bot, message);
        break;
    }
  }
}