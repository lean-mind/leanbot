import { GratitudeSummaryViewProps } from "../../../../../models/platform/slack/views/view-gratitude-summary";
import { View } from "../../../../../models/platform/message";

export const GratitudeSummaryViewBuilder = ({
  platform,
  image = "image-url",
  sent = [],
  received = []
}: Partial<GratitudeSummaryViewProps & { platform }>): Promise<View> => platform.getView("gratitudeSummary", {
  image,
  sent,
  received
})