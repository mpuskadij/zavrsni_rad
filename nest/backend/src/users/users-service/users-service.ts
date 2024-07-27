import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user/user';
import { Repository } from 'typeorm';
import { CryptoService } from '../../crpyto/crypto-service/crypto-service';
import { HashedPasswordData } from '../../crpyto/hashed-password-data/hashed-password-data';
import { AuthenticationService } from '../../authentication/authentication-service/authentication-service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private cryptoService: CryptoService,
    private authenticationService: AuthenticationService,
  ) {}
  async checkIfUsernameIsAlreadyInDatabase(username: string): Promise<boolean> {
    return await this.userRepository.existsBy({ username });
  }

  async getUser(username: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { username: username },
      relations: ['bmiEntries', 'journalEntries'],
    });
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
      bmiEntries: [],
      journalEntries: [],
    });

    await this.saveUserData(newUser);

    return true;
  }

  async createJWT(username: string): Promise<string> {
    const user: User = await this.getUser(username);

    if (user == null) throw new InternalServerErrorException('User not found!');

    return await this.authenticationService.generateJWT(
      user.username,
      user.isAdmin,
    );
  }

  async saveUserData(user: User): Promise<boolean> {
    return (await this.userRepository.save(user)) != null;
  }
}
