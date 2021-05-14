import * as https from "https"
import * as fs from "fs"
import * as jwt from "jsonwebtoken";
import { json, urlencoded } from "body-parser"
import { getDateFormatted, Logger } from "../logger/logger"
import { config } from "../../config"
import { EndpointInstance, Endpoints } from "./endpoints"
import { Emojis } from "../../models/emojis"
import * as morgan from "morgan"
import { registerCommunity } from "./methods/register-community"
import { getPlatformData } from "./methods/get-platform-data"
import { Slack } from "../platform/slack/slack"
import { Database } from "../database/database"
import { QueryOptions } from "../database/mongo/methods/query"
import { OAuth2Client } from "google-auth-library"

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

// eslint-disable-next-line @typescript-eslint/no-var-requires
const app = require("express")()
const client = new OAuth2Client(process.env.CLIENT_ID)

app.use(json())
app.use(urlencoded({ extended: true }))

morgan.token("date", () => getDateFormatted())
app.use(morgan(":date :method :url :status :res[content-length] - :response-time ms"))

Endpoints.forEach(({ name, action, getProps }: EndpointInstance) => {
  app.post(name, async (request: any, response: any) => {
    const { platform, data } = await getPlatformData(request)

    if (config.maintenance) {
      return response.send(`¡Estamos en mantenimiento, sentimos las molestias! ${Emojis.Construction}`)
    }

    if (platform && data) {
      await registerCommunity(platform, data)
      const props = await platform.getPlatformProps(data, getProps)
      action(platform, props)
      return response.send()
    }

    const errorMessage = "Invalid request"
    Logger.onError(`${errorMessage}: ${request}`)
    return response.send(errorMessage)
  })
})

const db: Database = Database.make()

app.get("/gratitudeMessages", async (request: any, response: any) => {
  // TODO: maintenance??
  const options: QueryOptions = request.query
  const gratitudeMessages = await db.getGratitudeMessages(options)
  return response.send(gratitudeMessages)
})

app.get("/coffeeBreaks", async (request: any, response: any) => {
  const options: QueryOptions = request.query
  const coffeeBreaks = await db.getCoffeeBreaks(options)
  return response.send(coffeeBreaks)
})

app.get("/users/:id", async (request: any, response: any) => {
  const userId: string = request.params.id
  const { id, name } = await Slack.getInstance().getUserInfo(userId) ?? { id: "", name: ""}
  return response.send({ id, name })
})

app.post("/auth", async (request: any, response: any) => {
  const decodedToken = await decodeGoogleToken(client, request);
  console.log("/auth <--", decodedToken)

  return response.send()
})

app.post("/signup", async (request: any, response: any) => {
  const options: SignUpQuery = request.query
  try {
    const decodedGoogleToken = await decodeGoogleToken(client, request)
    const decodedIdToken = decodeIdToken(options.id)
    console.log("/signup <--", decodedGoogleToken, decodedIdToken)
    return response.send()
  } catch (error) {
    console.log(error)
    return response.send(`Invalid token: ${error}`)
  }
})

export const httpsApp = https.createServer({
  key: fs.readFileSync(process.env.HTTPS_KEY ?? ""),
  cert: fs.readFileSync(process.env.HTTPS_CERT ?? ""),
  ca: fs.readFileSync(process.env.HTTPS_CHAIN ?? "")
}, app)
