import csprng from 'csprng';

export class SaltGenerator {
  async generateSalt(): Promise<string> {
    return csprng(160, 36);
  }
}
