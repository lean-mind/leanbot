import { GratitudeSummaryMessage } from "../../../../models/database/gratitude-message";
import { I18n } from "../../../i18n/i18n";
import { getDateFormatted } from "../../../logger/logger";
import { SlackView } from "../slack";

interface ViewGratitudeSummaryProps {
  image: string,
  sent?: GratitudeSummaryMessage[],
  received?: GratitudeSummaryMessage[],
}

const toMessage = ({ users, createdAt, text }: GratitudeSummaryMessage) => {
  return `• *${users.map(({ id }) => `<@${id}>`).join(", ")}* \`${getDateFormatted(createdAt)}\`: ${text}`;
}

export const ViewGratitudeSummary = ({ image, sent, received }: ViewGratitudeSummaryProps, i18n: I18n = new I18n()): SlackView => {
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
        text: i18n.gratitudeMessageSummary("title"), 
        emoji: true
      }
    },
    { type: "divider" },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: hasSent ? `*${i18n.gratitudeMessageSummary("sent")}*\n` + sent?.map(toMessage).join("\n") : i18n.gratitudeMessageSummary("noSent")
      }
    },
    { type: "divider" },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: hasReceived ? `*${i18n.gratitudeMessageSummary("received")}*\n` + received?.map(toMessage).join("\n") : i18n.gratitudeMessageSummary("noReceived")
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
          text: (hasSent ? i18n.gratitudeMessageSummary("sentCount", { count: (sent?.length ?? 0) + ""}) : '') +
            (hasSent && hasReceived ? `. ` : '') +
            (hasReceived ? i18n.gratitudeMessageSummary("receivedCount", { count: (received?.length ?? 0) + ""}) : '')
        }
      ]
    }
  ]

  return new SlackView(blocks)
}