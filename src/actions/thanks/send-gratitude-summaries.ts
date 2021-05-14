import { Community } from "../../models/database/community"
import { GratitudeMessage, GratitudeSummary, GratitudeSummaryMessage } from "../../models/database/gratitude-message"
import { Message } from "../../models/platform/message"
import { Cat } from "../../services/cat/cat"
import { Database } from "../../services/database/database"
import { Logger } from "../../services/logger/logger"
import { Platform, PlatformName } from "../../services/platform/platform"
import { Factory } from "../../services/infrastructure/factory"

const getGratitudeSummaryMessageFrom = (
  gratitudeMessage: GratitudeMessage,
  isSender: boolean
): GratitudeSummaryMessage => ({
  users: isSender ? [gratitudeMessage.recipient] : [gratitudeMessage.sender],
  text: gratitudeMessage.text.split("\n").join(" "),
  isAnonymous: gratitudeMessage.isAnonymous && isSender ? false : gratitudeMessage.isAnonymous,
  createdAt: gratitudeMessage.createdAt,
})

const updateListIfNeeds = (list: GratitudeSummaryMessage[], currentThanks: GratitudeSummaryMessage) => {
  const alreadyExistsText = list.find(
    ({ text, createdAt }: GratitudeSummaryMessage) =>
      text === currentThanks.text && createdAt.getTime() === currentThanks.createdAt.getTime()
  )

  if (alreadyExistsText) {
    alreadyExistsText.users.push(...currentThanks.users)
  } else {
    list.push(currentThanks)
  }
}

const update = (
  summary: GratitudeSummary[],
  currentGratitudeMessage: GratitudeMessage,
  who: "sender" | "recipient"
) => {
  const isSender = who === "sender"
  const user = currentGratitudeMessage[who]
  const gratitudeSummaryMessage = getGratitudeSummaryMessageFrom(currentGratitudeMessage, isSender)
  const existingGratitudeSummary = summary.find((value) => value.user.id === user.id)
  const gratitudeSummary: GratitudeSummary = existingGratitudeSummary ?? {
    communityId: currentGratitudeMessage.communityId,
    user,
    sent: [],
    received: [],
  }

  if (isSender) {
    updateListIfNeeds(gratitudeSummary.sent, gratitudeSummaryMessage)
  } else {
    updateListIfNeeds(gratitudeSummary.received, gratitudeSummaryMessage)
  }

  if (!existingGratitudeSummary) summary.push(gratitudeSummary)
}

export const sendGratitudeSummaries = async (
  db: Database = Factory.createRepository(),
  cat: Cat = new Cat()
): Promise<void> => {
  Logger.log("Sending gratitude summaries...")
  try {
    const catImage = await cat.getRandomImage({})
    const communities = await db.getCommunities()
    const gratitudeMessagesFromLastWeek: GratitudeMessage[] = await db.getGratitudeMessages({ days: 7 })
    const summaries: GratitudeSummary[] = gratitudeMessagesFromLastWeek.reduce(
      (summary: GratitudeSummary[], current: GratitudeMessage) => {
        update(summary, current, "sender")
        update(summary, current, "recipient")
        return summary
      },
      []
    )
    let messagesSent = 0
    await Promise.all(
      summaries.map(async ({ communityId, user, sent, received }: GratitudeSummary) => {
        const platformName: PlatformName | undefined = communities.find(
          (current: Community) => current.id === communityId
        )?.platform
        if (platformName) {
          const platform = Platform.getInstance(platformName)
          const message: Message = await platform.getView("gratitudeSummary", { image: catImage.url, sent, received })
          await platform.sendMessage(user.id, message)
          messagesSent++
        }
      })
    )
    Logger.log(`${messagesSent} summary messages sent`)
  } catch (e) {
    Logger.onError(e)
  }
}
