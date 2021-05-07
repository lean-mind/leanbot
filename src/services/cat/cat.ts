import axios from "axios"
import { config } from "../../config"

type MimeType = "jpg" | "png" | "gif"

interface CatImageProps {
  limit?: number
  mimeTypes?: MimeType[]
}

interface Image {
  url: string
}

export class Cat {
  private imageUrlByDefault =
    "https://www.radioformula.com.mx/wp-content/uploads/notas_anteriores/notas_201807/20180706_17_43_gato.jpg"

  constructor(
    private api = axios.create({
      baseURL: "https://api.thecatapi.com/v1",
      headers: {
        "x-api-key": config.catToken,
      },
    })
  ) {}

  getRandomImage = async ({ limit, mimeTypes }: CatImageProps): Promise<Image> => {
    const { data, status } = await this.api.get("/images/search", {
      params: {
        limit: limit ?? 1,
        mime_types: mimeTypes ?? ["jpg", "png", "gif"],
      },
    })

    if (status === 200) return data[0]
    return { url: this.imageUrlByDefault }
  }
}
