import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VirtualTimeService {
  constructor(private configService: ConfigService) {}
  async setTime(offset: number): Promise<void> {
    this.configService.set('TIME_OFFSET', offset);
  }
}
