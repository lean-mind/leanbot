import { CoffeeRouletteProps } from "../../actions/coffee-roulette/coffee-roulette"
import { GratitudeSummaryViewProps } from "./slack/views/views"

export type Message = string | View | InteractiveView

export abstract class View {
  static gratitudeSummary = (props: GratitudeSummaryViewProps) => undefined
}

export abstract class InteractiveView {
  static gratitudeMessage = () => undefined
  static coffeeRouletteMessage = (data: CoffeeRouletteProps) => undefined
}