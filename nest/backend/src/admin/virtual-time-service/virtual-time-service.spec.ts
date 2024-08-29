import { Test, TestingModule } from '@nestjs/testing';
import { VirtualTimeService } from './virtual-time-service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InternalServerErrorException } from '@nestjs/common';
describe('VirtualTimeService (unit tests)', () => {
  let provider: VirtualTimeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [VirtualTimeService],
    }).compile();

    provider = module.get<VirtualTimeService>(VirtualTimeService);
  });

  describe('setTime', () => {
    it('should throw excpetion if offset is not a number', async () => {
      const result = () => provider.setTime(NaN);

      expect(result).rejects.toThrow(InternalServerErrorException);
    });
  });
});
