import { Injectable } from '@nestjs/common';
import { SaltGenerator } from '../salt-generator/salt-generator';
import { HashGenerator } from '../hash-generator/hash-generator';
import { HashedPasswordData } from '../hashed-password-data/hashed-password-data';

@Injectable()
export class CryptoService {
  constructor(private hashGenerator: HashGenerator) {}

  async hashPassword(password: string): Promise<HashedPasswordData> {
    if (password?.length == 0) {
      throw new Error('Cannot hash empty password!');
    }
    const hashedPasswordData = await this.hashGenerator.hashPassword(password);
    return hashedPasswordData;
  }

  async compareIfPasswordsMatch(
    plainPassword: string,
    encryptedPassword: string,
  ): Promise<boolean> {
    return await this.hashGenerator.compareHashes(
      plainPassword,
      encryptedPassword,
    );
  }
}
