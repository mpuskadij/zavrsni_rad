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

describe('UsersService', () => {
  let provider: UsersService;
  let repository: Repository<User>;
  let crypto: CryptoService;
  const mockCryptoService = {
    hashPassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CrpytoModule],
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useClass: Repository },
        { provide: CryptoService, useValue: mockCryptoService },
        HashGenerator,
        SaltGenerator,
        HashedPasswordData,
      ],
    }).compile();

    provider = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    crypto = module.get<CryptoService>(CryptoService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  const username: string = 'marin';
  const password: string = 'abchdj4K';

  describe('checkIfUsernameAlreadyInDatabase (unit tests)', () => {
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

  describe('addUser (unit tests)', () => {
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
      jest.spyOn(repository, 'insert').mockResolvedValue(insertResult);
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
        .spyOn(repository, 'insert')
        .mockResolvedValue(insertResult);

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
        .spyOn(repository, 'insert')
        .mockResolvedValue(insertResult);

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
      jest.spyOn(repository, 'insert').mockResolvedValue(insertResult);
      const result = await provider.addUser(
        userToAdd.username,
        userToAdd.password,
      );

      expect(result).toBe(true);
      expect(mockCryptoService.hashPassword).toHaveBeenCalled();
    });
  });

  describe('addUser (integration tests)', () => {});
});
