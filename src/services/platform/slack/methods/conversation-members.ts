import { Logger } from "../../../logger/logger"
import { Request } from "../slack"

export const getConversationMembers = (request: Request, headers: any) => async (
  channel: string
): Promise<string[]> => {
  const endpoint = "/conversations.members"
  Logger.onRequest(endpoint, { channel })
  const { data, status } = await request.get(endpoint, {
    headers,
    params: {
      channel,
    },
  })
  Logger.onResponse(endpoint, { status, error: data.error })
  return data.ok ? data.members : []
}
