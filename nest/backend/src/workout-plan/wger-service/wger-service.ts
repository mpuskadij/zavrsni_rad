import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { WgerExerciseResultDto } from '../../dtos/wger-exercise-result-dto/wger-exercise-result-dto';
import { response } from 'express';
import { plainToClass, plainToInstance } from 'class-transformer';
import { WgerExerciseDto } from '../../dtos/wger-exercise-dto/wger-exercise-dto';
import { WgerCategoryDto } from '../../dtos/wger-category-dto/wger-category-dto';
import { WgerCategoryResponseDto } from '../../dtos/wger-category-response-dto/wger-category-response-dto';
import { WgerEquipmentDto } from '../../dtos/wger-equipment-dto/wger-equipment-dto';
import { WgerEquipmentResponseDto } from '../../dtos/wger-equipment-response-dto/wger-equipment-response-dto';

@Injectable()
export class WgerService {
  async getEquipmentNamesById(equipment: number[]): Promise<string> {
    let equipmentNames: string = '';
    if (!equipment?.length) {
      return '';
    }

    const equipmentFromWger: WgerEquipmentDto[] = await this.getEquipment();
    equipment.forEach((eq) => {
      const foundEquipment = equipmentFromWger.find(
        (element) => eq == element.id,
      );
      if (foundEquipment?.name) {
        !equipmentNames
          ? (equipmentNames += foundEquipment.name)
          : (equipmentNames += ',' + foundEquipment.name);
      }
    });

    return equipmentNames;
  }
  async getCategoryNameById(categoryID: number): Promise<string> {
    if (!categoryID) {
      throw new InternalServerErrorException(
        'Server had trouble getting category name!',
      );
    }

    const allCategories = await this.getCategories();

    const foundCategory = allCategories.find(
      (category) => category.id == categoryID,
    );

    if (!foundCategory) {
      throw new InternalServerErrorException(
        'Server had trouble getting category name!',
      );
    }

    const categoryName: string = foundCategory.name;

    return categoryName;
  }
  async getEquipment(
    equipmentName: string = null,
  ): Promise<WgerEquipmentDto[]> {
    let url: string = this.wgerEquipmentApiUrl;
    if (equipmentName) {
      url += '?name=' + equipmentName;
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new ServiceUnavailableException(
        'Error while communicating with external API!',
      );
    }
    const responseText = JSON.parse(await response.text());
    const equipmentResponse = plainToInstance(
      WgerEquipmentResponseDto,
      responseText,
    );
    if (equipmentResponse.count == 0) {
      throw new BadRequestException('Equipment with requested name not found!');
    }
    return equipmentResponse.results;
  }
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
  private wgerEquipmentApiUrl = this.wgerUrl + '/equipment/';

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

    if (equipment) {
      const equipmentFromWger: WgerEquipmentDto = (
        await this.getEquipment(equipment)
      ).at(0);
      searchTerm || category ? (apiQuery += '&') : (apiQuery += '?');
      apiQuery += 'equipment=' + equipmentFromWger.id;
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
