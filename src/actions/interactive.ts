import { Logger } from "../services/logger/logger"
import { Platform } from "../services/platform/platform"
import { thanksConfirmation } from "./thanks"

export interface InteractiveProps {
  nextStep: string,
  data: any,
  accept: boolean,
}

export const interactive = (platform: Platform, props: InteractiveProps) => {
  if (props) {
    const { nextStep, accept, data } = props
    const mapper = {
      ["thanks-confirmation"]: thanksConfirmation,
    }
    const command = mapper[nextStep];
    
    if (command && accept) {
      Logger.log(`/interactive -> { nextStep : "${nextStep}", accept: "${accept}", data: "${data}" }`)
      command(platform, data)
    }
  }
}
