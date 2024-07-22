import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user/user';
import { Repository } from 'typeorm';
import { CryptoService } from '../../crpyto/crypto-service/crypto-service';
import { HashedPasswordData } from '../../crpyto/hashed-password-data/hashed-password-data';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private cryptoService: CryptoService,
  ) {}
  async checkIfUsernameIsAlreadyInDatabase(username: string): Promise<boolean> {
    return await this.userRepository.existsBy({ username });
  }

  async getUser(username: string): Promise<User> {
    return await this.userRepository.findOneBy({ username });
  }

  async checkLoginCredentials(
    username: string,
    password: string,
  ): Promise<boolean> {
    const userDatabase: User = await this.getUser(username);
    if (userDatabase == null) {
      return false;
    }
    return await this.cryptoService.compareIfPasswordsMatch(
      password,
      userDatabase.password,
    );
  }

  async addUser(username: string, password: string): Promise<boolean> {
    const usernameAlreadyExists: boolean =
      await this.checkIfUsernameIsAlreadyInDatabase(username);
    if (usernameAlreadyExists == true) {
      return false;
    }
    const hashedPasswordData: HashedPasswordData =
      await this.cryptoService.hashPassword(password);

    const newUser = this.userRepository.create({
      isAdmin: 0,
      password: hashedPasswordData.HashedPassword,
      username: username,
    });

    await this.userRepository.insert(newUser);

    return true;
  }
}
