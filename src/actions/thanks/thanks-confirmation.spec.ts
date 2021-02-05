import { Emojis } from "../../models/emojis"
import { Database } from "../../services/database/database"
import { I18n } from "../../services/i18n/i18n"
import { Slack } from "../../services/slack/slack"
import { ThanksPayloadBuilder } from "../../tests/builders/actions/thanks-payload-builder"
import { thanksConfirmation } from "./thanks-confirmation"

describe('Actions Thanks Confirmation', () => {
  const fromId = "U-from-id"
  const reason = "reason"
  const i18n = new I18n()

  let db: Database
  let slack: Slack

  beforeEach(() => {
    db = new Database()
    db.saveThanks = jest.fn()

    slack = new Slack()
    slack.chatPostMessage = jest.fn()
    slack.conversationsMembers = jest.fn(async () => ({
      members: ["U-member-id-1"]
    }))
  })

  it('should not give thanks to itself', async () => {
    const myselfId = "U-myself-id"
    const payload = ThanksPayloadBuilder({
      from: myselfId,
      recipients: [myselfId]
    })

    await thanksConfirmation(payload, db, slack)
    expect(slack.chatPostMessage).toBeCalledTimes(1) 
    expect(slack.chatPostMessage).toBeCalledWith(myselfId, { text: `${i18n.thanks("errorThanksItself")} ${Emojis.FacePalm}` })
  })

  it('should not give thanks to an empty channel', async () => {
    const toId = "C-channel-id"
    const payload = ThanksPayloadBuilder({ 
      from: fromId,
      recipients: [toId],
    })
     
    slack.conversationsMembers = jest.fn(async () => ({
      members: []
    }))

    await thanksConfirmation(payload, db, slack)

    expect(slack.conversationsMembers).toBeCalledTimes(1)
    expect(slack.chatPostMessage).toBeCalledTimes(1)
    expect(slack.chatPostMessage).toBeCalledWith(fromId, { text: `${i18n.thanks("errorNothingToGive")} ${Emojis.Disappointed}` })
  })

  it('should not notify twice to a person', async () => {
    const toId = "U-to-id"
    const channelId = "C-channel-id"
    const payload = ThanksPayloadBuilder({ 
      from: fromId,
      recipients: [toId, channelId],
      reason
    })
     
    slack.conversationsMembers = jest.fn(async () => ({
      members: [toId]
    }))

    await thanksConfirmation(payload, db, slack)

    expect(slack.chatPostMessage).toBeCalledTimes(2)
    expect(slack.chatPostMessage).nthCalledWith(1, toId, { text: i18n.thanks("messageTo", { from: `<@${fromId}>`, reason }) })
    expect(slack.chatPostMessage).nthCalledWith(2, fromId, { text: i18n.thanks("messageFrom", { to: `<@${toId}>, <#${channelId}>`, reason }) })
  })
  
  it('should give thanks to many people', async () => {
    const personId1 = "U-to-id-1"
    const personId2 = "U-to-id-2"
    const payload = ThanksPayloadBuilder({ 
      from: fromId,
      recipients: [personId1, personId2],
      reason
    })

    await thanksConfirmation(payload, db, slack)

    expect(slack.chatPostMessage).toBeCalledTimes(3)
    expect(slack.chatPostMessage).nthCalledWith(1, personId1, { text: i18n.thanks("messageTo", { from: `<@${fromId}>`, reason }) })
    expect(slack.chatPostMessage).nthCalledWith(2, personId2, { text: i18n.thanks("messageTo", { from: `<@${fromId}>`, reason }) })
    expect(slack.chatPostMessage).nthCalledWith(3, fromId, { text: i18n.thanks("messageFrom", { to: `<@${personId1}>, <@${personId2}>`, reason }) })
  })

  it('should give thanks to all channel members', async () => {
    const personId1 = "U-to-id-1"
    const personId2 = "U-to-id-2"
    const channelId = "C-channel-id"
    const payload = ThanksPayloadBuilder({ 
      from: fromId,
      recipients: [channelId],
      reason
    })
     
    slack.conversationsMembers = jest.fn(async () => ({
      members: [personId1, personId2]
    }))

    await thanksConfirmation(payload, db, slack)

    expect(slack.chatPostMessage).toBeCalledTimes(3)
    expect(slack.chatPostMessage).nthCalledWith(1, personId1, { text: i18n.thanks("messageTo", { from: `<@${fromId}>`, reason }) })
    expect(slack.chatPostMessage).nthCalledWith(2, personId2, { text: i18n.thanks("messageTo", { from: `<@${fromId}>`, reason }) })
    expect(slack.chatPostMessage).nthCalledWith(3, fromId, { text: i18n.thanks("messageFrom", { to: `<#${channelId}>`, reason }) })
  })
  
  it('should be able to publish in a channel', async () => {
    const toId = "U-to-id"
    const channelWhereId = "C-channel-id"
    const payload = ThanksPayloadBuilder({ 
      from: fromId,
      recipients: [toId],
      where: channelWhereId,
      reason,
    })

    await thanksConfirmation(payload, db, slack)

    expect(slack.chatPostMessage).toBeCalledTimes(3)
    expect(slack.chatPostMessage).nthCalledWith(1, toId, { text: i18n.thanks("messageTo", { from: `<@${fromId}>`, reason }) })
    expect(slack.chatPostMessage).nthCalledWith(2, channelWhereId, { text: i18n.thanks("messageWhere", { from: `<@${fromId}>`, to: `<@${toId}>`, reason }) })
    expect(slack.chatPostMessage).nthCalledWith(3, fromId, { text: i18n.thanks("messageFrom", { to: `<@${toId}>`, reason }) })
  })

  it('should be able to give thanks anonymously', async () => {
    const toId = "U-to-id"
    const channelWhereId = "C-channel-id"
    const payload = ThanksPayloadBuilder({ 
      from: fromId,
      recipients: [toId],
      anonymous: true,
      where: channelWhereId,
      reason,
    })

    await thanksConfirmation(payload, db, slack)

    expect(slack.chatPostMessage).toBeCalledTimes(3)
    expect(slack.chatPostMessage).nthCalledWith(1, toId, { text: i18n.thanks("messageTo", { from: i18n.thanks("anAnonymous"), reason }) })
    expect(slack.chatPostMessage).nthCalledWith(2, channelWhereId, { text: i18n.thanks("messageWhere", { from: i18n.thanks("anAnonymous"), to: `<@${toId}>`, reason }) })
    expect(slack.chatPostMessage).nthCalledWith(3, fromId, { text: i18n.thanks("messageFrom", { to: `<@${toId}>${i18n.thanks("anonymously")}`, reason }) })
  })
})