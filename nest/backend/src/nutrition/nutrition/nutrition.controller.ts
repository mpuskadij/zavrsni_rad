import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  ParseIntPipe,
  Post,
  Put,
  Query,
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
import { instanceToInstance } from 'class-transformer';
import { Food } from 'src/entities/food/food';
import { UpdateDescription } from 'typeorm';
import { UpdateFoodQuantityDto } from '../../dtos/update-food-quantity-dto/update-food-quantity-dto';

@Controller('api/nutrition')
export class NutritionController {
  constructor(
    private nutritionixService: NutritionixService,
    private foodService: FoodService,
    private usersService: UsersService,
  ) {}

  @Get()
  @UseGuards(JwtGuard)
  async getAll(@Payload('username') username: string): Promise<any> {
    const user: User = await this.usersService.getUser(username);
    if (!user) {
      throw new InternalServerErrorException(
        'Server had trouble finding the user!',
      );
    }

    const userFood = await this.usersService.getFoodOfUser(user);

    if (!userFood) {
      throw new ForbiddenException("You don't have any food items!");
    }

    const foods = new Array<Food>();
    userFood.forEach((usrf) => foods.push(usrf.food));
  }

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
        const userFood = await this.usersService.createUserFood(
          food.id,
          user.username,
          1,
        );
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
      const userFood = await this.usersService.createUserFood(
        food.id,
        user.username,
        1,
      );
      await this.usersService.assignFood(user, userFood);
      await this.foodService.assignUser(food, userFood);
      return;
    }

    const foodExistsInDatabase = await this.foodService.getFoodByTagId(
      detailsOfRequestedFoodItem.tag_id,
    );

    if (!foodExistsInDatabase) {
      const food = await this.foodService.createFood(
        detailsOfRequestedFoodItem,
      );
      const userFood = await this.usersService.createUserFood(
        food.id,
        user.username,
        1,
      );
      await this.usersService.assignFood(user, userFood);
      await this.foodService.assignUser(food, userFood);
      return;
    }

    const userHasCommonFoodInNutritionAlready =
      await this.usersService.checkIfUserHasFoodWithTagIdAlreadyInNutrition(
        user.userFoods,
        foodExistsInDatabase.tagId,
      );
    if (userHasCommonFoodInNutritionAlready) {
      throw new ForbiddenException(
        'Item with same nutritional value already in your nutrition!',
      );
    }
    const userFood = await this.usersService.createUserFood(
      foodExistsInDatabase.id,
      user.username,
      1,
    );
    await this.usersService.assignFood(user, userFood);
    await this.foodService.assignUser(foodExistsInDatabase, userFood);

    return;
  }

  @Put('/:id')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateQuantity(
    @Query(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: number,
    @Body(new ValidationPipe({ transform: true }))
    updateFoodQuantityDto: UpdateFoodQuantityDto,
    @Payload('username') username: string,
  ): Promise<any> {
    const user = await this.usersService.getUser(username);

    if (!user) {
      throw new InternalServerErrorException(
        'Server had trouble finding the user!',
      );
    }

    await this.usersService.updateFoodQuantity(
      user.userFoods,
      id,
      updateFoodQuantityDto.quantity,
    );

    await this.usersService.saveUserData(user);

    return;
  }
}
