import { Logger } from "../../../logger/logger"
import { Request } from "../slack"

interface ChatPostMessageProps {
  text?: string,
  blocks?: any[]
}

export const chatPostMessage = (request: Request, headers: any) => async (channel: string, { text, blocks }: ChatPostMessageProps): Promise<void> => {
  const endpoint = "/chat.postMessage"  
  Logger.onRequest(endpoint, { channel, text, blocks })
  if (text || blocks) {
    const { data, status } = await request.post(endpoint, {
      channel,
      text: blocks ? null : text,
      blocks,
    }, { 
      headers 
    })
    // TODO: handle errors
    Logger.onResponse(endpoint, { channel, status, error: data.error })
  } else {
    Logger.onError("Param text or blocks required")
  }
}