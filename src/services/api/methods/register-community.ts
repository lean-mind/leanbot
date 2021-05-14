import { Platform } from "../../platform/platform"
import { SlackBody } from "../../../models/platform/slack/body"
import { Community } from "../../../models/database/community"
import { Factory } from "../../infrastructure/factory"

export const registerCommunity = async (platform: Platform, data: SlackBody): Promise<void> => {
  const db = Factory.createRepository()
  const community: Community = platform.getCommunity(data)
  await db.registerCommunity(community)
}
