import { Database } from "../../services/database/database"
import { Platform } from "../../services/platform/platform"
import { ToDo } from "../../models/database/todo"
import { CheckboxActionProps } from "../../services/platform/slack/props/checkbox-action-props"
import { Factory } from "../../services/infrastructure/factory";
import { I18n } from "../../services/i18n/i18n";

export const completeToDo = async (
  platform: Platform,
  { userId, responseUrl, value, assigned }: CheckboxActionProps,
  db: Database = Factory.createRepository()
) => {
  await db.completeToDo(value)
  const toDoList: ToDo[] = await db.getToDos(userId.id)
  await platform.updateMessage(responseUrl, await platform.getView("toDoList", { userId: userId.id, toDoList }))
  if (assigned) {
    const i18n: I18n = await I18n.getInstance()
    const todo = await db.getToDoById(value)
    await platform.sendMessage(
      todo.user.id,
      await i18n.translate("todo.completedAssignedToDo", { user: `<@${userId.id}>`, todo: todo.text })
    )
  }
}
