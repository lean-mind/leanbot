import { Logger } from "../../../logger/logger"
import { Request } from "../slack"

export const getUserPresence = (request: Request, headers: any) => async (userId: string): Promise<boolean> => {
  const endpoint = "/users.getPresence"
  const { data, status } = await request.get(endpoint, {
    headers,
    params: {
      user: userId,
    },
  })
  Logger.onResponse(endpoint, { status, error: data.error })

  return data.presence === "active" ? true : false
}
