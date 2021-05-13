import { Id } from "../../models/platform/slack/id"
import { Cat } from "../../services/cat/cat"
import { MongoDB } from "../../services/database/mongo/mongo"
import { Platform, PlatformName } from "../../services/platform/platform"
import { Slack } from "../../services/platform/slack/slack"
import { GratitudeMessageBuilder } from "../../tests/builders/models/gratitude-message-builder"
import { GratitudeSummaryMessageBuilder } from "../../tests/builders/models/gratitude-summary-message-builder"
import { GratitudeSummaryViewBuilder } from "../../tests/builders/platform/slack/views/gratitude-summary-view-builder"
import { sendGratitudeSummaries } from "./send-gratitude-summaries"

jest.mock('../../services/database/mongo/mongo')
jest.mock('../../services/cat/cat')

describe('Action Send Gratitude Summary', () => {
  const platformName: PlatformName = "slack" 
  const communityId = "irrelevant-community-id"
  const senderId = "irrelevant-sender-id"
  const recipientId = "irrelevant-recipient-id"
  const text = "irrelevant-text"
  const catImage = "cat-image-url"
  const gratitudeMessage = { 
    communityId, 
    text,
    createdAt: new Date(),
    sender: new Id(senderId)
  }
  
  const mockCat = new Cat()
  const mockDb = new MongoDB()
  const slack = Slack.getInstance()

  beforeEach(() => {
    Platform.getInstance = jest.fn((_) => slack)
    slack.sendMessage = jest.fn()
    
    mockCat.getRandomImage = jest.fn(async () => ({ url: catImage }))
    mockDb.getCommunities = jest.fn(async () => ([
      {
        id: communityId,
        platform: platformName
      }
    ]))
  })

  it('should send a summary message to everyone that gave or received gratitude', async () => {
    mockDb.getGratitudeMessages = jest.fn(async () => ([
      GratitudeMessageBuilder({ 
        ...gratitudeMessage, 
        recipient: new Id(recipientId)
      })
    ]))

    await sendGratitudeSummaries(mockDb, mockCat)

    expect(slack.sendMessage).toBeCalledWith(senderId, expect.anything())
    expect(slack.sendMessage).toBeCalledWith(recipientId, expect.anything())
    expect(slack.sendMessage).toBeCalledTimes(2)
  })
  
  it('should only send summaries to registered communities', async () => {
    mockDb.getCommunities = jest.fn(async () => ([]))
    mockDb.getGratitudeMessages = jest.fn(async () => ([
      GratitudeMessageBuilder({})
    ]))

    await sendGratitudeSummaries(mockDb, mockCat)

    expect(slack.sendMessage).not.toBeCalled()
  })
  
  it('should group messages that were sent to several people with the same gratitude text and date', async () => {
    const firstRecipientId = "first-recipient-id"
    const secondRecipientId = "second-recipient-id"

    mockDb.getGratitudeMessages = jest.fn(async () => ([
      GratitudeMessageBuilder({  
          ...gratitudeMessage,
          recipient: new Id(firstRecipientId)
      }),
      GratitudeMessageBuilder({  
          ...gratitudeMessage,
          recipient: new Id(secondRecipientId)
      })
    ]))

    await sendGratitudeSummaries(mockDb, mockCat)

    expect(slack.sendMessage).toBeCalledWith(senderId, expect.anything())
    expect(slack.sendMessage).toBeCalledWith(firstRecipientId, expect.anything())
    expect(slack.sendMessage).toBeCalledWith(secondRecipientId, expect.anything())
    expect(slack.sendMessage).toBeCalledTimes(3)
  })
})