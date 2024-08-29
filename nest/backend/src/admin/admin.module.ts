import { Module } from '@nestjs/common';
import { VirtualTimeService } from './virtual-time-service/virtual-time-service';
import { ConfigService } from '@nestjs/config';
import { TimeController } from './time/time.controller';
import { GuardsModule } from '../guards/guards.module';
import { AuthenticationModule } from '../authentication/authentication.module';

@Module({
  imports: [GuardsModule, AuthenticationModule],
  exports: [VirtualTimeService],
  providers: [VirtualTimeService],
  controllers: [TimeController],
})
export class AdminModule {}
