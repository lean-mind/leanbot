import { Emojis } from "../../models/emojis"
import { Database } from "../../services/database/database"
import { I18n } from "../../services/i18n/i18n"
import { Platform } from "../../services/platform/platform"
import { Slack } from "../../services/platform/slack/slack"
import { ThanksConfirmationPropsBuilder } from "../../tests/builders/actions/thanks-confirmation-props-builder"
import { thanksConfirmation, ThanksConfirmationProps } from "./thanks-confirmation"

describe('Actions Thanks Confirmation', () => {
  const fromId = "U-from-id"
  const text = "text"
  let i18n: I18n

  let db: Database
  let platform: Platform

  beforeAll(async () => {
    i18n = await I18n.getInstance()
  })

  beforeEach(() => {
    db = Database.make()
    db.saveGratitudeMessage = jest.fn()

    platform = Slack.getInstance()
    platform.sendMessage = jest.fn()
    platform.getMembersByChannelId = jest.fn(async () => (["U-member-id-1"]))
  })

  it('should not give thanks to itself', async () => {
    const myselfId = "U-myself-id"
    const props: ThanksConfirmationProps = ThanksConfirmationPropsBuilder({
      sender: myselfId,
      recipients: [myselfId]
    })

    await thanksConfirmation(platform, props, db)
    expect(platform.sendMessage).toBeCalledTimes(1) 
    expect(platform.sendMessage).toBeCalledWith(myselfId, `${await i18n.translate("gratitudeMessage.errorMessageSelf")} ${Emojis.FacePalm}`)
  })

  it('should not give thanks to itself from channel', async () => {
    const myselfId = "U-myself-id"
    const anotherId = "U-another-id"
    const toId = "C-channel-id"
    const props: ThanksConfirmationProps = ThanksConfirmationPropsBuilder({ 
      sender: myselfId,
      recipients: [toId],
      text,
    })
     
    platform.getMembersByChannelId = jest.fn(async () => ([anotherId, myselfId]))

    await thanksConfirmation(platform, props, db)

    expect(platform.sendMessage).toBeCalledTimes(2)
    expect(platform.sendMessage).nthCalledWith(1, anotherId, i18n.translate("gratitudeMessage.recipientMessage", { sender: `<@${myselfId}>`, text }))
    expect(platform.sendMessage).nthCalledWith(2, myselfId, i18n.translate("gratitudeMessage.senderMessage", { recipient: `<#${toId}>`, text }))
  })

  it('should not give thanks to an empty channel', async () => {
    const toId = "C-channel-id"
    const props: ThanksConfirmationProps = ThanksConfirmationPropsBuilder({ 
      sender: fromId,
      recipients: [toId],
    })
     
    platform.getMembersByChannelId = jest.fn(async () => ([]))

    await thanksConfirmation(platform, props, db)

    expect(platform.getMembersByChannelId).toBeCalledTimes(1)
    expect(platform.sendMessage).toBeCalledTimes(1)
    expect(platform.sendMessage).toBeCalledWith(fromId, `${i18n.translate("gratitudeMessage.errorNothingToGive")} ${Emojis.Disappointed}`)
  })

  it('should not notify twice to a person', async () => {
    const toId = "U-to-id"
    const channelId = "C-channel-id"
    const props: ThanksConfirmationProps = ThanksConfirmationPropsBuilder({ 
      sender: fromId,
      recipients: [toId, channelId],
      text
    })
     
    platform.getMembersByChannelId = jest.fn(async () => ([toId]))

    await thanksConfirmation(platform, props, db)

    expect(platform.sendMessage).toBeCalledTimes(2)
    expect(platform.sendMessage).nthCalledWith(1, toId, i18n.translate("gratitudeMessage.recipientMessage", { sender: `<@${fromId}>`, text }))
    expect(platform.sendMessage).nthCalledWith(2, fromId, i18n.translate("gratitudeMessage.senderMessage", { recipient: `<@${toId}>, <#${channelId}>`, text }))
  })
  
  it('should give thanks to many people', async () => {
    const personId1 = "U-to-id-1"
    const personId2 = "U-to-id-2"
    const props: ThanksConfirmationProps = ThanksConfirmationPropsBuilder({ 
      sender: fromId,
      recipients: [personId1, personId2],
      text
    })

    await thanksConfirmation(platform, props, db)

    expect(platform.sendMessage).toBeCalledTimes(3)
    expect(platform.sendMessage).nthCalledWith(1, personId1, i18n.translate("gratitudeMessage.recipientMessage", { sender: `<@${fromId}>`, text }))
    expect(platform.sendMessage).nthCalledWith(2, personId2, i18n.translate("gratitudeMessage.recipientMessage", { sender: `<@${fromId}>`, text }))
    expect(platform.sendMessage).nthCalledWith(3, fromId, i18n.translate("gratitudeMessage.senderMessage", { recipient: `<@${personId1}>, <@${personId2}>`, text }))
  })

  it('should give thanks to all channel members', async () => {
    const personId1 = "U-to-id-1"
    const personId2 = "U-to-id-2"
    const channelId = "C-channel-id"
    const props: ThanksConfirmationProps = ThanksConfirmationPropsBuilder({ 
      sender: fromId,
      recipients: [channelId],
      text
    })
     
    platform.getMembersByChannelId = jest.fn(async () => ([personId1, personId2]))

    await thanksConfirmation(platform, props, db)

    expect(platform.sendMessage).toBeCalledTimes(3)
    expect(platform.sendMessage).nthCalledWith(1, personId1, i18n.translate("gratitudeMessage.recipientMessage", { sender: `<@${fromId}>`, text }))
    expect(platform.sendMessage).nthCalledWith(2, personId2, i18n.translate("gratitudeMessage.recipientMessage", { sender: `<@${fromId}>`, text }))
    expect(platform.sendMessage).nthCalledWith(3, fromId, i18n.translate("gratitudeMessage.senderMessage", { recipient: `<#${channelId}>`, text }))
  })
  
  it('should be able to publish in a channel', async () => {
    const toId = "U-to-id"
    const channelId = "C-channel-id"
    const props: ThanksConfirmationProps = ThanksConfirmationPropsBuilder({ 
      sender: fromId,
      recipients: [toId],
      channel: channelId,
      text,
    })

    await thanksConfirmation(platform, props, db)

    expect(platform.sendMessage).toBeCalledTimes(3)
    expect(platform.sendMessage).nthCalledWith(1, toId, i18n.translate("gratitudeMessage.recipientMessage", { sender: `<@${fromId}>`, text }))
    expect(platform.sendMessage).nthCalledWith(2, channelId, i18n.translate("gratitudeMessage.channelMessage", { sender: `<@${fromId}>`, recipient: `<@${toId}>`, text }))
    expect(platform.sendMessage).nthCalledWith(3, fromId, i18n.translate("gratitudeMessage.senderMessage", { recipient: `<@${toId}>`, text }))
  })

  it('should be able to give thanks anonymously', async () => {
    const toId = "U-to-id"
    const channelId = "C-channel-id"
    const props: ThanksConfirmationProps = ThanksConfirmationPropsBuilder({ 
      sender: fromId,
      recipients: [toId],
      isAnonymous: true,
      channel: channelId,
      text,
    })

    await thanksConfirmation(platform, props, db)

    expect(platform.sendMessage).toBeCalledTimes(3)
    expect(platform.sendMessage).nthCalledWith(1, toId, i18n.translate("gratitudeMessage.recipientMessage", { sender: i18n.translate("gratitudeMessage.anAnonymous"), text }))
    expect(platform.sendMessage).nthCalledWith(2, channelId, i18n.translate("gratitudeMessage.channelMessage", { sender: i18n.translate("gratitudeMessage.anAnonymous"), recipient: `<@${toId}>`, text }))
    expect(platform.sendMessage).nthCalledWith(3, fromId, i18n.translate("gratitudeMessage.senderMessage", { recipient: `<@${toId}>${i18n.translate("gratitudeMessage.anonymously")}`, text }))
  })
})