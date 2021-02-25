import { I18n } from "./i18n";

describe('Service I18n', () => {
  let i18n: I18n
  const esCan = require("./translations/es.can.json")

  beforeAll(async () => {
    i18n = await I18n.getInstance()
  })
    
  it('should get translation from key', () => {
    expect(i18n.translate("gratitudeMessage.error")).toEqual(esCan.gratitudeMessage.error)
  })

  it('should get "key" if the translation does not exist', () => {
    const nonexistentKey = "irrelevant.i.do.not.exist"
    expect(i18n.translate(nonexistentKey)).toEqual(nonexistentKey)
  })
})