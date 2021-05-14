import { CoffeeBreakBuilder } from './../../../tests/builders/models/coffee-break-builder';
import { CoffeeBreak } from './../../../models/database/coffee-break';
import { CommunityBuilder } from './../../../tests/builders/models/community-builder';
import { GratitudeMessageBuilder } from './../../../tests/builders/models/gratitude-message-builder';
import { Community } from './../../../models/database/community';
import { config } from "../../../config"
import { MongoDB } from "./mongo"
import { GratitudeMessage } from '../../../models/database/gratitude-message';
import { Id } from '../../../models/platform/slack/id';
import { User } from "../../../models/database/user";
import { UserBuilder } from "../../../tests/builders/models/user-builder";

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

  it('should throw errors if needed', async () => {
    config.database = {
      mongodb: {
        uri: "",
        database: "test"
      }
    }

    const errorDb = new MongoDB()
    await expect(errorDb.getCommunities()).rejects.toBeDefined()
  })

  describe('Collection communities', () => {
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
  })

  describe('Collection users', () => {
    it('should save and retrieve user', async () => {
      const user: User = UserBuilder({})
      await db.saveUser(user)
      const retrievedUser: User | undefined = await db.getUser(user.userId)

      expect(retrievedUser).not.toBeUndefined()
      expect(retrievedUser).toEqual(user)
    })
    it('should not save user when it already exists', async () => {
      const user: User = UserBuilder({userName: 'repeated-username'})

      const firstInsertedUser: User | undefined = await db.saveUser(user)
      const retrievedUser: User | undefined = await db.getUser(user.userId)
      const secondInsertedUser: User | undefined = await db.saveUser(user)

      expect(firstInsertedUser).toEqual(user)
      expect(secondInsertedUser).toBeUndefined()
      expect(retrievedUser).not.toBeUndefined()
    })
  })

  describe('Collection gratitude messages:', () => {
    it('should save and retrieve gratitude messages', async () => {
      const gratitudeMessages: GratitudeMessage[] = [
        GratitudeMessageBuilder({ text: "message 1" }),
        GratitudeMessageBuilder({ text: "message 2" }),
        GratitudeMessageBuilder({ text: "message 3" })
      ]
      await db.saveGratitudeMessages(gratitudeMessages)

      const retrievedMessages: GratitudeMessage[] = await db.getGratitudeMessages({})

      expect(retrievedMessages).toContainEqual(gratitudeMessages[0])
      expect(retrievedMessages).toContainEqual(gratitudeMessages[1])
      expect(retrievedMessages).toContainEqual(gratitudeMessages[2])
      expect(retrievedMessages).toHaveLength(3)
    })

    it('should retrieve gratitude messages for a certain community', async () => {
      const communityId = "test-community-id"
      const gratitudeMessages: GratitudeMessage[] = [
        GratitudeMessageBuilder({ communityId }),
        GratitudeMessageBuilder({}),
      ]
      await db.saveGratitudeMessages(gratitudeMessages)

      const retrievedMessages: GratitudeMessage[] = await db.getGratitudeMessages({ communityId })

      expect(retrievedMessages).toContainEqual(gratitudeMessages[0])
      expect(retrievedMessages).not.toContainEqual(gratitudeMessages[1])
      expect(retrievedMessages).toHaveLength(1)
    })

    it('should retrieve gratitude messages for a certain user', async () => {
      const userId: Id = new Id("test-user-id")
      const gratitudeMessages: GratitudeMessage[] = [
        GratitudeMessageBuilder({ sender: userId }),
        GratitudeMessageBuilder({ recipient: userId }),
        GratitudeMessageBuilder({})
      ]
      await db.saveGratitudeMessages(gratitudeMessages)

      const retrievedMessages: GratitudeMessage[] = await db.getGratitudeMessages({ userId: userId.id })

      expect(retrievedMessages).toContainEqual(gratitudeMessages[0])
      expect(retrievedMessages).toContainEqual(gratitudeMessages[1])
      expect(retrievedMessages).not.toContainEqual(gratitudeMessages[2])
      expect(retrievedMessages).toHaveLength(2)
    })

    it('should retrieve gratitude messages from a given number of days', async () => {
      const today = new Date()
      const fiveDaysAgo = new Date()
      fiveDaysAgo.setDate(today.getDate() - 5)

      const gratitudeMessages: GratitudeMessage[] = [
        GratitudeMessageBuilder({ createdAt: today }),
        GratitudeMessageBuilder({ createdAt: fiveDaysAgo })
      ]
      await db.saveGratitudeMessages(gratitudeMessages)

      const retrievedMessages: GratitudeMessage[] = await db.getGratitudeMessages({ days: 3 })

      expect(retrievedMessages).toContainEqual(gratitudeMessages[0])
      expect(retrievedMessages).not.toContainEqual(gratitudeMessages[1])
      expect(retrievedMessages).toHaveLength(1)
    })

    it('should retrieve gratitude messages for a given time interval with 1 or both boundaries', async () => {
      const today = new Date()
      const fiveDaysAgo = new Date(today.getDate() - 5)
      const tenDaysAgo = new Date(today.getDate() - 10)

      const gratitudeMessages: GratitudeMessage[] = [
        GratitudeMessageBuilder({ createdAt: today }),
        GratitudeMessageBuilder({ createdAt: fiveDaysAgo }),
        GratitudeMessageBuilder({ createdAt: tenDaysAgo })
      ]
      await db.saveGratitudeMessages(gratitudeMessages)

      const startDate = new Date(today.getDate() - 7).toISOString()
      const endDate = new Date(today.getDate() - 2).toISOString()

      let retrievedMessages: GratitudeMessage[] = await db.getGratitudeMessages({ startDate, endDate })

      expect(retrievedMessages).not.toContainEqual(gratitudeMessages[0])
      expect(retrievedMessages).toContainEqual(gratitudeMessages[1])
      expect(retrievedMessages).not.toContainEqual(gratitudeMessages[2])
      expect(retrievedMessages).toHaveLength(1)

      retrievedMessages = await db.getGratitudeMessages({ startDate })
      expect(retrievedMessages).toContainEqual(gratitudeMessages[0])
      expect(retrievedMessages).toContainEqual(gratitudeMessages[1])
      expect(retrievedMessages).not.toContainEqual(gratitudeMessages[2])
      expect(retrievedMessages).toHaveLength(2)

      retrievedMessages = await db.getGratitudeMessages({ endDate })
      expect(retrievedMessages).not.toContainEqual(gratitudeMessages[0])
      expect(retrievedMessages).toContainEqual(gratitudeMessages[1])
      expect(retrievedMessages).toContainEqual(gratitudeMessages[2])
      expect(retrievedMessages).toHaveLength(2)
    })
  })

  describe('Collection coffeeBreaks:', () => {
    it('should save and retrieve coffee breaks', async () => {
      const coffeeBreak: CoffeeBreak = CoffeeBreakBuilder({})

      await db.saveCoffeeBreak(coffeeBreak)

      const retrievedCoffees: CoffeeBreak[] = await db.getCoffeeBreaks({})

      expect(retrievedCoffees).toContainEqual(coffeeBreak)
      expect(retrievedCoffees).toHaveLength(1)
    })

    it('should retrieve coffee breaks for a certain community', async () => {
      const communityId = "test-community-id"
      const coffeeBreaks: CoffeeBreak[] = [
        CoffeeBreakBuilder({ communityId }),
        CoffeeBreakBuilder({})
      ]

      for (const coffeeBreak of coffeeBreaks) {
        await db.saveCoffeeBreak(coffeeBreak)
      }

      const retrievedCoffees: CoffeeBreak[] = await db.getCoffeeBreaks({ communityId })

      expect(retrievedCoffees).toContainEqual(coffeeBreaks[0])
      expect(retrievedCoffees).not.toContainEqual(coffeeBreaks[1])
      expect(retrievedCoffees).toHaveLength(1)
    })

    it('should retrieve coffee breaks for a certain user', async () => {
      const userId: Id = new Id("test-user-id")
      const coffeeBreaks: CoffeeBreak[] = [
        CoffeeBreakBuilder({ sender: userId }),
        CoffeeBreakBuilder({ recipient: userId }),
        CoffeeBreakBuilder({})
      ]

      for (const coffeeBreak of coffeeBreaks) {
        await db.saveCoffeeBreak(coffeeBreak)
      }

      const retrievedCoffees: CoffeeBreak[] = await db.getCoffeeBreaks({ userId: userId.id })

      expect(retrievedCoffees).toContainEqual(coffeeBreaks[0])
      expect(retrievedCoffees).toContainEqual(coffeeBreaks[1])
      expect(retrievedCoffees).not.toContainEqual(coffeeBreaks[2])
      expect(retrievedCoffees).toHaveLength(2)
    })

    it('should retrieve coffee breaks from a given number of days', async () => {
      const today = new Date()
      const fiveDaysAgo = new Date(today.getDate() - 5)

      const coffeeBreaks: CoffeeBreak[] = [
        CoffeeBreakBuilder({ createdAt: today }),
        CoffeeBreakBuilder({ createdAt: fiveDaysAgo })
      ]

      for (const coffeeBreak of coffeeBreaks) {
        await db.saveCoffeeBreak(coffeeBreak)
      }

      const retrievedCoffees: CoffeeBreak[] = await db.getCoffeeBreaks({ days: 3 })

      expect(retrievedCoffees).toContainEqual(coffeeBreaks[0])
      expect(retrievedCoffees).not.toContainEqual(coffeeBreaks[1])
      expect(retrievedCoffees).toHaveLength(1)
    })

    it('should retrieve coffee breaks for a given time interval with 1 or both boundaries', async () => {
      const today = new Date()
      const fiveDaysAgo = new Date(today.getDate() - 5)
      const tenDaysAgo = new Date(today.getDate() - 10)

      const coffeeBreaks: CoffeeBreak[] = [
        CoffeeBreakBuilder({ createdAt: today }),
        CoffeeBreakBuilder({ createdAt: fiveDaysAgo }),
        CoffeeBreakBuilder({ createdAt: tenDaysAgo })
      ]
      for (const coffeeBreak of coffeeBreaks) {
        await db.saveCoffeeBreak(coffeeBreak)
      }

      const startDate = new Date(today.getDate() - 7).toISOString()
      const endDate = new Date(today.getDate() - 2).toISOString()

      let retrievedCoffees: CoffeeBreak[] = await db.getCoffeeBreaks({ startDate, endDate })

      expect(retrievedCoffees).not.toContainEqual(coffeeBreaks[0])
      expect(retrievedCoffees).toContainEqual(coffeeBreaks[1])
      expect(retrievedCoffees).not.toContainEqual(coffeeBreaks[2])
      expect(retrievedCoffees).toHaveLength(1)

      retrievedCoffees = await db.getCoffeeBreaks({ startDate })
      expect(retrievedCoffees).toContainEqual(coffeeBreaks[0])
      expect(retrievedCoffees).toContainEqual(coffeeBreaks[1])
      expect(retrievedCoffees).not.toContainEqual(coffeeBreaks[2])
      expect(retrievedCoffees).toHaveLength(2)

      retrievedCoffees = await db.getCoffeeBreaks({ endDate })
      expect(retrievedCoffees).not.toContainEqual(coffeeBreaks[0])
      expect(retrievedCoffees).toContainEqual(coffeeBreaks[1])
      expect(retrievedCoffees).toContainEqual(coffeeBreaks[2])
      expect(retrievedCoffees).toHaveLength(2)
    })
  })
}) 