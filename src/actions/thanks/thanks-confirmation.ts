import { GratitudeMessage } from "../../models/database/gratitude-message"
import { Emojis } from "../../models/emojis"
import { Id, IdType } from "../../models/slack/id"
import { Database } from "../../services/database/database"
import { I18n } from "../../services/i18n/i18n"
import { Logger } from "../../services/logger/logger"
import { Platform } from "../../services/platform/platform"

export interface ThanksConfirmationProps {
  communityId: string
  sender: Id
  recipients: Id[]
  channel: Id
  text: string
  isAnonymous: boolean
}

const i18n = new I18n()

const separateByType = (sender: Id) => (recipientsFiltered: any, currentRecipient: Id) => {
  if (currentRecipient.type == IdType.channel){
    recipientsFiltered.channels.push(currentRecipient)
  } else if (currentRecipient.id !== sender.id) {
    recipientsFiltered.users.push(currentRecipient)
  } 
  return recipientsFiltered;
}

const getMembersFromChannel = (platform: Platform) => async (currentChannel: Id) => {
  const members = await platform.getMembersByChannelId(currentChannel.id)

  return members.map((member: string) => new Id(member))
}

const unifyIds = (acc: Id[], current: Id[]) => ([ ...acc, ...current])

const removeMyself = (myself: Id) => (current: Id) => myself.id !== current.id

const getGratitudeMessage = (communityId: string, sender: Id, recipient: Id, channel: Id, text: string, isAnonymous: boolean, date: Date): GratitudeMessage => {
  return new GratitudeMessage(communityId, sender, recipient, channel, text, isAnonymous, date);
}

const sendRecipientMessages = (platform: Platform, gratitudeMessages: GratitudeMessage[]): void => {
  gratitudeMessages.map(({ sender, recipient, text, isAnonymous }: GratitudeMessage) => {
    const senderName = isAnonymous ? i18n.gratitudeMessage("anAnonymous") : `<@${sender.id}>`
    const recipientMessage = i18n.gratitudeMessage("recipientMessage", { sender: senderName, text: text.toString() })
  
    platform.postMessage(recipient.id, recipientMessage)
  })
}

const sendSenderMessage = (platform: Platform, channel: Id, sender: Id, recipient: Id[], text: string, isAnonymous: boolean = false): void => {
  const allRecipients = recipient.map((current: Id) => current.type === IdType.channel ? `<#${current.id}>` : `<@${current.id}>`).join(", ")
  const senderName = isAnonymous ? i18n.gratitudeMessage("anAnonymous") : `<@${sender.id}>`
  const anonymously = isAnonymous ? i18n.gratitudeMessage("anonymously") : ""
  const senderMessage = i18n.gratitudeMessage("senderMessage", { recipient: `${allRecipients}${anonymously}`, text })
  const channelMessage = i18n.gratitudeMessage("channelMessage", { sender: senderName, recipient: `${allRecipients}`, text })

  if (channel.type !== IdType.unknown) {
    platform.postMessage(channel.id, channelMessage)
  }
  platform.postMessage(sender.id, senderMessage)
}

const sendMessage = async (platform: Platform, id: string, message: string): Promise<void> => {
  await platform.postMessage(id, message)
}

export const thanksConfirmation = async (
  platform: Platform,
  { communityId, sender, recipients, text, isAnonymous, channel }: ThanksConfirmationProps,
  db: Database = Database.make(),
) => {
  const createdAt = new Date()

  const recipientsFiltered = recipients.reduce(separateByType(sender), { channels: [], users: [] })
  const recipientIdsFromChannels: Id[][] = await Promise.all(recipientsFiltered.channels.map(getMembersFromChannel(platform)))
  const allRecipientIds: Id[] = recipientIdsFromChannels.reduce(unifyIds, recipientsFiltered.users)

  const uniqueIds: Id[] = allRecipientIds.filter(removeDuplicates<Id>("id")).filter(removeMyself(sender))
  const gratitudeMessages: GratitudeMessage[] = uniqueIds.map((recipient: Id) => getGratitudeMessage(communityId, sender, recipient, channel, text, isAnonymous, createdAt))

  try {
    if (gratitudeMessages.length > 0) {
      await db.saveGratitudeMessage(gratitudeMessages)

      sendRecipientMessages(platform, gratitudeMessages)
      sendSenderMessage(platform, channel, sender, recipients, text, isAnonymous)
    } else if (recipients[0].id !== sender.id) {
      sendMessage(platform, sender.id, `${i18n.gratitudeMessage("errorNothingToGive")} ${Emojis.Disappointed}`)
    } else {
      sendMessage(platform, sender.id, `${i18n.gratitudeMessage("errorMessageSelf")} ${Emojis.FacePalm}`)
    }
  } catch(e) {
    sendMessage(platform, sender.id, `${i18n.gratitudeMessage("error")} ${Emojis.ShockedFaceWithExplodingHead}`)
    Logger.onDBError(e)
  }
}

export const removeDuplicates = <T>(field?: keyof T) => (current: T | null, index: number, list: (T | null)[]): boolean => {
  if (current === null) return false
  if (field) {
    const listOfField = list.map((value: T | null) => value?.[field])
    return removeDuplicates()(current[field], index, listOfField)
  }
  return list.indexOf(current) === index
}