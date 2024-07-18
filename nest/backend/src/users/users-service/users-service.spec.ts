import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users-service';
import { UsersModule } from '../users.module';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entities/user/user';
import { AppModule } from '../../app.module';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let provider: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useClass: Repository },
      ],
    }).compile();

    provider = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  const username: string = 'marin';

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
});
