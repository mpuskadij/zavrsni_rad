import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtGuard } from '../../guards/jwt/jwt.guard';
import { AddFoodToNutritionDto } from '../../dtos/add-food-to-nutrition-dto/add-food-to-nutrition-dto';
import { NutritionixCommonAndBrandedFoodDetailsDto } from 'src/dtos/nutritionix-common-and-branded-food-details-details-dto/nutritionix-common-and-branded-food-details-dto';
import { NutritionixService } from '../nutritionix-service/nutritionix-service';

@Controller('api/nutrition')
export class NutritionController {
  constructor(private nutritionixService: NutritionixService) {}

  @Post()
  @UseGuards(JwtGuard)
  async addFoodToNutrition(
    @Body(
      new ValidationPipe({
        transform: true,
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      }),
    )
    addFoodToNutritionDto: AddFoodToNutritionDto,
  ) {
    if (addFoodToNutritionDto.name && addFoodToNutritionDto.id) {
      throw new BadRequestException(
        'Server received both name and id, only one of them is required!',
      );
    }
    const detailsOfRequestedFoodItem: NutritionixCommonAndBrandedFoodDetailsDto =
      addFoodToNutritionDto.name
        ? await this.nutritionixService.getCommonFoodItemDetails(
            addFoodToNutritionDto.name,
          )
        : await this.nutritionixService.getBrandedFoodItemDetails(
            addFoodToNutritionDto.id,
          );
    return detailsOfRequestedFoodItem;
  }
}
