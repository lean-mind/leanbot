import { Bot } from "../services/bot/bot";
import { Body } from "../services/api/api-body";
import { Emojis } from "../models/emojis";
import { Logger } from "../services/logger/logger";

export const help = async (_: Body, response: any, __: Bot) => {
  const message = `Todas mis funcionalidades están disponibles en el repositorio sobre mi ${Emojis.SuperSmileToogethere}`;
  const featuresUrl = `https://github.com/mreysei/leanbot/blob/master/docs/features.md`;
  response.send(`${message}\n${featuresUrl}`);
  Logger.onHelp();
}