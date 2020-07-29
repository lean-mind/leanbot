import { Bot } from "../services/bot/bot";
import { Body } from "../services/api/api-body";
import { Emojis } from "../models/emojis";
import { Logger } from "../services/logger/logger";
import { User } from "../models/slack/user";

export const random = async (body: Body, response: any, bot: Bot) => {
  try {
    const user = bot.getSlackUser(body.user_id);
    const slackMembers: User[] = bot.getSlackUsers().filter((user: User) => !user.is_bot && !user.deleted);
    const maxUsers: number = slackMembers.length;
    const defaultUsers = 1;
    const words: string[] = body.text.split(' ');
    const param: number = words.length > 0 ? Number.parseInt(words[0]) : defaultUsers;
    const users = isNaN(param) ? defaultUsers : (param > maxUsers ? maxUsers : param);
    const usersSelected: string[] = [];

    for (let i = 0; i < users; i++) {
      const random = Math.floor(Math.random() * slackMembers.length);
      usersSelected.push(`<@${slackMembers[random].id}>`);
      slackMembers.splice(random, 1);
    }

    if (usersSelected.length === 0) {
      response.send(`Vaya, parece que no se ha obtenido ningún resultado ${Emojis.Pepe}`);
      Logger.onRandomError(new Error('Has not given any results'))
    } else {
      const message = `Estos son los ${users} usuarios random: ${Emojis.CongaParrot}\n${usersSelected.join(" ")}`;
      if (body.channel_name !== 'privategroup') {
        bot.writeMessage(body.channel_id, message)
        response.send();
      } else {
        response.send(message);
      }
      Logger.onRandom(user?.real_name ?? "Someone");
    }
  } catch (error) {
    response.send(`Es posible que el número de usuarios que has introducido no sea un número ${Emojis.Pepe}`);
    Logger.onRandomError(error)
  }
}