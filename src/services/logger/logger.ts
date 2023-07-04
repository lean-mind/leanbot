import { File } from "../file/file"

export enum LogFiles {
  log = "logs.log",
  error = "errors.log",
}

// TODO: maybe add colors in logs
export class Logger {
  private static info = (message: string, showInConsole = true) => {
    const log = `[${getDateFormatted()}] ${message}`
    if (showInConsole) console.info(log)
    File.write(log, LogFiles.log)
  }

  private static error = (message: string, error?: any) => {
    const log = `[${getDateFormatted()}] ${message}` + (error ? `: ${JSON.stringify(error)}` : "")
    console.error(log)
    File.write(log, LogFiles.error)
    Logger.info(`${message} (see "${LogFiles.error}" file for more info)`, false)
  }

  static log = Logger.info
  static onApiStart = (port: number): void => Logger.info(`API started in port ${port}`)
  static onScheduleStart = (): void => Logger.info(`Scheduler started`)
  static onDBAction = (message: string): void => Logger.info(`Database action: ${message}`)
  static onRequest = (endpoint: string, data: any): void => Logger.info(`${endpoint} -> ${JSON.stringify(data)}`)
  static onResponse = (endpoint: string, data: any): void => Logger.info(`${endpoint} <- ${JSON.stringify(data)}`)

  static onError = (error: any): void => Logger.error(`Oops! There was an error`, error)
  static onDBError = (error: any): void => Logger.error(`Oops! There was an error writing or reading database`, error)
  static onFileReadError = (file: string, error: any): void =>
    Logger.error(`Oops! There was an error reading ${file} file`, error)
  static onFileWriteError = (file: string, error: any): void =>
    Logger.error(`Oops! There was an error writing ${file} file`, error)
  static onMissingTranslation = (file: string, type: string, key: string): void =>
    Logger.error(`Oops! There was an error in ${file} file: { "${type}": { "${key}": "MISSING TRANSLATION" } }`)

  onDBAction(message: string) {
    Logger.onDBAction(message)
  }
}

export const getDateFormatted = (date: Date = new Date(Date.now())): string => {
  const days = date.getDate()
  const months = date.getMonth() + 1
  const years = date.getFullYear()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  return `${days}/${months}/${years} ${hours}:${minutes}:${seconds}`
}
