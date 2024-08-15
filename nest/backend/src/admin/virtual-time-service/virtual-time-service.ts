import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Injectable()
export class VirtualTimeService {
  constructor(private configService: ConfigService) {}

  async setTime(offset: number): Promise<void> {
    if (isNaN(offset) || offset === undefined || offset === null) {
      throw new InternalServerErrorException(
        'Server had trouble setting virtual time!',
      );
    }
    this.configService.set('TIME_OFFSET', offset);

    return;
  }

  async getTime(): Promise<Date> {
    await ConfigModule.envVariablesLoaded;
    const offset: number = parseInt(
      this.configService.getOrThrow('TIME_OFFSET'),
      10,
    );

    const currentTime = new Date();

    currentTime.setHours(currentTime.getHours() + offset);

    return currentTime;
  }
}
