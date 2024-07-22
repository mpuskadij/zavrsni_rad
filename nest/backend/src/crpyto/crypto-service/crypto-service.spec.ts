import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from './crypto-service';
import { SaltGenerator } from '../salt-generator/salt-generator';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { HashGenerator } from '../hash-generator/hash-generator';
import { HashedPasswordData } from '../hashed-password-data/hashed-password-data';

describe('CryptoService (unit tests)', () => {
  let provider: CryptoService;
  let generator: HashGenerator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoService, SaltGenerator, HashGenerator],
    }).compile();

    provider = module.get<CryptoService>(CryptoService);
    generator = module.get<HashGenerator>(HashGenerator);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('hashPassword', () => {
    it('should throw exception if password is null', async () => {
      await expect(provider.hashPassword('')).rejects.toBeDefined();
    });

    it('should return correct properites of object HashedPasswordData', async () => {
      const hashedPasswordData: HashedPasswordData = {
        HashedPassword: 'sdakmfas',
        Salt: '13sdfsf',
      };
      jest
        .spyOn(generator, 'hashPassword')
        .mockResolvedValue(hashedPasswordData);
      await expect(provider.hashPassword('fsdf')).resolves.toEqual(
        hashedPasswordData,
      );
    });
  });
});
