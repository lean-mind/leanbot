import * as jwt from "jsonwebtoken";
import { json, urlencoded } from "body-parser";
import { Logger } from "../logger/logger";
import { config } from "../../config";
import { EndpointInstance, Endpoints } from "./endpoints";
import { Emojis } from "../../models/emojis";
import { Slack } from "../platform/slack/slack";
import { Platform } from "../platform/platform";
import { Community } from "../../models/database/community";
import { Database } from "../database/database";
import { QueryOptions } from "../database/mongo/methods/query";
import { OAuth2Client } from "google-auth-library";

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

const decodeGoogleToken = async (client: OAuth2Client, request: any) => {
  const authorization: string = request.get("authorization")
  const bearer = "bearer "
  if (authorization && authorization.toLowerCase().startsWith(bearer)) {
    const token = authorization.substring(bearer.length)
    return await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID
    }).then(ticket => ticket.getPayload())
  }
}

const decodeIdToken = (token: string) => {
  console.log(token)
  return jwt.verify(token, process.env.PASS, function (error, decode){
    if(error){
      throw new Error(error)
    }
    return decode
  })
}

interface SignUpQuery {
  id: string
}

export class API {
  private port: number = parseInt(config.apiPort)

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    private instance = require('express')(),
    private client = new OAuth2Client(process.env.CLIENT_ID)
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
      const options: QueryOptions = request.query
      const gratitudeMessages = await db.getGratitudeMessages(options)
      return response.send(gratitudeMessages)
    })
    
    this.instance.get("/coffeeBreaks", async (request: any, response: any) => {
      const options: QueryOptions = request.query
      const coffeeBreaks = await db.getCoffeeBreaks(options)
      return response.send(coffeeBreaks)
    })
    
    this.instance.get("/users/:id", async (request: any, response: any) => {
      const userId: string = request.params.id
      const { id, name } = await Slack.getInstance().getUserInfo(userId) ?? { id: "", name: ""}
      return response.send({ id, name })
    })

    this.instance.post("/auth", async (request: any, response: any) => {
      const decodedToken = await decodeGoogleToken(this.client, request);
      console.log("/auth <--", decodedToken)

      return response.send()
    })

    this.instance.post("/signup", async (request: any, response: any) => {
      const options: SignUpQuery = request.query
      try {
        const decodedGoogleToken = await decodeGoogleToken(this.client, request)
        const decodedIdToken = decodeIdToken(options.id)
        console.log("/signup <--", decodedGoogleToken, decodedIdToken)
        return response.send()
      } catch (error) {
        console.log(error)
        return response.send(`Invalid token: ${error}`)
      }
    })
    
    this.instance.listen(this.port, () => Logger.onApiStart(this.port))
  }
}