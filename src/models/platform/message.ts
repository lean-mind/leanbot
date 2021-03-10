/* eslint-disable @typescript-eslint/no-empty-function */
import { CoffeeRouletteProps } from "../../actions/coffee-roulette/coffee-roulette"
import { GratitudeSummaryViewProps } from "./slack/views/views"

export type Message = string | View | InteractiveView

export abstract class View {
  static gratitudeSummary = (props: GratitudeSummaryViewProps) => {}
}

export abstract class InteractiveView {
  static gratitudeMessage = () => {}
  static coffeeRouletteMessage = (data: CoffeeRouletteProps) => {}
}