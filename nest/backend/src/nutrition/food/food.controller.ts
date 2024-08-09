import {
  Controller,
  Get,
  HttpStatus,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtGuard } from '../../guards/jwt/jwt.guard';
import { SearchFoodDto } from '../../dtos/search-food-dto/search-food-dto';
import { NutritionixService } from '../nutritionix-service/nutritionix-service';

@Controller('api/food')
export class FoodController {
  constructor(private nutritionixService: NutritionixService) {}
  @Get()
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
}
