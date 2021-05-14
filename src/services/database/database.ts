import { GratitudeMessage } from "../../models/database/gratitude-message"
import { QueryOptions } from "./mongo/methods/query"
import { User } from "../../models/database/user"
import { CoffeeBreak } from "../../models/database/coffee-break"
import { Community } from "../../models/database/community"
import { Logger } from "../logger/logger"

export type DatabaseName = "mongo"

export abstract class Database {
  static make = (databaseName: DatabaseName = "mongo"): Database => {
    const dictionary = {
      ["mongo"]: (): Database => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { MongoDB } = require("./mongo/mongo")
        return new MongoDB()
      },
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
  abstract getGratitudeMessages: (options: QueryOptions) => Promise<GratitudeMessage[]>

  abstract saveCoffeeBreak: (coffeeBreak: CoffeeBreak) => Promise<void>
  abstract getCoffeeBreaks: (options: QueryOptions) => Promise<CoffeeBreak[]>

  abstract saveUser: (user: User) => Promise<User | undefined>
  abstract getUser: (userId: string) => Promise<User | undefined>

}
