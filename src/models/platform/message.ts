export interface Message {
  send(recipient: string)
  update(responseUrl: string)
}

// TODO: turn into enum
export type ViewTypes = "gratitudeSummary" | "gratitudeMessage" | "coffeeRouletteMessage" | "tryAgainCoffeeMessage"
