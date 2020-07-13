export enum ErrorCode {
  SocketExpired = 1,
  MessageNull = 3
}

export const isError = (data: any) => {
  return data.type === 'error' && data.error !== undefined
}

export class Error {
  code: ErrorCode;
  message: String;

  constructor(fill: any) {
    this.code = (fill.code as number);
    this.message = fill.msg;
  }
}