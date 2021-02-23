import { Logger } from "../../../logger/logger"
import { Request } from "../slack"

export const viewsOpen = (request: Request, headers: any) => async (view: any, trigger_id: string) => {
  const endpoint = "/views.open"
  Logger.onRequest(endpoint, { view, trigger_id })
  const { data, status } = await request.post(endpoint, {
    view: JSON.stringify(view),
    trigger_id,
    submit_disabled: true,
  }, {
    headers,
  })
  Logger.onResponse(endpoint, { status, error: data.error })
}