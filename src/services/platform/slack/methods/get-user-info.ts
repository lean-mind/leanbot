import { Logger } from "../../../logger/logger"
import { Request } from "../slack"

interface User

export const getUserInfo = (request: Request, headers: any) => async (userId : string) => {
  Logger.log(`/users.info -> { userId: "${userId}"`)
  const { data } = await request.post("/users.info", {
    user: userIdd
  }, { 
    headers 
  })

  if(data.ok) return data.user  
  Logger.onError(data)
}