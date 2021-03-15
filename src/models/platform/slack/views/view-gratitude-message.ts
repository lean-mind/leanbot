import { SlackModal } from "./views";
import { I18n } from "../../../../services/i18n/i18n";

let viewNumber = 0

export const GratitudeMessageInteractiveView = async (): Promise<SlackModal> => {
  const i18n = await I18n.getInstance()
  const type = "modal"
  const external_id = `${viewNumber++}-thanks-confirmation`
  const title = {
    type: "plain_text",
    text: i18n.translate("gratitudeMessageView.title")
  }
  const submit = {
    type: "plain_text",
    text: i18n.translate("gratitudeMessageView.submit")
  }
  const close = {
    type: "plain_text",
    text: i18n.translate("gratitudeMessageView.cancel")
  }
  const blocks = [
    {
      type: "section",
      block_id: "recipients",
      text: {
        type: "mrkdwn",
        text: `*${i18n.translate("gratitudeMessageView.recipientsLabel")}*`
      },
      accessory: {
        type: "multi_conversations_select",
        placeholder: {
          type: "plain_text",
          text: i18n.translate("gratitudeMessageView.recipientsPlaceholder"),
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
        text: i18n.translate("gratitudeMessageView.textLabel"),
        emoji: true
      }
    },
    {
      type: "section",
      block_id: "options",
      text: {
        type: "mrkdwn",
        text: `*${i18n.translate("gratitudeMessageView.optionsLabel")}*`
      },
      accessory: {
        type: "checkboxes",
        options: [
          {
            text: {
              type: "mrkdwn",
              text: i18n.translate("gratitudeMessageView.optionsAnonymousLabel")
            },
            description: {
              type: "mrkdwn",
              text: `_${i18n.translate("gratitudeMessageView.optionsAnonymousDescription")}_`
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
        text: `*${i18n.translate("gratitudeMessageView.channelLabel")}*\n${i18n.translate("gratitudeMessageView.channelDescription")}`
      },
      accessory: {
        type: "conversations_select",
        placeholder: {
          type: "plain_text",
          text: i18n.translate("gratitudeMessageView.channelPlaceholder"),
        },
        filter: {
          include: [ "public" ]
        },
        action_id: "action"
      }
    }
  ]
  
  return new SlackModal({
    type,
    external_id,
    title,
    submit,
    close,
    blocks,
  })
}