import { GratitudeMessage } from "../../models/database/gratitude-message"
import { Database } from "../../services/database/database"
import { Logger, getDateFormatted } from "../../services/logger/logger"
import { Platform } from "../../services/platform/platform"
import { Factory } from "../../services/infrastructure/factory"

export interface StatsProps {
  userId: string
}

export const sendStatsSummaries = async (
  platform: Platform,
  data: StatsProps
): Promise<void> => {
  const db: Database = Factory.createRepository()

  Logger.log("Sending stats summaries...")
  try {
    const messages: GratitudeMessage[] = await db.getGratitudeMessages({})

    const totalMessages: number = messages.length
    const messagesSended: number = messages.filter(({ sender }) => sender.id === data.userId).length
    const messagesRecieved: number = messages.filter(({ recipient }) => recipient.id === data.userId).length
    const mostSendedDictionary: Record<string, number> = messages
      .filter(({ sender }) => sender.id === data.userId)
      .reduce((acc, { recipient }) => {
        acc[recipient.id] = acc[recipient.id] ? acc[recipient.id] + 1 : 1
        return acc
      }, {})
    const [mostSendedUserId, mostSendedUserNumber] = Object.entries(mostSendedDictionary).sort((a, b) => b[1] - a[1])[0]
    const mostRecievedDictionary: Record<string, number> = messages
      .filter(({ recipient }) => recipient.id === data.userId)
      .reduce((acc, { sender }) => {
        acc[sender.id] = acc[sender.id] ? acc[sender.id] + 1 : 1
        return acc
      }, {})
    const [mostRecievedUserId, mostRecievedUserNumber] = Object.entries(mostRecievedDictionary).sort((a, b) => b[1] - a[1])[0]
    const [firstThanks] = messages
      .filter(({ sender }) => sender.id === data.userId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

    await platform.sendMessage(data.userId, [
      `*¡Estas son tus estadisticas!*`,
      `• Mensajes de gratitud enviados: ${messagesSended}/${totalMessages}`,
      `• Mensajes de gratitud recibidos: ${messagesRecieved}/${totalMessages}`,
      `• Persona a la que más gratitudes le has enviado (${mostSendedUserNumber}): <@${mostSendedUserId}>`,
      `• Persona que más gratitudes te ha enviado (${mostRecievedUserNumber}): <@${mostRecievedUserId}>`,
      `• Diste gracias por primera vez en la fecha ${getDateFormatted(firstThanks.createdAt)}`,
    ].join("\n"))
  } catch (e) {
    Logger.onError(e)
  }
}
