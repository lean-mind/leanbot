import { Platform } from "../../services/platform/platform";
import { Database } from "../../services/database/database";
import { ToDo } from "../../models/database/todo";
import { Id } from "../../models/platform/slack/id";

export interface TodoProps {
  userId: string,
  text: string
}

export const todo = async (platform: Platform, data: TodoProps) => {
  await platform.sendMessage(data.userId, `You have made a todo: ${data.text}`)
  const db: Database = Database.make()
  const todo: ToDo = new ToDo(new Id(data.userId), data.text)
  await db.saveToDo(todo)
}