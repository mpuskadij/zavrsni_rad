import { Test, TestingModule } from '@nestjs/testing';
import { HashGenerator } from '../hash-generator/hash-generator';
import { CryptoService } from './crypto-service';
import { SaltGenerator } from '../salt-generator/salt-generator';
import { HashedPasswordData } from '../hashed-password-data/hashed-password-data';

describe('CryptoService', () => {
  let provider: CryptoService;
  let generator: HashGenerator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoService, SaltGenerator, HashGenerator],
    }).compile();

    provider = module.get<CryptoService>(CryptoService);
    generator = module.get<HashGenerator>(HashGenerator);
  });

  describe('hashPassword', () => {
    it('should return correct properites of object HashedPasswordData', async () => {
      const password: string = 'fsdf';
      const result: HashedPasswordData = await provider.hashPassword(password);
      expect(result.HashedPassword).not.toEqual(password);
      expect(result.Salt).not.toBeNull();
    });
  });

  describe('compareIfPasswordsMatch', () => {
    it('should return true when passwords match', async () => {
      const password: string = 'fsdf';
      const hashedPassword: string = (await provider.hashPassword(password))
        .HashedPassword;

      const result = await provider.compareIfPasswordsMatch(
        password,
        hashedPassword,
      );

      expect(result).toEqual(true);
    });

    it('should return false when passwords dont match', async () => {
      const password: string = 'fsdf';
      const differentPassword = 'fsdh';
      const hashedPassword: string = (await provider.hashPassword(password))
        .HashedPassword;

      const result = await provider.compareIfPasswordsMatch(
        differentPassword,
        hashedPassword,
      );

      expect(result).toEqual(false);
    });
  });
});
