import axios from "axios"
import { Logger } from "../../../logger/logger"

export const chatUpdateMessage = async (responseUrl: any, { text, blocks }: any): Promise<void> => {
  if (text || blocks) {
    const { data, status } = await axios.post(
      responseUrl,
      {
        replace_original: true,
        text: blocks ? null : text,
        blocks,
      },
      {
        headers: {
          "Content-type": "application/json; charset=utf-8",
        },
      }
    )
    // TODO: catch error on update message
    Logger.onResponse("updateMessage", { endpoint: responseUrl, status, error: data.error })
  } else {
    Logger.onError("Param text or blocks required")
  }
}
