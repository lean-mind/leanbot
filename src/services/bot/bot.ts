import { Slack } from '../slack/slack';
import { Events } from '../slack/events';
import { User } from '../../models/api/slack/user';
import { Channel } from '../../models/api/slack/channel';
import { MessageParams } from '../../models/api/slack/params/message_params';

export class Bot {
  private token: string;
  private name: string;
  private disconnect: boolean;

  private api: Slack;

  constructor() {
    this.token = process.env.BOT_TOKEN ?? "xoxb-unknown";
    this.name = process.env.BOT_NAME ?? "unknown";
    this.disconnect = process.env.BOT_DISCONNECT === "true";

    this.api = new Slack({
      token: this.token,
      name: this.name,
      disconnect: this.disconnect,
    });
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
}