import { interactive } from "../../actions/interactive"
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
  }
]