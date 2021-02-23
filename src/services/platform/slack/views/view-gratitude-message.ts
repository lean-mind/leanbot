import { I18n } from "../../../i18n/i18n";
import { SlackInteractiveView } from "../slack";

// TODO: Change name to [Blank]InteractiveView
export const ViewGratitudeMessage = (i18n: I18n = new I18n()): SlackInteractiveView => {
  const type = "modal"
  const externalId = "thanks-confirmation"
  const title = {
    type: "plain_text",
    text: i18n.gratitudeMessageView("title")
  }
  const submit = {
    type: "plain_text",
    text: i18n.gratitudeMessageView("submit")
  }
  const close = {
    type: "plain_text",
    text: i18n.gratitudeMessageView("cancel")
  }
  const blocks = [
    {
      type: "section",
      block_id: "recipients",
      text: {
        type: "mrkdwn",
        text: `*${i18n.gratitudeMessageView("recipientsLabel")}*`
      },
      accessory: {
        type: "multi_conversations_select",
        placeholder: {
          type: "plain_text",
          text: i18n.gratitudeMessageView("recipientsPlaceholder"),
          emoji: true
        },
        filter: {
          include: [ "public", "im" ]
        },
        action_id: "action"
      }
    },
    {
      type: "input",
      block_id: "text",
      element: {
        type: "plain_text_input",
        multiline: true,
        action_id: "action"
      },
      label: {
        type: "plain_text",
        text: i18n.gratitudeMessageView("textLabel"),
        emoji: true
      }
    },
    {
      type: "section",
      block_id: "options",
      text: {
        type: "mrkdwn",
        text: `*${i18n.gratitudeMessageView("optionsLabel")}*`
      },
      accessory: {
        type: "checkboxes",
        options: [
          {
            text: {
              type: "mrkdwn",
              text: i18n.gratitudeMessageView("optionsAnonymousLabel")
            },
            description: {
              type: "mrkdwn",
              text: `_${i18n.gratitudeMessageView("optionsAnonymousDescription")}_`
            },
            value: "anonymous"
          }
        ],
        action_id: "action"
      }
    },
    {
      type: "section",
      block_id: "channel",
      text: {
        type: "mrkdwn",
        text: `*${i18n.gratitudeMessageView("channelLabel")}*\n${i18n.gratitudeMessageView("channelDescription")}`
      },
      accessory: {
        type: "conversations_select",
        placeholder: {
          type: "plain_text",
          text: i18n.gratitudeMessageView("channelPlaceholder"),
        },
        filter: {
          include: [ "public" ]
        },
        action_id: "action"
      }
    }
  ]
  
  return new SlackInteractiveView({
    type,
    externalId,
    title,
    submit,
    close,
    blocks,
  })
}