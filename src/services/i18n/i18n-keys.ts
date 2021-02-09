export type Type = 
    "thanks" | 
    "thanksView" | 
    "thanksSummary"

export interface Keys {
  thanks: ThanksKeys
  thanksView: ThanksViewKeys
  thanksSummary: ThanksSummaryKeys
}

type ThanksKeys = 
    "anAnonymous" |
    "anonymously" |
    "messageTo" |
    "messageFrom" |
    "messageWhere" |
    "error" |
    "errorThanksItself" |
    "errorNothingToGive"

type ThanksViewKeys = 
    "title" | 
    "submit" | 
    "cancel" | 
    "recipientsLabel" | 
    "recipientsPlaceholder" | 
    "reasonLabel" | 
    "optionsLabel" | 
    "optionsAnonymousLabel" | 
    "optionsAnonymousDescription" | 
    "whereLabel" | 
    "whereDescription" | 
    "wherePlaceholder"

type ThanksSummaryKeys = 
    "title" | 
    "given" | 
    "noGiven" | 
    "givenCount" | 
    "received" | 
    "noReceived" | 
    "receivedCount"