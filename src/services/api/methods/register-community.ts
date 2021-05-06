import { Platform } from "../../platform/platform";
import { SlackBody } from "../../../models/platform/slack/body";
import { Database } from "../../database/database";
import { Community } from "../../../models/database/community";

export const registerCommunity = async (platform: Platform, data: SlackBody): Promise<void> => {
    const db = Database.make()
    const community: Community = platform.getCommunity(data)
    await db.registerCommunity(community)
}