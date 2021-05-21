import { GratitudeMessage } from "../../models/database/gratitude-message"
import { Emojis } from "../../models/emojis"
import { Id, IdType } from "../../models/platform/slack/id"
import { Database } from "../../services/database/database"
import { I18n } from "../../services/i18n/i18n"
import { Platform } from "../../services/platform/platform"
import { Factory } from "../../services/infrastructure/factory";

export interface ThanksConfirmationProps {
  communityId: string
  sender: Id
  recipients: Id[]
  channel: Id
  text: string
  isAnonymous: boolean
}

let i18n: I18n

const separateByType = (sender: Id) => (recipientsFiltered, currentRecipient: Id) => {
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

const sendRecipientMessages = async (platform: Platform, gratitudeMessages: GratitudeMessage[]): Promise<void> => {
  await Promise.all(gratitudeMessages.map(async ({ sender, recipient, text, isAnonymous }: GratitudeMessage) => {
    text = text.split("\n").join("\n>")
    const senderName = isAnonymous ? i18n.translate("gratitudeMessage.anAnonymous") : `<@${sender.id}>`
    const recipientMessage = i18n.translate("gratitudeMessage.recipientMessage", { sender: senderName, text: text.toString() })
  
    await platform.sendMessage(recipient.id, recipientMessage)
  }))
}

const sendSenderMessage = async (platform: Platform, channel: Id, sender: Id, recipient: Id[], text: string, isAnonymous = false): Promise<void> => {
  text = text.split("\n").join("\n>")
  const allRecipients = recipient.map((current: Id) => current.type === IdType.channel ? `<#${current.id}>` : `<@${current.id}>`).join(", ")
  const senderName = isAnonymous ? i18n.translate("gratitudeMessage.anAnonymous") : `<@${sender.id}>`
  const anonymously = isAnonymous ? i18n.translate("gratitudeMessage.anonymously") : ""
  const senderMessage = i18n.translate("gratitudeMessage.senderMessage", { recipient: `${allRecipients}${anonymously}`, text })
  const channelMessage = i18n.translate("gratitudeMessage.channelMessage", { sender: senderName, recipient: `${allRecipients}`, text })

  if (channel.type !== IdType.unknown) {
    await platform.sendMessage(channel.id, channelMessage)
  }
  await platform.sendMessage(sender.id, senderMessage)
}

const sendMessage = async (platform: Platform, id: string, message: string): Promise<void> => {
  await platform.sendMessage(id, message)
}

export const thanksConfirmation = async (
  platform: Platform,
  { communityId, sender, recipients, text, isAnonymous, channel }: ThanksConfirmationProps,
  db: Database = Factory.createRepository(),
): Promise<void> => {
  i18n = await I18n.getInstance()
  const createdAt = new Date()

  const recipientsFiltered = recipients.reduce(separateByType(sender), { channels: [], users: [] })
  const recipientIdsFromChannels: Id[][] = await Promise.all(recipientsFiltered.channels.map(getMembersFromChannel(platform)))
  const allRecipientIds: Id[] = recipientIdsFromChannels.reduce(unifyIds, recipientsFiltered.users)

  const uniqueIds: Id[] = allRecipientIds.filter(removeDuplicates<Id>("id")).filter(removeMyself(sender))
  const gratitudeMessages: GratitudeMessage[] = uniqueIds.map((recipient: Id) => getGratitudeMessage(communityId, sender, recipient, channel, text, isAnonymous, createdAt))

  try {
    if (gratitudeMessages.length > 0) {
      await db.saveGratitudeMessages(gratitudeMessages)

      await sendRecipientMessages(platform, gratitudeMessages)
      await sendSenderMessage(platform, channel, sender, recipients, text, isAnonymous)
    } else if (recipients[0].id !== sender.id) {
      await sendMessage(platform, sender.id, `${i18n.translate("gratitudeMessage.errorNothingToGive")} ${Emojis.Disappointed}`)
    } else {
      await sendMessage(platform, sender.id, `${i18n.translate("gratitudeMessage.errorMessageSelf")} ${Emojis.FacePalm}`)
    }
  } catch(e) {
    await sendMessage(platform, sender.id, `${i18n.translate("gratitudeMessage.error")} ${Emojis.ShockedFaceWithExplodingHead}`)
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