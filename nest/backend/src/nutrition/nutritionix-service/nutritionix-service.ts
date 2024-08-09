import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { query } from 'express';
import { NutritionixInstantEndpointResponseDto } from '../../dtos/nutritionix-instant-endpoint-response-dto/nutritionix-instant-endpoint-response-dto';
import { plainToInstance } from 'class-transformer';
import { NutritionixNaturalLanguageNutrientsResponseDto } from '../../dtos/nutritionix-natural-language-nutrients-response-dto/nutritionix-natural-language-nutrients-response-dto';
import { NutritionixNaturalLanguageNutrientsDetailsDto } from '../../dtos/nutritionix-natural-language-nutrients-details-dto/nutritionix-natural-language-nutrients-details-dto';

@Injectable()
export class NutritionixService {
  private nutritionixBaseUrl: string = 'https://trackapi.nutritionix.com/v2/';
  private searchEndpoint: string = this.nutritionixBaseUrl + 'search/instant/';
  private headersRequiredForNutritionix: HeadersInit;
  private commonFoodNutrientsEndpoint: string =
    this.nutritionixBaseUrl + 'natural/nutrients/';

  constructor(private configService: ConfigService) {
    this.headersRequiredForNutritionix = new Headers();
    this.headersRequiredForNutritionix.set('Content-Type', 'application/json');
    this.headersRequiredForNutritionix.set(
      'x-app-id',
      configService.get('NUTRITIONIX_APP_ID'),
    );
    this.headersRequiredForNutritionix.set(
      'x-app-key',
      configService.get('NUTRITIONIX_APP_KEY'),
    );
    this.headersRequiredForNutritionix.set('x-remote-user-id', '0');
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

    if (foundCommonAndBrandedFoodItems.common) {
      const tagIds = foundCommonAndBrandedFoodItems.common.map(
        (commonFood) => commonFood.tag_id,
      );
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
  ): Promise<NutritionixNaturalLanguageNutrientsDetailsDto> {
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

    const commonFoodDetails = plainToInstance(
      NutritionixNaturalLanguageNutrientsResponseDto,
      parsedBody,
    );

    if (!commonFoodDetails?.foods?.length) {
      throw new BadRequestException(
        'No details found for requested food item!',
      );
    }
    return commonFoodDetails.foods[0];
  }
}
