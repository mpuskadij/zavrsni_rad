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
import { Exercise } from '../../entities/exercise/exercise';
import { WorkoutPlanService } from '../../workout-plan/workout-plan-service/workout-plan-service';
import { title } from 'process';
import { Food } from '../../entities/food/food';
import { UserFood } from '../../entities/user_food/user_food';
import { AdminModule } from '../../admin/admin.module';

describe('UsersService (integration tests)', () => {
  let provider: UsersService;
  let repository: Repository<User>;
  let journalRepo: Repository<JournalEntry>;
  let workoutPlanService: WorkoutPlanService;

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
          entities: [
            User,
            Bmientry,
            JournalEntry,
            WorkoutPlan,
            Exercise,
            Food,
            UserFood,
          ],
        }),
        TypeOrmModule.forFeature([
          User,
          JournalEntry,
          Bmientry,
          WorkoutPlan,
          Exercise,
          Food,
          UserFood,
        ]),
        ConfigModule.forRoot({ envFilePath: '.test.env' }),
        AdminModule,
        AuthenticationModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          global: true,
          signOptions: { expiresIn: '15m' },
        }),
      ],
      providers: [
        UsersService,
        CryptoService,
        HashGenerator,
        SaltGenerator,
        HashedPasswordData,
        AuthenticationService,
        WorkoutPlanService,
      ],
    }).compile();

    provider = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    journalRepo = module.get<Repository<JournalEntry>>(
      getRepositoryToken(JournalEntry),
    );
    workoutPlanService = module.get<WorkoutPlanService>(WorkoutPlanService);
  });

  describe('checkIfUsernameIsAlreadyInDatabase', () => {
    it('should return true when username already in database', async () => {
      const user: User = await repository.findOneBy({ username: username });
      if (user == null) {
        const user = new User();
        user.username = username;
        user.password = password;
        user.isAdmin = false;
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
      expect(user.isAdmin).toBe(false);
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
        const user = new User();
        user.username = username;
        user.password = password;
        user.isAdmin = false;

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
      const user = new User();
      user.username = username;
      user.password = password;
      user.isAdmin = false;
      user.isActive = true;
      await repository.save(user);

      const result: boolean = await provider.checkLoginCredentials(
        username,
        password + '1',
      );

      expect(result).toBe(false);
    });

    it('should return false if username exists, password is correct, but user is locked', async () => {
      const usernameInDatabase = await repository.findOne({
        where: { username: username },
        relations: ['bmiEntries', 'journalEntries'],
      });
      if (usernameInDatabase != null) {
        await repository.remove(usernameInDatabase);
      }
      const user = new User();
      user.username = username;
      user.password = password;
      user.isAdmin = false;
      user.isActive = false;
      await repository.save(user);

      const result: boolean = await provider.checkLoginCredentials(
        username,
        password,
      );

      expect(result).toBe(false);
    });

    it('should return true if username exists and password is correct', async () => {
      const usernameInDatabase = await repository.findOne({
        where: { username: username },
        relations: ['bmiEntries', 'journalEntries'],
      });
      if (usernameInDatabase != null) {
        await repository.remove(usernameInDatabase);
      }
      const user = new User();
      user.username = username;
      user.password = password;
      user.isAdmin = false;
      user.isActive = true;
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
        const user = new User();
        user.username = username;
        user.password = password;
        user.isAdmin = false;
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
      const user = new User();
      user.username = username;
      user.password = password;
      user.isAdmin = false;
      const result = await provider.saveUserData(user);

      expect(result).toBe(user);
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
        isAdmin: false,
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
        isAdmin: false,
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

  describe('UsersService - WorkoutPlanService', () => {
    it('should assign workout plan to user with no previous workout plans', async () => {
      const usernameInDatabase = await repository.findOne({
        where: { username: username },
        relations: ['bmiEntries', 'journalEntries', 'workoutPlans'],
      });
      if (usernameInDatabase != null) {
        await repository.remove(usernameInDatabase);
      }

      await provider.addUser(username, password);
      const workoutPlan =
        await workoutPlanService.createWorkoutPlan('Get moving!');
      const user = await provider.getUser(username);
      await provider.assignWorkoutPlan(user, workoutPlan);
      expect(user.workoutPlans).toHaveLength(1);
    });

    it('should assign workout plan to user with already existing workout plans', async () => {
      const usernameInDatabase = await repository.findOne({
        where: { username: username },
        relations: ['bmiEntries', 'journalEntries', 'workoutPlans'],
      });
      if (usernameInDatabase != null) {
        await repository.remove(usernameInDatabase);
      }

      await provider.addUser(username, password);
      const workoutPlan =
        await workoutPlanService.createWorkoutPlan('Get moving!');
      const user = await provider.getUser(username);
      await provider.assignWorkoutPlan(user, workoutPlan);
      const secondWorkoutPlan =
        await workoutPlanService.createWorkoutPlan('Daily');
      await provider.assignWorkoutPlan(user, secondWorkoutPlan);
      expect(user.workoutPlans).toHaveLength(2);
    });

    it('should assign workout plan with title that already exist', async () => {
      const usernameInDatabase = await repository.findOne({
        where: { username: username },
        relations: ['bmiEntries', 'journalEntries', 'workoutPlans'],
      });
      if (usernameInDatabase != null) {
        await repository.remove(usernameInDatabase);
      }

      await provider.addUser(username, password);
      const workoutPlan =
        await workoutPlanService.createWorkoutPlan('Get moving!');
      const user = await provider.getUser(username);
      await provider.assignWorkoutPlan(user, workoutPlan);
      const secondWorkoutPlan =
        await workoutPlanService.createWorkoutPlan('Daily');
      await provider.assignWorkoutPlan(user, workoutPlan);
      expect(user.workoutPlans).toHaveLength(2);
    });

    it('should assign workout plan and be able to retrieve it', async () => {
      const usernameInDatabase = await repository.findOne({
        where: { username: username },
        relations: ['bmiEntries', 'journalEntries', 'workoutPlans'],
      });
      if (usernameInDatabase != null) {
        await repository.remove(usernameInDatabase);
      }

      await provider.addUser(username, password);
      const workoutPlan =
        await workoutPlanService.createWorkoutPlan('Get moving!');
      const user = await provider.getUser(username);
      await provider.assignWorkoutPlan(user, workoutPlan);
      expect(user.workoutPlans).toHaveLength(1);
      const result = await workoutPlanService.getWorkoutPlanByID(
        user.workoutPlans[0].id,
      );
      expect(result.id).toEqual(user.workoutPlans[0].id);
      expect(result.username).toEqual(username);
      expect(result.title).toEqual('Get moving!');
    });

    it('should assign workout plan, retrieve it and validate is username matches', async () => {
      const usernameInDatabase = await repository.findOne({
        where: { username: username },
        relations: ['bmiEntries', 'journalEntries', 'workoutPlans'],
      });
      if (usernameInDatabase != null) {
        await repository.remove(usernameInDatabase);
      }

      await provider.addUser(username, password);
      const workoutPlan =
        await workoutPlanService.createWorkoutPlan('Get moving!');
      const user = await provider.getUser(username);
      await provider.assignWorkoutPlan(user, workoutPlan);
      expect(user.workoutPlans).toHaveLength(1);
      const resultPlan = await workoutPlanService.getWorkoutPlanByID(
        user.workoutPlans[0].id,
      );
      expect(
        await workoutPlanService.checkIfWorkoutPlanBelongsToUser(
          username,
          resultPlan,
        ),
      ).resolves;
    });

    it('should be able to create a workout plan and delete it for a user', async () => {
      const usernameInDatabase = await repository.findOne({
        where: { username: username },
        relations: ['bmiEntries', 'journalEntries', 'workoutPlans'],
      });
      if (usernameInDatabase != null) {
        await repository.remove(usernameInDatabase);
      }
      await provider.addUser(username, password);
      const user = await provider.getUser(username);
      const workoutPlan = await workoutPlanService.createWorkoutPlan(title);
      await provider.assignWorkoutPlan(user, workoutPlan);
      expect(user.workoutPlans).toHaveLength(1);
      await workoutPlanService.deleteWorkoutPlan(
        user.workoutPlans,
        workoutPlan.id,
      );
      await provider.unassignWorkoutPlan(user, workoutPlan);
      expect(user.workoutPlans).toHaveLength(0);
    });
  });
});
