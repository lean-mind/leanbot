import express from 'express';
import { Logger } from '../logger/logger';
import { onRetrievePoints } from '../../actions/on-retrieve-points';
import { Bot } from '../bot/bot';
import { config } from '../../config/config-data';
import { ApiRoutes } from './api-routes';
import { ApiQuery } from './api-query';

type CallbackResponse = (query: ApiQuery) => void;

export class API {
  private port: number = parseInt(config.apiPort);
  private secret: string = config.slack.signingSecret;

  constructor(
    private bot: Bot,
    private instance = express(),
  ) {
    this.instance.get(ApiRoutes.points, this.response((query: ApiQuery) => {
      onRetrievePoints(this.bot, query.user_id);
    }))

    this.instance.listen(this.port, () => {
      Logger.onApiStart(this.port);
    });
  }

  private response = (callback: CallbackResponse) => (req: any, _: any) => {
    const query = req.query as ApiQuery;

    if (query.token === this.secret) {
      callback(query);
    } else {
      Logger.onError(`Token '${query.token}' is invalid in command ${query.command}`)
    }
  }
}