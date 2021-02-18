import { Slack } from "./slack"
import axios from 'axios'

jest.mock('axios')

describe('Service Slack:', () => {
  const axiosMock = axios
  const slackMock = Slack.getInstance(axiosMock)

  describe('chat.postMessage method', () => {
    const endpoint = "/chat.postMessage"
    const channel = "irrelevant-channel"
    const text = "irrelevant-text"

    it('with success response', () => {
      slackMock.postMessage(channel, text)
  
      expect(axiosMock.post).toBeCalledWith(endpoint, { channel, text })
    })
  })

  describe('conversations.members method', () => {
    const endpoint = "/conversations.members"
    const channel = "irrelevant-channel"

    it('with success response', async () => {
      const membersExpected = ["member-id-1"]
      axiosMock.get = jest.fn(async (_, __): Promise<any> => ({ 
        data: { ok: true, members: membersExpected } 
      }))
      const members = await slackMock.getMembersByChannelId(channel)
  
      expect(axiosMock.get).toBeCalledWith(endpoint, { params: { channel }})
      expect(members.length).toBe(membersExpected.length)
    })
  
    it('with error response', async () => {
      axiosMock.get = jest.fn(async (_, __): Promise<any> => ({ 
        data: { ok: false } 
      }))
      const members = await slackMock.getMembersByChannelId(channel)
      
      expect(axiosMock.get).toBeCalledWith(endpoint, { params: { channel }})
      expect(members.length).toBe(0)
    })
  })
  
  describe('views-open method', () => {
    const endpoint = "/views.open"
    const view = { irrelevant: "value" }
    const trigger_id = "irrelevant-trigger-id"

    it('with success response', () => {
      slackMock.openInteractive(trigger_id, view)
  
      expect(axiosMock.post).toBeCalledWith(endpoint, { 
        view: JSON.stringify(view), 
        trigger_id, 
        submit_disabled: true
      })
    })
  })
})