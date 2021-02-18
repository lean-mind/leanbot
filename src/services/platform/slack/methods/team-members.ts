import { Logger } from "../../../logger/logger"
import { Request } from "../slack"

export const getTeamMembers = (request: Request) => async (teamId: string): Promise<string[]> => {
  const { data } = await request.get("/admin.users.list", {
    params: {
      team_id: teamId
    }
  })

  if (data.ok) {
    Logger.log(`/admin.users.list -> { team_id: "${teamId}" }`)
    return data.users = data.users.filter((user) => !user.is_bot).map((user) => user.id)
  }

  return []
}