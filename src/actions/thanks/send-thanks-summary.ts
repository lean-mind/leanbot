import { SimpleThanks, Thanks, ThanksSummary } from "../../models/database/thanks";
import { Cat } from "../../services/cat/cat";
import { Database } from "../../services/database/database";
import { MongoDB } from "../../services/database/mongo/mongo";
import { Logger } from "../../services/logger/logger";
import { Platform } from "../../services/platform/platform";
import { Slack } from "../../services/platform/slack/slack";
import { ViewThanksSummary } from "../../services/platform/slack/views/view-thanks-summary";

const sendMessage = async (platform: Platform, id: string, blocks: any[]): Promise<void> => {
  await platform.postBlocks(id, blocks)
}

const getSimpleThanksFrom = (thanks: Thanks, isSender: boolean): SimpleThanks => ({
  users: isSender ? [thanks.to] : [thanks.from],
  reason: thanks.reason,
  anonymous: thanks.anonymous,
  date: thanks.createdAt,
})

const updateListIfNeeds = (list: SimpleThanks[], currentThanks: SimpleThanks) => {
  const alreadyExistsReason = list.find(({ reason, date }: SimpleThanks) => reason === currentThanks.reason && date.getTime() === currentThanks.date.getTime())
  
  if (alreadyExistsReason) {
    alreadyExistsReason.users.push(...currentThanks.users)
  } else {
    list.push(currentThanks)
  }
}

const update = (summary: ThanksSummary[], currentThanks: Thanks, who: "from" | "to") => {
  const isSender = who === "from"
  const user = currentThanks[who]
  const simpleThanks = getSimpleThanksFrom(currentThanks, isSender)
  const existingThanksSummary = summary.find((value) => value.user.id === user.id)
  const thanksSummary = existingThanksSummary ?? { user, given: [], received: [] }
  
  if (isSender) {
    updateListIfNeeds(thanksSummary.given, simpleThanks)
  } else {
    updateListIfNeeds(thanksSummary.received, simpleThanks)
  }
  
  if (!existingThanksSummary) summary.push(thanksSummary)
}

export const sendThanksSummary = async (
  platform: Platform = new Slack(),
  db: Database = new MongoDB(),
  cat: Cat = new Cat()
) => {
  try {
    const catImage = await cat.getRandomImage({})
    const thanksFromLastWeek: Thanks[] = await db.getThanksFromLastWeek()
    const summary: ThanksSummary[] = thanksFromLastWeek.reduce((summary: ThanksSummary[], currentThanks: Thanks) => {
      update(summary, currentThanks, "from")
      update(summary, currentThanks, "to")
      return summary
    }, [])

    summary.forEach(({ user, given, received }: ThanksSummary) => {
      const blocks = ViewThanksSummary({ image: catImage.url, given, received })
      sendMessage(platform, user.id, blocks)
    })
  } catch(e) {
    Logger.onError(e)
  }
}