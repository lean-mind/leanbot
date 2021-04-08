import { Platform } from "../../services/platform/platform";
import { Id } from "../../models/platform/slack/id";

export interface RegisterProps {
  userId: Id
  userName: string,
  channelId: string
}

export const register = (platform: Platform, { userId, userName, channelId }: RegisterProps): void => {
  console.log(userId.id, userName, channelId)
  platform.sendMessage(channelId, "Hola")

  // Comprobar si está en la base de datos
      // Si está, responder con un mensaje de "Ya estás registrado"
  // Sino, registrar el usuario en base de datos
  // Enviar mensaje con el link al front
}
