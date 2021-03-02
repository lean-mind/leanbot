import { I18n } from "../../services/i18n/i18n"
import { Platform } from "../../services/platform/platform"
import { Slack } from "../../services/platform/slack/slack"
import { CoffeeRoulettePropsBuilder } from "../../tests/builders/actions/coffee-roulette-props-builder"
import { coffeeRoulette, CoffeeRouletteProps } from "./coffee-roulette"

describe('Coffee roulette', () => {
  let i18n: I18n
  let platform: Platform
  let coffeeRouletteProps: CoffeeRouletteProps
  
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
    coffeeRouletteProps = CoffeeRoulettePropsBuilder({})
  })

  describe('command', () => {
    it('should ask another user for a coffee', async () => {
      platform.getCommunityMembers = jest.fn(async () => ([randomUserId]))
      
      await coffeeRoulette(platform, coffeeRouletteProps)
      
      expect(platform.sendMessage).toBeCalledWith(
        randomUserId, 
        i18n.translate("coffeeRoulette.recipientMessage", { sender: `<@${coffeeRouletteProps.userId}>` })
        )
    })
      
    it('should ask another user for a coffee with message', async () => {
      const coffeeRoulettePropsWithText = CoffeeRoulettePropsBuilder({ text: "irrelevant-text" })
      platform.getCommunityMembers = jest.fn(async () => ([randomUserId]))
      
      await coffeeRoulette(platform, coffeeRoulettePropsWithText)

      expect(platform.sendMessage).toBeCalledWith(
        randomUserId, 
        i18n.translate("coffeeRoulette.recipientMessageWithText", { 
          sender: `<@${coffeeRoulettePropsWithText.userId}>`,
          text: coffeeRoulettePropsWithText.text
        })
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
    it.todo('should be able to accept a coffee')
    it.todo('should be able to reject a coffee')
    it.todo('should update the invited user message if there is no response')
  })
  
  describe('errors', () => {
    it.todo('should inform the user if there was an error')
    it.todo('should inform the user if there was an error getting the users')
  })
})