import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { WgerExerciseResultDto } from '../../dtos/wger-exercise-result-dto/wger-exercise-result-dto';
import { response } from 'express';
import { plainToClass, plainToInstance } from 'class-transformer';
import { WgerExerciseDto } from '../../dtos/wger-variaton-dto/wger-variaton-dto';
import { WgerCategoryDto } from '../../dtos/wger-category-dto/wger-category-dto';
import { WgerCategoryResponseDto } from '../../dtos/wger-category-response-dto/wger-category-response-dto';

@Injectable()
export class WgerService {
  async getCategories(categoryName: string = null): Promise<WgerCategoryDto[]> {
    let url: string = this.wgerCategoryApiUrl;
    if (categoryName) {
      url += '?name=' + categoryName;
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new ServiceUnavailableException(
        'Error while communnicating with external API!',
      );
    }
    const responseText = JSON.parse(await response.text());
    const categoriesResponse = plainToInstance(
      WgerCategoryResponseDto,
      responseText,
    );
    if (!categoriesResponse.count) {
      throw new BadRequestException('Incorrect category!');
    }
    return categoriesResponse.results;
  }
  private wgerUrl: string = 'https://wger.de/api/v2';
  private wgerExerciseApiUrl: string = this.wgerUrl + '/exercise/';
  private language: string = '&language=2';
  private wgerCategoryApiUrl = this.wgerUrl + '/exercisecategory/';

  async getExercises(
    page: number,
    searchTerm: string = null,
    category: string = null,
    equipment: string = null,
  ): Promise<WgerExerciseDto[]> {
    if (!page || page < 1) {
      throw new BadRequestException('Page must be a number');
    }
    const offset = ((page - 1) * 20).toString().replace('.', '');
    let apiQuery: string = '';
    if (searchTerm) {
      apiQuery += '?name=' + searchTerm;
    }
    if (category) {
      const categoryFromWger: WgerCategoryDto = (
        await this.getCategories(category)
      ).at(0);
      searchTerm ? (apiQuery += '&') : (apiQuery += '?');
      apiQuery += 'category=' + categoryFromWger.id;
    }
    apiQuery ? (apiQuery += '&') : (apiQuery += '?');
    apiQuery += 'offset=' + offset;
    const wgerResponse: Response = await fetch(
      this.wgerExerciseApiUrl + apiQuery + this.language,
    );
    if (!wgerResponse.ok)
      throw new ServiceUnavailableException(
        'Error while communnicating with external API!',
      );
    const foundExercisesFromWger = JSON.parse(await wgerResponse.text());
    const result = plainToInstance(
      WgerExerciseResultDto,
      foundExercisesFromWger,
    );
    if (result.count == 0 || !result.results?.length) {
      throw new BadRequestException(
        'You have reached the end of found exercises!',
      );
    }
    return result.results;
  }
}
