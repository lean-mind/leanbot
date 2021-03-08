import { rejectCoffee } from './reject-coffee';
import { CoffeeButtonActionPropsBuilder } from './../../tests/builders/actions/coffee-button-action-props-builder';
import { acceptCoffee } from './accept-coffee';
import { SlackInteractiveBlock } from "../../models/platform/slack/views/views"
import { I18n } from "../../services/i18n/i18n"
import { Platform } from "../../services/platform/platform"
import { Slack } from "../../services/platform/slack/slack"
import { CoffeeRoulettePropsBuilder } from "../../tests/builders/actions/coffee-roulette-props-builder"
import { coffeeRoulette, CoffeeRouletteProps } from "./coffee-roulette"
import { CoffeeButtonActionProps } from '../../services/platform/slack/props/button-props';
import { Database } from '../../services/database/database';

describe('Coffee roulette', () => {
  let i18n: I18n
  let platform: Platform
  let coffeeRouletteProps: CoffeeRouletteProps
  let db: Database
  
  const randomUserId = "irrelevant-random-user-id"
  
  beforeEach(async () => {
    i18n = await I18n.getInstance()

    platform = Slack.getInstance()
    platform.getUserInfo = jest.fn(async () => ({
      id: randomUserId,
      name: "irrelevant-name",
      isBot: false
    }))
    platform.sendMessage = jest.fn()
    platform.updateMessage = jest.fn()

    db = Database.make()
    db.saveCoffeeBreak = jest.fn()
    
    coffeeRouletteProps = CoffeeRoulettePropsBuilder({})
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
        await SlackInteractiveBlock.coffeeRouletteMessage(coffeeRouletteProps)
      )
    })
      
    it('should ask another user for a coffee with message', async () => {
      const coffeeRoulettePropsWithText = CoffeeRoulettePropsBuilder({ text: "irrelevant-text" })
      platform.getCommunityMembers = jest.fn(async () => ([randomUserId]))
      
      await coffeeRoulette(platform, coffeeRoulettePropsWithText)

      expect(platform.sendMessage).nthCalledWith(
        2,
        randomUserId, 
        await SlackInteractiveBlock.coffeeRouletteMessage(coffeeRoulettePropsWithText)
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

    it('should inform you if no one is available', async () => {
      platform.getCommunityMembers = jest.fn(async () => ([]))

      await coffeeRoulette(platform, coffeeRouletteProps)      

      expect(platform.sendMessage).toBeCalledWith(
        coffeeRouletteProps.userId, 
        i18n.translate("coffeeRoulette.noOneAvailable")
      )
    })

    it.todo('should inform the user if there is no response')
    it.todo('should try again if there is no response and the user wants to try again')
  })

  describe('invited user', () => {
    it('should be able to accept a coffee and inform the OG user', async () => {
      // Cuando el usuario invitado le da al botón de aceptar, pasan cosas que tienen que pasar
      const senderId = "U-sender"
      const invitedUserId = "U-invited-user"
      const responseUrl = "response-url"

      const coffeeProps: CoffeeButtonActionProps =  CoffeeButtonActionPropsBuilder({ 
        userId: invitedUserId,
        sender: senderId,
        responseUrl
      }) 

      await acceptCoffee(platform, coffeeProps, db)

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

    it('should be able to reject a coffee and inform the OG user', async () => {
      const senderId = "U-sender"
      const invitedUserId = "U-invited-user"
      const responseUrl = "response-url"

      const coffeeProps: CoffeeButtonActionProps =  CoffeeButtonActionPropsBuilder({ 
        userId: invitedUserId,
        sender: senderId,
        responseUrl
      }) 

      await rejectCoffee(platform, coffeeProps)

      expect(platform.sendMessage).toBeCalledWith(
        senderId, 
        i18n.translate("coffeeRoulette.rejectedOffer", { user: `<@${invitedUserId}>` })
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
    it.todo('should inform the user if there was an error')
    it.todo('should inform the user if there was an error getting the users')
  })
})