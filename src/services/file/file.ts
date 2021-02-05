import { existsSync, appendFileSync, writeFileSync, readFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { Logger } from '../logger/logger';

const fileDir = 'logs'

export class File {
  private static exists(file: string): boolean {
    if (!existsSync(fileDir)) {
      mkdirSync(fileDir)
    }

    return existsSync(file)
  }
  
  static write(message: string, file: string) {
    const filePath = join(fileDir, file)
    try {
      if (File.exists(filePath)) {
        appendFileSync(filePath, "\n" + message);
      } else {
        writeFileSync(filePath, message);
      }
    } catch (error) {
      Logger.onFileWriteError(filePath, error);
    }
  }

  static read(file: string): string[] {
    const filePath = join(fileDir, file)
    try {
      if (existsSync(filePath)) {
        const data = readFileSync(filePath, { encoding: 'UTF-8' });
        const lines = data.split(/\r?\n/);
        return lines;
      }
    } catch (error) {
      Logger.onFileReadError(filePath, error);
    }
    return [];
  }
}