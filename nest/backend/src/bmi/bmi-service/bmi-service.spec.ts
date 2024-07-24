import { Test, TestingModule } from '@nestjs/testing';
import { BmiService } from './bmi-service';
import { NotAcceptableException, UnauthorizedException } from '@nestjs/common';

describe('BmiService (unit tests)', () => {
  let provider: BmiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BmiService],
    }).compile();

    provider = module.get<BmiService>(BmiService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('addNewBmiEntry', () => {
    it('should return true when new bmi entry is added to database', async () => {
      const weight: number = 66.7;
      const height: number = 180;
      const result: boolean = await provider.addNewBmiEntry(weight, height);

      expect(result).toBe(true);
    });

    it('should throw error when negative weight passed', async () => {
      const weight: number = -66.7;
      const height: number = 180;

      try {
        const result: boolean = await provider.addNewBmiEntry(weight, height);
      } catch (error) {
        expect(error).toBeInstanceOf(NotAcceptableException);
      }
    });

    it('should return false when negative height passed', async () => {
      const weight: number = 66.7;
      const height: number = -180;

      try {
        const result: boolean = await provider.addNewBmiEntry(weight, height);
      } catch (error) {
        expect(error).toBeInstanceOf(NotAcceptableException);
      }
    });
  });
});
