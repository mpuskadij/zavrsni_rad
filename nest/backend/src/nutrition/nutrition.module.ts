import { Module } from '@nestjs/common';
import { NutritionixService } from './nutritionix-service/nutritionix-service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DtosModule } from '../dtos/dtos.module';

@Module({
  imports: [DtosModule],
  providers: [NutritionixService, ConfigService],
})
export class NutritionModule {}
