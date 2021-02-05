import { SimpleThanks } from "../../../models/database/thanks";
import { I18n } from "../../i18n/i18n";
import { getDateFormatted } from "../../logger/logger";

interface ViewThanksSummaryProps {
  image?: string,
  given?: SimpleThanks[],
  received?: SimpleThanks[],
}

const toMessage = ({ users, date, reason }: SimpleThanks) => {
  return `• *${users.map(({ id }) => `<@${id}>`).join(", ")}* \`${getDateFormatted(date)}\`: ${reason}`;
}

export const ViewThanksSummary = ({ image, given, received }: ViewThanksSummaryProps, i18n: I18n = new I18n()) => {
  const hasGiven = given !== undefined && given.length > 0
  const hasReceived = received !== undefined && received.length > 0
  const imageByDefault = "https://www.radioformula.com.mx/wp-content/uploads/notas_anteriores/notas_201807/20180706_17_43_gato.jpg"

  return [
    {
      type: "image",
      image_url: image ?? imageByDefault,
      alt_text: "cats everywhere"
    },
    {
      type: "header",
      text: {
        type: "plain_text",
        text: i18n.thanksSummary("title"),
        emoji: true
      }
    },
    { type: "divider" },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: hasGiven ? `*${i18n.thanksSummary("given")}:*\n` + given?.map(toMessage).join("\n") : i18n.thanksSummary("noGiven")
      }
    },
    { type: "divider" },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: hasReceived ? `*${i18n.thanksSummary("received")}:*\n` + received?.map(toMessage).join("\n") : i18n.thanksSummary("noReceived")
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
          text: (hasGiven ? i18n.thanksSummary("givenCount", { count: (given?.length ?? 0) + ""}) : '') +
            (hasGiven && hasReceived ? `. ` : '') +
            (hasReceived ? i18n.thanksSummary("receivedCount", { count: (received?.length ?? 0) + ""}) : '')
        }
      ]
    }
  ]
}