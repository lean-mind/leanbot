import { existsSync, appendFileSync, writeFileSync, readFileSync } from 'fs';
import { Logger } from '../logger/logger';

export class File {
  static write(message: string, file: string) {
    try {
      if (existsSync(file)) {
        appendFileSync(file, "\n" + message);
      } else {
        writeFileSync(file, message);
      }
    } catch (error) {
      Logger.onFileWriteError(file, error);
    }
  }

  static read(file: string): string[] {
    try {
      if (existsSync(file)) {
        const data = readFileSync(file, { encoding: 'UTF-8' });
        const lines = data.split(/\r?\n/);
        return lines;
      }
    } catch (error) {
      Logger.onFileReadError(file, error);
    }
    return [];
  }

  static readLastLines(file: string, numberOfLines: number): string[] {
    const lines = File.read(file);
    return File.getLastLines(lines, numberOfLines);
  }

  private static getLastLines(lines: string[], numberOfLines: number): string[] {
    if (lines.length > numberOfLines) {
      lines.shift();
      return File.getLastLines(lines, numberOfLines)
    }
    return lines;
  }
}