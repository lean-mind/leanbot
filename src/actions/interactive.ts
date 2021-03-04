import { Logger } from "../services/logger/logger"
import { Platform } from "../services/platform/platform"
import { acceptCoffee } from "./coffee-roulette/accept-coffee"
import { rejectCoffee } from "./coffee-roulette/reject-coffee"
import { thanksConfirmation } from "./thanks"

export interface InteractiveProps {
  nextStep: string,
  data: any,
  accept: boolean,
}

export const interactive = (platform: Platform, props: InteractiveProps) => {
  const endpoint = "/interactive"
  if (props) {
    Logger.onRequest(endpoint, props)
    const { nextStep, accept, data } = props
    const mapper = {
      ["thanks-confirmation"]: thanksConfirmation,
      ["accept-coffee"]: acceptCoffee,
      ["reject-coffee"]: rejectCoffee
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