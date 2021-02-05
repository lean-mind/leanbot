import { Body, Payload } from "../models/api"
import { Logger } from "../services/logger/logger"
import { thanksConfirmation } from "./thanks"

const accept = (payload: Payload) => 
  payload.type === "view_submission"

export const interactive = ({ payload }: Body) => {
  const mapper = {
    ["thanks-confirmation"]: thanksConfirmation,
  }
  const command = mapper[payload.view.external_id];
  
  if (command && accept(payload)) {
    Logger.log(`/interactive -> { external_id : "${payload.view.external_id}" }`)
    command(payload)
  }
} 