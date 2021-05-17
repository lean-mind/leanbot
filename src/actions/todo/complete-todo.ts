import { Database } from "../../services/database/database"
import { Platform } from "../../services/platform/platform"
import { ToDo } from "../../models/database/todo"
import { CheckboxActionProps } from "../../services/platform/slack/props/checkbox-action-props"
import { Factory } from "../../services/infrastructure/factory";

export const completeToDo = async (
  platform: Platform,
  { userId, responseUrl, value }: CheckboxActionProps,
  db: Database = Factory.createRepository()
) => {
  await db.completeToDo(value)
  const toDoList: ToDo[] = await db.getToDos(userId.id)
  await platform.updateMessage(responseUrl, await platform.getView("toDoList", { userId: userId.id, toDoList }))
}
