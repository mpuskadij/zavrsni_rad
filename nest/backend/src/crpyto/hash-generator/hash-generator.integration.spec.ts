import { HashedPasswordData } from '../hashed-password-data/hashed-password-data';
import { SaltGenerator } from '../salt-generator/salt-generator';
import { HashGenerator } from './hash-generator';

describe('HashGenerator (integration tests)', () => {
  let hashGenerator: HashGenerator;

  beforeEach(() => {
    hashGenerator = new HashGenerator();
  });
  it('should be defined', () => {
    expect(hashGenerator).toBeDefined();
  });

  describe('hashPassword', () => {
    it('should not return the same string as the one provided when using real salt generation', async () => {
      const password = 'skdjfnksdnfkans';
      const hashedPasswordData: HashedPasswordData =
        await hashGenerator.hashPassword(password);
      expect(hashedPasswordData.HashedPassword).not.toEqual(password);
    });
  });

  describe('compareHashes', () => {
    it('should return true if hashes are the same', async () => {
      const password = 'skdjfnksdnfkans';
      const hashedPasswordData: HashedPasswordData =
        await hashGenerator.hashPassword(password);

      const result = await hashGenerator.compareHashes(
        password,
        hashedPasswordData.HashedPassword,
      );
      expect(result).toBe(true);
    });

    it('should return false if hashes are not the same', async () => {
      const password = 'skdjfnksdnfkans';
      const hashedPasswordData: HashedPasswordData =
        await hashGenerator.hashPassword(password);

      const result = await hashGenerator.compareHashes(
        'skdjfnksdnfkanr',
        hashedPasswordData.HashedPassword,
      );
      expect(result).toBe(false);
    });
  });
});
