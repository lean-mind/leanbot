import { View } from "../../../../../models/platform/message"
import { GratitudeSummaryViewProps } from "../../../../../services/platform/slack/views/view-gratitude-summary"

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