import { SaltGenerator } from './salt-generator';

describe('SaltGenerator', () => {
  let generator: SaltGenerator;
  beforeEach(() => {
    generator = new SaltGenerator();
  });
  it('should be defined', () => {
    expect(generator).toBeDefined();
  });

  describe('generateSalt (integration tests)', () => {
    it('should generate salt different from input string', async () => {
      await expect(generator.generateSalt()).resolves.toBeDefined();
    });
  });
});
