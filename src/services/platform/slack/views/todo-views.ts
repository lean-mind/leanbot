import { SlackInteractiveBlock } from "../../../../models/platform/slack/views"
import { ToDo } from "../../../../models/database/todo"
import { I18n } from "../../../i18n/i18n"

export const ToDoListView = async (toDoList: ToDo[]): Promise<SlackInteractiveBlock> => {
  const i18n = await I18n.getInstance()
  const uncompletedToDoList = toDoList.filter((todo) => !todo.completed)

  let blocks: any[]

  if (uncompletedToDoList.length == 0) {
    blocks = [{
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": await i18n.translate("todo.emptyToDoList")
      }
    }]
  } else {
    blocks = [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": await i18n.translate("todo.toDoListTitle")
        }
      },
      {
        "type": "actions",
        "elements": [
          {
            "type": "checkboxes",
            "options":
              uncompletedToDoList.map((todo) => {
                return {
                  "text": {
                    "type": "mrkdwn",
                    "text": todo.text
                  },
                  // "description": todo.user.id != todo.assignee.id ? {
                  //   "type": "mrkdwn",
                  //   "text": `Asignado por otra persona`
                  // } : undefined,
                  "value": todo.id
                }
              }),
            "action_id": "complete-todo"
          }
        ]
      }
    ]
  }
  return new SlackInteractiveBlock(blocks)
}