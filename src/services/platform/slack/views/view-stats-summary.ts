import { GratitudeMessage } from "../../../../models/database/gratitude-message"
import { SlackView } from "../../../../models/platform/slack/views"
import { getDateFormatted } from "../../../../services/logger/logger"

export interface StatsSummaryViewProps {
  totalMessages: number
  totalMessagesSent: number
  totalMessagesReceived: number
  bestSender: { senderId: string, count: number }
  bestReceiver: { receiverId: string, count: number }
  firstMessageSent: GratitudeMessage
  firstMessageReceived: GratitudeMessage
}

export const StatsSummaryView = async (stats: StatsSummaryViewProps): Promise<SlackView> => {
  const blocks = [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "📈 ¡Estadísticas! 📉"
      }
    },
    {
      "type": "divider"
    },
    {
      "type": "section",
      "text": {
        "type": "plain_text",
        "text": `Se han enviado un total de ${stats.totalMessages} mensajes de gratitud, de los cuales:`,
        "emoji": true
      }
    },
    {
      "type": "context",
      "elements": [
        {
          "type": "mrkdwn",
          "text": "📨"
        },
        {
          "type": "mrkdwn",
          "text": `${stats.totalMessagesSent} mensajes los has enviados tú`
        }
      ]
    },
    {
      "type": "context",
      "elements": [
        {
          "type": "mrkdwn",
          "text": "📮"
        },
        {
          "type": "mrkdwn",
          "text": `${stats.totalMessagesReceived} mensajes te los han enviado a tí`
        }
      ]
    },
    {
      "type": "context",
      "elements": [
        {
          "type": "mrkdwn",
          "text": "🤯"
        },
        {
          "type": "mrkdwn",
          "text": `Le has enviado un total de ${stats.bestReceiver.count} mensajes de gratitud a <@${stats.bestReceiver.receiverId}>`
        }
      ]
    },
    {
      "type": "context",
      "elements": [
        {
          "type": "mrkdwn",
          "text": "💭"
        },
        {
          "type": "mrkdwn",
          "text": `<@${stats.bestSender.senderId}> te ha enviado un total de ${stats.bestSender.count} mensajes de gratitud`
        }
      ]
    },
    {
      "type": "context",
      "elements": [
        {
          "type": "mrkdwn",
          "text": "🎉"
        },
        {
          "type": "mrkdwn",
          "text": `Le enviaste tu primera gratitud a <@${stats.firstMessageSent.recipient.id}> el ${getDateFormatted(stats.firstMessageSent.createdAt)}`
        }
      ]
    },
    {
      "type": "context",
      "elements": [
        {
          "type": "mrkdwn",
          "text": "✨"
        },
        {
          "type": "mrkdwn",
          "text": `Recibiste tu primera gratitud de <@${stats.firstMessageReceived.sender.id}> el ${getDateFormatted(stats.firstMessageReceived.createdAt)}`
        }
      ]
    },
  ]

  return new SlackView(blocks)
}
