import * as https from "https"
import * as fs from "fs"
import { json, urlencoded } from "body-parser"
import { getDateFormatted, Logger } from "../logger/logger"
import { config } from "../../config"
import { EndpointInstance, Endpoints } from "./endpoints"
import { Emojis } from "../../models/emojis"
import * as morgan from "morgan"
import { registerCommunity } from "./methods/register-community"
import { getPlatformData } from "./methods/get-platform-data"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const app = require("express")()
app.use(json())
app.use(urlencoded({ extended: true }))

morgan.token("date", () => {
  return `[${getDateFormatted()}]`
})
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

export const httpsApp = https.createServer(
  {
    key: fs.readFileSync(process.env.HTTPS_KEY ?? ""),
    cert: fs.readFileSync(process.env.HTTPS_CERT ?? ""),
    ca: fs.readFileSync(process.env.HTTPS_CHAIN ?? ""),
  },
  app
)
