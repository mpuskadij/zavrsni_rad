import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users-service';
import { UsersModule } from '../users.module';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entities/user/user';
import { AppModule } from '../../app.module';
import { InsertResult, Repository } from 'typeorm';
import { CryptoService } from '../../crpyto/crypto-service/crypto-service';
import { CrpytoModule } from '../../crpyto/crpyto.module';
import { HashGenerator } from '../../crpyto/hash-generator/hash-generator';
import { SaltGenerator } from '../../crpyto/salt-generator/salt-generator';
import { HashedPasswordData } from '../../crpyto/hashed-password-data/hashed-password-data';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { AuthenticationService } from '../../authentication/authentication-service/authentication-service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JournalEntry } from '../../entities/journal-entry/journal-entry';
import { InternalServerErrorException } from '@nestjs/common';

describe('UsersService (unit tests)', () => {
  let provider: UsersService;
  let repository: Repository<User>;
  const mockCryptoService = {
    hashPassword: jest.fn(),
    compareIfPasswordsMatch: jest.fn(),
  };

  const mockAuthenticationService = {
    generateJWT: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CrpytoModule,
        AuthenticationModule,
        ConfigModule.forRoot(),
        JwtModule.register({ secret: process.env.JWT_SECRET }),
      ],
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useClass: Repository },
        { provide: CryptoService, useValue: mockCryptoService },
        { provide: AuthenticationService, useValue: mockAuthenticationService },
        JwtService,
        ConfigService,
        HashGenerator,
        SaltGenerator,
        HashedPasswordData,
      ],
    }).compile();

    provider = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  const username: string = 'marin';
  const password: string = 'abchdj4K';

  describe('checkIfUsernameAlreadyInDatabase', () => {
    it('should return false if username not in database', async () => {
      jest.spyOn(repository, 'existsBy').mockResolvedValue(false);
      const result =
        await provider.checkIfUsernameIsAlreadyInDatabase(username);

      expect(result).toBe(false);
    });

    it('should return true if username is in database', async () => {
      jest.spyOn(repository, 'existsBy').mockResolvedValue(true);
      const result =
        await provider.checkIfUsernameIsAlreadyInDatabase(username);

      expect(result).toBe(true);
    });
  });

  describe('addUser', () => {
    const crpytoResult: HashedPasswordData = {
      HashedPassword: 'asfsdgs',
      Salt: 'asadasf',
    };
    const userToAdd = new User();
    userToAdd.isAdmin = 0;
    userToAdd.password = 'jfdhgt6H';
    userToAdd.username = 'alex';
    const insertResult = new InsertResult();
    it('should return true when user is successfully added', async () => {
      jest
        .spyOn(provider, 'checkIfUsernameIsAlreadyInDatabase')
        .mockResolvedValue(false);
      jest.spyOn(repository, 'save').mockResolvedValue(userToAdd);
      jest.spyOn(repository, 'create').mockReturnValue(userToAdd);
      mockCryptoService.hashPassword.mockResolvedValue(crpytoResult);

      const result = await provider.addUser(
        userToAdd.username,
        userToAdd.password,
      );

      expect(result).toBe(true);
    });

    it('should activate user repository methods create and insert to add user', async () => {
      jest
        .spyOn(provider, 'checkIfUsernameIsAlreadyInDatabase')
        .mockResolvedValue(false);
      let mockFunction = jest
        .spyOn(repository, 'save')
        .mockResolvedValue(userToAdd);

      let createMockFunction = jest
        .spyOn(repository, 'create')
        .mockReturnValue(userToAdd);

      const result = await provider.addUser('alex', 'jfdhgt6H');

      expect(mockFunction).toHaveBeenCalled();
      expect(createMockFunction).toHaveBeenCalled();
    });

    it('should return false when username already exists', async () => {
      jest
        .spyOn(provider, 'checkIfUsernameIsAlreadyInDatabase')
        .mockResolvedValue(true);
      let mockFunction = jest
        .spyOn(repository, 'save')
        .mockResolvedValue(userToAdd);

      let createMockFunction = jest
        .spyOn(repository, 'create')
        .mockReturnValue(userToAdd);

      const result = await provider.addUser('alex', 'jfdhgt6H');

      expect(result).toBe(false);
      expect(mockFunction).toHaveBeenCalledTimes(0);
      expect(createMockFunction).toHaveBeenCalledTimes(0);
    });

    it('should use CryptoService for creating a hash', async () => {
      jest
        .spyOn(provider, 'checkIfUsernameIsAlreadyInDatabase')
        .mockResolvedValue(false);
      jest.spyOn(repository, 'create').mockReturnValue(userToAdd);
      mockCryptoService.hashPassword.mockResolvedValue(crpytoResult);
      jest.spyOn(repository, 'save').mockResolvedValue(userToAdd);
      const result = await provider.addUser(
        userToAdd.username,
        userToAdd.password,
      );

      expect(result).toBe(true);
      expect(mockCryptoService.hashPassword).toHaveBeenCalled();
    });
  });

  describe('checkLoginCredentials', () => {
    const user: User = {
      password: password,
      username: username,
      isAdmin: 0,
      bmiEntries: [],
      journalEntries: [],
    };
    it('should return true if username and password are correct', async () => {
      jest.spyOn(provider, 'getUser').mockResolvedValue(user);
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(user);
      mockCryptoService.compareIfPasswordsMatch.mockResolvedValue(true);

      const result: boolean = await provider.checkLoginCredentials(
        username,
        password,
      );

      expect(mockCryptoService.compareIfPasswordsMatch).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false if username not even in database', async () => {
      jest.spyOn(provider, 'getUser').mockResolvedValue(null);
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      const result: boolean = await provider.checkLoginCredentials(
        username,
        password,
      );
      expect(mockCryptoService.compareIfPasswordsMatch).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should return false when password doesnt match', async () => {
      jest.spyOn(provider, 'getUser').mockResolvedValue(user);
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(user);
      mockCryptoService.compareIfPasswordsMatch.mockResolvedValue(false);

      const result: boolean = await provider.checkLoginCredentials(
        username,
        password,
      );

      expect(mockCryptoService.compareIfPasswordsMatch).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  describe('getUser', () => {
    const user: User = {
      password: password,
      username: username,
      isAdmin: 0,
      bmiEntries: [],
      journalEntries: [],
    };
    it('should get user when username passed exists in database', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(user);
      const result: User = await provider.getUser(username);

      expect(result).not.toBeNull();
      expect(result).toBe(user);
    });

    it('should return null when username passed doesnt exist in database', async () => {
      const username: string = 'marin';
      const password: string = 'asfkasf';
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      const result: User = await provider.getUser(username);

      expect(result).toBeNull();
    });
  });

  describe('createJWT', () => {
    const user: User = {
      password: password,
      username: username,
      isAdmin: 0,
      bmiEntries: [],
      journalEntries: [],
    };
    it('should use AuthenticationService', async () => {
      mockAuthenticationService.generateJWT.mockResolvedValue(
        'asdasd.sadasd.asdasd',
      );
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(provider, 'getUser').mockResolvedValue(user);

      const result: string = await provider.createJWT(username);
      const tokenParts: string[] = result.split('.');

      expect(mockAuthenticationService.generateJWT).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(tokenParts).toHaveLength(3);
    });
  });

  describe('saveUserData', () => {
    const user: User = {
      password: password,
      username: username,
      isAdmin: 0,
      bmiEntries: [],
      journalEntries: [],
    };
    it('should use userRepository to save user and return true if save is successful', async () => {
      jest.spyOn(repository, 'save').mockResolvedValue(user);

      const result = await provider.saveUserData(user);

      expect(result).toBe(true);
    });

    it('should return false if save returns null', async () => {
      jest.spyOn(repository, 'save').mockResolvedValue(null);

      const result = await provider.saveUserData(user);

      expect(result).toBe(false);
    });
  });

  describe('assignJournalEntry', () => {
    const user: User = {
      password: password,
      username: username,
      isAdmin: 0,
      bmiEntries: [],
      journalEntries: [],
    };
    const journalEntry: JournalEntry = {
      dateAdded: new Date(),
      description: 'sda',
      title: 'asda',
      user: user,
      username: username,
    };

    it('should throw InternalServerException if user null', async () => {
      await expect(
        provider.assignJournalEntry(null, journalEntry),
      ).rejects.toBeInstanceOf(InternalServerErrorException);
    });

    it('should throw InternalServerException if journal entry null', async () => {
      await expect(
        provider.assignJournalEntry(user, null),
      ).rejects.toBeInstanceOf(InternalServerErrorException);
    });

    it('should assign journal entry to user when no entries', async () => {
      jest.spyOn(provider, 'saveUserData').mockResolvedValue(true);

      await provider.assignJournalEntry(user, journalEntry);

      expect(user.journalEntries).toHaveLength(1);
    });
  });
});
