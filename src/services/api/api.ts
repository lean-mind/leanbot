import express from 'express';
import bodyParser from 'body-parser';
import { Logger } from '../logger/logger';
import { Bot } from '../bot/bot';
import { config } from '../../config/config-data';
import { ApiBody } from './api-body';
import { Endpoints, Endpoint } from '../../endpoints';

export class API {
  private port: number = parseInt(config.apiPort);
  private secret: string = config.slack.signingSecret;
  private endpoints: string[] = Object.keys(Endpoints);

  constructor(
    private bot: Bot,
    private instance = express(),
  ) {
    this.instance.use(bodyParser.json())
    this.instance.use(bodyParser.urlencoded({ extended: true }))

    this.endpoints.forEach((name: string) => {
      const endpoint: Endpoint = Endpoints[name];
      this.instance.post(endpoint.route, async (req: any, res: any) => {
        const body = req.body as ApiBody;

        if (body.token === this.secret) {
          endpoint.function(body, res, this.bot);
        } else {
          Logger.onError(`Token '${body.token}' is invalid in command ${body.command}`)
        }
      });
    });

    this.instance.listen(this.port, () => {
      Logger.onApiStart(this.port);
    });
  }
}