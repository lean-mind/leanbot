import { StatsProps } from "../../../../actions/stats/send-stats-summaries";
import { SlackBody } from "../../../../models/platform/slack/body";

export const getSlackStatsProps = async (body: SlackBody): Promise<StatsProps> => ({
  userId: body.user_id,
})