import { Logger } from "../../../logger/logger"
import { Request } from "../slack"
import { getConversationMembers } from "./conversation-members"

export const getTeamMembers = (request: Request, headers: any) => async (teamId: string): Promise<string[]> => {
  const { data } = await request.get("/conversations.list", {
    headers,
    params: {
      team_id: teamId,
    },
  })

  if (data.ok) {
    Logger.log(`/conversations.list -> { team_id: "${teamId}" }`)
    const generalChannelId: string = data.channels.find(({ is_general }) => is_general)?.id ?? ""
    const teamMembers = getConversationMembers(request, headers)(generalChannelId)
    return teamMembers
  }
  Logger.onError(data)
  // TODO: log !data.ok
  return []
}