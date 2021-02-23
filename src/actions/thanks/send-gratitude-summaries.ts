import { Community } from "../../models/database/community";
import { GratitudeMessage, GratitudeSummary, GratitudeSummaryMessage } from "../../models/database/gratitude-message";
import { View } from "../../models/platform/message";
import { Cat } from "../../services/cat/cat";
import { Database } from "../../services/database/database";
import { Logger } from "../../services/logger/logger";
import { Platform, PlatformName } from "../../services/platform/platform";
import { ViewGratitudeSummary } from "../../services/platform/slack/views/view-gratitude-summary";

const getGratitudeSummaryMessageFrom = (gratitudeMessage: GratitudeMessage, isSender: boolean): GratitudeSummaryMessage => ({
  users: isSender ? [gratitudeMessage.recipient] : [gratitudeMessage.sender],
  text: gratitudeMessage.text,
  isAnonymous: gratitudeMessage.isAnonymous,
  createdAt: gratitudeMessage.createdAt,
})

const updateListIfNeeds = (list: GratitudeSummaryMessage[], currentThanks: GratitudeSummaryMessage) => {
  const alreadyExistsText = list.find(({ text, createdAt }: GratitudeSummaryMessage) => 
    text === currentThanks.text && createdAt.getTime() === currentThanks.createdAt.getTime()
  )

  if (alreadyExistsText) {
    alreadyExistsText.users.push(...currentThanks.users)
  } else {
    list.push(currentThanks)
  }
}

const update = (summary: GratitudeSummary[], currentGratitudeMessage: GratitudeMessage, who: "sender" | "recipient") => {
  const isSender = who === "sender"
  const user = currentGratitudeMessage[who]
  const gratitudeSummaryMessage = getGratitudeSummaryMessageFrom(currentGratitudeMessage, isSender)
  const existingGratitudeSummary = summary.find((value) => value.user.id === user.id)
  const gratitudeSummary: GratitudeSummary = existingGratitudeSummary ?? { communityId: currentGratitudeMessage.communityId, user, sent: [], received: [] }
  
  if (isSender) {
    updateListIfNeeds(gratitudeSummary.sent, gratitudeSummaryMessage)
  } else {
    updateListIfNeeds(gratitudeSummary.received, gratitudeSummaryMessage)
  }
  
  if (!existingGratitudeSummary) summary.push(gratitudeSummary)
}

export const sendGratitudeSummaries = async (
  db: Database = Database.make(),
  cat: Cat = new Cat()
) => {
  Logger.log("Sending gratitude summaries...")
  try {
    const catImage = await cat.getRandomImage({})
    const communities = await db.getCommunities()
    const gratitudeMessagesFromLastWeek: GratitudeMessage[] = await db.getGratitudeMessages({ days: 7 })
    const summaries: GratitudeSummary[] = gratitudeMessagesFromLastWeek.reduce((summary: GratitudeSummary[], current: GratitudeMessage) => {
      update(summary, current, "sender")
      update(summary, current, "recipient")
      return summary
    }, [])
    
    let messagesSent = 0
    summaries.forEach(({ communityId, user, sent, received }: GratitudeSummary) => {
      // TODO: Get view from platform
      // type Views = "gratitude-summary"
      // type InteractiveViews = "gratitude-message"
      // Platform.getInstance(platform).getView("gratitude-summary")
      const blocks: View = ViewGratitudeSummary({ image: catImage.url, sent, received })
      const platformName: PlatformName | undefined = communities.find((current: Community) => current.id === communityId)?.platform
      
      if (platformName) {
        Platform.getInstance(platformName).sendMessage(user.id, blocks)
        messagesSent++
      }
    })
    Logger.log(`${messagesSent} summary messages sent`)
  } catch(e) {
    Logger.onError(e)
  }
}