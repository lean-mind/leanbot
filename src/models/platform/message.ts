/* eslint-disable @typescript-eslint/no-empty-interface */

// export type Message = string | View | InteractiveView
// export interface View {}
// export interface InteractiveView {}
export interface Message {
  send(recipient: string)
}

export type ViewTypes = "gratitudeSummary" | "gratitudeMessage" | "coffeeRouletteMessage" | "tryAgainCoffeeMessage"
