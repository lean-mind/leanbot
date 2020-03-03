export enum MessageType {
  Mention,
  Gratitude,
  Undefined,
}

enum MessageRegExp {
  Mention = '<@[a-zA-Z0-9]{9}>',
  Gratitude = '<@[a-zA-Z0-9]{9}> [+]*'
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
  gratitudePoints: number | null = null;
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
    if (this.match(MessageRegExp.Gratitude)) {
      console.log("GRATITUDE")
      this.updateGratitudePoints();
      return MessageType.Gratitude;
    } else if (this.match(MessageRegExp.Mention)) {
      console.log("MENTION")
      this.updateUsersMentionId();
      return MessageType.Mention;
    } else {
      console.log("UNDEFINED")
      return MessageType.Undefined;
    }
  }

  private match(expresion: string, text?: string) {
    const regexp = new RegExp(expresion);

    return regexp.test(text ?? this.text);
  }

  private updateUsersMentionId() {
    this.text.split(" ").map(this.updateUserId.bind(this));

    this.usersMentionId = this.usersMentionId.filter((item, index, list) =>
      index === list.indexOf(item)
    )
  }

  private updateGratitudePoints() {
    let mentionFound = false;

    this.text.split(" ").map((word: string) => {
      if (mentionFound && word.includes("+") && this.gratitudePoints === null) {
        this.gratitudePoints = word.match(/[+]/g)?.length || 0;
      } else {
        this.updateUserId(word);
        mentionFound = true;
      }
    })
  }

  private updateUserId(word: string) {
    if (this.match(MessageRegExp.Mention, word)) {
      const userId = word.substring(word.indexOf("<@") + 2, word.indexOf(">"));
      this.usersMentionId.push(userId);
    }
  }
}