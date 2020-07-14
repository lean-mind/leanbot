import express from 'express';
import bodyParser from 'body-parser';
import { Logger } from '../logger/logger';
import { onRetrievePoints } from '../../actions/on-retrieve-points';
import { Bot } from '../bot/bot';
import { config } from '../../config/config-data';
import { ApiRoutes } from './api-routes';
import { ApiBody } from './api-body';

type CallbackResponse = (query: ApiBody, response: any) => void;

export class API {
  private port: number = parseInt(config.apiPort);
  private secret: string = config.slack.signingSecret;

  constructor(
    private bot: Bot,
    private instance = express(),
  ) {
    this.instance.use(bodyParser.json())
    this.instance.use(bodyParser.urlencoded({ extended: true }))

    this.instance.post(ApiRoutes.restart, this.response((_: ApiBody, res: any) => {
      bot.restart();
      res.send('I have been restarted, thanks!')
    }))

    this.instance.post(ApiRoutes.points, this.response(async (body: ApiBody, res: any) => {
      const message = await onRetrievePoints(this.bot, body.user_id);
      res.send(message);
    }))

    this.instance.listen(this.port, () => {
      Logger.onApiStart(this.port);
    });
  }

  private response = (callback: CallbackResponse) => (req: any, res: any) => {
    const body = req.body as ApiBody;

    if (body.token === this.secret) {
      callback(body, res);
    } else {
      Logger.onError(`Token '${body.token}' is invalid in command ${body.command}`)
    }
  }
}