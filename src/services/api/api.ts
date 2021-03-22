import { GratitudeMessageOptions } from './../../models/database/gratitude-message';
import { json, urlencoded } from 'body-parser';
import { Logger } from '../logger/logger';
import { config } from '../../config';
import { EndpointInstance, Endpoints } from './endpoints';
import { Emojis } from '../../models/emojis';
import { Slack } from '../platform/slack/slack';
import { Platform } from '../platform/platform';
import { Community } from '../../models/database/community';
import { Database } from '../database/database';

const getPlatformData = async (request: any) => {
  const db = Database.make()

  if (Slack.getToken(request) === config.platform.slack.signingSecret) {
    const platform: Platform = Slack.getInstance()
    const data = Slack.getBody(request)
    const community: Community = { id: data.team_id, platform: "slack" }
    await db.registerCommunity(community)

    return { platform, data }
  }
}

const getPlatformProps = async (platform: Platform, data, getProps) => {
  return await getProps(platform, data)
}

export class API {
  private port: number = parseInt(config.apiPort)

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    private instance = require('express')()
  ) {
    this.instance.use(json())
    this.instance.use(urlencoded({ extended: true }))

    Endpoints.forEach(({ name, action, getProps }: EndpointInstance) => {
      this.instance.post(name, async (request: any, response: any) => {
        const data = await getPlatformData(request)
        
        if (config.maintenance) {
          return response.send(`¡Estamos en mantenimiento, sentimos las molestias! ${Emojis.Construction}`)
        }
        
        if (data) {
          const props = await getPlatformProps(data.platform, data.data, getProps)
          action(data.platform, props)
          return response.send()
        }
        
        const errorMessage = "Invalid request"
        Logger.onError(`${errorMessage}: ${request}`)
        return response.send(errorMessage)
      })
    })

    const db: Database = Database.make()
    
    this.instance.get("/gratitudeMessages", async (request: any, response: any) => {
      // TODO: maintenance??
      const options: GratitudeMessageOptions = request.query
      const gratitudeMessages = await db.getGratitudeMessages(options)
      return response.send(gratitudeMessages)
    })
    // TODO: /coffeeBreaks

    this.instance.listen(this.port, () => Logger.onApiStart(this.port))
  }
}