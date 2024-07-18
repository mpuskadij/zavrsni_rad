import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users-service';

describe('UsersService', () => {
  let provider: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    provider = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  const username: string = 'marin';

  describe('checkIfUsernameAlreadyInDatabase', () => {
    it('should return false if username not in database', async () => {
      const result =
        await provider.checkIfUsernameIsAlreadyInDatabase(username);

      expect(result).toBe(false);
    });

    it('should return true if username is in database', async () => {
      const result =
        await provider.checkIfUsernameIsAlreadyInDatabase(username);

      expect(result).toBe(true);
    });
  });
});
