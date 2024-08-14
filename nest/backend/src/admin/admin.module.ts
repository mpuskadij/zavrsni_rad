import { Module } from '@nestjs/common';
import { VirtualTimeService } from './virtual-time-service/virtual-time-service';

@Module({
  exports: [VirtualTimeService],
  providers: [VirtualTimeService],
})
export class AdminModule {}
