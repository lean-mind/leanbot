import { interactive } from "../../actions/interactive"
import { thanks } from "../../actions/thanks/thanks"
import { Body } from "../../models/api/body"

export interface Endpoint {
  name: string,
  action: (body: Body) => void
} 

export const Endpoints: Endpoint[] = [
  { 
    name: "/interactive",
    action: interactive 
  },
  { 
    name: "/thanks",
    action: thanks 
  }
]