import { GratitudeSummaryViewProps } from './slack/views/view-gratitude-summary';

export type Message = string | View | InteractiveView

export abstract class View {
  static gratitudeSummary = (props: GratitudeSummaryViewProps) => {}
}

// TODO: add interface methods (gratitudeMessage, coffeeRoulette...)
export abstract class InteractiveView {
  static gratitudeMessage = () => {}
}