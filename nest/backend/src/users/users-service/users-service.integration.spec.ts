import { User } from '../../entities/user/user';
import { Repository } from 'typeorm';
import { UsersService } from './users-service';
import { Test, TestingModule } from '@nestjs/testing';
import { CrpytoModule } from '../../crpyto/crpyto.module';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { CryptoService } from '../../crpyto/crypto-service/crypto-service';
import { HashGenerator } from '../../crpyto/hash-generator/hash-generator';
import { SaltGenerator } from '../../crpyto/salt-generator/salt-generator';
import { HashedPasswordData } from '../../crpyto/hashed-password-data/hashed-password-data';
import { UsersModule } from '../users.module';

describe('UsersService (integration tests)', () => {
  let provider: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CrpytoModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: './database/test.sqlite',
          synchronize: true,
          entities: [User],
        }),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [
        UsersService,
        CryptoService,
        HashGenerator,
        SaltGenerator,
        HashedPasswordData,
      ],
    }).compile();

    provider = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('addUser', () => {
    it('should add user, hash the password using CryptoService and insert hashed password with salt into database', async () => {
      const username = 'marin';
      const password = '123456Hm';
      const usernameInDatabase =
        await provider.checkIfUsernameIsAlreadyInDatabase(username);
      if (usernameInDatabase == true) {
        await repository.delete({ username: username });
      }

      const result: boolean = await provider.addUser(username, password);

      expect(result).toBe(true);
      const user = await repository.findOneBy({ username: username });
      expect(user).not.toBeNull();
      expect(user.salt).not.toBeNull();
      expect(user.password).not.toEqual(password);
      expect(user.isAdmin).toBe(0);
    });
  });
});
