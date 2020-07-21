export enum ErrorCode {
  Undefined = -1,
  MessageNull = 3,
}

export const isError = (data: any) => {
  return data.type === 'error' && data.error !== undefined
}

export class Error {
  code: ErrorCode;
  message: String;

  constructor(fill: any) {
    const code = fill.code as number;
    this.code = Object.values(ErrorCode).includes(code) ? code : ErrorCode.Undefined;
    this.message = fill.msg;
  }
}