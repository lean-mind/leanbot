import { Platform } from "../../services/platform/platform";

export interface RegisterProps {
  userId: string
  userName: string,
}

export const register = (platform: Platform, data: RegisterProps): void => {
  console.log(data.userId, data.userName)
  platform.sendMessage(data.userId, "Hola")

  // Comprobar si está en la base de datos
      // Si está, responder con un mensaje de "Ya estás registrado"
  // Sino, registrar el usuario en base de datos
  // Enviar mensaje con el link al front
}
