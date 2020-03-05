import { Bot } from "../services/bot/bot";
import { Message, MessageType } from "../models/message";
import { onMentions } from "./on-mentions";
import { onGratitude } from "./on-gratitude";

const isNotMessage = (data) => {
  return data.type !== 'message'
    || data.subtype === 'bot_message'
    || data.subtype === 'message_changed'
    || data.bot_id !== undefined
}

export const onMessage = (bot: Bot, data) => {
  if (isNotMessage(data)) return;

  const message: Message = new Message(data);
  switch (message.type) {
    case MessageType.Mention:
      onMentions(bot, message);
      break;
    case MessageType.Gratitude:
      onGratitude(bot, message);
      break;
  }
}