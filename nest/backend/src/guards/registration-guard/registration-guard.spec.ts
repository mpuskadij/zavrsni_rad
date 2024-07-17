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

    it('should return false when password is filled, but username is empty', () => {
      const username = '';
      const password = 'abc';
      const result = provider.validateParameters(username, password);

      expect(result).toBe(false);
    });

    it('should return false when username is a number', () => {
      const username = '1';
      const password = 'abc';
      const result = provider.validateParameters(username, password);

      expect(result).toBe(false);
    });

    it('should return false when username has length less than 5', () => {
      const username = 'abcd';
      const password = 'abc';
      const result = provider.validateParameters(username, password);

      expect(result).toBe(false);
    });

    it('should return true when username has length of 5', () => {
      const username = 'abcde';
      const password = 'abc';
      const result = provider.validateParameters(username, password);

      expect(result).toBe(true);
    });

    it('should return true when username has length of 6', () => {
      const username = 'abcdef';
      const password = 'abc';
      const result = provider.validateParameters(username, password);

      expect(result).toBe(true);
    });

    it('should return false when username has length greater than 25', () => {
      const username = 'qwertzuioplkjhgfdsayxcvbnm';
      const password = 'abc';
      const result = provider.validateParameters(username, password);

      expect(result).toBe(false);
    });

    it('should return true when username is 25 characters long', () => {
      const username = 'qwertzuioplkjhgfdsayxcvbn';
      const password = 'abc';
      const result = provider.validateParameters(username, password);

      expect(result).toBe(true);
    });

    it('should return true when username is 24 characters long', () => {
      const username = 'qwertzuioplkjhgfdsayxcvbn';
      const password = 'abc';
      const result = provider.validateParameters(username, password);

      expect(result).toBe(true);
    });
  });
});
