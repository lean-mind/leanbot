import { Message } from "../../../../../models/platform/message"
import { GratitudeSummaryViewProps } from "../../../../../services/platform/slack/views/view-gratitude-summary"

export const GratitudeSummaryViewBuilder = async ({
  platform,
  image = "image-url",
  sent = [],
  received = []
}: Partial<GratitudeSummaryViewProps & { platform }>): Promise<Message> => await platform.getView("gratitudeSummary", {
  image,
  sent,
  received
})