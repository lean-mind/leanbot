import { File } from "../file/file";

export enum LogFiles {
  log = "logs.log",
  error = "errors.log"
}

export class Logger {
  private static info = (message: String, showInConsole: boolean = true) => {
    const log = `${getDateFormatted()} ${message}`;
    if (showInConsole) console.info(log);
    File.write(log, LogFiles.log);
  }

  private static error = (message: String, error?: any) => {
    const log = `${getDateFormatted()} ${message}` + (error ? `: ${error}` : "");
    console.error(log);
    File.write(log, LogFiles.error);
    Logger.info(`${message} (see "${LogFiles.error}" file for more info)`, false);
  }

  static log = Logger.info;
  static onApiStart = (port: number) => Logger.info(`API started in port ${port}`);
  static onScheduleStart = () => Logger.info(`Scheduler started`);

  static onError = (error: any) => Logger.error(`Oops! There was an error`, error);
  static onDBError = (error: any) => Logger.error(`Oops! There was an error writing or readind database`, error);
  static onFileReadError = (file: string, error: any) => Logger.error(`Oops! There was an error reading ${file} file`, error);
  static onFileWriteError = (file: string, error: any) => Logger.error(`Oops! There was an error writing ${file} file`, error);
  static onMissingTranslation = (file: string, type: string, key: string) => Logger.error(`Oops! There was an error in ${file} file: { "${type}": { "${key}": "MISSING TRANSLATION" } }`);
}
 
export const getDateFormatted = (date: Date = new Date(Date.now())) => {
  const days = date.getDate();
  const months = date.getMonth() + 1;
  const years = date.getFullYear();
  const hours = date.getHours();
  const mins = date.getMinutes();
  const seconds = date.getSeconds();
  return `[${days}/${months}/${years} ${hours}:${mins}:${seconds}]`
}