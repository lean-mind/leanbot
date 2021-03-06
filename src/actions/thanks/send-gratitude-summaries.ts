import { Community } from "../../models/database/community";
import { GratitudeMessage, GratitudeSummary, GratitudeSummaryMessage } from "../../models/database/gratitude-message";
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
  const grattudeSummaryMessage = getGratitudeSummaryMessageFrom(currentGratitudeMessage, isSender)
  const existingGratitudeSummary = summary.find((value) => value.user.id === user.id)
  const gratitudeSummary: GratitudeSummary = existingGratitudeSummary ?? { communityId: currentGratitudeMessage.communityId, user, sent: [], received: [] }
  
  if (isSender) {
    updateListIfNeeds(gratitudeSummary.sent, grattudeSummaryMessage)
  } else {
    updateListIfNeeds(gratitudeSummary.received, grattudeSummaryMessage)
  }
  
  if (!existingGratitudeSummary) summary.push(gratitudeSummary)
}

export const sendGratitudeSummaries = async (
  db: Database = Database.make(),
  cat: Cat = new Cat()
) => {
  try {
    const catImage = await cat.getRandomImage({})
    const communities = await db.getCommunities()
    const gratitudeMessagesFromLastWeek: GratitudeMessage[] = await db.getGratitudeMessages({ days: 7 })
    const summaries: GratitudeSummary[] = gratitudeMessagesFromLastWeek.reduce((summary: GratitudeSummary[], current: GratitudeMessage) => {
      update(summary, current, "sender")
      update(summary, current, "recipient")
      return summary
    }, [])
    
    summaries.forEach(({ communityId, user, sent, received }: GratitudeSummary) => {
      const blocks = ViewGratitudeSummary({ image: catImage.url, sent, received })
      const platformName: PlatformName | undefined = communities.find((current: Community) => current.id === communityId)?.platform
      
      if (platformName) {
        Platform.getInstance(platformName).postBlocks(user.id, blocks)
      }
    })
  } catch(e) {
    Logger.onError(e)
  }
}