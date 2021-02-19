import { Platform } from "../../services/platform/platform"
import { Slack } from "../../services/platform/slack/slack"
import { CoffeeRoulettePropsBuilder } from "../../tests/builders/actions/coffee-roulette-props-builder"
import { coffeeRoulette, CoffeeRouletteProps } from "./coffee-roulette"

describe('Coffee roulette',() => {

  let platform: Platform
  let coffeeRouletteProps: CoffeeRouletteProps

  const randomUserId = "irrelevant-random-user-id"

  beforeEach(() => {
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
      await coffeeRoulette([randomUserId])(platform, coffeeRouletteProps)
      expect(platform.sendMessage).toBeCalledWith(
        randomUserId, 
        `<@${coffeeRouletteProps.userId}> te ha invitado a tomarte un café`
      )
    })
    it.todo('should ask another user for a coffee with message')    
    it.todo('should not ask the user/yourself for a coffee')
    it.todo('should inform you if no one is available')
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