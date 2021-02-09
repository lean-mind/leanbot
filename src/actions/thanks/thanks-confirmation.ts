import { Payload, View } from "../../models/api/payload"
import { Thanks } from "../../models/database/thanks"
import { Emojis } from "../../models/emojis"
import { Id, IdType } from "../../models/slack/id"
import { Database } from "../../services/database/database"
import { I18n } from "../../services/i18n/i18n"
import { Logger } from "../../services/logger/logger"
import { Slack } from "../../services/slack/slack"

const i18n = new I18n()

const getPropsFrom = ({ state }: View) => ({
  recipients: state.values.recipients.action.selected_conversations.filter(removeDuplicates<string>()).map((toId: string) => new Id(toId)),
  reason: state.values.reason.action.value.split("\n").join("\n>"),
  anonymous: state.values.options.action.selected_options.some(({ value }) => value === "anonymous"),
  where: new Id(state.values.where.action.selected_conversation)
})

const separateByType = (from: Id) => (recipientsFiltered: any, currentRecipient: Id) => {
  if (currentRecipient.type == IdType.channel){
    recipientsFiltered.channels.push(currentRecipient)
  } else if (currentRecipient.id !== from.id) {
    recipientsFiltered.users.push(currentRecipient)
  }
  return recipientsFiltered;
}

const getMembersFromChannel = (slack: Slack) => async (currentChannel: Id) => {
  const { members } = await slack.conversationsMembers(currentChannel.id)

  return members.map((member: string) => new Id(member))
}

const unifyIds = (acc: Id[], current: Id[]) => ([ ...acc, ...current])

const removeDuplicates = <T>(field?: keyof T) => (current: T | null, index: number, list: (T | null)[]): boolean => {
  if (current === null) return false
  if (field) {
    const listOfField = list.map((value: T | null) => value?.[field])
    return removeDuplicates()(current[field], index, listOfField)
  }
  return list.indexOf(current) === index
}

const removeMyself = (myself: Id) => (current: Id) => {
  return myself.id !== current.id
}

const getThanks = (team: Id, from: Id, recipient: Id, where: Id, reason: string, anonymous: boolean, date: Date): Thanks => {
  return new Thanks(team, from, recipient, where, reason, anonymous, date);
}

const sendMessagesTo = (slack: Slack, thanksList: Thanks[]): void => {
  thanksList.map(({ from, to, reason, anonymous }: Thanks) => {
    const fromName = anonymous ? i18n.thanks("anAnonymous") : `<@${from.id}>`
    const messageTo = i18n.thanks("messageTo", { from: fromName, reason: reason.toString() })
  
    slack.chatPostMessage(to.id, { text: messageTo })
  })
}

const sendMessagesFrom = (slack: Slack, where: Id, from: Id, to: Id[], reason: string, anonymous: boolean = false): void => {
  const allRecipients = to.map((current: Id) => current.type === IdType.channel ? `<#${current.id}>` : `<@${current.id}>`).join(", ")
  const fromName = anonymous ? i18n.thanks("anAnonymous") : `<@${from.id}>`
  const anonymously = anonymous ? i18n.thanks("anonymously") : ""
  const messageFrom = i18n.thanks("messageFrom", { to: `${allRecipients}${anonymously}`, reason })
  const messageWhere = i18n.thanks("messageWhere", { from: fromName, to: `${allRecipients}`, reason })

  if (where.type !== IdType.unknown) {
    slack.chatPostMessage(where.id, { text: messageWhere })
  }
  slack.chatPostMessage(from.id, { text: messageFrom })
}

const sendMessage = async (slack: Slack, id: string, message: string): Promise<void> => {
  await slack.chatPostMessage(id, { text: message })
}

export const thanksConfirmation = async (
  { team, user, view }: Payload, 
  db: Database = new Database(),
  slack: Slack = new Slack(),
) => {
  const { recipients, reason, anonymous, where } = getPropsFrom(view)
  const from = new Id(user.id)
  const teamWhereIsIt = new Id(team.id)
  const createdAt = new Date()

  const recipientsFiltered = recipients.reduce(separateByType(from), { channels: [], users: [] })
  const recipientIdsFromChannels: Id[][] = await Promise.all(recipientsFiltered.channels.map(getMembersFromChannel(slack)))
  const allRecipientIds: Id[] = recipientIdsFromChannels.reduce(unifyIds, recipientsFiltered.users)

  const uniqueIds: Id[] = allRecipientIds.filter(removeDuplicates<Id>("id")).filter(removeMyself(from))
  const thanksList: Thanks[] = uniqueIds.map((to: Id) => getThanks(teamWhereIsIt, from, to, where, reason, anonymous, createdAt))

  try {
    if (thanksList.length > 0) {
      await db.saveThanks(thanksList)

      sendMessagesTo(slack, thanksList)
      sendMessagesFrom(slack, where, from, recipients, reason, anonymous)
    } else if (recipients[0].id !== from.id) {
      sendMessage(slack, from.id, `${i18n.thanks("errorNothingToGive")} ${Emojis.Disappointed}`)
    } else {
      sendMessage(slack, from.id, `${i18n.thanks("errorThanksItself")} ${Emojis.FacePalm}`)
    }
  } catch(e) {
    sendMessage(slack, from.id, `${i18n.thanks("error")} ${Emojis.ShockedFaceWithExplodingHead}`)
    Logger.onDBError(e)
  }
}