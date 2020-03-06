import extend from "extend";
import Vow from 'vow';
import request from 'request';
import WebSocket from 'ws';
import { setWsHeartbeat } from 'ws-heartbeat/client';
import { EventEmitter } from 'events';
import { MethodName } from "./methods-name";
import { Params } from "./params";
import { Response } from "../../models/slack/response";
import { Team, TeamNull } from "../../models/slack/team";
import { Channel } from "../../models/slack/channel";
import { User } from "../../models/slack/user";
import { Direct } from "../../models/slack/direct";
import { Group } from "../../models/slack/group";
import { Events } from "./events";
import { MessageParams } from "../../models/slack/params/message-params";

interface Data {
  url: string;
  form: any;
}

export class Slack {
  private apiUrl: string = 'https://slack.com/api/';
  private token: string;
  private emitter: EventEmitter;
  private ws: WebSocket;

  private wsUrl: string = "";
  private self: any;
  private team: Team = new TeamNull();
  private channels: Channel[] = [];
  private users: User[] = [];
  private ims: Direct[] = [];
  private groups: Group[] = [];

  constructor(params) {
    this.emitter = new EventEmitter(params);
    this.token = params.token;

    this.login();
  }

  private login() {
    this.api(MethodName.start).then((data: Response) => {
      this.wsUrl = data.url;
      this.self = data.self;
      this.team = data.team;
      this.channels = data.channels;
      this.users = data.users;
      this.ims = data.ims;
      this.groups = data.groups;

      this.connect()
      this.emitter.emit('start');
    }).fail((data) => {
      this.emitter.emit('error', new Error(data?.error ? data.error : data));
    }).done()
  }

  private connect() {
    this.ws = new WebSocket(this.wsUrl);

    setWsHeartbeat(this.ws, '{ "kind": "ping" }');

    const open = (data) => this.emitter.emit('open', data);
    const close = (data) => this.emitter.emit('close', data);
    const message = (data) => {
      try {
        const messageData = JSON.parse(data)
        this.emitter.emit('message', messageData);
      } catch (e) {
        console.log(e);
      }
    }

    this.ws.on('open', open.bind(this.emitter));
    this.ws.on('close', close.bind(this.emitter));
    this.ws.on('message', message.bind(this.emitter));
  }

  private getData(method: MethodName, params: Params = {}): Data {
    return {
      url: this.apiUrl + method,
      form: this.preprocessParams(params),
    }
  }

  private preprocessParams(params: Params) {
    params = extend(params || {}, {
      token: this.token,
    });

    Object.keys(params).forEach(function (name) {
      var param = params[name];

      if (param && typeof param === 'object') {
        params[name] = JSON.stringify(param);
      }
    });

    return params;
  }

  private api(method: MethodName, params: Params = {}) {
    const data = this.getData(method, params);

    return new Vow.Promise((resolve, reject) => {
      request.post(data, (error, _, data) => {
        if (error) {
          reject(error);
          return;
        }
        try {
          const response = JSON.parse(data);

          if (response.ok) {
            resolve(response);
          } else {
            reject(response.error);
          }
        } catch (e) {
          reject(e);
        }
      })
    })
  }

  private post(type, id, text, params, cb) {
    var method = ({
      'group': 'getGroupId',
      'channel': 'getChannelId',
      'user': 'getChatId',
      'slackbot': 'getUserId'
    })[type];

    if (typeof params === 'function') {
      cb = params;
      params = null;
    }

    const postMessage = (itemId) => {
      return this.message(itemId, text, params);
    }

    return this[method](id).then(
      postMessage.bind(this)
    ).always((data) =>
      cb && cb(data._value)
    );
  }

  private message(id: string, text: string, params: MessageParams) {
    params = extend({
      text: text,
      channel: id,
      username: process.env.BOT_NAME
    }, params || {});

    return this.api(MethodName.postMessage, params);
  }

  postMessageToUser(userId: string, text: string, params: MessageParams) {
    params = extend({
      as_user: true,
    }, params || {});

    this.message(userId, text, params);
  }

  postMessageToChannel(channelId: string, text: string, params: MessageParams) {
    this.message(channelId, text, params);
  }

  getChannels(): Channel[] {
    return this.channels;
  }

  getUsers(): User[] {
    return this.users;
  }

  on(event: Events, listener: (...args: any[]) => void) {
    this.emitter.on(event, listener)
  }
}