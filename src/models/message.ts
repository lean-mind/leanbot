export enum MessageType {
  Mention,
  Undefined,
}

enum MessageRegExp {
  Mention = '<@[a-zA-Z0-9]{9}>',
}

export class Message {
  messageId: string;
  userId: string;
  usersMentionId: string[] = [];
  teamId: string;
  sourceTeamId: string;
  userTeamId: string;
  channelId: string;
  text: string;
  type: MessageType;

  constructor(fill: any) {
    this.messageId = fill.client_msg_id;
    this.userId = fill.user;
    this.teamId = fill.team;
    this.sourceTeamId = fill.source_team;
    this.userTeamId = fill.user_team;
    this.channelId = fill.channel;
    this.text = fill.text;
    this.type = this.calculateType();
  }

  private calculateType(): MessageType {
    if (this.match(MessageRegExp.Mention)) {
      this.updateUsersMentionId()
      return MessageType.Mention;
    }
    return MessageType.Undefined;
  }

  private match(expresion: string, text?: string) {
    const regexp = new RegExp(expresion);

    return regexp.test(text ?? this.text);
  }

  private updateUsersMentionId() {
    this.text.split(" ").map((word: string) => {
      if (this.match(MessageRegExp.Mention, word)) {
        const userId = word.substring(word.indexOf("<@") + 2, word.indexOf(">"));
        this.usersMentionId.push(userId)
      }
    });

    this.usersMentionId = this.usersMentionId.filter((item, index, list) =>
      index === list.indexOf(item)
    )
  }
}