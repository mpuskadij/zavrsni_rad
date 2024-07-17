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
      const password = 'abcdef1H';
      const result = provider.validateParameters(username, password);

      expect(result).toBe(false);
    });

    it('should return false when username is a number', () => {
      const username = '1';
      const password = 'abcdef1H';
      const result = provider.validateParameters(username, password);

      expect(result).toBe(false);
    });

    it('should return false when username has length less than 5', () => {
      const username = 'abcd';
      const password = 'abcdef1H';
      const result = provider.validateParameters(username, password);

      expect(result).toBe(false);
    });

    it('should return true when username has length of 5', () => {
      const username = 'abcde';
      const password = 'abcdef1H';
      const result = provider.validateParameters(username, password);

      expect(result).toBe(true);
    });

    it('should return true when username has length of 6', () => {
      const username = 'abcdef';
      const password = 'abcdef1H';
      const result = provider.validateParameters(username, password);

      expect(result).toBe(true);
    });

    it('should return false when username has length greater than 25', () => {
      const username = 'qwertzuioplkjhgfdsayxcvbnm';
      const password = 'abcdef1H';
      const result = provider.validateParameters(username, password);

      expect(result).toBe(false);
    });

    it('should return true when username is 25 characters long', () => {
      const username = 'qwertzuioplkjhgfdsayxcvbn';
      const password = 'abcdef1H';
      const result = provider.validateParameters(username, password);

      expect(result).toBe(true);
    });

    it('should return true when username is 24 characters long', () => {
      const username = 'qwertzuioplkjhgfdsayxcvbn';
      const password = 'abcdef1H';
      const result = provider.validateParameters(username, password);

      expect(result).toBe(true);
    });

    it('should return false when password is less than 8 characters', () => {
      const username = 'asdfg';
      const password = 'abc';
      const result = provider.validateParameters(username, password);

      expect(result).toBe(false);
    });

    it('should return false when password is 7 characters long', () => {
      const username = 'asdfg';
      const password = 'abcdefg';
      const result = provider.validateParameters(username, password);

      expect(result).toBe(false);
    });

    it('should return true when password is 8 characters long', () => {
      const username = 'asdfg';
      const password = 'abcdef1H';
      const result = provider.validateParameters(username, password);

      expect(result).toBe(true);
    });

    it('should return true when password is 9 characters long', () => {
      const username = 'asdfg';
      const password = 'abcdefgH1';
      const result = provider.validateParameters(username, password);

      expect(result).toBe(true);
    });

    it('should return false when password contains only numbers', () => {
      const username = 'asdfg';
      const password = '12345678';
      const result = provider.validateParameters(username, password);

      expect(result).toBe(false);
    });

    it('should return true when password contains number and symbol', () => {
      const username = 'asdfg';
      const password = 'asdfghgh4E';
      const result = provider.validateParameters(username, password);

      expect(result).toBe(true);
    });

    it('should return false when password doesnt contain uppercase character', () => {
      const username = 'asdfg';
      const password = 'asdfghgh4';
      const result = provider.validateParameters(username, password);

      expect(result).toBe(false);
    });

    it('should return true when password contain 1 uppercase and at least 1 number', () => {
      const username = 'asdfg';
      const password = 'asdfghgH4';
      const result = provider.validateParameters(username, password);

      expect(result).toBe(true);
    });
  });
});
