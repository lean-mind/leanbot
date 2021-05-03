import { CoffeeBreak } from '../../models/database/coffee-break';
import { Community } from "../../models/database/community";
import { GratitudeMessage, GratitudeMessageOptions } from "../../models/database/gratitude-message";
import { Logger } from "../logger/logger";

export interface DatabaseResponse {
  ok: boolean
  data?: any
  error?: any
}

export type DatabaseName = "mongo"

export abstract class Database {
  static make = (databaseName: DatabaseName = "mongo"): Database => {
    const dictionary = {
      ["mongo"]: (): Database => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { MongoDB } = require('./mongo/mongo')
        return new MongoDB()
      }
    }

    const instance = dictionary[databaseName]
    if (instance) return instance()

    const errorMessage = `The ${databaseName} database is not implemented`
    Logger.onError(errorMessage)
    throw Error(errorMessage)
  }

  abstract registerCommunity: (community: Community) => Promise<void>
  abstract getCommunities: () => Promise<Community[]>
  
  abstract saveGratitudeMessages: (gratitudeMessages: GratitudeMessage[]) => Promise<void>
  abstract getGratitudeMessages: (options: GratitudeMessageOptions) => Promise<GratitudeMessage[]>

  abstract saveCoffeeBreak: (coffeeBreak: CoffeeBreak) => Promise<void>
}
