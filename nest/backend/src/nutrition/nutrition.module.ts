import { Module } from '@nestjs/common';
import { NutritionixService } from './nutritionix-service/nutritionix-service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DtosModule } from '../dtos/dtos.module';
import { FoodController } from './food/food.controller';
import { GuardsModule } from '../guards/guards.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { NutritionController } from './nutrition/nutrition.controller';
import { FoodService } from './food-service/food-service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Food } from '../entities/food/food';
import { UsersModule } from '../users/users.module';

@Module({
  exports: [NutritionixService],
  imports: [
    DtosModule,
    UsersModule,
    GuardsModule,
    AuthenticationModule,
    TypeOrmModule.forFeature([Food]),
  ],
  providers: [NutritionixService, ConfigService, FoodService],
  controllers: [FoodController, NutritionController],
})
export class NutritionModule {}
