import * as bcrypt from 'bcrypt';
import { SaltGenerator } from '../salt-generator/salt-generator';
import { HashedPasswordData } from '../hashed-password-data/hashed-password-data';
export class HashGenerator {
  private saltGenerator: SaltGenerator;
  constructor() {
    this.saltGenerator = new SaltGenerator();
  }
  async hashPassword(plainPassword: string): Promise<HashedPasswordData> {
    const salt = await this.saltGenerator.generateSalt();
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    const hashedPasswordData = new HashedPasswordData(salt, hashedPassword);
    return hashedPasswordData;
  }
}
