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

@Injectable()
export class NutritionixService {
  private nutritionixBaseUrl: string = 'https://trackapi.nutritionix.com/v2/';
  private searchEndpoint: string = this.nutritionixBaseUrl + 'search/instant/';
  private headersRequiredForNutritionix: HeadersInit;

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

    return foundCommonAndBrandedFoodItems;
  }
}
