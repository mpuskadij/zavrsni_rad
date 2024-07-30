import { Test, TestingModule } from '@nestjs/testing';
import { WgerService } from './wger-service';
import { WgerExerciseResultDto } from '../../dtos/wger-exercise-result-dto/wger-exercise-result-dto';
import { DtosModule } from '../../dtos/dtos.module';
import { WgerExerciseDto } from '../../dtos/wger-variaton-dto/wger-variaton-dto';

describe('WgerService (integration tests)', () => {
  let provider: WgerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DtosModule],
      providers: [WgerService],
    }).compile();

    provider = module.get<WgerService>(WgerService);
  });

  describe('getExercisesBySearchTerm', () => {
    const searchTerm = '2 Handed Kettlebell Swing';

    it('should throw BadRequestException if Wger returns 0 exercises', async () => {
      const incorrectTerm = 'asdlksjdgj';
      await expect(
        provider.getExercisesBySearchTerm(incorrectTerm),
      ).rejects.toThrow('No exercises matching search term found!');
    });

    it('should return matching exercises if search term not empty and exercises are found', async () => {
      const result = await provider.getExercisesBySearchTerm(searchTerm);

      expect(result).toBeInstanceOf(Array<WgerExerciseDto>);
    });
  });
});
