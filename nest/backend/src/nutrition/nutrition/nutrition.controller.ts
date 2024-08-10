import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  HttpStatus,
  InternalServerErrorException,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtGuard } from '../../guards/jwt/jwt.guard';
import { AddFoodToNutritionDto } from '../../dtos/add-food-to-nutrition-dto/add-food-to-nutrition-dto';
import { NutritionixCommonAndBrandedFoodDetailsDto } from 'src/dtos/nutritionix-common-and-branded-food-details-details-dto/nutritionix-common-and-branded-food-details-dto';
import { NutritionixService } from '../nutritionix-service/nutritionix-service';
import { FoodService } from '../food-service/food-service';
import { UsersService } from '../../users/users-service/users-service';
import { Payload } from '../../decorators/payload/payload.decorator';
import { User } from '../../entities/user/user';

@Controller('api/nutrition')
export class NutritionController {
  constructor(
    private nutritionixService: NutritionixService,
    private foodService: FoodService,
    private usersService: UsersService,
  ) {}

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
    @Payload('username') username: string,
  ) {
    if (addFoodToNutritionDto.name && addFoodToNutritionDto.id) {
      throw new BadRequestException(
        'Server received both name and id, only one of them is required!',
      );
    }
    const user: User = await this.usersService.getUser(username);
    if (!user) {
      throw new InternalServerErrorException(
        'Server had trouble finding the user!',
      );
    }
    const id = addFoodToNutritionDto.id;
    if (id) {
      const food = await this.foodService.getFoodByNixId(id);
      if (food) {
        const userHasBrandedFoodInNutritionAlready =
          await this.usersService.checkIfUserHasFoodInNutrition(
            user.userFoods,
            food.id,
          );

        if (userHasBrandedFoodInNutritionAlready) {
          throw new ForbiddenException(
            'You already have the food item in the nutrition!',
          );
        }
        const userFood = await this.usersService.createUserFood(1);
        await this.usersService.assignFood(user, userFood);
        await this.foodService.assignUser(food, userFood);
        return;
      }
    }
    const detailsOfRequestedFoodItem: NutritionixCommonAndBrandedFoodDetailsDto =
      addFoodToNutritionDto.name
        ? await this.nutritionixService.getCommonFoodItemDetails(
            addFoodToNutritionDto.name,
            'common',
          )
        : await this.nutritionixService.getBrandedFoodItemDetails(
            addFoodToNutritionDto.id,
          );

    if (id) {
      const food = await this.foodService.createFood(
        detailsOfRequestedFoodItem,
      );
      const userFood = await this.usersService.createUserFood(1);
      await this.usersService.assignFood(user, userFood);
      await this.foodService.assignUser(food, userFood);
      return;
    }

    return;
  }
}
