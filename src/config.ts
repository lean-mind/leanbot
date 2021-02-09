require('dotenv').config()

interface Config {
  maintenance: boolean
  apiPort: string
  catToken: string
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
  readonly uri: string
  readonly database: string
}

export const config: Config = {
  maintenance: process.env.MAINTENANCE === "true" || false,
  apiPort: process.env.API_PORT || "5051",
  catToken: process.env.CAT_TOKEN || "token-unknown",
  slack: {
    token: process.env.BOT_TOKEN || "xoxb-unknown",
    name: process.env.BOT_NAME || "unknown",
    disconnect: process.env.BOT_DISCONNECT === "true" || false,
    signingSecret: process.env.SLACK_SIGNING_SECRET || "secret-unknown",
  },
  mongodb: {
    uri: process.env.MONGODB_URI || "mongodb://localhost:27017",
    database: process.env.MONGODB_DATABASE || "db-unknown"
  }
};