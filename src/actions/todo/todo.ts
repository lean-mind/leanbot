import { Platform } from "../../services/platform/platform"
import { Database } from "../../services/database/database"
import { ToDo } from "../../models/database/todo"
import { Id } from "../../models/platform/slack/id"
import { I18n } from "../../services/i18n/i18n"

export interface TodoProps {
  userId: string,
  text: string
}

export const todo = async (platform: Platform, data: TodoProps, db: Database = Database.make()) => {
  const listKeyword = /^list$/
  if (data.text.match(listKeyword)) {
    await listToDos(platform, data, db)
  } else {
    await createToDo(platform, data, db)
  }
}

const listToDos = async (platform: Platform, data: TodoProps, db: Database) => {
  const toDoList: ToDo[] = await db.getToDos(data.userId)
  await platform.sendMessage(data.userId, await platform.getView("toDoList", toDoList))
}

const createToDo = async (platform: Platform, data: TodoProps, db: Database) => {
  const i18n: I18n = await I18n.getInstance()
  if (data.text.length === 0) {
    await platform.sendMessage(data.userId, i18n.translate("todo.emptyTextError", {todo: data.text}))
    return
  }
  const todo: ToDo = new ToDo(new Id(data.userId), data.text)
  await db.saveToDo(todo)
  await platform.sendMessage(data.userId, i18n.translate("todo.toDoCreated", {todo: data.text}))
}
