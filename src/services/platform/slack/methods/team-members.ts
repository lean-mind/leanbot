import { Logger } from "../../../logger/logger"
import { Request } from "../slack"
import { getConversationMembers } from "./conversation-members"

export const getTeamMembers = (request: Request, headers: any) => async (teamId: string): Promise<string[]> => {
  const endpoint = "/conversations.list"
  Logger.onRequest(endpoint, { teamId })
  const { data, status } = await request.get("/conversations.list", {
    headers,
    params: {
      team_id: teamId,
    },
  })
  Logger.onResponse(endpoint, { status, error: data.error })

  if (data.ok) {
    const generalChannelId: string = data.channels.find(({ is_general }) => is_general)?.id ?? ""
    return getConversationMembers(request, headers)(generalChannelId)
  }
  return []
}