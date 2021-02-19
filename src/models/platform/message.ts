export type Message = string | View | InteractiveView

export class View {
  static isInstance(message: Message): message is View {
    return (message as View) != undefined
  }
}

export class InteractiveView {}
