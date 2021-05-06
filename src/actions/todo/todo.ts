import { Platform } from "../../services/platform/platform";
import { Database } from "../../services/database/database";
import { ToDo } from "../../models/database/todo";
import { Id } from "../../models/platform/slack/id";

export interface TodoProps {
  userId: string,
  text: string
}

export const todo = async (platform: Platform, data: TodoProps) => {
  if (data.text.match(/^list$/)) {
    await listToDos(platform, data)
  } else {
    await createToDo(platform, data)
  }
}

const db: Database = Database.make()

const listToDos = async (platform: Platform, data: TodoProps) => {
  const toDoList: ToDo[] = await db.getToDos(data.userId)
  await platform.sendMessage(data.userId, await platform.getView("toDoList", toDoList))
}

const createToDo = async (platform: Platform, data: TodoProps) => {
  await platform.sendMessage(data.userId, `You have made a todo: ${data.text}`)
  const todo: ToDo = new ToDo(new Id(data.userId), data.text)
  await db.saveToDo(todo)
}
