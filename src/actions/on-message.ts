import { Bot } from "../services/bot/bot";
import { Message, MessageType, isMessage } from "../models/message";
import { isError } from "../models/error";
import { onGratitude } from "./on-gratitude";
import { onError } from "./on-error";

export const onMessage = (bot: Bot, data: any) => {
  if (isError(data)) onError(bot, data)

  if (isMessage(data)) {
    const message: Message = new Message(data);
    switch (message.type) {
      case MessageType.Gratitude:
        onGratitude(bot, message);
        break;
    }
  }
}