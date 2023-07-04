export interface Message {
  send(recipient: string)
  update(responseUrl: string)
}

// TODO: turn into enum
export type ViewTypes = "gratitudeSummary" | "statsSummary" | "gratitudeMessage" | "coffeeRouletteMessage" | "tryAgainCoffeeMessage" | "toDoList"
