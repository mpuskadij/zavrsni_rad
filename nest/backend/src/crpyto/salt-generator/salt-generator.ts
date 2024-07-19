import * as bcrypt from 'bcrypt';

export class SaltGenerator {
  async generateSalt(): Promise<string> {
    return await bcrypt.genSalt();
  }
}
