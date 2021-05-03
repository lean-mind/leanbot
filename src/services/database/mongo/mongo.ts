import { CoffeeBreak } from '../../../models/database/coffee-break';
import { MongoClient } from 'mongodb'
import { JsonData } from '../../../models/json-data';
import { Database, DatabaseResponse } from '../database';
import { Logger } from '../../logger/logger';
import { Collection } from './collection';
import { config } from '../../../config';
import { Community } from '../../../models/database/community';
import { CommunityDto } from '../../../models/database/dtos/community-dto';
import { GratitudeMessage, GratitudeMessageOptions } from '../../../models/database/gratitude-message';
import { GratitudeMessageDto } from '../../../models/database/dtos/gratitude-message-dto';
import { CoffeeBreakDto } from '../../../models/database/dtos/coffee-break-dto';

export class MongoDB extends Database {
  private database = config.database.mongodb.database

  private static getClient = () => {
    return new MongoClient(config.database.mongodb.uri, { 
      useUnifiedTopology: true,
    })
  }
  
  constructor(
    private instance: MongoClient = MongoDB.getClient()
  ) {
    super()
  }

  private on = async (callback: () => Promise<any>): Promise<DatabaseResponse> => {
    let data: any
    try {
      await this.connect()
      data = await callback()
    } catch (error) {
      Logger.onDBError(error)
      return { ok: false, error }
    } finally {
      await this.close()
    }
    return { ok: true, data }
  }
  
  private connect = async (): Promise<void> => {
    if (!this.instance.isConnected()) {
      await this.instance.connect()
    }
  }
  
  private close = async (): Promise<void> => {
    if (this.instance.isConnected()) {
      await this.instance.close()
      this.instance = MongoDB.getClient()
    }
  }
  
  removeCollections = async (): Promise<void> => {
    await this.on(() => this.instance.db(this.database).dropDatabase())
  }

  registerCommunity = async (community: Community): Promise<void> => {
    await this.on(async () => {
      if (!community.id) return
      
      const collection = this.instance.db(this.database).collection(Collection.communities)
      const existsCommunity = await collection.findOne({ id: community.id })
      
      if (!existsCommunity) {
        Logger.onDBAction("Registering community")
        const communityJson = CommunityDto.fromModel(community).toJson()
        await collection.insertOne(communityJson)
      }
    })
  }
  
  getCommunities = async (): Promise<Community[]> => {
    const response = await this.on(async () => {
      Logger.onDBAction("Getting communities")
      const cursor = await this.instance.db(this.database).collection(Collection.communities).find({deletedAtTime: null}).toArray()
      return cursor?.map((community: JsonData) => CommunityDto.fromJson(community).toModel()) ?? []
    });
    
    return response.ok ? response.data : []
  }

  saveGratitudeMessage = async (gratitudeMessages: GratitudeMessage[]): Promise<void> => {
    const response = await this.on(async () => {
      const gratitudeMessagesJson = gratitudeMessages.map((gratitudeMessage) => GratitudeMessageDto.fromModel(gratitudeMessage).toJson())

      if (gratitudeMessagesJson.length > 0) {
        Logger.onDBAction("Saving gratitude messages")
        await this.instance.db(this.database).collection(Collection.gratitudeMessages).insertMany(gratitudeMessagesJson)
      }
    });
    
    if (!response.ok) throw Error(`saveGratitudeMessage error: ${response.error}`)
  }

  getGratitudeMessages = async (options: GratitudeMessageOptions): Promise<GratitudeMessage[]> => {
    const response = await this.on(async () => {
      const query = {}
      
      if (options.days) {
        const nowTime = (new Date()).getTime()
        const queryTime = options.days * 24 * 60 * 60 * 1000
        query["createdAtTime"] = {
          $gte: nowTime - queryTime,
          $lt: nowTime,
        }
      }

      Logger.onDBAction("Getting gratitude messages")
      const cursor = await this.instance.db(this.database).collection(Collection.gratitudeMessages).find(query).toArray()
      return cursor.map((gratitudeMessageJson): GratitudeMessage => GratitudeMessageDto.fromJson(gratitudeMessageJson).toModel())
    })

    return response.ok ? response.data : []
  }

  saveCoffeeBreak = async (coffeeBreak: CoffeeBreak): Promise<void> => {
    const response = await this.on(async () => {
      const coffeeBreakJson = CoffeeBreakDto.fromModel(coffeeBreak).toJson()
      Logger.onDBAction("Saving coffee break")
      await this.instance.db(this.database).collection(Collection.coffeeBreaks).insertOne(coffeeBreakJson)
    })

    if (!response.ok) throw Error(`saveCoffeeBreak error: ${response.error}`)
  }
}

// getUser = () => {
//   try {
//     db.connect()
//     getUserById() // lógica
//   } finally {
//     db.close()
//   }
// }
//
// @connectdb
// getUser () => {
//   //lógica
// }