import { Message } from "../models/message"
import { Bot } from "../services/bot/bot";

export const onGratitude = (bot: Bot, message: Message) => {
  message.usersMentionId.map((userId: string) => {
    if (message.userId === userId) return;

    const text = `*¡<@${message.userId}> te ha dado ${message.gratitudePoints} punto/s de gratitud!*`

    bot.writeMessageToUser(userId, text);
  });
}