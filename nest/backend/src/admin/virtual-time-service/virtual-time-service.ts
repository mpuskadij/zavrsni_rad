import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import { boolean } from 'joi';
import * as path from 'path';

@Injectable()
export class VirtualTimeService {
  private filePath = path.resolve(__dirname, '../../../time.json');
  constructor() {}

  async setTime(offset: number): Promise<void> {
    if (isNaN(offset) || offset === undefined || offset === null) {
      throw new InternalServerErrorException(
        'Server had trouble setting virtual time!',
      );
    }
    const fileData = { offset };
    try {
      await fs.writeFile(this.filePath, JSON.stringify(fileData), {
        encoding: 'utf8',
      });
    } catch {
      throw new InternalServerErrorException(
        'Server had trouble updating offset!',
      );
    }
  }

  async getTime(): Promise<Date> {
    try {
      const rawData = await fs.readFile(this.filePath, { encoding: 'utf8' });
      const jsonData = JSON.parse(rawData);
      const serverTime = new Date();

      serverTime.setHours(serverTime.getHours() + jsonData.offset);

      return serverTime;
    } catch {
      throw new InternalServerErrorException(
        'Server had trouble getting time!',
      );
    }
  }
}
