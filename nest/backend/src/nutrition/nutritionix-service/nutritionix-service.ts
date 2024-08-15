import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { query } from 'express';
import { NutritionixInstantEndpointResponseDto } from '../../dtos/nutritionix-instant-endpoint-response-dto/nutritionix-instant-endpoint-response-dto';
import { plainToInstance } from 'class-transformer';
import { NutritionixCommonAndBrandedFoodDetailsResponseDto } from '../../dtos/nutritionix-common-and-branded-food-details-response-dto/nutritionix-common-and-branded-food-details-response-dto';
import { NutritionixCommonAndBrandedFoodDetailsDto } from '../../dtos/nutritionix-common-and-branded-food-details-details-dto/nutritionix-common-and-branded-food-details-dto';

@Injectable()
export class NutritionixService {
  private nutritionixBaseUrl: string = 'https://trackapi.nutritionix.com/v2/';
  private searchEndpoint: string = this.nutritionixBaseUrl + 'search/instant/';
  private headersRequiredForNutritionix: HeadersInit;
  private commonFoodNutrientsEndpoint: string =
    this.nutritionixBaseUrl + 'natural/nutrients/';
  private brandedFoodNutrientsEndpoint: string =
    this.nutritionixBaseUrl + 'search/item/?';

  constructor(private configService: ConfigService) {
    ConfigModule.envVariablesLoaded.then(() => {
      this.headersRequiredForNutritionix = new Headers();
      this.headersRequiredForNutritionix.set(
        'Content-Type',
        'application/json',
      );
      this.headersRequiredForNutritionix.set(
        'x-app-id',
        configService.getOrThrow('NUTRITIONIX_APP_ID'),
      );
      this.headersRequiredForNutritionix.set(
        'x-app-key',
        configService.getOrThrow('NUTRITIONIX_APP_KEY'),
      );
      this.headersRequiredForNutritionix.set('x-remote-user-id', '0');
    });
  }
  async searchForFood(
    searchTerm: string,
  ): Promise<NutritionixInstantEndpointResponseDto> {
    if (!searchTerm) {
      throw new BadRequestException('Search term cannot be empty!');
    }
    const queryParameters = new URLSearchParams({ query: searchTerm });
    const responseFromNutritionix: Response = await fetch(
      this.searchEndpoint + '?' + queryParameters.toString(),
      {
        headers: this.headersRequiredForNutritionix,
        method: 'GET',
      },
    );
    if (!responseFromNutritionix.ok) {
      throw new ServiceUnavailableException(
        'Server had trouble communicating with external API!',
      );
    }

    const responseBody: string = JSON.parse(
      await responseFromNutritionix.text(),
    );

    const foundCommonAndBrandedFoodItems = plainToInstance(
      NutritionixInstantEndpointResponseDto,
      responseBody,
    );

    if (
      !foundCommonAndBrandedFoodItems.common?.length &&
      !foundCommonAndBrandedFoodItems.branded?.length
    ) {
      throw new BadRequestException(
        'No food items matching search term found!',
      );
    }

    if (foundCommonAndBrandedFoodItems.common) {
      foundCommonAndBrandedFoodItems.common =
        foundCommonAndBrandedFoodItems.common.filter(
          (commonFood, index, array) =>
            index === array.findIndex((cf) => cf.tag_id === commonFood.tag_id),
        );
    }

    return foundCommonAndBrandedFoodItems;
  }

  async getCommonFoodItemDetails(
    commonFoodName: string,
    group: string = null,
  ): Promise<NutritionixCommonAndBrandedFoodDetailsDto> {
    if (!commonFoodName) {
      throw new BadRequestException(
        'Server did not receive food name to get details of!',
      );
    }
    const body = JSON.stringify({ query: commonFoodName });
    const nutritionixResponse = await fetch(this.commonFoodNutrientsEndpoint, {
      headers: this.headersRequiredForNutritionix,
      body: body,
      method: 'POST',
    });

    if (!nutritionixResponse.ok) {
      throw new ServiceUnavailableException(
        'Server had trouble communicating with external API!',
      );
    }

    const responseBody = await nutritionixResponse.text();
    const parsedBody = JSON.parse(responseBody);
    let commonFoodDetails: NutritionixCommonAndBrandedFoodDetailsResponseDto;
    if (group) {
      commonFoodDetails = plainToInstance(
        NutritionixCommonAndBrandedFoodDetailsResponseDto,
        parsedBody,
        { groups: [group] },
      );
    } else {
      commonFoodDetails = plainToInstance(
        NutritionixCommonAndBrandedFoodDetailsResponseDto,
        parsedBody,
      );
    }

    if (!commonFoodDetails?.foods?.length) {
      throw new BadRequestException(
        'No details found for requested food item!',
      );
    }
    return commonFoodDetails.foods[0];
  }

  async getBrandedFoodItemDetails(
    nixId: string,
  ): Promise<NutritionixCommonAndBrandedFoodDetailsDto> {
    if (!nixId) {
      throw new BadRequestException(
        'Server did not receive id of branded food item to find details of',
      );
    }
    const queryParams = new URLSearchParams({ nix_item_id: nixId });
    const response = await fetch(
      this.brandedFoodNutrientsEndpoint + queryParams.toString(),
      { headers: this.headersRequiredForNutritionix, method: 'GET' },
    );
    if (!response.ok) {
      throw new ServiceUnavailableException(
        'Server had trouble getting details of requested food item!',
      );
    }

    const responseBody = await response.text();
    const parsedBody = JSON.parse(responseBody);

    const brandedFoodDetails = plainToInstance(
      NutritionixCommonAndBrandedFoodDetailsResponseDto,
      parsedBody,
      { groups: ['branded'] },
    );

    if (!brandedFoodDetails?.foods?.length) {
      throw new BadRequestException(
        'No details found for requested food item!',
      );
    }

    return brandedFoodDetails.foods[0];
  }
}
