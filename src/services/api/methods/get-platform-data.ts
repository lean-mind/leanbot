import { Slack } from "../../platform/slack/slack";
import { config } from "../../../config";
import { Platform } from "../../platform/platform";

export const getPlatformData = async (request: any) => {
  if (Slack.getToken(request) === config.platform.slack.signingSecret) {
    const platform: Platform = Slack.getInstance()
    const data = Slack.getBody(request)

    return {platform, data}
  }
  return {platform: undefined, data: undefined}
}