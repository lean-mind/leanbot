require('dotenv').config()

interface Config {
  maintenance: boolean
  apiPort: string
  slack: SlackConfig
  mongodb: MongoDBConfig
}

interface SlackConfig {
  readonly token: string
  readonly name: string
  readonly disconnect: boolean
  readonly signingSecret: string
}

interface MongoDBConfig {
  readonly port: string
  readonly database: string
  readonly username: string
  readonly password: string
}

export const config: Config = {
  maintenance: process.env.MAINTENANCE === "true" || false,
  apiPort: process.env.API_PORT || "5051",
  slack: {
    token: process.env.BOT_TOKEN || "xoxb-unknown",
    name: process.env.BOT_NAME || "unknown",
    disconnect: process.env.BOT_DISCONNECT === "true" || false,
    signingSecret: process.env.SLACK_SIGNING_SECRET || "secret-unknown",
  },
  mongodb: {
    port: process.env.MONGODB_PORT || "27017",
    database: process.env.MONGODB_DATABASE || "db-unknown",
    username: process.env.MONGODB_USERNAME || "user-unknown",
    password: process.env.MONGODB_PASSWORD || "pass-unknown",
  },
};