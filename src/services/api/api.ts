import { json, urlencoded } from 'body-parser';
import { Logger } from '../logger/logger';
import { config } from '../../config';
import { EndpointInstance, Endpoints } from './endpoints';
import { Emojis } from '../../models/emojis';
import { Slack } from '../platform/slack/slack';
import { Platform } from '../platform/platform';

const getPlatformData = (request: any, getProps: any) => {
  if (Slack.getToken(request) === config.slack.signingSecret) {
    const platform: Platform = new Slack()
    const data = Slack.getBody(request)
    const props = getProps(platform, data)

    return { platform, props }
  }
}

export class API {
  private port: number = parseInt(config.apiPort)

  constructor(
    private instance = require('express')()
  ) {
    this.instance.use(json())
    this.instance.use(urlencoded({ extended: true }))

    Endpoints.forEach(({ name, action, getProps }: EndpointInstance) => {
      this.instance.post(name, async (request: any, response: any) => {
        const data = getPlatformData(request, getProps)
        
        if (config.maintenance) {
          return response.send(`¡Estamos en mantenimiento, sentimos las molestias! ${Emojis.Construction}`)
        }

        if (data) {
          action(data.platform, data.props)
          return response.send()
        }
        
        const errorMessage = "Invalid request"
        Logger.onError(`${errorMessage}: ${request}`)
        return response.send(errorMessage)
      })
    })

    this.instance.listen(this.port, () => Logger.onApiStart(this.port))
  }
}