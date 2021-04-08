import { Platform } from "../../services/platform/platform";

export interface RegisterProps {
  userId: string
  userName: string
}

export const register = (platform: Platform, { userId, userName }: RegisterProps): void => {
  console.log(userId, userName)
}
