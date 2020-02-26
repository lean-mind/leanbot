import SlackBot from 'slackbots';
import { Message, MessageType } from "../models/message";
import { onMentions } from "./on_mentions";

const isNotMessage = (data) => {
  return data.type !== 'message'
    || data.subtype === 'bot_message'
    || data.subtype === 'message_changed'
    || data.bot_id !== undefined
}

export const onMessage = (bot: SlackBot, data) => {
  if (isNotMessage(data)) return;
  console.log(data)

  const message: Message = new Message(data);
  switch (message.type) {
    case MessageType.Mention:
      onMentions(bot, message);
      break;
  }
}