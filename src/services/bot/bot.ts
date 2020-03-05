import { Slack } from '../slack/slack';
import { Events } from '../slack/events';
import { Channel } from '../../models/api/slack/channel';
import { MessageParams } from '../../models/api/slack/params/message-params';
import { Database } from '../database/database';
import { UserData } from '../../models/database/user-data';
import { config } from '../../config/config-data';
import { GratitudeUpdate } from '../../models/database/gratitude-data';

export class Bot {
  private token: string;
  private name: string;
  private disconnect: boolean;
  private database: Database;

  private api: Slack;

  constructor() {
    this.token = config.slack.token;
    this.name = config.slack.name;
    this.disconnect = config.slack.disconnect;

    this.api = new Slack({
      token: this.token,
      name: this.name,
      disconnect: this.disconnect,
    });
    this.database = new Database();
  }

  onStart(listener: (...args: any[]) => void) {
    this.api.on(Events.start, listener);
  }

  onMessage(listener: (...args: any[]) => void) {
    this.api.on(Events.message, listener);
  }

  onError(listener: (...args: any[]) => void) {
    this.api.on(Events.error, listener);
  }

  writeMessageToUser(id: string, text: string, params: MessageParams = {}) {
    this.api.postMessageToUser(id, text, params);
  }

  writeMessageToChannel(id: string, text: string, params: MessageParams = {}) {
    this.api.postMessageToChannel(id, text, params);
  }

  getChannels(): Channel[] {
    return this.api.getChannels();
  }

  getGeneralChannel(): Channel | null {
    return this.api.getChannels().find(channel => channel.is_general) || null;
  }

  async giveGratitudePoints(userIdFrom: string, userIdTo: string, points: number): Promise<number> {
    const userFrom: UserData = await this.database.getUser(userIdFrom);
    const userTo: UserData = await this.database.getUser(userIdTo);

    if (points > userFrom.gratitude.toGive) {
      points = userFrom.gratitude.toGive;
    }

    userFrom.gratitude.toGive -= points;
    userTo.gratitude.totalMonth += points;
    userTo.gratitude.totalWeek += points;
    userTo.gratitude.total += points;

    this.database.updateGratitudePoints(userIdFrom, userFrom.gratitude);
    this.database.updateGratitudePoints(userIdTo, userTo.gratitude);

    return points;
  }

  async restartGratitudePoints() {
    const gratitude: GratitudeUpdate = {
      toGive: 15,
      totalWeek: 0,
    }
    await this.database.updateGratitudePointsForAllUsers(gratitude);
  }

  async registerGratitudePointsOfMonth() {
    const now = new Date();
    let month = now.getMonth() + 1;
    let year = now.getFullYear();

    if (month == 1) {
      month = 12;
      year--;
    } else {
      month--;
    }

    const gratitude: GratitudeUpdate = {
      newMonthHistorical: `${year}/${month}`,
      totalMonth: 0,
    }
    await this.database.updateGratitudePointsForAllUsers(gratitude);
  }
}