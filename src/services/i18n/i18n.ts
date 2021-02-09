import { Logger } from "../logger/logger";
import { Keys, Type } from "./i18n-keys";
import { I18nLanguages } from "./i18n-languages";

interface Values {
  [key: string]: string
}

export class I18n {
  constructor(
    private language = I18nLanguages.canary
  ) { }

  private transformKeyToValue = (text: string, values: Values = {}) => {
    return text.split(" ").reduce((messages: string[], currentWord: string) => {
      if (currentWord.indexOf('${') >= 0){
        const currentKey = currentWord.substring(currentWord.indexOf('{') + 1, currentWord.indexOf('}'));
        const value = currentWord.replace('${' + currentKey + '}', values[currentKey])
        return [...messages, value]
      }
      return [...messages, currentWord]
    }, []).join(" ")
  }

  private get = <T>(type: Type) => (key: T, values: Values = {}) => {
    try {
      const file = require(`./translations/${this.language}.json`)
      const textTranslated = file[type][key];

      if (textTranslated){
        return this.transformKeyToValue(textTranslated, values)
      } else {
        Logger.onMissingTranslation(`${this.language}.json`, type, `${key}`)
      }
    } catch(e) {
      Logger.onError(e)
    }
    return `${type}.${key}`
  }

  thanks = this.get<Keys["thanks"]>("thanks")
  thanksView = this.get<Keys["thanksView"]>("thanksView")
  thanksSummary = this.get<Keys["thanksSummary"]>("thanksSummary")
}