import { I18n } from "./i18n";

describe('Service I18n', () => {
  let i18n: I18n
  const translations = {
    existentMessage: "This message exists",
    messageWithVariables: "My name is ${name}",
    messageWithSpecialCharacters: "> This is a message"
  }
  
  const translationsInOtherLanguage = {
    existentMessage: "Este mensaje existe"
  }

  beforeEach(async () => {
    i18n = await I18n.getInstance()
    await i18n.changeLanguage("test", translations)
  })
  
  it('should get translation from key', () => {
    expect(i18n.translate("existentMessage")).toEqual(translations.existentMessage)
  })
  
  it('should get translation interpolating variables', () => {
    const name = "John Doe"
    const expectedMessage = translations.messageWithVariables.replace('${name}', name)
    expect(i18n.translate("messageWithVariables", { name })).toEqual(expectedMessage)
  })
  
  it('should preserve special characters within interpolated variables', () => {
    const name = "<@JDOE>"
    const expectedMessage = translations.messageWithVariables.replace('${name}', name)
    expect(i18n.translate("messageWithVariables", { name })).toEqual(expectedMessage)
  })
  
  it('should preserve special characters', () => {
    expect(i18n.translate("messageWithSpecialCharacters")).toEqual(translations.messageWithSpecialCharacters)
  })

  it('should be able to change language', async () => {
    await i18n.changeLanguage("test-2", translationsInOtherLanguage)
    
    expect(i18n.translate("existentMessage")).toEqual(translationsInOtherLanguage.existentMessage)
  })

  it('should get "key" if the translation does not exist', () => {
    const nonexistentKey = "irrelevant.i.do.not.exist"
    expect(i18n.translate(nonexistentKey)).toEqual(nonexistentKey)
  })
})   
