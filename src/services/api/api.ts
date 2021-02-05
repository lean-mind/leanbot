import { json, urlencoded } from 'body-parser';
import { Logger } from '../logger/logger';
import { config } from '../../config';
import { Body } from '../../models/api/body';
import { Endpoints } from './endpoints';
import { Emojis } from '../../models/emojis';

export class API {
  private port: number = parseInt(config.apiPort);
  private secret: string = config.slack.signingSecret;

  constructor(
    private instance = require('express')()
  ) {
    this.instance.use(json())
    this.instance.use(urlencoded({ extended: true }))

    Endpoints.forEach(({ name, action }) => {
      this.instance.post(name, async (req: any, res: any) => {
        if (config.maintenance) {
          res.send(`¡Estamos en mantenimiento, sentimos las molestias! ${Emojis.Construction}`)
        } else {
          const payload = req.body.payload ? JSON.parse(req.body.payload) : {}
          const body = { ...req.body, payload } as Body
  
          if (body?.token === this.secret || body.payload?.token === this.secret) {
            action(body)
            res.send()
          } else {
            Logger.onError(`Token '${body.token}' is invalid in command ${name}`)
            res.send(`Token is invalid in command ${name}`)
          }
        }
      })
    })

    this.instance.listen(this.port, () => Logger.onApiStart(this.port))
  }
}