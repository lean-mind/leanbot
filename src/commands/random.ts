import { Bot } from "../services/bot/bot";
import { Body } from "../services/api/api-body";
import { Emojis } from "../models/emojis";
import { Logger } from "../services/logger/logger";
import { User } from "../models/slack/user";

export const random = async (body: Body, response: any, bot: Bot) => {
  try {
    const user = bot.getSlackUser(body.user_id);
    const slackMembers = bot.getSlackUsers().filter((user: User) => !user.is_bot && !user.deleted);
    const maxUsers = slackMembers.length;
    const defaultUsers = 1;
    const words: string[] = body.text.split(' ');
    const param: number = words.length > 0 ? Number.parseInt(words[0]) : defaultUsers;
    const users = param > maxUsers ? maxUsers : param;
    const usersSelected: string[] = [];

    for (let i = 0; i < users; i++) {
      const random = Math.floor(Math.random() * slackMembers.length);
      usersSelected.push(`<@${slackMembers[random].id}>`);
      slackMembers.splice(random, 1);
    }

    if (usersSelected.length > 0) {
      response.send(`Vaya, parece que no se ha obtenido ningún resultado ${Emojis.Pepe}`);
      Logger.onRandomError(new Error('Has not given any results'))
    } else {
      const id = body.channel_id ?? body.team_id;
      bot.writeMessage(id, `Estos son los ${users} usuarios random: ${Emojis.CongaParrot}\n${usersSelected.join(" ")}`)
      Logger.onRandom(user?.real_name ?? "Someone");
    }
  } catch (error) {
    response.send(`Es posible que el número de usuarios que has introducido no sea un número ${Emojis.Pepe}`);
    Logger.onRandomError(error)
  }
}