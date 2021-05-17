import { CoffeeBreak } from "../../models/database/coffee-break"
import { Community } from "../../models/database/community"
import { GratitudeMessage, GratitudeMessageOptions } from "../../models/database/gratitude-message"
import { ToDo } from "../../models/database/todo"

export abstract class Database {
  abstract removeCollections: () => Promise<void>

  abstract registerCommunity: (community: Community) => Promise<void>
  abstract getCommunities: () => Promise<Community[]>

  abstract saveGratitudeMessages: (gratitudeMessages: GratitudeMessage[]) => Promise<void>
  abstract getGratitudeMessages: (options: GratitudeMessageOptions) => Promise<GratitudeMessage[]>

  abstract saveCoffeeBreak: (coffeeBreak: CoffeeBreak) => Promise<void>

  abstract saveToDo: (todo: ToDo) => Promise<void>
  abstract getToDos: (userId: string) => Promise<ToDo[]>
  abstract getToDoById: (toDoId: string) => Promise<ToDo>
  abstract completeToDo: (toDoId: string) => Promise<void>
}
