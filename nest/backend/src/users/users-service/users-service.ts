import {
  BadRequestException,
  ForbiddenException,
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
import { JournalEntry } from '../../entities/journal-entry/journal-entry';
import { WorkoutPlan } from '../../entities/workout-plan/workout-plan';
import { UserFood } from '../../entities/user_food/user_food';
import { Food } from 'src/entities/food/food';

@Injectable()
export class UsersService {
  async checkIfUserHasFoodWithTagIdAlreadyInNutrition(
    currentUserFoods: UserFood[],
    tagIdToCheck: string,
  ): Promise<boolean> {
    if (!currentUserFoods?.length) {
      return false;
    }

    const foundFood = currentUserFoods.some(
      (usrf) => usrf.food.tagId == tagIdToCheck,
    );

    return foundFood;
  }
  async assignFood(user: User, userFood: UserFood): Promise<void> {
    if (!user || !userFood) {
      throw new InternalServerErrorException(
        'Server had trouble adding food to nutrition!',
      );
    }
    user.userFoods.push(userFood);

    await this.saveUserData(user);
  }
  async createUserFood(quantity: number): Promise<UserFood> {
    if (!quantity) {
      throw new InternalServerErrorException(
        'Server had trouble adding quantity to food item!',
      );
    }
    const userFood = new UserFood();
    userFood.quantity = quantity;
    return userFood;
  }
  async checkIfUserHasFoodInNutrition(
    usersFood: UserFood[],
    id: number,
  ): Promise<boolean> {
    if (!id) {
      throw new InternalServerErrorException(
        'Server had trouble finding the food item!',
      );
    }
    if (!usersFood?.length) {
      return false;
    }

    return usersFood.some((food) => food.foodId == id);
  }

  async getFoodOfUser(user: User): Promise<UserFood[]> {
    if (!user) {
      throw new InternalServerErrorException(
        'Server had trouble finding the user!',
      );
    }
    return user.userFoods;
  }
  async getWorkoutById(
    workoutPlans: WorkoutPlan[],
    idOfWorkoutPlanToFind: number,
  ): Promise<WorkoutPlan> {
    if (!workoutPlans || !idOfWorkoutPlanToFind) {
      throw new InternalServerErrorException(
        'Server had trouble finding the workout plan!',
      );
    }

    if (!workoutPlans.length) {
      throw new ForbiddenException("You don't have any workout plans yet!");
    }

    const workoutPlan = workoutPlans.find(
      (plan) => plan.id == idOfWorkoutPlanToFind,
    );
    if (!workoutPlan) {
      throw new InternalServerErrorException(
        'Server had trouble finding the workout plan!',
      );
    }

    return workoutPlan;
  }
  async unassignWorkoutPlan(
    user: User,
    workoutPlan: WorkoutPlan,
  ): Promise<void> {
    if (!user?.workoutPlans?.length || !workoutPlan) {
      throw new InternalServerErrorException(
        'Server had trouble deleting your workout plan!',
      );
    }

    const indexOfWorkoutPlanToDelete = user.workoutPlans.indexOf(workoutPlan);
    if (indexOfWorkoutPlanToDelete === -1) {
      throw new InternalServerErrorException(
        'Workout plan to delete not found!',
      );
    }

    user.workoutPlans.splice(indexOfWorkoutPlanToDelete);
    await this.saveUserData(user);
    return;
  }
  async getWorkoutsFromUser(user: User): Promise<WorkoutPlan[]> {
    if (!user) {
      throw new InternalServerErrorException('User not found!');
    }
    if (!user.workoutPlans?.length) {
      throw new ForbiddenException("You don't have any workout plans yet!");
    }

    return user.workoutPlans;
  }
  async assignWorkoutPlan(user: User, workoutPlan: WorkoutPlan): Promise<void> {
    const invalidParameters = !user || !workoutPlan;
    if (invalidParameters) {
      throw new InternalServerErrorException('Error creating workout plan!');
    }
    const missingTitle = !workoutPlan.title;
    if (missingTitle) {
      throw new BadRequestException('Workout plan must have a title!');
    }

    user.workoutPlans.push(workoutPlan);
    await this.saveUserData(user);

    return;
  }
  async unassignJournalEntry(
    user: User,
    journalEntryToRemove: JournalEntry,
  ): Promise<void> {
    if (!user) {
      throw new InternalServerErrorException('Invalid user passed!');
    }
    if (!user.journalEntries?.length) {
      throw new InternalServerErrorException(
        "You don't have any journal entries!",
      );
    }
    const indexOfEntryToDelete =
      user.journalEntries.indexOf(journalEntryToRemove);
    if (indexOfEntryToDelete === -1) {
      throw new InternalServerErrorException(
        'Journal entry to delete not found!',
      );
    }
    user.journalEntries.splice(indexOfEntryToDelete);

    await this.saveUserData(user);

    return;
  }
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
      relations: ['bmiEntries', 'journalEntries', 'workoutPlans'],
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

    const newUser: User = new User();
    newUser.isAdmin = 0;
    newUser.username = username;
    newUser.password = hashedPasswordData.HashedPassword;

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

  async saveUserData(user: User): Promise<User> {
    if (!user) {
      throw new InternalServerErrorException('Error saving user data!');
    }
    return await this.userRepository.save(user);
  }

  async assignJournalEntry(
    user: User,
    journalEntry: JournalEntry,
  ): Promise<void> {
    if (!user || !journalEntry)
      throw new InternalServerErrorException(
        'Error assigning journal entry to user!',
      );
    user.journalEntries.push(journalEntry);
    await this.saveUserData(user);
  }
}
