import { CommunityBuilder } from './../../../tests/builders/models/community-builder';
import { GratitudeMessageBuilder } from './../../../tests/builders/models/gratitude-message-builder';
import { DatabaseResponse } from './../database';
import { Community } from './../../../models/database/community';
import { config } from "../../../config"
import { MongoDB } from "./mongo"
import { GratitudeMessage } from '../../../models/database/gratitude-message';

describe('Service MongoDB: ', () => {
  let db: MongoDB
  const oldConfig = config.database

  beforeEach(() => {
    config.database = {
      mongodb: {
        uri: process.env.TEST_MONGODB_URI || "",
        database: process.env.TEST_MONGODB_DATABASE || "test"
      }
    }
    db = new MongoDB()
  })

  afterEach(async () => {
    await db.removeCollections()
  })
  
  afterAll(() => {
    config.database = oldConfig
  })

  it('should save and retrieve communities', async () => {
    const communities: Community[] = [
      CommunityBuilder({ id: "first-community-id"}), 
      CommunityBuilder({ id: "second-community-id"})
    ]
    await db.registerCommunity(communities[0])
    await db.registerCommunity(communities[1])
    
    const retrievedCommunities: Community[] = await db.getCommunities()
    
    expect(retrievedCommunities).toContainEqual(communities[0])
    expect(retrievedCommunities).toContainEqual(communities[1])
    expect(retrievedCommunities).toHaveLength(2)
  }) 

  it('should save and retrieve gratitude messages', async () => {
    const gratitudeMessages: GratitudeMessage[] = [
      GratitudeMessageBuilder({ text: "message 1" }),
      GratitudeMessageBuilder({ text: "message 2" }),
      GratitudeMessageBuilder({ text: "message 3" })
    ]
    await db.saveGratitudeMessage(gratitudeMessages)

    const retrievedMessages: GratitudeMessage[] = await db.getGratitudeMessages({})

    expect(retrievedMessages).toContainEqual(gratitudeMessages[0])
    expect(retrievedMessages).toContainEqual(gratitudeMessages[1])
    expect(retrievedMessages).toContainEqual(gratitudeMessages[2])
    expect(retrievedMessages).toHaveLength(3)
  })
  
  it('should retrieve gratitude messages from a given number of days', async () => {
    const today = new Date()
    const fiveDaysAgo = new Date()
    fiveDaysAgo.setDate(today.getDate() - 5)

    const gratitudeMessages: GratitudeMessage[] = [
      GratitudeMessageBuilder({ createdAt: today }),
      GratitudeMessageBuilder({ createdAt: fiveDaysAgo })
    ]
    await db.saveGratitudeMessage(gratitudeMessages)

    const retrievedMessages: GratitudeMessage[] = await db.getGratitudeMessages({ days: 3 })

    expect(retrievedMessages).toContainEqual(gratitudeMessages[0])
    expect(retrievedMessages).not.toContainEqual(gratitudeMessages[1])
    expect(retrievedMessages).toHaveLength(1)
  })
}) 