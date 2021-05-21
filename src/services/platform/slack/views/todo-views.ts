import { SlackInteractiveBlock } from "../../../../models/platform/slack/views"
import { ToDo } from "../../../../models/database/todo"
import { I18n } from "../../../i18n/i18n"

interface ToDoViewProps {
  userId: string
  toDoList: ToDo[]
}

export const ToDoListView = async ({ userId , toDoList }: ToDoViewProps): Promise<SlackInteractiveBlock> => {
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
    blocks = []
    const toDosForUser = uncompletedToDoList.filter((todo) => todo.assignee.id == userId)
    if (toDosForUser.length !== 0) {
      blocks.push({
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": await i18n.translate("todo.toDoListTitle")
        }
      })
      blocks.push({
        "type": "actions",
        "elements": [
          {
            "type": "checkboxes",
            "options":
              await Promise.all(toDosForUser.map(async (todo) => {
                return {
                  "text": {
                    "type": "mrkdwn",
                    "text": `*${todo.text}*`
                  },
                  "description": todo.user.id !== todo.assignee.id ? {
                    "type": "mrkdwn",
                    "text": await i18n.translate("todo.assignedBy", { user: `<@${todo.user.id}>` })
                  } : undefined,
                  "value": todo.id
                }
              })),
            "action_id": "complete-todo"
          }
        ]
      })
    } else {
      blocks.push({
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": await i18n.translate("todo.emptyToDoList")
        }
      })
    }

    blocks.push ({
      "type": "divider"
    })

    const toDosByUser = await Promise.all(uncompletedToDoList.filter((todo) => todo.assignee.id !== userId).map(async (todo) => {
      return {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `• *${todo.text}* ${await i18n.translate("todo.assignedTo", { user: `<@${todo.assignee.id}>` })}`
        }
      }
    }))
    console.log(toDosByUser)
    if (toDosByUser.length !== 0) {
      blocks.push({
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": await i18n.translate("todo.assignedToDoListTitle")
        }
      })
      blocks.push(...toDosByUser)
    } else {
      blocks.push({
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": await i18n.translate("todo.emptyAssignedToDoList")
        }
      })
    }
  }
  return new SlackInteractiveBlock(blocks)
}