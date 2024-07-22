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

  const username = 'marin';
  const password = 'ajskfnU7';

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

  describe('checkIfUsernameIsAlreadyInDatabase', () => {
    it('should return true when username already in database', async () => {
      const user: User = await repository.findOneBy({ username: username });
      if (user == null) {
        await repository.insert({
          isAdmin: 0,
          username: username,
          password: password,
        });
      }
      const result =
        await provider.checkIfUsernameIsAlreadyInDatabase(username);
      expect(result).toBe(true);
    });

    it('should return false when username not in database', async () => {
      const user: User = await repository.findOneBy({ username: username });
      if (user != null) {
        await repository.delete({ username: username });
      }
      const result =
        await provider.checkIfUsernameIsAlreadyInDatabase(username);
      expect(result).toBe(false);
    });
  });

  describe('addUser', () => {
    it('should add user, hash the password using CryptoService and insert hashed password with salt into database', async () => {
      const usernameInDatabase =
        await provider.checkIfUsernameIsAlreadyInDatabase(username);
      if (usernameInDatabase == true) {
        await repository.delete({ username: username });
      }

      const result: boolean = await provider.addUser(username, password);

      expect(result).toBe(true);
      const user = await repository.findOneBy({ username: username });
      expect(user).not.toBeNull();
      expect(user.password).not.toEqual(password);
      expect(user.isAdmin).toBe(0);
    });
  });

  describe('getUser', () => {
    it('should return null if username not found in database', async () => {
      const usernameInDatabase = await repository.findOneBy({ username });
      if (usernameInDatabase != null) {
        await repository.delete({ username: username });
      }
      const result = await provider.getUser(username);

      expect(result).toBeNull();
    });

    it('should return User object if username found in database', async () => {
      const usernameInDatabase = await repository.findOneBy({ username });
      if (usernameInDatabase == null) {
        const user = repository.create({
          username: username,
          password: password,
          isAdmin: 0,
        });

        await repository.insert(user);
      }
      const result = await provider.getUser(username);

      expect(result).not.toBeNull();
      expect(result).toBeInstanceOf(User);
      expect(result.username).toEqual(username);
    });
  });

  describe('checkLoginCredentials', () => {
    it('should return false if username not found', async () => {
      const usernameInDatabase = await repository.findOneBy({ username });
      if (usernameInDatabase != null) {
        await repository.delete({ username: username });
      }

      const result: boolean = await provider.checkLoginCredentials(
        username,
        password,
      );

      expect(result).toBe(false);
    });

    it('should return false if username exists, but incorrect password', async () => {
      const usernameInDatabase = await repository.findOneBy({ username });
      if (usernameInDatabase != null) {
        await repository.delete({ username: username });
      }
      await repository.insert(
        repository.create({
          username: username,
          password: password,
          isAdmin: 0,
        }),
      );

      const result: boolean = await provider.checkLoginCredentials(
        username,
        password + '1',
      );

      expect(result).toBe(false);
    });

    it('should return true if username exists nad password is correct', async () => {
      const usernameInDatabase = await repository.findOneBy({ username });
      if (usernameInDatabase != null) {
        await repository.delete({ username: username });
      }
      await repository.insert(
        repository.create({
          username: username,
          password: password,
          isAdmin: 0,
        }),
      );

      const result: boolean = await provider.checkLoginCredentials(
        username,
        password,
      );

      expect(result).toBe(false);
    });
  });
});
