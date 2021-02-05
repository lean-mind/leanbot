export enum IdType {
  user = "U",
  channel = "C",
  team = "T",
  directMessage = "D",
  privateGroup = "G",
  unknown = "",
}

export class Id {
  id: string
  type: IdType
  
  constructor(id: string) {
    this.id = id ?? ""
    this.type = this.getTypeFrom(id)
  }

  private getTypeFrom(id: string): IdType {
    if (id) {
      const key = Object.keys(IdType).find((currentKey) => IdType[currentKey] === id[0])
      return key ? IdType[key] : IdType.unknown
    }
    return IdType.unknown
  }
}