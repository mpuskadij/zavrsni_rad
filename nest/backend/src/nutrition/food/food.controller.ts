import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtGuard } from '../../guards/jwt/jwt.guard';
import { SearchFoodDto } from '../../dtos/search-food-dto/search-food-dto';
import { NutritionixService } from '../nutritionix-service/nutritionix-service';
import { FindFoodDetailsDto } from '../../dtos/find-food-details-dto/find-food-details-dto';
import { NutritionixCommonAndBrandedFoodDetailsDto } from '../../dtos/nutritionix-common-and-branded-food-details-details-dto/nutritionix-common-and-branded-food-details-dto';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('food')
export class FoodController {
  constructor(private nutritionixService: NutritionixService) {}
  @Get()
  @SkipThrottle({ default: false, nutritionix: true })
  @UseGuards(JwtGuard)
  async searchForFood(
    @Query(
      new ValidationPipe({
        transform: true,
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      }),
    )
    searchFoodDto: SearchFoodDto,
  ): Promise<any> {
    const searchTerm = searchFoodDto.searchTerm;

    const foundFoodItems =
      await this.nutritionixService.searchForFood(searchTerm);
    return foundFoodItems;
  }

  @Get('/details')
  @SkipThrottle({ default: false, nutritionix: true })
  @UseGuards(JwtGuard)
  async getFoodItemDetails(
    @Query(
      new ValidationPipe({
        transform: true,
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      }),
    )
    findFoodDetailsDto: FindFoodDetailsDto,
  ): Promise<any> {
    if (findFoodDetailsDto.name && findFoodDetailsDto.id) {
      throw new BadRequestException(
        'Server received both name and id, only one of them is required!',
      );
    }
    const detailsOfRequestedFoodItem: NutritionixCommonAndBrandedFoodDetailsDto =
      findFoodDetailsDto.name
        ? await this.nutritionixService.getCommonFoodItemDetails(
            findFoodDetailsDto.name,
          )
        : await this.nutritionixService.getBrandedFoodItemDetails(
            findFoodDetailsDto.id,
          );
    return detailsOfRequestedFoodItem;
  }
}
