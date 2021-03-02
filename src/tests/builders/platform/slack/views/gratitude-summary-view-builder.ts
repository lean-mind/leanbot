import { SlackView } from "../../../../../services/platform/slack/views";
import { GratitudeSummaryView, GratitudeSummaryViewProps } from "../../../../../services/platform/slack/views/view-gratitude-summary";

export const GratitudeSummaryViewBuilder = ({
  image = "image-url",
  sent = [],
  received = []
}: Partial<GratitudeSummaryViewProps>): Promise<SlackView> => GratitudeSummaryView({
  image,
  sent,
  received
})