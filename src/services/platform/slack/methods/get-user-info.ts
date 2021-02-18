import { Logger } from "../../../logger/logger"
import { Request } from "../slack"

export interface UserInfo {
  id: string,
  isBot: boolean,
  name: string
}

export const getUserInfo = (request: Request, headers: any) => async (userId : string) : Promise<UserInfo | undefined> => {
  Logger.log(`/users.info -> { userId: "${userId}"`)
  const { data } = await request.get("/users.info", {
    headers, 
    params: {
      user: userId
    } 
  })

  if (data.ok) 
    return {
      id: data.user.id,
      name: data.user.name,
      isBot: data.user.is_bot
    }
  Logger.onError(data)
}