import { Bot } from "../services/bot/bot";
import { Body } from "../services/api/api-body";
import { Emojis } from "../models/emojis";
import { Logger, LogFiles } from "../services/logger/logger";
import { File } from "../services/file/file";

export const logs = async (body: Body, response: any, bot: Bot) => {
  try {
    const maxLines = 50;
    const defaultLines = 10;
    const user = bot.getSlackUser(body.user_id);
    const words: string[] = body.text.split(' ');
    const param: number = words.length > 0 ? Number.parseInt(words[0]) : defaultLines;
    const numberOfLines = param > maxLines ? maxLines : param;

    let logMessage = getLogsMessage(LogFiles.log, `${Emojis.DrakeYes} *${LogFiles.log}:* `, `No hay logs ${Emojis.Pepe}`, numberOfLines)
    let errorMessage = getLogsMessage(LogFiles.error, `${Emojis.DrakeNo} *${LogFiles.error}:* `, `No hay errores ${Emojis.AwYeah}`, numberOfLines)

    response.send(`${logMessage}\n\n${errorMessage}`);
    Logger.onLogs(user?.real_name ?? "Someone");
  } catch (error) {
    response.send(`Es posible que el número de líneas que has introducido no sea un número ${Emojis.Pepe}`);
    Logger.onLogsError(error)
  }
}

const getLogsMessage = (file: string, initialMessage: string, noLogMessage: string, numberOfLines: number) => {
  const lines = File.readLastLines(file, numberOfLines);
  let message = initialMessage;

  if (lines.length > 0) {
    lines.forEach((line: string) => {
      message += `\n${line}`
    })
  } else {
    message += `\n${noLogMessage}`
  }
  return message;
}