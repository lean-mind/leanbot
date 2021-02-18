import { Logger } from "../../../logger/logger"
import { Request } from "../slack"

export const getConversationMembers = (request: Request, headers: any) => async (channel: string): Promise<string[]> => {
  const { data } = await request.get("/conversations.members", {
    headers,
    params: {
      channel
    },
  })

  Logger.log(`/conversations.members -> { channel: "${channel}" }`)
  return data.ok ? data.members : []
}