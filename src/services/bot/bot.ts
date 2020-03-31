import { Slack } from '../slack/slack';
import { Events } from '../slack/events';
import { Channel } from '../../models/slack/channel';
import { MessageParams } from '../../models/slack/params/message-params';
import { Database } from '../database/database';
import { UserData } from '../../models/database/user-data';
import { config } from '../../config/config-data';
import { GratitudeUpdate } from '../../models/database/gratitude-data';
import { User } from '../../models/slack/user';

const initializeSlack = () => new Slack({
  token: config.slack.token,
  name: config.slack.name,
  disconnect: config.slack.disconnect,
});

export class Bot {

  constructor(
    private api: Slack = initializeSlack(),
    private database: Database = new Database()
  ) { }

  onStart(listener: (...args: any[]) => void) {
    this.api.on(Events.start, listener);
  }

  onMessage(listener: (...args: any[]) => void) {
    this.api.on(Events.message, listener);
  }

  onError(listener: (...args: any[]) => void) {
    this.api.on(Events.error, listener);
  }

  writeMessageToUser(userId: string, text: string, params: MessageParams = {}) {
    this.api.postMessageToUser(userId, text, params);
  }

  writeMessageToChannel(channelId: string, text: string, params: MessageParams = {}) {
    this.api.postMessageToChannel(channelId, text, params);
  }

  async getUsers(): Promise<UserData[]> {
    return await this.database.getUsers();
  }

  getSlackUsers(): User[] {
    return this.api.getUsers();
  }

  getChannels(): Channel[] {
    return this.api.getChannels();
  }

  getGeneralChannel(): Channel | null {
    return this.api.getChannels().find(channel => channel.is_general) || null;
  }

  async giveGratitudePoints(userIdFrom: string, userIdTo: string, points: number): Promise<number> {
    if (points == 0) return points;

    const userFrom: UserData = await this.database.getUser(userIdFrom);
    const userTo: UserData = await this.database.getUser(userIdTo);

    if (points > userFrom.gratitude.toGive) {
      points = userFrom.gratitude.toGive;
    }

    userFrom.gratitude.toGive -= points;
    userTo.gratitude.totalWeek += points;
    userTo.gratitude.totalMonth += points;
    userTo.gratitude.total += points;

    this.database.updateGratitudePoints(userIdFrom, userFrom.gratitude);
    this.database.updateGratitudePoints(userIdTo, userTo.gratitude);

    return points;
  }

  async restartGratitudePoints(): Promise<void>  {
    const gratitude: GratitudeUpdate = {
      toGive: 15,
      totalWeek: 0,
    }
    await this.database.updateGratitudePointsForAllUsers(gratitude);
  }

  async registerGratitudePointsOfMonth(){
    const now = new Date(Date.now());
    let month: number = now.getMonth() + 1;
    let year: number = now.getFullYear();

    if (month == 1) {
      month = 12;
      year--;
    } else {
      month--;
    }

    const gratitude: GratitudeUpdate = {
      newHistorical: { month, year },
      totalMonth: 0,
    }

    await this.database.updateGratitudePointsForAllUsers(gratitude);
  }
}