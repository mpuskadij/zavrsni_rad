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
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { AuthenticationService } from '../../authentication/authentication-service/authentication-service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Bmientry } from '../../entities/bmientry/bmientry';
import { JournalEntry } from '../../entities/journal-entry/journal-entry';
import { WorkoutPlan } from '../../entities/workout-plan/workout-plan';

describe('UsersService (integration tests)', () => {
  let provider: UsersService;
  let repository: Repository<User>;
  let journalRepo: Repository<JournalEntry>;

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
          autoLoadEntities: true,
          entities: [User, Bmientry, JournalEntry, WorkoutPlan],
        }),
        TypeOrmModule.forFeature([User, JournalEntry, Bmientry, WorkoutPlan]),
        ConfigModule.forRoot(),
        AuthenticationModule,
        JwtModule.register({ secret: process.env.JWT_SECRET }),
      ],
      providers: [
        UsersService,
        CryptoService,
        HashGenerator,
        SaltGenerator,
        HashedPasswordData,
        AuthenticationService,
      ],
    }).compile();

    provider = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    journalRepo = module.get<Repository<JournalEntry>>(
      getRepositoryToken(JournalEntry),
    );
  });

  describe('checkIfUsernameIsAlreadyInDatabase', () => {
    it('should return true when username already in database', async () => {
      const user: User = await repository.findOneBy({ username: username });
      if (user == null) {
        const user: User = {
          isAdmin: 0,
          username: username,
          password: password,
          bmiEntries: [],
          journalEntries: [],
        };
        await repository.save(user);
      }
      const result =
        await provider.checkIfUsernameIsAlreadyInDatabase(username);
      expect(result).toBe(true);
    });

    it('should return false when username not in database', async () => {
      const usernameInDatabase = await repository.findOne({
        where: { username: username },
        relations: ['bmiEntries', 'journalEntries'],
      });
      if (usernameInDatabase != null) {
        await repository.remove(usernameInDatabase);
      }
      const result =
        await provider.checkIfUsernameIsAlreadyInDatabase(username);
      expect(result).toBe(false);
    });
  });

  describe('addUser', () => {
    it('should add user, hash the password using CryptoService and insert hashed password with salt into database', async () => {
      const usernameInDatabase = await repository.findOne({
        where: { username: username },
        relations: ['bmiEntries', 'journalEntries'],
      });
      if (usernameInDatabase != null) {
        await repository.remove(usernameInDatabase);
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
      const usernameInDatabase = await repository.findOne({
        where: { username: username },
        relations: ['bmiEntries', 'journalEntries'],
      });
      if (usernameInDatabase != null) {
        await repository.remove(usernameInDatabase);
      }
      const result = await provider.getUser(username);

      expect(result).toBeNull();
    });

    it('should return User object if username found in database', async () => {
      const usernameInDatabase = await repository.findOneBy({ username });
      if (usernameInDatabase == null) {
        const user: User = {
          username: username,
          password: password,
          isAdmin: 0,
          bmiEntries: [],
          journalEntries: [],
        };

        await repository.save(user);
      }
      const result = await provider.getUser(username);

      expect(result).not.toBeNull();
      expect(result).toBeInstanceOf(User);
      expect(result.username).toEqual(username);
    });
  });

  describe('checkLoginCredentials', () => {
    it('should return false if username not found', async () => {
      const usernameInDatabase = await repository.findOne({
        where: { username: username },
        relations: ['bmiEntries', 'journalEntries'],
      });
      if (usernameInDatabase != null) {
        await repository.remove(usernameInDatabase);
      }

      const result: boolean = await provider.checkLoginCredentials(
        username,
        password,
      );

      expect(result).toBe(false);
    });

    it('should return false if username exists, but incorrect password', async () => {
      const usernameInDatabase = await repository.findOne({
        where: { username: username },
        relations: ['bmiEntries', 'journalEntries'],
      });
      if (usernameInDatabase != null) {
        await repository.remove(usernameInDatabase);
      }
      const user: User = {
        username: username,
        password: password,
        isAdmin: 0,
        bmiEntries: [],
        journalEntries: [],
      };
      await repository.save(user);

      const result: boolean = await provider.checkLoginCredentials(
        username,
        password + '1',
      );

      expect(result).toBe(false);
    });

    it('should return true if username exists nad password is correct', async () => {
      const usernameInDatabase = await repository.findOne({
        where: { username: username },
        relations: ['bmiEntries', 'journalEntries'],
      });
      if (usernameInDatabase != null) {
        await repository.remove(usernameInDatabase);
      }
      const user: User = {
        username: username,
        password: password,
        isAdmin: 0,
        bmiEntries: [],
        journalEntries: [],
      };
      await repository.save(user);

      const result: boolean = await provider.checkLoginCredentials(
        username,
        password,
      );

      expect(result).toBe(false);
    });
  });

  describe('createJWT', () => {
    it('should generate jwt when valid username passed', async () => {
      const usernameInDatabase = await repository.findOne({
        where: { username: username },
        relations: ['bmiEntries', 'journalEntries'],
      });
      if (usernameInDatabase == null) {
        const user: User = {
          bmiEntries: [],
          isAdmin: 0,
          journalEntries: [],
          password: password,
          username: username,
        };
        await repository.save(user);
      }
      const token = await provider.createJWT(username);
      const tokenParts = token?.split('.');
      expect(token).toBeDefined();
      expect(tokenParts).toBeDefined();
      expect(tokenParts).toHaveLength(3);
    });
  });

  describe('saveUserData', () => {
    it('should return true if user is saved', async () => {
      const usernameInDatabase = await repository.findOne({
        where: { username: username },
        relations: ['bmiEntries', 'journalEntries'],
      });
      if (usernameInDatabase != null) {
        await repository.remove(usernameInDatabase);
      }
      const user: User = {
        username: username,
        password: password,
        isAdmin: 0,
        bmiEntries: [],
        journalEntries: [],
      };
      const result = await provider.saveUserData(user);

      expect(result).toBe(true);
    });
  });

  describe('assignJournalEntry', () => {
    it('should push new journal entry when no previous journal entries', async () => {
      const usernameInDatabase = await repository.findOne({
        where: { username: username },
        relations: ['bmiEntries', 'journalEntries'],
      });
      if (usernameInDatabase != null) {
        await repository.remove(usernameInDatabase);
      }
      const user: User = repository.create({
        username: username,
        password: password,
        isAdmin: 0,
        bmiEntries: [],
        journalEntries: [],
      });
      const result = await provider.saveUserData(user);
      const journalEntry: JournalEntry = journalRepo.create({
        dateAdded: new Date(),
        description: 'asdas',
        title: 'asd',
        user: user,
        username: username,
      });
      await provider.assignJournalEntry(user, journalEntry);
      expect(user.journalEntries).toHaveLength(1);
    });

    it('should push new journal entry when 1 previous journal entry exists', async () => {
      const usernameInDatabase = await repository.findOne({
        where: { username: username },
        relations: ['bmiEntries', 'journalEntries'],
      });
      if (usernameInDatabase != null) {
        await repository.remove(usernameInDatabase);
      }
      const user: User = repository.create({
        username: username,
        password: password,
        isAdmin: 0,
        bmiEntries: [],
        journalEntries: [],
      });
      const journalEntryThreeDaysAgo = journalRepo.create({
        dateAdded: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        description: 'asd',
        title: 'asda',
      });
      await provider.assignJournalEntry(user, journalEntryThreeDaysAgo);
      const journalEntryToday: JournalEntry = journalRepo.create({
        dateAdded: new Date(),
        description: 'asdas',
        title: 'asd',
      });
      await provider.assignJournalEntry(user, journalEntryToday);
      expect(user.journalEntries).toHaveLength(2);
    });
  });
});
