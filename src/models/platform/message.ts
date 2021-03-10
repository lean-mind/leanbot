/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
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