import { Logger } from "../services/logger/logger"
import { Platform } from "../services/platform/platform"
import { acceptCoffee } from "./coffee-roulette/accept-coffee"
import { rejectCoffee } from "./coffee-roulette/reject-coffee"
import { stopCoffee } from "./coffee-roulette/stop-coffee"
import { tryAgainCoffee } from "./coffee-roulette/try-again-coffee"
import { thanksConfirmation } from "./thanks"

export interface InteractiveProps {
  nextStep: string,
  data,
  accept: boolean,
}

export const interactive = (platform: Platform, props: InteractiveProps): void => {
  const endpoint = "/interactive"
  if (props) {
    Logger.onRequest(endpoint, props)
    const { nextStep, accept, data } = props
    const mapper = {
      ["thanks-confirmation"]: thanksConfirmation,
      ["accept-coffee"]: acceptCoffee,
      ["reject-coffee"]: rejectCoffee,
      ["try-again-coffee"]: tryAgainCoffee,
      ["stop-coffee"]: stopCoffee,
    }
    const command = mapper[nextStep];
    
    if (command && accept) {
      Logger.onResponse(endpoint, { status: 200 })
      command(platform, data)
    } else {
      Logger.onResponse(endpoint, { status: 418, error: !command ? "Command not found" : "Command not accepted" })
    }
  }
}