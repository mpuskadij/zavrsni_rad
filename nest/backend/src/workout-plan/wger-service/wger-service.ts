import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { WgerExerciseResultDto } from '../../dtos/wger-exercise-result-dto/wger-exercise-result-dto';
import { response } from 'express';
import { plainToClass, plainToInstance } from 'class-transformer';

@Injectable()
export class WgerService {
  private wgerExerciseApiUrl: string = 'https://wger.de/api/v2/exercise/';
  private language: string = '&language=2';

  async getExerciseBySearchTerm(searchTerm: string): Promise<any> {
    if (!searchTerm) {
      throw new BadRequestException('Search term is empty!');
    }
    const apiQuery: string = '?name=' + searchTerm + this.language;
    const wgerResponse: Response = await fetch(
      this.wgerExerciseApiUrl + apiQuery,
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
    if (result.count == 0) {
      throw new BadRequestException('No exercises matching search term found!');
    }
    return result;
  }
}
