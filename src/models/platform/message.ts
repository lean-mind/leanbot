export type Message = string | View | InteractiveView

export abstract class View {}

// TODO: add interface methods (gratitudeMessage, coffeeRoulette...)
export abstract class InteractiveView {}