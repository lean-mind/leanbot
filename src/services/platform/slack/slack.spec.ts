import { InteractiveProps } from './../../../actions/interactive';
import { getSlackInteractiveProps } from './props/interactive-props';
import { ThanksConfirmationProps } from './../../../actions/thanks/thanks-confirmation';
import { SlackBodyBuilder } from './../../../tests/builders/models/slack/slack-body-builder';
import { CoffeeRouletteProps } from './../../../actions/coffee-roulette/coffee-roulette';
import { getSlackThanksConfirmationProps, getSlackThanksProps } from './props/thanks-props';
import { UserInfo } from './methods/get-user-info';
import { Slack, SlackInteractiveView, SlackView } from "./slack"
import axios from 'axios'
import { getSlackCoffeeRouletteProps } from './props/coffee-roulette-props';
import { ThanksProps } from '../../../actions/thanks/thanks';
import { ViewGratitudeMessage } from './views';
import { View } from '../../../models/platform/message';

jest.mock('axios')

describe('Slack service:', () => {
  const axiosMock = axios
  const slackMock: Slack = Slack.getInstance(axiosMock)
  const headers = Slack.headers.bot

  describe('sendMessage method', () => {
    it('should send a simple text message', () => {
      const endpoint = "/chat.postMessage"
      const channel = "irrelevant-channel"
      const text = "irrelevant-text"

      slackMock.sendMessage(channel, text)
  
      expect(axiosMock.post).toBeCalledWith(endpoint, { channel, blocks: undefined, text }, { headers })
    })

    it('should send a view', () => {
      const endpoint = "/chat.postMessage"
      const channel = "irrelevant-channel"
      const view: View = new SlackView([{ message: "irrelevant-text2" }])

      slackMock.sendMessage(channel, view)
  
      expect(axiosMock.post).toBeCalledWith(endpoint, { channel, blocks: (view as SlackView).blocks, text: null }, { headers })
    })

    it('should send an interactive view', () => {
      const endpoint = "/views.open"
      const view: SlackInteractiveView = new SlackInteractiveView({
        blocks: [{value: "irrelevant-value"}]
      })
      const trigger_id = "irrelevant-trigger-id"

      slackMock.sendMessage(trigger_id, view)
  
      expect(axiosMock.post).toBeCalledWith(endpoint, { 
        view: JSON.stringify(view), 
        trigger_id, 
        submit_disabled: true
      }, { headers })
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
      name: "irrelevant-name",
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
      expect(userInfoReceived?.name).toBe(userInfoJson.name)
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
    it('should extract relevant data for thanks confirmation interactivity', () => {
      const externalId = "thanks-confirmation"
      const teamId = "communityId"
      const body = SlackBodyBuilder({
        externalId,
        type: "view_submission",
        teamId,
      })

      const interactiveProps: InteractiveProps = getSlackInteractiveProps(body)

      expect(interactiveProps.nextStep).toBe(externalId)
      expect(interactiveProps.accept).toBe(true)
      expect(JSON.stringify(interactiveProps.data)).not.toBe("{}")
    })
    
    it('should reject incorrect submissions for thanks confirmation interactivity', () => {
      const externalId = "thanks-confirmation"
      const teamId = "communityId"
      const body = SlackBodyBuilder({
        externalId,
        type: "another_type",
        teamId,
      })
      const interactiveProps: InteractiveProps = getSlackInteractiveProps(body)

      expect(interactiveProps.nextStep).toBe(externalId)
      expect(interactiveProps.accept).toBe(false)
      expect(JSON.stringify(interactiveProps.data)).toBe("{}")
    })

    // TODO: add test to retrieve relevant data for coffee roulette interactivity
    // TODO: MAYBE add test to reject incorrect submissions for coffee roulette interactivity

    it('should reject nonexistent commands', () => {
      const externalId = "command-nonexistent"
      const body = SlackBodyBuilder ({
        externalId
      })

      const interactiveProps: InteractiveProps = getSlackInteractiveProps(body)

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
      const view = await ViewGratitudeMessage()
      const body = SlackBodyBuilder({ triggerId })

      const thanksProps: ThanksProps = await getSlackThanksProps(body)

      expect(triggerId).toBe(thanksProps.channelId)
      expect(view.type).toBe(thanksProps.block.type)
      expect(view.external_id).toBe(thanksProps.block.external_id)
    })
    
    it('shoud retrieve thanks confirmation props from the request body', () => {
      const body = SlackBodyBuilder({
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

    it('should retrieve coffee roulette command props from the request body', () => {
      const body = SlackBodyBuilder({
        triggerId,
        teamId,
        userId,
        text,
      })

      const coffeeRouletteProps: CoffeeRouletteProps = getSlackCoffeeRouletteProps(body)

      expect(triggerId).toBe(coffeeRouletteProps.channelId)
      expect(teamId).toBe(coffeeRouletteProps.communityId)
      expect(userId).toBe(coffeeRouletteProps.userId)
      expect(text).toBe(coffeeRouletteProps.text)
    })

    // TODO: add test to get what button was clicked
  })
})