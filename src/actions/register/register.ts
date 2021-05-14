import { Platform } from "../../services/platform/platform";
import { Database } from "../../services/database/database";
import * as jwt from "jsonwebtoken";

export interface RegisterProps {
  userId: string
  userName: string,
}

export const register = async (platform: Platform, data: RegisterProps): Promise<void> => {
  const db: Database = Database.make()
  const user = await db.getUser(data.userId)
  console.log(user)
  if (user) {
    await platform.sendMessage(data.userId, "user already exists")
  } else {
    const token = jwt.sign(data, process.env.PASS)
    await platform.sendMessage(data.userId, `http://localhost:3000/signup?id=${token}`)
  }
}
