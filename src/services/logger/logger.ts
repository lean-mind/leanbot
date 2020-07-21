export class Logger {
  private static info = (message: String) => console.info(`${currentTime()} ${message}`);
  private static error = (message: String, error: any) => console.error(`${currentTime()} ${message}:`, error);

  static onStart = () => Logger.info(`Bot started`);
  static onClose = () => Logger.info(`Bot stopped`);
  static onApiStart = (port: number) => Logger.info(`API started in port ${port}`);
  static onRestartGratitude = () => Logger.info(`Weekly points have been restarted`);
  static onRegisterGratitude = () => Logger.info(`Monthly points have been registered`);
  static onGratitude = (userFrom: string, userTo: string, points: number) => Logger.info(`${userTo} have been given ${points} points of gratitude from ${userFrom}`);
  static onRetrievePoints = (user: string) => Logger.info(`${user} has retrieve their points`);
  static onError = (error: any) => Logger.error(`Oops! There was a error`, error);
}

const currentTime = () => {
  const now: Date = new Date();
  const days = now.getDate();
  const months = now.getMonth() + 1;
  const years = now.getFullYear();
  const hours = now.getHours();
  const mins = now.getMinutes();
  const seconds = now.getSeconds();
  return `[${days}/${months}/${years} ${hours}:${mins}:${seconds}]`
}