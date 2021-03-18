import { GratitudeSummaryMessage } from "../../../database/gratitude-message";
import { SlackView } from "./views";
import { I18n } from "../../../../services/i18n/i18n";
import { getDateFormatted } from "../../../../services/logger/logger";

export interface GratitudeSummaryViewProps {
  image: string,
  sent?: GratitudeSummaryMessage[],
  received?: GratitudeSummaryMessage[],
}


const toMessage = ({ users, createdAt, text, isAnonymous }: GratitudeSummaryMessage, i18n: I18n) => {
  const userList = isAnonymous ? 
                    i18n.translate("gratitudeMessageSummary.anonymous") 
                    : users.map(({ id }) => `<@${id}>`).join(", ")
  return `• *${userList}* \`${getDateFormatted(createdAt)}\`: ${text}`;
}

export const GratitudeSummaryView = async ({ image, sent, received }: GratitudeSummaryViewProps): Promise<SlackView> => {
  const i18n = await I18n.getInstance()
  const hasSent = sent !== undefined && sent.length > 0
  const hasReceived = received !== undefined && received.length > 0

  const blocks = [
    {
      type: "image",
      image_url: image,
      alt_text: "cats everywhere"
    },
    {
      type: "header",
      text: {
        type: "plain_text",
        text: i18n.translate("gratitudeMessageSummary.title"), 
        emoji: true
      }
    },
    { type: "divider" },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: hasSent ? 
          `*${i18n.translate("gratitudeMessageSummary.sent")}*\n` + sent?.map(message => toMessage(message, i18n)).join("\n") 
          : i18n.translate("gratitudeMessageSummary.noSent")
      }
    },
    { type: "divider" },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: hasReceived ? 
        `*${i18n.translate("gratitudeMessageSummary.received")}*\n` + received?.map(message => toMessage(message, i18n)).join("\n") 
        : i18n.translate("gratitudeMessageSummary.noReceived")
      }
    },
    { type: "divider" },
    {
      type: "context",
      elements: [
        {
          type: "image",
          image_url: "https://static3.lasprovincias.es/www/multimedia/202010/10/media/cortadas/gato-ksgH-U1204237773070s-1248x770@Las%20Provincias.jpg",
          alt_text: "cute cat"
        },
        {
          type: "mrkdwn",
          text: (hasSent ? i18n.translate("gratitudeMessageSummary.sentCount", { count: (sent?.length ?? 0) + ""}) : '') +
            (hasSent && hasReceived ? `. ` : '') +
            (hasReceived ? i18n.translate("gratitudeMessageSummary.receivedCount", { count: (received?.length ?? 0) + ""}) : '')
        }
      ]
    }
  ]

  return new SlackView(blocks)
}