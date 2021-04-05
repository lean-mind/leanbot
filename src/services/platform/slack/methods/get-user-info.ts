import { getUserPresence } from './get-user-presence';
import { Logger } from "../../../logger/logger"
import { Request } from "../slack"

export interface UserInfo {
  id: string,
  isBot: boolean,
  name: string,
  isAvailable: boolean
}

export const getUserInfo = (request: Request, headers: any) => async (userId : string) : Promise<UserInfo | undefined> => {
  const endpoint = "/users.info" 
  Logger.onRequest(endpoint, { userId })
  const { data, status } = await request.get(endpoint, {
    headers, 
    params: {
      user: userId
    } 
  })
  Logger.onResponse(endpoint, { status, error: data.error })

  return data.ok ? {
    id: data.user.id,
    name: data.user.real_name,
    isBot: data.user.is_bot,
    isAvailable: await getUserPresence(request, headers)(userId)
  } : undefined
}