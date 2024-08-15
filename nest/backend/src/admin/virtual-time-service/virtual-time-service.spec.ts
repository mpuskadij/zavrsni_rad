import { Test, TestingModule } from '@nestjs/testing';
import { VirtualTimeService } from './virtual-time-service';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('VirtualTimeService (unit tests)', () => {
  let provider: VirtualTimeService;
  let mockConfigService = { set: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        VirtualTimeService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    provider = module.get<VirtualTimeService>(VirtualTimeService);
  });

  describe('setTime', () => {
    it('should set offset on current time based on given parameter', async () => {
      await provider.setTime(1);

      expect(mockConfigService.set).toHaveBeenCalled();
    });
  });
});
