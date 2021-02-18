import { coffeeRoulette } from "../../actions/coffee-roulette/coffee-roulette"
import { interactive } from "../../actions/interactive"
import { sendGratitudeSummaries } from "../../actions/thanks"
import { thanks } from "../../actions/thanks/thanks"
import { Platform } from "../platform/platform"

export interface EndpointInstance {
  name: Endpoint,
  action: (platform: Platform, data: any) => void
  getProps: (platform: Platform, data: any) => any
} 

export enum Endpoint {
  interactive = "/interactive",
  thanks = "/thanks",
  coffeeRoulette = "/coffee-roulette",
  sendSummary = "/send-summary",
}

export const Endpoints: EndpointInstance[] = [
  { 
    name: Endpoint.interactive,
    action: interactive,
    getProps: (platform, data) => platform.getInteractiveProps(data) ?? {}
  },
  { 
    name: Endpoint.thanks,
    action: thanks,
    getProps: (platform, data) => platform.getThanksProps(data)
  },
  {
    name: Endpoint.coffeeRoulette,
    action: coffeeRoulette,
    getProps: (platform, data) => platform.getCoffeeRouletteProps(data)
  },
  { 
    name: Endpoint.sendSummary,
    action: (_) => sendGratitudeSummaries(),
    getProps: () => {}
  }
]