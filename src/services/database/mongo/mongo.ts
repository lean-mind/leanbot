import { CoffeeBreak } from "../../../models/database/coffee-break"
import { MongoClient, ObjectId } from "mongodb"
import { JsonData } from "../../../models/json-data"
import { Database } from "../database"
import { Collection } from "./collection"
import { config } from "../../../config"
import { Community } from "../../../models/database/community"
import { CommunityDto } from "../../../models/database/dtos/community-dto"
import { GratitudeMessage, GratitudeMessageOptions } from "../../../models/database/gratitude-message"
import { GratitudeMessageDto } from "../../../models/database/dtos/gratitude-message-dto"
import { CoffeeBreakDto } from "../../../models/database/dtos/coffee-break-dto"
import { ToDo } from "../../../models/database/todo"
import { ToDoDto } from "../../../models/database/dtos/to-do-dto"

export class MongoDB extends Database {
  private database = config.database.mongodb.database

  private static getClient = () => {
    return new MongoClient(config.database.mongodb.uri, {
      useUnifiedTopology: true,
    })
  }

  constructor(private instance: MongoClient = MongoDB.getClient()) {
    super()
  }

  private on = async (callback: () => Promise<any>): Promise<any> => {
    try {
      await this.connect()
      return await callback()
    } finally {
      await this.close()
    }
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
    await this.on(() => this.dropDatabase())
  }

  registerCommunity = async (community: Community): Promise<void> => {
    await this.on(async () => await this.insertCommunity(community))
  }

  getCommunities = async (): Promise<Community[]> => {
    return await this.on(async () => await this.findAllCommunities())
  }

  saveGratitudeMessages = async (gratitudeMessages: GratitudeMessage[]): Promise<void> => {
    await this.on(async () => await this.insertGratitudeMessages(gratitudeMessages))
  }

  getGratitudeMessages = async (options: GratitudeMessageOptions): Promise<GratitudeMessage[]> => {
    return await this.on(async () => await this.findGratitudeMessages(options))
  }

  saveCoffeeBreak = async (coffeeBreak: CoffeeBreak): Promise<void> => {
    return await this.on(async () => await this.insertCoffeeBreak(coffeeBreak))
  }

  saveToDo = async (todo: ToDo): Promise<void> => {
    return await this.on(async () => await this.insertToDo(todo))
  }

  getToDos = async (userId: string) => {
    return await this.on(async () => await this.findAssignedToDos(userId))
  }

  completeToDo = async (toDoId: string): Promise<void> => {
    return await this.on(async () => await this.completeToDoById(toDoId))
  }

  private dropDatabase = () => this.db().dropDatabase()

  private insertCommunity = async (community: Community) => {
    if (!community.id) return

    const collection = this.db().collection(Collection.communities)
    const existsCommunity = await collection.findOne({ id: community.id })

    if (!existsCommunity) {
      const communityJson = CommunityDto.fromModel(community).toJson()
      await collection.insertOne(communityJson)
    }
  }

  private findAllCommunities = async () => {
    const collection = this.db().collection(Collection.communities)
    const cursor = await collection.find({ deletedAtTime: null }).toArray()
    return cursor?.map((community: JsonData) => CommunityDto.fromJson(community).toModel()) ?? []
  }

  private insertGratitudeMessages = async (gratitudeMessages: GratitudeMessage[]) => {
    const gratitudeMessagesJson = gratitudeMessages.map((gratitudeMessage) =>
      GratitudeMessageDto.fromModel(gratitudeMessage).toJson()
    )
    if (gratitudeMessagesJson.length > 0) {
      await this.db().collection(Collection.gratitudeMessages).insertMany(gratitudeMessagesJson)
    }
  }

  private findGratitudeMessages = async (options: GratitudeMessageOptions) => {
    const query = {}
    if (options.days) {
      const nowTime = new Date().getTime()
      const queryTime = options.days * 24 * 60 * 60 * 1000
      query["createdAtTime"] = {
        $gte: nowTime - queryTime,
        $lt: nowTime,
      }
    }
    const cursor = await this.db().collection(Collection.gratitudeMessages).find(query).toArray()
    return cursor.map(
      (gratitudeMessageJson): GratitudeMessage => GratitudeMessageDto.fromJson(gratitudeMessageJson).toModel()
    )
  }

  private insertCoffeeBreak = async (coffeeBreak: CoffeeBreak) => {
    const coffeeBreakJson = CoffeeBreakDto.fromModel(coffeeBreak).toJson()
    await this.db().collection(Collection.coffeeBreaks).insertOne(coffeeBreakJson)
  }

  private insertToDo = async (todo: ToDo) => {
    const toDoJson = ToDoDto.fromModel(todo).toJson()
    await this.db().collection(Collection.toDos).insertOne(toDoJson)
  }

  private findAssignedToDos = async (userId: string) => {
    const collection = this.db().collection(Collection.toDos)
    const cursor = await collection.find({ $or: [{ userId }, { assigneeId: userId }] }).toArray()
    return cursor?.map((todo: JsonData) => {
        return ToDoDto.fromJson(todo).toModel()
    }) ?? []
  }

  private completeToDoById = async (toDoId: string) => {
    const collection = this.db().collection(Collection.toDos)
    await collection.updateOne(
      { "_id" : new ObjectId(toDoId) },
      { $set: { "completed" : true } }
    )
  }

  private db = () => {
    return this.instance.db(this.database)
  }
}
