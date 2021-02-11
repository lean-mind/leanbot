import { Emojis } from "../../models/emojis"
import { Database } from "../../services/database/database"
import { MongoDB } from "../../services/database/mongo/mongo"
import { I18n } from "../../services/i18n/i18n"
import { Platform } from "../../services/platform/platform"
import { Slack } from "../../services/platform/slack/slack"
import { ThanksConfirmationPropsBuilder } from "../../tests/builders/actions/thanks-confirmation-props-builder"
import { thanksConfirmation, ThanksConfirmationProps } from "./thanks-confirmation"

describe('Actions Thanks Confirmation', () => {
  const fromId = "U-from-id"
  const reason = "reason"
  const i18n = new I18n()

  let db: Database
  let platform: Platform

  beforeEach(() => {
    db = new MongoDB()
    db.saveThanks = jest.fn()

    platform = new Slack()
    platform.postMessage = jest.fn()
    platform.getMembersId = jest.fn(async () => (["U-member-id-1"]))
  })

  it('should not give thanks to itself', async () => {
    const myselfId = "U-myself-id"
    const props: ThanksConfirmationProps = ThanksConfirmationPropsBuilder({
      from: myselfId,
      recipients: [myselfId]
    })

    await thanksConfirmation(platform, props, db)
    expect(platform.postMessage).toBeCalledTimes(1) 
    expect(platform.postMessage).toBeCalledWith(myselfId, `${i18n.thanks("errorThanksItself")} ${Emojis.FacePalm}`)
  })

  it('should not give thanks to itself from channel', async () => {
    const myselfId = "U-myself-id"
    const anotherId = "U-another-id"
    const toId = "C-channel-id"
    const props: ThanksConfirmationProps = ThanksConfirmationPropsBuilder({ 
      from: myselfId,
      recipients: [toId],
      reason,
    })
     
    platform.getMembersId = jest.fn(async () => ([anotherId, myselfId]))

    await thanksConfirmation(platform, props, db)

    expect(platform.postMessage).toBeCalledTimes(2)
    expect(platform.postMessage).nthCalledWith(1, anotherId, i18n.thanks("messageTo", { from: `<@${myselfId}>`, reason }))
    expect(platform.postMessage).nthCalledWith(2, myselfId, i18n.thanks("messageFrom", { to: `<#${toId}>`, reason }))
  })

  it('should not give thanks to an empty channel', async () => {
    const toId = "C-channel-id"
    const props: ThanksConfirmationProps = ThanksConfirmationPropsBuilder({ 
      from: fromId,
      recipients: [toId],
    })
     
    platform.getMembersId = jest.fn(async () => ([]))

    await thanksConfirmation(platform, props, db)

    expect(platform.getMembersId).toBeCalledTimes(1)
    expect(platform.postMessage).toBeCalledTimes(1)
    expect(platform.postMessage).toBeCalledWith(fromId, `${i18n.thanks("errorNothingToGive")} ${Emojis.Disappointed}`)
  })

  it('should not notify twice to a person', async () => {
    const toId = "U-to-id"
    const channelId = "C-channel-id"
    const props: ThanksConfirmationProps = ThanksConfirmationPropsBuilder({ 
      from: fromId,
      recipients: [toId, channelId],
      reason
    })
     
    platform.getMembersId = jest.fn(async () => ([toId]))

    await thanksConfirmation(platform, props, db)

    expect(platform.postMessage).toBeCalledTimes(2)
    expect(platform.postMessage).nthCalledWith(1, toId, i18n.thanks("messageTo", { from: `<@${fromId}>`, reason }))
    expect(platform.postMessage).nthCalledWith(2, fromId, i18n.thanks("messageFrom", { to: `<@${toId}>, <#${channelId}>`, reason }))
  })
  
  it('should give thanks to many people', async () => {
    const personId1 = "U-to-id-1"
    const personId2 = "U-to-id-2"
    const props: ThanksConfirmationProps = ThanksConfirmationPropsBuilder({ 
      from: fromId,
      recipients: [personId1, personId2],
      reason
    })

    await thanksConfirmation(platform, props, db)

    expect(platform.postMessage).toBeCalledTimes(3)
    expect(platform.postMessage).nthCalledWith(1, personId1, i18n.thanks("messageTo", { from: `<@${fromId}>`, reason }))
    expect(platform.postMessage).nthCalledWith(2, personId2, i18n.thanks("messageTo", { from: `<@${fromId}>`, reason }))
    expect(platform.postMessage).nthCalledWith(3, fromId, i18n.thanks("messageFrom", { to: `<@${personId1}>, <@${personId2}>`, reason }))
  })

  it('should give thanks to all channel members', async () => {
    const personId1 = "U-to-id-1"
    const personId2 = "U-to-id-2"
    const channelId = "C-channel-id"
    const props: ThanksConfirmationProps = ThanksConfirmationPropsBuilder({ 
      from: fromId,
      recipients: [channelId],
      reason
    })
     
    platform.getMembersId = jest.fn(async () => ([personId1, personId2]))

    await thanksConfirmation(platform, props, db)

    expect(platform.postMessage).toBeCalledTimes(3)
    expect(platform.postMessage).nthCalledWith(1, personId1, i18n.thanks("messageTo", { from: `<@${fromId}>`, reason }))
    expect(platform.postMessage).nthCalledWith(2, personId2, i18n.thanks("messageTo", { from: `<@${fromId}>`, reason }))
    expect(platform.postMessage).nthCalledWith(3, fromId, i18n.thanks("messageFrom", { to: `<#${channelId}>`, reason }))
  })
  
  it('should be able to publish in a channel', async () => {
    const toId = "U-to-id"
    const channelWhereId = "C-channel-id"
    const props: ThanksConfirmationProps = ThanksConfirmationPropsBuilder({ 
      from: fromId,
      recipients: [toId],
      where: channelWhereId,
      reason,
    })

    await thanksConfirmation(platform, props, db)

    expect(platform.postMessage).toBeCalledTimes(3)
    expect(platform.postMessage).nthCalledWith(1, toId, i18n.thanks("messageTo", { from: `<@${fromId}>`, reason }))
    expect(platform.postMessage).nthCalledWith(2, channelWhereId, i18n.thanks("messageWhere", { from: `<@${fromId}>`, to: `<@${toId}>`, reason }))
    expect(platform.postMessage).nthCalledWith(3, fromId, i18n.thanks("messageFrom", { to: `<@${toId}>`, reason }))
  })

  it('should be able to give thanks anonymously', async () => {
    const toId = "U-to-id"
    const channelWhereId = "C-channel-id"
    const props: ThanksConfirmationProps = ThanksConfirmationPropsBuilder({ 
      from: fromId,
      recipients: [toId],
      anonymous: true,
      where: channelWhereId,
      reason,
    })

    await thanksConfirmation(platform, props, db)

    expect(platform.postMessage).toBeCalledTimes(3)
    expect(platform.postMessage).nthCalledWith(1, toId, i18n.thanks("messageTo", { from: i18n.thanks("anAnonymous"), reason }))
    expect(platform.postMessage).nthCalledWith(2, channelWhereId, i18n.thanks("messageWhere", { from: i18n.thanks("anAnonymous"), to: `<@${toId}>`, reason }))
    expect(platform.postMessage).nthCalledWith(3, fromId, i18n.thanks("messageFrom", { to: `<@${toId}>${i18n.thanks("anonymously")}`, reason }))
  })
})