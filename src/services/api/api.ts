import express from 'express';
import bodyParser from 'body-parser';
import { Logger } from '../logger/logger';
import { Bot } from '../bot/bot';
import { config } from '../../config/config-data';
import { Body } from './api-body';
import { Commands, Command } from '../../commands';

export class API {
  private port: number = parseInt(config.apiPort);
  private secret: string = config.slack.signingSecret;
  private endpoints: string[] = Object.keys(Commands);

  constructor(
    private bot: Bot,
    private instance = express(),
  ) {
    this.instance.use(bodyParser.json())
    this.instance.use(bodyParser.urlencoded({ extended: true }))

    this.endpoints.forEach((name: string) => {
      const command: Command = Commands[name];
      this.instance.post(command.name, async (req: any, res: any) => {
        const body = req.body as Body;

        if (body.token === this.secret) {
          command.function(body, res, this.bot);
        } else {
          Logger.onError(`Token '${body.token}' is invalid in command ${body.command}`)
        }
      });
    });

    this.instance.get('/status', async (_: any, res: any) => {
      res.send({
        "schemaVersion": 1,
        "label": "Status",
        "message": this.bot.isConnected ? "Online" : "Offline",
        "color": this.bot.isConnected ? "green" : "red"
      });
    })

    this.instance.get('/gratitude-points', async (_: any, res: any) => {
      const points = await this.bot.getAllGratitudePoints();
      res.send({
        "schemaVersion": 1,
        "label": "Gratitude points given",
        "message": points.toString(),
        "color": "blue"
      });
    })

    this.instance.listen(this.port, () => {
      Logger.onApiStart(this.port);
    });
  }
}