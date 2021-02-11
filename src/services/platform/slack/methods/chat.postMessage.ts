import { Logger } from "../../../logger/logger"
import { Request } from "../slack"

interface ChatPostMessageProps {
  text?: string,
  blocks?: any[]
}

export const chatPostMessage = (request: Request) => async (channel: string, { text, blocks }: ChatPostMessageProps) => {
  if (!text && !blocks) throw Error("Param text or blocks required");
  
  Logger.log(`/chat.postMessage -> { channel: "${channel}", text: "${text?.split("\n").join(" ")}", blocks: "${blocks}"}`)
  await request.post("/chat.postMessage", {
    channel,
    text: blocks ? null : text,
    blocks
  })
}