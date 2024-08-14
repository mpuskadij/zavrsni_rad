import { Test, TestingModule } from '@nestjs/testing';
import { VirtualTimeService } from './virtual-time-service';

describe('VirtualTimeService (unit tests)', () => {
  let provider: VirtualTimeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VirtualTimeService],
    }).compile();

    provider = module.get<VirtualTimeService>(VirtualTimeService);
  });
});
