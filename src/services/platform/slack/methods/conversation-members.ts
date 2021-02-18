import { Logger } from "../../../logger/logger"
import { Request } from "../slack"

export const getConversationMembers = (request: Request) => async (channel: string): Promise<string[]> => {
  const { data } = await request.get("/conversations.members", {
    params: {
      channel,
    }
  })

  Logger.log(`/conversations.members -> { channel: "${channel}" }`)
  return data.ok ? data.members : []
}