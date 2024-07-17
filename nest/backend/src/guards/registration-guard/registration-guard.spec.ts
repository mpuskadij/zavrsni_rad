import { Test, TestingModule } from '@nestjs/testing';
import { RegistrationGuard } from './registration-guard';

describe('RegistrationGuard', () => {
  let provider: RegistrationGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegistrationGuard],
    }).compile();

    provider = module.get<RegistrationGuard>(RegistrationGuard);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('validateParameters', () => {
    it('should return false when username is empty', () => {
      const username = '';
      const password = '';
      const result = provider.validateParameters(username, password);

      expect(result).toBe(false);
    });

    it('should return false when username is filled, but password is empty', () => {
      const username = 'abc';
      const password = '';
      const result = provider.validateParameters(username, password);

      expect(result).toBe(false);
    });
  });
});
