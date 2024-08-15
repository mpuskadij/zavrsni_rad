import { Module } from '@nestjs/common';
import { VirtualTimeService } from './virtual-time-service/virtual-time-service';
import { ConfigService } from '@nestjs/config';

@Module({
  exports: [VirtualTimeService],
  providers: [VirtualTimeService, ConfigService],
})
export class AdminModule {}
