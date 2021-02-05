import { SimpleThanks, Thanks, ThanksSummary } from "../../models/database/thanks";
import { Database } from "../../services/database/database";
import { Logger } from "../../services/logger/logger";
import { Slack } from "../../services/slack/slack";
import { ViewThanksSummary } from "../../services/slack/views/view-thanks-summary";

const sendMessage = async (slack: Slack, id: string, blocks: any[]): Promise<void> => {
  await slack.chatPostMessage(id, { blocks })
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
  db: Database = new Database(),
  slack: Slack = new Slack(),
) => {
  try {
    const thanksFromLastWeek: Thanks[] = await db.getThanksFromLastWeek()
    const summary: ThanksSummary[] = thanksFromLastWeek.reduce((summary: ThanksSummary[], currentThanks: Thanks) => {
      update(summary, currentThanks, "from")
      update(summary, currentThanks, "to")
      return summary
    }, [])

    summary.forEach(({ user, given, received }: ThanksSummary) => {
      const blocks = ViewThanksSummary({ given, received })
      sendMessage(slack, user.id, blocks)
    })
  } catch(e) {
    Logger.onError(e)
  }
}