import { Test, TestingModule } from '@nestjs/testing';
import { WgerService } from './wger-service';
import { WgerExerciseResultDto } from '../../dtos/wger-exercise-result-dto/wger-exercise-result-dto';
import { DtosModule } from '../../dtos/dtos.module';

describe('WgerService', () => {
  let provider: WgerService;
  const mockFetch = jest.fn();
  global.fetch = mockFetch as jest.Mock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DtosModule],
      providers: [WgerService],
    }).compile();

    provider = module.get<WgerService>(WgerService);
  });

  describe('getExerciseBySearchTerm', () => {
    const searchTerm = '2 Handed Kettlebell Swing';

    it('should throw BadRequestException if search term not provided', async () => {
      await expect(provider.getExerciseBySearchTerm('')).rejects.toThrow(
        'Search term is empty!',
      );
    });

    it('should throw ServiceUnavailable if Wger returns status different than 200', async () => {
      const incorrectTerm = 'asdlksjdgj';
      mockFetch.mockResolvedValue({ ok: false });
      await expect(
        provider.getExerciseBySearchTerm(incorrectTerm),
      ).rejects.toThrow('Error while communnicating with external API!');
    });

    it('should throw BadRequestException if Wger returns 0 exercises', async () => {
      const incorrectTerm = 'asdlksjdgj';
      const wgerResponse: WgerExerciseResultDto = {
        count: 0,
        results: [],
        previous: null,
        next: null,
      };
      mockFetch.mockResolvedValue({
        ok: true,
        text: async () => JSON.stringify(wgerResponse),
      });
      await expect(
        provider.getExerciseBySearchTerm(incorrectTerm),
      ).rejects.toThrow('No exercises matching search term found!');
    });

    it('should return matching exercises if search term not empty and exercises are found', async () => {
      const wgerResponse: WgerExerciseResultDto = {
        count: 1,
        results: [],
        previous: null,
        next: null,
      };
      mockFetch.mockResolvedValue({
        ok: true,
        text: async () => JSON.stringify(wgerResponse),
      });
      const result = await provider.getExerciseBySearchTerm(searchTerm);

      expect(result).toBeInstanceOf(WgerExerciseResultDto);
    });
  });
});
