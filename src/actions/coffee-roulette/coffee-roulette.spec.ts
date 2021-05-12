import { tryAgainCoffee } from './try-again-coffee';
import { rejectCoffee } from './reject-coffee';
import { ButtonActionPropsBuilder } from './../../tests/builders/actions/coffee-button-action-props-builder';
import { acceptCoffee } from './accept-coffee';
import { I18n } from "../../services/i18n/i18n"
import { Platform } from "../../services/platform/platform"
import { Slack } from "../../services/platform/slack/slack"
import { CoffeeRoulettePropsBuilder } from "../../tests/builders/actions/coffee-roulette-props-builder"
import { coffeeRoulette, CoffeeRouletteProps } from "./coffee-roulette"
import { ButtonActionProps } from '../../services/platform/slack/props/button-props';
import { Database } from '../../services/database/database';
import { stopCoffee } from './stop-coffee';
import { Factory } from "../../services/infrastructure/factory";

describe('Coffee roulette', () => {
  let i18n: I18n
  let platform: Platform
  let coffeeRouletteProps: CoffeeRouletteProps
  let db: Database

  const randomUserId = "irrelevant-random-user-id" 
  const senderId = "U-sender"
  const invitedUserId = "U-invited-user"
  const responseUrl = "response-url"
  
  let coffeeButtonProps: ButtonActionProps 

  beforeEach(async () => {
    i18n = await I18n.getInstance()

    platform = Slack.getInstance()
    platform.getUserInfo = jest.fn(async () => ({
      id: randomUserId,
      name: "irrelevant-name",
      isBot: false,
      isAvailable: true
    }))
    platform.sendMessage = jest.fn()
    platform.updateMessage = jest.fn()

    db = Factory.createRepository()
    db.saveCoffeeBreak = jest.fn()
    
    coffeeRouletteProps = CoffeeRoulettePropsBuilder({})

    coffeeButtonProps = ButtonActionPropsBuilder({ 
      userId: invitedUserId,
      value: senderId,
      responseUrl
    }) 
  })

  afterEach(() => {
    platform.deleteTempUserData(coffeeRouletteProps.userId, "coffeeMembers")
    platform.deleteTempUserData(coffeeRouletteProps.userId, "coffeeText")
  })

  describe('command', () => {
    it('should inform the user that the command worked', async () => {
      platform.getCommunityMembers = jest.fn(async () => ([randomUserId]))

      await coffeeRoulette(platform, coffeeRouletteProps)

      expect(platform.sendMessage).nthCalledWith(
        1, 
        coffeeRouletteProps.userId,
        i18n.translate("coffeeRoulette.searching")
      )
    })
    
    it('should ask another user for a coffee', async () => {
      platform.getCommunityMembers = jest.fn(async () => ([randomUserId]))
      
      await coffeeRoulette(platform, coffeeRouletteProps)
      
      expect(platform.sendMessage).nthCalledWith(
        2,
        randomUserId, 
        await platform.getView("coffeeRouletteMessage", coffeeRouletteProps)
      )
    })
      
    it('should ask another user for a coffee with message', async () => {
      const coffeeRoulettePropsWithText = CoffeeRoulettePropsBuilder({ text: "irrelevant-text" })
      platform.getCommunityMembers = jest.fn(async () => ([randomUserId]))
      
      await coffeeRoulette(platform, coffeeRoulettePropsWithText)

      expect(platform.sendMessage).nthCalledWith(
        2,
        randomUserId, 
        await platform.getView("coffeeRouletteMessage", coffeeRoulettePropsWithText)
      )
    })

    it('should not ask the user/yourself for a coffee', async () => {
      const userMyself = "my-user-id"
      const myselfCoffeeRouletteProps = CoffeeRoulettePropsBuilder({ userId: userMyself })
      platform.getCommunityMembers = jest.fn(async () => ([userMyself]))

      await coffeeRoulette(platform, myselfCoffeeRouletteProps)

      expect(platform.sendMessage).not.toBeCalledWith(
        userMyself, 
        i18n.translate("coffeeRoulette.recipientMessage", { 
          sender: `<@${coffeeRouletteProps.userId}>` 
        })
      )
    })

    it('should try again if the user wants to try again', async () => {
      platform.getCommunityMembers = jest.fn(async () => ([]))
      platform.getTempUserData = jest.fn((_userId, _key) => ([randomUserId]))
      platform.updateTempUserData = jest.fn()
      
      await tryAgainCoffee(platform, coffeeButtonProps)
      
      expect(platform.updateMessage).toBeCalledWith(
        coffeeButtonProps.responseUrl,
        i18n.translate("coffeeRoulette.tryAgain")  
      )
      expect(platform.getCommunityMembers).not.toBeCalled()
      expect(platform.updateTempUserData).toBeCalledTimes(2)
      expect(platform.sendMessage).toBeCalledTimes(2)
    })

    it(`should stop if the user doesn't want to try again`, async() => {
      platform.deleteTempUserData = jest.fn()

      await stopCoffee(platform, coffeeButtonProps)

      expect(platform.updateMessage).toBeCalledWith(
        coffeeButtonProps.responseUrl,
        i18n.translate("coffeeRoulette.stop")
      )
      expect(platform.deleteTempUserData).toBeCalledWith(
        coffeeButtonProps.userId.id,
        "coffeeMembers"
      )
    })

    it('should inform you if no one is available', async () => {
      platform.getCommunityMembers = jest.fn(async () => ([]))

      await coffeeRoulette(platform, coffeeRouletteProps)      

      expect(platform.sendMessage).toBeCalledWith(
        coffeeRouletteProps.userId, 
        i18n.translate("coffeeRoulette.noOneAvailable")
      )
    })

    it.todo('should try again if there is no response and the user wants to try again')
  })

  describe('invited user', () => {
    it('should be able to accept a coffee and inform the OG user', async () => {
      await acceptCoffee(platform, coffeeButtonProps, db)

      expect(platform.sendMessage).toBeCalledWith(
        senderId, 
        i18n.translate("coffeeRoulette.acceptedOffer", { user: `<@${invitedUserId}>` })
      )
      expect(platform.updateMessage).toBeCalledWith(
        responseUrl, 
        i18n.translate("coffeeRoulette.recipientAcceptedOffer", { sender: `<@${senderId}>` })
      )
      expect(db.saveCoffeeBreak).toBeCalled()
    })

    it('should be able to reject a coffee and ask the OG user if they want to try again', async () => {
      await rejectCoffee(platform, coffeeButtonProps)

      expect(platform.sendMessage).toBeCalledWith(
        senderId, 
        await platform.getView("tryAgainCoffeeMessage", {})
      )
      expect(platform.updateMessage).toBeCalledWith(
        responseUrl, 
        i18n.translate("coffeeRoulette.recipientRejectedOffer", { sender: `<@${senderId}>` })
      )
      expect(db.saveCoffeeBreak).not.toBeCalled()
    })

    it.todo('should update the invited user message if there is no response')
  })
  
  describe('errors', () => {
    it('should inform the user if there was an error saving to db', async () => {
      db.saveCoffeeBreak = jest.fn(() => { throw Error("irrelevant-db-error")})

      await acceptCoffee(platform, coffeeButtonProps, db)

      const errorMessage = i18n.translate("coffeeRoulette.error")

      expect(platform.sendMessage).toBeCalledWith(
        senderId,
        errorMessage
      )
      expect(platform.updateMessage).toBeCalledWith(
        coffeeButtonProps.responseUrl,
        errorMessage
      )
    })
  })
})