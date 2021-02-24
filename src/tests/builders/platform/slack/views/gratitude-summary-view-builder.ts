import { SlackView } from "../../../../../services/platform/slack/slack";
import { ViewGratitudeSummary, ViewGratitudeSummaryProps } from "../../../../../services/platform/slack/views/view-gratitude-summary";

export const GratitudeSummaryViewBuilder = ({
  image = "image-url",
  sent = [],
  received = []
}: Partial<ViewGratitudeSummaryProps>): Promise<SlackView> => ViewGratitudeSummary({
  image,
  sent,
  received
})