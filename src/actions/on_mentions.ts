import SlackBot from 'slackbots';
import { Message } from "../models/message"

export const onMentions = (bot: SlackBot, message: Message) => {
  message.usersMentionId.map((userId: string) => {
    const text = `*<@${message.userId}> te ha mencionado en el canal <#${message.channelId}>:*\n <${message.messageId}>`
    bot.postMessage(userId, text, {
      as_user: true
    });
    // bot.postTo("maikelreyes96", text, {});
  });
}