import { SlackInteractiveBlock } from "../../../../models/platform/slack/views"
import { ToDo } from "../../../../models/database/todo"
import { I18n } from "../../../i18n/i18n"

export const ToDoListView = async (toDoList: ToDo[]): Promise<SlackInteractiveBlock> => {
  const i18n = await I18n.getInstance()

  let blocks: any[]

  if (toDoList.length == 0) {
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
              toDoList.filter((todo) => !todo.completed).map((todo) => {
                return {
                  "text": {
                  "type": "mrkdwn",
                    "text": todo.text
                },
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