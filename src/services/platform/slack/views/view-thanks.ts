import { I18n } from "../../../i18n/i18n";

export const ViewThanks = (i18n: I18n = new I18n()) => ({
  type: "modal",
  external_id: "thanks-confirmation",
  title: {
    type: "plain_text",
    text: i18n.thanksView("title")
  },
  submit: {
    type: "plain_text",
    text: i18n.thanksView("submit")
  },
  close: {
    type: "plain_text",
    text: i18n.thanksView("cancel")
  },
  blocks: [
    {
      type: "section",
      block_id: "recipients",
      text: {
        type: "mrkdwn",
        text: `*${i18n.thanksView("recipientsLabel")}*`
      },
      accessory: {
        type: "multi_conversations_select",
        placeholder: {
          type: "plain_text",
          text: i18n.thanksView("recipientsPlaceholder"),
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
      block_id: "reason",
      element: {
        type: "plain_text_input",
        multiline: true,
        action_id: "action"
      },
      label: {
        type: "plain_text",
        text: i18n.thanksView("reasonLabel"),
        emoji: true
      }
    },
    {
      type: "section",
      block_id: "options",
      text: {
        type: "mrkdwn",
        text: `*${i18n.thanksView("optionsLabel")}*`
      },
      accessory: {
        type: "checkboxes",
        options: [
          {
            text: {
              type: "mrkdwn",
              text: i18n.thanksView("optionsAnonymousLabel")
            },
            description: {
              type: "mrkdwn",
              text: `_${i18n.thanksView("optionsAnonymousDescription")}_`
            },
            value: "anonymous"
          }
        ],
        action_id: "action"
      }
    },
    {
      type: "section",
      block_id: "where",
      text: {
        type: "mrkdwn",
        text: `*${i18n.thanksView("whereLabel")}*\n${i18n.thanksView("whereDescription")}`
      },
      accessory: {
        type: "conversations_select",
        placeholder: {
          type: "plain_text",
          text: i18n.thanksView("wherePlaceholder"),
        },
        filter: {
          include: [ "public" ]
        },
        action_id: "action"
      }
    }
  ]
})