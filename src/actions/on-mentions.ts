import { Message } from "../models/message"
import { Bot } from "../services/bot/bot";

export const onMentions = (bot: Bot, message: Message) => {
  message.usersMentionId.map((userId: string) => {
    const userMentioned = bot.getSlackUser(userId);
    if (userMentioned === undefined) return;
    if (message.userId === userId) return;

    const text = `*<@${message.userId}> te ha mencionado en el canal <#${message.channelId}>:*\n${message.text}`

    bot.writeMessageToUser(userId, text);
  });
}