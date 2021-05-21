import { Database } from "../database";
import { Logger } from "../../logger/logger";
import { Community } from "../../../models/database/community";
import { GratitudeMessage, GratitudeMessageOptions } from "../../../models/database/gratitude-message";
import { CoffeeBreak } from "../../../models/database/coffee-break";
import { ToDo } from "../../../models/database/todo";

export class LoggedDatabase extends Database {
  constructor(private database: Database, private logger: Logger) {
    super()
  }

  removeCollections = async (): Promise<void> => {
    this.logger.onDBAction("Removing collections")
    await this.database.removeCollections()
  }

  registerCommunity = async (community: Community): Promise<void> => {
    this.logger.onDBAction("Registering community")
    await this.database.registerCommunity(community)
  }

  getCommunities = async (): Promise<Community[]> => {
    this.logger.onDBAction("Getting communities")
    return await this.database.getCommunities()
  }

  saveGratitudeMessages = async (gratitudeMessages: GratitudeMessage[]): Promise<void> => {
    this.logger.onDBAction("Saving gratitude messages")
    await this.database.saveGratitudeMessages(gratitudeMessages)
  }

  getGratitudeMessages = async (options: GratitudeMessageOptions): Promise<GratitudeMessage[]> => {
    this.logger.onDBAction("Getting gratitude messages")
    return await this.database.getGratitudeMessages(options)
  }

  saveCoffeeBreak = async (coffeeBreak: CoffeeBreak): Promise<void> => {
    this.logger.onDBAction("Saving coffee break")
    return await this.database.saveCoffeeBreak(coffeeBreak)
  }

  saveToDo = async (todo: ToDo): Promise<void> => {
    this.logger.onDBAction("Saving todo")
    return await this.database.saveToDo(todo)
  }

  getToDos = async (userId: string) => {
    this.logger.onDBAction(`Getting todos for user ${userId}`)
    return await this.database.getToDos(userId)
  }

  getToDoById = async (toDoId: string): Promise<ToDo> => {
    this.logger.onDBAction(`Getting todo with id ${toDoId}`)
    return await this.database.getToDoById(toDoId)
  }

  completeToDo = async (toDoId: string): Promise<void> => {
    this.logger.onDBAction(`Completing todo with id ${toDoId}`)
    return await this.database.completeToDo(toDoId)
  }
}
