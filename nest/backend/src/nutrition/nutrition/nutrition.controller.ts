import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { JwtGuard } from '../../guards/jwt/jwt.guard';
import { AddFoodToNutritionDto } from '../../dtos/add-food-to-nutrition-dto/add-food-to-nutrition-dto';
import { NutritionixCommonAndBrandedFoodDetailsDto } from 'src/dtos/nutritionix-common-and-branded-food-details-details-dto/nutritionix-common-and-branded-food-details-dto';
import { NutritionixService } from '../nutritionix-service/nutritionix-service';
import { FoodService } from '../food-service/food-service';
import { UsersService } from '../../users/users-service/users-service';
import { Payload } from '../../decorators/payload/payload.decorator';
import { User } from '../../entities/user/user';
import { Type, instanceToInstance, plainToInstance } from 'class-transformer';
import { Food } from '../../entities/food/food';
import { UpdateDescription } from 'typeorm';
import { UpdateFoodQuantityDto } from '../../dtos/update-food-quantity-dto/update-food-quantity-dto';
import { GetFoodDto } from '../../dtos/get-food-dto/get-food-dto';
import { ValidateNested } from 'class-validator';
import { UpdateFoodQuantityBodyDto } from '../../dtos/update-food-quantity-body-dto/update-food-quantity-body-dto';

@Controller('nutrition')
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
    const foodToReturn = plainToInstance(GetFoodDto, foods);
    foodToReturn.forEach((fd) => {
      const foodWithQuantity = userFood.find((usrf) => usrf.foodId == fd.id);
      fd.quantity = foodWithQuantity.quantity;
    });

    return foodToReturn;
  }

  @Post()
  @SkipThrottle({ default: false, nutritionix: true })
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
        //await this.usersService.assignFood(user, userFood);
        //await this.foodService.assignUser(food, userFood);
        return;
      }
    }
    const detailsOfRequestedFoodItem: NutritionixCommonAndBrandedFoodDetailsDto =
      addFoodToNutritionDto.name
        ? await this.nutritionixService.getCommonFoodItemDetails(
            addFoodToNutritionDto.name,
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

      //await this.usersService.assignFood(user, userFood);

      return;
    }
    const foodExistsInDatabase = await this.foodService.getFoodByName(
      detailsOfRequestedFoodItem.food_name,
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
      //await this.usersService.assignFood(user, userFood);
      //await this.foodService.assignUser(food, userFood);
      return;
    }

    const userHasCommonFoodInNutritionAlready =
      await this.usersService.checkIfUserHasFoodWithNameAlreadyInNutrition(
        user.userFoods,
        foodExistsInDatabase.name,
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
    //await this.usersService.assignFood(user, userFood);
    //await this.foodService.assignUser(foodExistsInDatabase, userFood);

    return;
  }

  @Put('')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateQuantity(
    @Body(
      new ValidationPipe({
        always: true,
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        transform: true,
      }),
    )
    updateFoodQuantityBody: UpdateFoodQuantityBodyDto,
    @Payload('username') username: string,
  ): Promise<any> {
    const user = await this.usersService.getUser(username);

    if (!user) {
      throw new InternalServerErrorException(
        'Server had trouble finding the user!',
      );
    }
    const userFoods = await this.usersService.getFoodOfUser(user);
    if (!userFoods.length) {
      throw new InternalServerErrorException('User has 0 foods in nutrition!');
    }
    await this.usersService.updateFoodQuantity(
      userFoods,
      updateFoodQuantityBody.foods,
    );

    return;
  }

  @Delete('/:id')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFoodFroomUser(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: number,
    @Payload('username')
    username: string,
  ): Promise<any> {
    const user = await this.usersService.getUser(username);

    if (!user) {
      throw new InternalServerErrorException(
        'Server had trouble finding the user!',
      );
    }
    const userFoods = await this.usersService.getFoodOfUser(user);
    await this.usersService.deleteFoodFromUser(userFoods, id);

    return;
  }
}
