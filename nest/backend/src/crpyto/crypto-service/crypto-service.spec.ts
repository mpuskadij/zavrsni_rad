import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from './crypto-service';

describe('CryptoService', () => {
  let provider: CryptoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoService],
    }).compile();

    provider = module.get<CryptoService>(CryptoService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
