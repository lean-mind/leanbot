import { Logger } from "../../logger/logger"
import { Request } from "../slack"

export const viewsOpen = (request: Request) => async (source: any, trigger_id: string) => {
  await request.post("/views.open", {
    view: JSON.stringify(source),
    trigger_id,
    submit_disabled: true,
  })

  Logger.log(`/views.open -> { trigger_id: "${trigger_id}", view: "${source}" }`)
}