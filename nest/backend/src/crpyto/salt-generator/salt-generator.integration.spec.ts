import { SaltGenerator } from './salt-generator';

describe('SaltGenerator (integration tests)', () => {
  let generator: SaltGenerator;
  beforeEach(() => {
    generator = new SaltGenerator();
  });
  it('should be defined', () => {
    expect(generator).toBeDefined();
  });

  describe('generateSalt', () => {
    it('should generate salt different from input string', async () => {
      await expect(generator.generateSalt()).resolves.toBeDefined();
    });
  });
});
