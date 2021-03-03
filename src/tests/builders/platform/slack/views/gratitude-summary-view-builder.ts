import { SlackView } from "../../../../../models/platform/slack/views/views";
import { GratitudeSummaryViewProps } from "../../../../../models/platform/slack/views/view-gratitude-summary";

export const GratitudeSummaryViewBuilder = ({
  image = "image-url",
  sent = [],
  received = []
}: Partial<GratitudeSummaryViewProps>): Promise<SlackView> => SlackView.gratitudeSummary({
  image,
  sent,
  received
})