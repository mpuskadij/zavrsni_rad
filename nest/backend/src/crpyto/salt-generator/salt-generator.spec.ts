import { SaltGenerator } from './salt-generator';

describe('SaltGenerator', () => {
  let generator: SaltGenerator;
  beforeEach(() => {
    generator = new SaltGenerator();
  });
  it('should be defined', () => {
    expect(new SaltGenerator()).toBeDefined();
  });

  describe('generateSalt', () => {
    it('should generate salt different from input string', async () => {
      const password = 'a';

      await expect(generator.generateSalt()).resolves.not.toEqual(password);
    });
  });
});
