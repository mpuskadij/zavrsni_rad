import { Test, TestingModule } from '@nestjs/testing';
import { FoodService } from './food-service';

describe('FoodService', () => {
  let provider: FoodService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FoodService],
    }).compile();

    provider = module.get<FoodService>(FoodService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
