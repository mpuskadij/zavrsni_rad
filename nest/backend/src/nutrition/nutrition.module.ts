import { Module } from '@nestjs/common';
import { NutritionixService } from './nutritionix-service/nutritionix-service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DtosModule } from '../dtos/dtos.module';
import { FoodController } from './food/food.controller';
import { GuardsModule } from '../guards/guards.module';
import { AuthenticationModule } from '../authentication/authentication.module';

@Module({
  imports: [DtosModule, GuardsModule, AuthenticationModule],
  providers: [NutritionixService, ConfigService],
  controllers: [FoodController],
})
export class NutritionModule {}
