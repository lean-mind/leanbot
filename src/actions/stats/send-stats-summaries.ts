import { GratitudeMessage } from "../../models/database/gratitude-message"
import { Database } from "../../services/database/database"
import { Logger, getDateFormatted } from "../../services/logger/logger"
import { Platform } from "../../services/platform/platform"
import { Factory } from "../../services/infrastructure/factory"
import { Message } from "../../models/platform/message"

export interface StatsProps {
  userId: string
}

const messagesSent = (messages: GratitudeMessage[], userId: string): number => {
  return messages.filter(({ sender }) => sender.id === userId).length
}

const messagesReceived = (messages: GratitudeMessage[], userId: string): number => {
  return messages.filter(({ recipient }) => recipient.id === userId).length
}

const bestSender = (messages: GratitudeMessage[], userId: string): { senderId: string, count: number } => {
  const mostSendedDictionary: Record<string, number> = messages
    .filter(({ sender }) => sender.id === userId)
    .reduce((acc, { recipient }) => {
      acc[recipient.id] = acc[recipient.id] ? acc[recipient.id] + 1 : 1
      return acc
    }, {})
  const [mostSendedUserId, mostSendedUserNumber] = Object.entries(mostSendedDictionary).sort((a, b) => b[1] - a[1])[0]
  return { senderId: mostSendedUserId, count: mostSendedUserNumber }
}

const bestReceiver = (messages: GratitudeMessage[], userId: string): { receiverId: string, count: number } => {
  const mostReceivedDictionary: Record<string, number> = messages
    .filter(({ recipient }) => recipient.id === userId)
    .reduce((acc, { sender }) => {
      acc[sender.id] = acc[sender.id] ? acc[sender.id] + 1 : 1
      return acc
    }, {})
  const [mostReceivedUserId, mostReceivedUserNumber] = Object.entries(mostReceivedDictionary).sort((a, b) => b[1] - a[1])[0]
  return { receiverId: mostReceivedUserId, count: mostReceivedUserNumber }
}

const firstThanksSended = (messages: GratitudeMessage[], userId: string): GratitudeMessage => {
  return messages.filter(({ sender }) => sender.id === userId).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())[0]
}

const firstThanksReceived = (messages: GratitudeMessage[], userId: string): GratitudeMessage => {
  return messages.filter(({ recipient }) => recipient.id === userId).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())[0]
}

export const sendStatsSummaries = async (
  platform: Platform,
  data: StatsProps,
): Promise<void> => {
  const db: Database = Factory.createRepository()
  Logger.log("Sending stats summaries...")

  try {
    const messages: GratitudeMessage[] = await db.getGratitudeMessages({})
    const message: Message = await platform.getView("statsSummary", {
      totalMessages: messages.length,
      totalMessagesSent: messagesSent(messages, data.userId),
      totalMessagesReceived: messagesReceived(messages, data.userId),
      bestSender: bestSender(messages, data.userId),
      bestReceiver: bestReceiver(messages, data.userId),
      firstMessageSent: firstThanksSended(messages, data.userId),
      firstMessageReceived: firstThanksReceived(messages, data.userId),
    })
    await platform.sendMessage(data.userId, message)
  } catch (e) {
    Logger.onError(e)
  }
}
