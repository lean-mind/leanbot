export type Type = 
    "gratitudeMessage" | 
    "gratitudeMessageView" | 
    "gratitudeMessageSummary"

export interface Keys {
  gratitudeMessage: GratitudeMessageKeys
  gratitudeMessageView: GratitudeMessageViewKeys
  gratitudeMessageSummary: GratitudeMessageSummaryKeys
}

type GratitudeMessageKeys = 
    "anAnonymous" |
    "anonymously" |
    "recipientMessage" |
    "senderMessage" |
    "channelMessage" |
    "error" |
    "errorMessageSelf" |
    "errorNothingToGive"

type GratitudeMessageViewKeys = 
    "title" | 
    "submit" | 
    "cancel" | 
    "recipientsLabel" | 
    "recipientsPlaceholder" | 
    "textLabel" | 
    "optionsLabel" | 
    "optionsAnonymousLabel" | 
    "optionsAnonymousDescription" | 
    "channelLabel" | 
    "channelDescription" | 
    "channelPlaceholder"

type GratitudeMessageSummaryKeys = 
    "title" | 
    "sent" | 
    "noSent" | 
    "sentCount" | 
    "received" | 
    "noReceived" | 
    "receivedCount"