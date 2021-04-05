import { InteractiveProps } from './../../../actions/interactive';
import { getSlackInteractiveProps } from './props/interactive-props';
import { ThanksConfirmationProps } from './../../../actions/thanks/thanks-confirmation';
import { SlackBodyBuilder } from './../../../tests/builders/models/slack/slack-body-builder';
import { CoffeeRouletteProps } from './../../../actions/coffee-roulette/coffee-roulette';
import { getSlackThanksConfirmationProps, getSlackThanksProps } from './props/thanks-props';
import { UserInfo } from './methods/get-user-info';
import { Slack } from "./slack"
import axios from 'axios'
import { getSlackCoffeeRouletteProps } from './props/coffee-roulette-props';
import { ThanksProps } from '../../../actions/thanks/thanks';
import { View } from '../../../models/platform/message';
import { SlackModal, SlackView } from '../../../models/platform/slack/views/views';

jest.mock('axios')

describe('Slack service:', () => {
  const axiosMock = axios
  const slackMock: Slack = Slack.getInstance(axiosMock)
  const responseUrl = "irrelevant-response-url"
  const headers = Slack.headers.bot
  
  beforeEach(() => {
    axiosMock.post = jest.fn(async (_, __): Promise<any> => ({ 
      data: { ok: true }, status: 200 
    }))
  })
  
  describe('sendMessage method', () => {

    it('should send a simple text message', async () => {
      const endpoint = "/chat.postMessage"
      const channel = "irrelevant-channel"
      const text = "irrelevant-text"

      await slackMock.sendMessage(channel, text)
  
      expect(axiosMock.post).toBeCalledWith(endpoint, { channel, blocks: undefined, text }, { headers })
    })

    it('should send a view', async () => {
      const endpoint = "/chat.postMessage"
      const channel = "irrelevant-channel"
      const view: View = new SlackView([{ message: "irrelevant-text2" }])

      await slackMock.sendMessage(channel, view)
  
      expect(axiosMock.post).toBeCalledWith(endpoint, { channel, blocks: (view as SlackView).blocks, text: null }, { headers })
    })

    it('should send an interactive view', async () => {
      const endpoint = "/views.open"
      const view: SlackModal = new SlackModal({
        blocks: [{value: "irrelevant-value"}]
      })
      const trigger_id = "irrelevant-trigger-id"

      await slackMock.sendMessage(trigger_id, view)
  
      expect(axiosMock.post).toBeCalledWith(endpoint, { 
        view: JSON.stringify(view), 
        trigger_id, 
        submit_disabled: true
      }, { headers })
    })
  })

  describe('updateMessage method', () => {
    const headers = { 
      "Content-type": "application/json; charset=utf-8"
    }

    it('should update with a simple text message', async () => {
      const text = "irrelevant-text"

      await slackMock.updateMessage(responseUrl, text)

      expect(axiosMock.post).toBeCalledWith(responseUrl, { replace_original: true, blocks: undefined, text }, { headers })
    })
    
    it('should update with a view', async () => {
      const view: View = new SlackView([{ message: "irrelevant-text2" }])
      
      await slackMock.updateMessage(responseUrl, view)
      expect(axiosMock.post).toBeCalledWith(responseUrl, { replace_original: true, blocks: (view as SlackView).blocks, text: null }, { headers })
    })
  })

  describe('getCommunityMembers method', () => {
    const endpointToGetChannels = "/conversations.list"
    const endpointToGetMembersByChannel = "/conversations.members"
    
    it('should retrieve all community members', async () => {
      const teamId = "irrelevant-team-id"
      const channelId = "irrelevant-channel-id"
      const memberId = "irrelevant-member-id"

      axiosMock.get = jest.fn(async (_, __): Promise<any> => ({ 
        data: { 
          ok: true, 
          channels: [{
            id: channelId,
            name: "irrelevant-channel-name", 
            is_general: true
          }],
          members: [memberId]
        } 
      }))

      const teamMembers = await slackMock.getCommunityMembers(teamId)

      expect(axiosMock.get).toHaveBeenNthCalledWith(1, endpointToGetChannels, { params: { team_id: teamId }, headers})
      expect(axiosMock.get).toHaveBeenNthCalledWith(2, endpointToGetMembersByChannel, { params: { channel: channelId }, headers})
      expect(teamMembers).toHaveLength(1)
      expect(teamMembers[0]).toBe(memberId)
    })
  })

  describe('getMembersByChannelId method', () => {
    const endpoint = "/conversations.members"
    const channel = "irrelevant-channel"

    it('should retrieve channel members', async () => {
      const membersExpected = ["member-id-1"]
      axiosMock.get = jest.fn(async (_, __): Promise<any> => ({ 
        data: { ok: true, members: membersExpected } 
      }))

      const members = await slackMock.getMembersByChannelId(channel)
  
      expect(axiosMock.get).toBeCalledWith(endpoint, { params: { channel }, headers})
      expect(members).toHaveLength(membersExpected.length)
    })
  
    it('should handle responses with no data', async () => {
      axiosMock.get = jest.fn(async (_, __): Promise<any> => ({ 
        data: { ok: false } 
      }))

      const members = await slackMock.getMembersByChannelId(channel)
      
      expect(axiosMock.get).toBeCalledWith(endpoint, { params: { channel }, headers})
      expect(members).toHaveLength(0)
    })
  })

  describe('getUserInfo method', () => {
    const endpoint = "/users.info"
    const userId = "irrelevant-user-id"
    const userInfoJson = { 
      id: userId,
      real_name: "irrelevant-name",
      is_bot: false
    }
    
    it('should retrieve user info', async () => {
      axiosMock.get = jest.fn(async (_, __): Promise<any> => ({ 
        data: { ok: true, user: userInfoJson }
      }))

      const userInfoReceived: UserInfo | undefined = await slackMock.getUserInfo(userId)

      expect(axiosMock.get).toBeCalledWith(endpoint, {
        headers,
        params: {
          user: userId
        }, 
      })

      expect(userInfoReceived?.id).toBe(userInfoJson.id)
      expect(userInfoReceived?.name).toBe(userInfoJson.real_name)
      expect(userInfoReceived?.isBot).toBe(userInfoJson.is_bot)
    })
    
    it('should handle responses with no data', async () => {
      axiosMock.get = jest.fn(async (_, __): Promise<any> => ({ 
        data: { ok: false }
      }))

      const userInfoReceived: UserInfo | undefined = await slackMock.getUserInfo(userId)

      expect(axiosMock.get).toBeCalledWith(endpoint, {
        headers,
        params: {
          user: userId
        }, 
      })

      expect(userInfoReceived).toBeUndefined()
    })
  })

  describe('getInteractiveProps', () => {
    it('should extract relevant data for thanks confirmation interactivity', async () => {
      const externalId = "thanks-confirmation"
      const teamId = "communityId"
      const body = SlackBodyBuilder({
        externalId,
        type: "view_submission",
        teamId,
      })

      const interactiveProps: InteractiveProps = await getSlackInteractiveProps(body)

      expect(interactiveProps.nextStep).toBe(externalId)
      expect(interactiveProps.accept).toBe(true)
      expect(JSON.stringify(interactiveProps.data)).not.toBe("{}")
    })
    
    it('should reject incorrect submissions for thanks confirmation interactivity', async () => {
      const externalId = "thanks-confirmation"
      const teamId = "communityId"
      const body = SlackBodyBuilder({
        externalId,
        type: "another_type",
        teamId,
      })
      const interactiveProps: InteractiveProps = await getSlackInteractiveProps(body)

      expect(interactiveProps.nextStep).toBe(externalId)
      expect(interactiveProps.accept).toBe(false)
      expect(JSON.stringify(interactiveProps.data)).toBe("{}")
    })
    
    it('should retrieve coffee roulette button action data', async () => {
      const actionId = "accept-coffee"
      const body = SlackBodyBuilder({
        type: "block_actions",
        actionId,
      })
      
      const interactiveProps: InteractiveProps = await getSlackInteractiveProps(body)
      
      expect(interactiveProps.nextStep).toBe(actionId)
      expect(interactiveProps.accept).toBe(true)
      expect(JSON.stringify(interactiveProps.data)).not.toBe("{}")
    })

    it.todo('should reject incorrect submissions for coffee roulette interactivity')

    it('should reject nonexistent commands', async () => {
      const externalId = "command-nonexistent"
      const body = SlackBodyBuilder ({
        externalId
      })

      const interactiveProps: InteractiveProps = await getSlackInteractiveProps(body)

      expect(interactiveProps.nextStep).toBe(externalId)
      expect(interactiveProps.accept).toBe(false)
      expect(JSON.stringify(interactiveProps.data)).toBe("{}")
    })
  })

  describe('Thanks command props methods', () => {
    const teamId = "irrelevant-team-id"
    const userId = "irrelevant-user-id"
    const recipientsId = ["irrelevant-recipients-id"]
    const channelId = "irrelevant-channel-id"
    const text = "irrelevant-text"
    const isAnonymous = false
    const triggerId = "irrelevant-trigger-id"

    it('should provide props for thanks command', async () => {
      const view: SlackModal = await SlackModal.gratitudeMessage()
      const body = SlackBodyBuilder({ triggerId })

      const thanksProps: ThanksProps = await getSlackThanksProps(body)

      expect(thanksProps.channelId).toBe(triggerId)
      expect(thanksProps.block.type).toBe(view.type)
      expect(thanksProps.block.external_id).toMatch("thanks-confirmation")
    })
    
    it('shoud retrieve thanks confirmation props from the request body', () => {
      const externalId = "thanks-confirmation"
      const body = SlackBodyBuilder({
        externalId,
        teamId,
        userId,
        recipientsId,
        channelId,
        text,
        isAnonymous,
      })
      
      const thanksConfirmationProps: ThanksConfirmationProps = getSlackThanksConfirmationProps(body)

      expect(teamId).toBe(thanksConfirmationProps.communityId)
      expect(userId).toBe(thanksConfirmationProps.sender.id)
      expect(recipientsId[0]).toBe(thanksConfirmationProps.recipients[0].id)
      expect(channelId).toBe(thanksConfirmationProps.channel.id)
      expect(text).toBe(thanksConfirmationProps.text)
      expect(isAnonymous).toBe(thanksConfirmationProps.isAnonymous)
    })
  })
  
  describe('Coffee roulette methods', () => {
    const triggerId = "irrelevant-trigger-id"
    const teamId = "irrelevant-team-id"
    const userId = "irrelevant-user-id"
    const text = "irrelevant-text"

    it('should retrieve coffee roulette command props from the request body', async () => {
      const body = SlackBodyBuilder({
        triggerId,
        teamId,
        userId,
        text,
      })

      const coffeeRouletteProps: CoffeeRouletteProps = await getSlackCoffeeRouletteProps(body)

      expect(triggerId).toBe(coffeeRouletteProps.channelId)
      expect(teamId).toBe(coffeeRouletteProps.communityId)
      expect(userId).toBe(coffeeRouletteProps.userId)
      expect(text).toBe(coffeeRouletteProps.text)
    })
  })
})