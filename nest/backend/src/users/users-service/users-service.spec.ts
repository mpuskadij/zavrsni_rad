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
import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { WorkoutPlan } from '../../entities/workout-plan/workout-plan';
import { Food } from '../../entities/food/food';
import { UserFood } from '../../entities/user_food/user_food';

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

      const result = await provider.addUser('alex', 'jfdhgt6H');

      expect(mockFunction).toHaveBeenCalled();
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
    const user = new User();
    user.username = username;
    user.password = password;
    user.isAdmin = 0;
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
    const user = new User();
    user.username = username;
    user.password = password;
    user.isAdmin = 0;
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
    const user = new User();
    user.username = username;
    user.password = password;
    user.isAdmin = 0;
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
    const user = new User();
    user.username = username;
    user.password = password;
    user.isAdmin = 0;
    it('should use userRepository to save user and return updated user if save is successful', async () => {
      jest.spyOn(repository, 'save').mockResolvedValue(user);

      const result = await provider.saveUserData(user);

      expect(result).toBe(user);
    });

    it('should throw Exception if user is null', async () => {
      await expect(provider.saveUserData(null)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('assignJournalEntry', () => {
    const user = new User();
    user.username = username;
    user.password = password;
    user.isAdmin = 0;
    user.journalEntries = [];
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
      jest.spyOn(provider, 'saveUserData').mockResolvedValue(user);

      await provider.assignJournalEntry(user, journalEntry);

      expect(user.journalEntries).toHaveLength(1);
    });
  });

  describe('unassignJournalEntry', () => {
    const userWithNoJournalEntries = new User();
    userWithNoJournalEntries.isAdmin = 0;
    userWithNoJournalEntries.journalEntries = [];
    userWithNoJournalEntries.password = password;
    userWithNoJournalEntries.username = username;

    const userWithEntry: User = new User();
    userWithEntry.isAdmin = 0;
    userWithEntry.username = username;
    userWithEntry.password = password;
    userWithEntry.journalEntries = [];

    const journalEntry: JournalEntry = {
      dateAdded: new Date(),
      description: 'sda',
      title: 'asda',
      user: userWithEntry,
      username: username,
    };
    userWithEntry.journalEntries.push(journalEntry);

    it('should throw InternalServerException if user received is null', async () => {
      await expect(
        provider.unassignJournalEntry(userWithNoJournalEntries, journalEntry),
      ).rejects.toBeInstanceOf(InternalServerErrorException);
    });

    it('should throw InternalServerException if user has 0 journal entries', async () => {
      await expect(
        provider.unassignJournalEntry(userWithNoJournalEntries, journalEntry),
      ).rejects.toThrow("You don't have any journal entries!");
    });

    it('should throw InternalServerException if entry passed doesnt exist in the array', async () => {
      const wrongJournalEntry: JournalEntry = {
        dateAdded: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        description: 'Fun',
        title: 'Boring',
        username: userWithEntry.username,
        user: userWithEntry,
      };
      await expect(
        provider.unassignJournalEntry(userWithEntry, wrongJournalEntry),
      ).rejects.toThrow('Journal entry to delete not found!');
    });

    it('should remove journal entry from users array of journal entries if entry found', async () => {
      const mockSave = jest
        .spyOn(provider, 'saveUserData')
        .mockResolvedValue(userWithEntry);

      await provider.unassignJournalEntry(userWithEntry, journalEntry);

      expect(userWithEntry.journalEntries).toHaveLength(0);

      expect(mockSave).toHaveBeenCalled();
    });
  });

  describe('assignWorkoutPlan', () => {
    const title = 'Get moving!';
    const workoutPlanWithMissingTitle: WorkoutPlan = new WorkoutPlan();
    const workoutPlanWithTitle: WorkoutPlan = new WorkoutPlan();
    workoutPlanWithTitle.title = title;
    const user: User = new User();
    user.isAdmin = 0;
    user.password = password;
    user.username = username;
    user.workoutPlans = [];
    it('should throw InternalServerException if workout plan is null or undefined', async () => {
      await expect(provider.assignWorkoutPlan(null, null)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw InternalServerException if user is null or undefined', async () => {
      await expect(
        provider.assignWorkoutPlan(null, workoutPlanWithMissingTitle),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw BadRequestException if title of the workout plan is empty,null or undefined', async () => {
      await expect(
        provider.assignWorkoutPlan(user, workoutPlanWithMissingTitle),
      ).rejects.toThrow(BadRequestException);
    });

    it('should push the workout plan into users list of workout plans', async () => {
      jest.spyOn(repository, 'save').mockResolvedValue(user);
      jest.spyOn(provider, 'saveUserData').mockResolvedValue(user);
      await provider.assignWorkoutPlan(user, workoutPlanWithTitle);

      expect(user.workoutPlans).toHaveLength(1);
    });

    it('should save added workout after adding it to users list of workout plans', async () => {
      jest.spyOn(repository, 'save').mockResolvedValue(user);
      jest.spyOn(provider, 'saveUserData').mockResolvedValue(user);
      await provider.assignWorkoutPlan(user, workoutPlanWithTitle);

      expect(provider.saveUserData).toHaveBeenCalled();
    });
  });

  describe('getWorkoutsFromUser', () => {
    const userNoPlans = new User();
    userNoPlans.workoutPlans = [];

    const workoutPlan: WorkoutPlan = new WorkoutPlan();
    workoutPlan.title = 'First plan!';
    const userWithPlans = new User();
    userWithPlans.workoutPlans = [workoutPlan];

    it('should throw InternalServerException if user null or undefined', async () => {
      await expect(provider.getWorkoutsFromUser(null)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw ForbiddenException if user has no workout plans', async () => {
      await expect(provider.getWorkoutsFromUser(userNoPlans)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw return workout plans if there is at least one workout plan', async () => {
      const result: WorkoutPlan[] =
        await provider.getWorkoutsFromUser(userWithPlans);

      expect(result).toHaveLength(1);
    });
  });

  describe('unassignWorkoutPlan', () => {
    it('should throw InternalServerError if user is not defined', async () => {
      const result = () =>
        provider.unassignWorkoutPlan(null, new WorkoutPlan());

      expect(result).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw InternalServerError if workout plan is not defined', async () => {
      const result = () => provider.unassignWorkoutPlan(new User(), null);

      expect(result).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw InternalServerError if users array of workout plans is empty', async () => {
      const user = new User();
      user.workoutPlans = [];
      const result = () =>
        provider.unassignWorkoutPlan(user, new WorkoutPlan());

      expect(result).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw InternalServerError if workout plan not in users array of workout plans', async () => {
      const user = new User();
      const workoutPlan = new WorkoutPlan();
      workoutPlan.id = 1;
      workoutPlan.username = username;
      user.workoutPlans = [workoutPlan];
      const result = () =>
        provider.unassignWorkoutPlan(user, new WorkoutPlan());

      expect(result).rejects.toThrow(InternalServerErrorException);
    });

    it('should resolve and delete workout plan from users array of workout plans', async () => {
      const user = new User();
      const workoutPlan = new WorkoutPlan();
      workoutPlan.id = 1;
      workoutPlan.username = username;
      user.workoutPlans = [workoutPlan];
      jest.spyOn(provider, 'saveUserData').mockResolvedValue(user);
      await provider.unassignWorkoutPlan(user, workoutPlan);
      expect(user.workoutPlans).toHaveLength(0);
    });
  });

  describe('getWorkoutById', () => {
    it('should throw InternalServerError if user is falsy', async () => {
      const result = () => provider.getWorkoutById(null, null);

      expect(result).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw InternalServerError if id is falsy', async () => {
      const result = () => provider.getWorkoutById([], null);

      expect(result).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw ForbiddenException if user has no workouts!', async () => {
      const result = () => provider.getWorkoutById([], 1);

      expect(result).rejects.toThrow(ForbiddenException);
    });

    it('should throw InternalServerError if workout plan not found', async () => {
      const workoutPlan = new WorkoutPlan();
      workoutPlan.id = 1;
      const result = () => provider.getWorkoutById([workoutPlan], 2);

      expect(result).rejects.toThrow(InternalServerErrorException);
    });

    it('should return the workout with given id', async () => {
      const workoutPlan = new WorkoutPlan();
      workoutPlan.id = 1;
      const result = await provider.getWorkoutById([workoutPlan], 1);

      expect(result).toStrictEqual(workoutPlan);
    });
  });

  describe('getFoodOfUser', () => {
    it('should throw exception is user is undefined', async () => {
      const result = () => provider.getFoodOfUser(undefined);

      expect(result).rejects.toThrow(InternalServerErrorException);
    });

    it('should return users food is correct user received', async () => {
      const user = new User();
      user.userFoods = [];

      const result = await provider.getFoodOfUser(user);
      expect(result).toStrictEqual(user.userFoods);
    });
  });

  describe('checkIfUserHasFoodInNutrition', () => {
    it('should throw exception if id is falsy', async () => {
      const result = () =>
        provider.checkIfUserHasFoodInNutrition(new Array<UserFood>(), null);
      expect(result).rejects.toThrow(InternalServerErrorException);
    });

    it('should return false if user has no food yet', async () => {
      const result = await provider.checkIfUserHasFoodInNutrition(
        new Array<UserFood>(),
        3,
      );
      expect(result).toStrictEqual(false);
    });

    it('should return false if id of food item is not found', async () => {
      const userFood = new UserFood();
      userFood.foodId = 3;
      const result = await provider.checkIfUserHasFoodInNutrition(
        [userFood],
        4,
      );
      expect(result).toStrictEqual(false);
    });

    it('should return true if id of food item is found', async () => {
      const userFood = new UserFood();
      userFood.foodId = 3;
      const result = await provider.checkIfUserHasFoodInNutrition(
        [userFood],
        3,
      );
      expect(result).toStrictEqual(true);
    });
  });

  describe('createUserFood', () => {
    it('should throw exception if quantity is falsy', async () => {
      const result = () => provider.createUserFood(1, 'marin', NaN);

      expect(result).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw exception if username is falsy', async () => {
      const result = () => provider.createUserFood(1, '', 1);

      expect(result).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw exception if username is falsy', async () => {
      const result = () => provider.createUserFood(NaN, 'marin', 1);

      expect(result).rejects.toThrow(InternalServerErrorException);
    });

    it('should create user food if quantity is a number', async () => {
      const quantity = 1;
      const result = await provider.createUserFood(1, username, quantity);

      expect(result).toBeDefined();
      expect(result.quantity).toStrictEqual(quantity);
    });
  });

  describe('assignFood', () => {
    it('should throw exception if user is falsy', async () => {
      const result = () => provider.assignFood(null, new UserFood());

      expect(result).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw exception if food is falsy', async () => {
      const result = () => provider.assignFood(new User(), null);

      expect(result).rejects.toThrow(InternalServerErrorException);
    });

    it('should assign food if parameters are not falsy', async () => {
      const user = new User();
      user.userFoods = [];
      jest.spyOn(repository, 'save').mockResolvedValue(user);
      await provider.assignFood(user, new UserFood());

      expect(user.userFoods).toHaveLength(1);
    });
  });

  describe('checkIfUserHasFoodWithTagIdAlreadyInNutrition', () => {
    it('should return false if user food is falsy', async () => {
      const result =
        await provider.checkIfUserHasFoodWithTagIdAlreadyInNutrition(null, '1');
      expect(result).toBeFalsy();
    });

    it('should return false if user has no food in nutrition', async () => {
      const result =
        await provider.checkIfUserHasFoodWithTagIdAlreadyInNutrition([], '1');
      expect(result).toBeFalsy();
    });

    it('should return true if user has food with matching tag id', async () => {
      const food = new Food();
      food.tagId = '1';
      const userFood = new UserFood();
      userFood.food = food;

      const result =
        await provider.checkIfUserHasFoodWithTagIdAlreadyInNutrition(
          [userFood],
          '1',
        );
      expect(result).toBeTruthy();
    });

    it('should return false if user has no food with matching tag id', async () => {
      const food = new Food();
      food.tagId = '1';
      const userFood = new UserFood();
      userFood.food = food;

      const result =
        await provider.checkIfUserHasFoodWithTagIdAlreadyInNutrition(
          [userFood],
          '2',
        );
      expect(result).toBeFalsy();
    });
  });

  describe('updateFoodQuantity', () => {
    it('should throw exception if user has no food', async () => {
      const result = () => provider.updateFoodQuantity([], 1, 2);

      expect(result).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw exception if id is falsy', async () => {
      const userFood = new UserFood();
      const result = () => provider.updateFoodQuantity([userFood], NaN, 1);

      expect(result).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw exception if quantity is falsy', async () => {
      const userFood = new UserFood();
      const result = () => provider.updateFoodQuantity([userFood], 1, NaN);

      expect(result).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw exception if quantity is negative', async () => {
      const userFood = new UserFood();
      const result = () => provider.updateFoodQuantity([userFood], 1, -1);

      expect(result).rejects.toThrow(BadRequestException);
    });

    it('should throw exception if food not found', async () => {
      const userFood = new UserFood();
      userFood.foodId = 1;
      const result = () => provider.updateFoodQuantity([userFood], 2, 2);

      expect(result).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw exception if quantity is the same', async () => {
      const userFood = new UserFood();
      userFood.foodId = 1;
      userFood.quantity = 1;
      const result = () => provider.updateFoodQuantity([userFood], 1, 1);

      expect(result).rejects.toThrow(BadRequestException);
    });

    it('should upadte quantity if quantity is different', async () => {
      const userFood = new UserFood();
      userFood.foodId = 1;
      userFood.quantity = 1;
      const result = await provider.updateFoodQuantity([userFood], 1, 1.5);

      expect(userFood.quantity).toBe(1.5);
    });
  });

  describe('deleteFoodFromUser', () => {
    it('should throw an exception if user has no food', async () => {
      const result = () => provider.deleteFoodFromUser([], 2);

      expect(result).rejects.toThrow(ForbiddenException);
    });

    it('should throw an exception id is falsy', async () => {
      const userFood = new UserFood();
      const result = () => provider.deleteFoodFromUser([userFood], NaN);

      expect(result).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw an exception food with passed id not found', async () => {
      const userFood = new UserFood();
      userFood.foodId = 1;
      const result = () => provider.deleteFoodFromUser([userFood], 2);

      expect(result).rejects.toThrow(BadRequestException);
    });

    it('should remove entry that has been deleted', async () => {
      const userFood = new UserFood();
      userFood.foodId = 1;
      const userFoods = [userFood];
      await provider.deleteFoodFromUser(userFoods, 1);

      expect(userFoods).toHaveLength(0);
    });
  });

  describe('getAllUsers', () => {
    it('should return all users that exist in database if no username to exclude passed', async () => {
      const user1 = new User();
      user1.username = 'admin';
      const user2 = new User();
      user2.username = 'marin';
      const usersInDatabase = [user1, user2];
      jest.spyOn(repository, 'find').mockResolvedValue(usersInDatabase);
      const users = await provider.getAllUsers();

      expect(users).toEqual(usersInDatabase);
    });

    it('should return all users excluding username that was passed', async () => {
      const user1 = new User();
      user1.username = 'admin';
      const user2 = new User();
      user2.username = 'marin';
      const usersInDatabase = [user1, user2];
      jest.spyOn(repository, 'find').mockResolvedValue(usersInDatabase);
      const users = await provider.getAllUsers('admin');
      expect(users).toHaveLength(1);
      expect(users[0].username).toStrictEqual(user2.username);
    });
  });
});
