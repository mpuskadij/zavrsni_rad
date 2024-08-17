import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtGuard } from '../../guards/jwt/jwt.guard';
import { Payload } from '../../decorators/payload/payload.decorator';
import { CreateWorkoutPlanDto } from '../../dtos/create-workout-plan-dto/create-workout-plan-dto';
import { WorkoutPlan } from '../../entities/workout-plan/workout-plan';
import { UsersService } from '../../users/users-service/users-service';
import { WorkoutPlanService } from '../workout-plan-service/workout-plan-service';
import { User } from 'src/entities/user/user';
import { plainToInstance } from 'class-transformer';
import { WorkoutPlanDto } from '../../dtos/workout-plan-dto/workout-plan-dto';
import { AddExerciseToWorkoutPlanDto } from '../../dtos/add-exercise-to-workout-plan-dto/add-exercise-to-workout-plan-dto';
import { WgerService } from '../wger-service/wger-service';
import { WgerExerciseDto } from '../../dtos/wger-exercise-dto/wger-exercise-dto';
import { WgerCategoryDto } from 'src/dtos/wger-category-dto/wger-category-dto';
import { ExerciseService } from '../exercise-service/exercise-service';
import { DeleteExerciseDto } from '../../dtos/delete-exercise-dto/delete-exercise-dto';

@Controller('workout-plans')
export class WorkoutPlanController {
  constructor(
    private workoutPlanService: WorkoutPlanService,
    private usersService: UsersService,
    private wgerService: WgerService,
    private exerciseService: ExerciseService,
  ) {}
  @Get()
  @UseGuards(JwtGuard)
  async findAllPlans(@Payload('username') username: string): Promise<any> {
    const user: User = await this.usersService.getUser(username);
    if (!user) {
      throw new InternalServerErrorException('Error finding user!');
    }
    const workoutPlans: WorkoutPlan[] =
      await this.usersService.getWorkoutsFromUser(user);

    return plainToInstance(WorkoutPlanDto, workoutPlans);
  }

  @Post()
  @UseGuards(JwtGuard)
  async createWorkoutPlan(
    @Payload('username') username: string,
    @Body(new ValidationPipe({ transform: true }))
    createWorkoutPlanData: CreateWorkoutPlanDto,
  ): Promise<any> {
    const user = await this.usersService.getUser(username);
    if (!user) {
      throw new InternalServerErrorException('User not found!');
    }
    const workoutPlan: WorkoutPlan =
      await this.workoutPlanService.createWorkoutPlan(
        createWorkoutPlanData.title,
      );
    await this.usersService.assignWorkoutPlan(user, workoutPlan);
    return;
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtGuard)
  async deleteWorkoutPlan(
    @Body(
      'id',
      new ParseIntPipe({
        optional: false,
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      }),
    )
    id: number,
    @Payload('username') username: string,
  ): Promise<any> {
    const user: User = await this.usersService.getUser(username);
    if (!user) {
      throw new InternalServerErrorException(
        'Server had trouble finding you in database!',
      );
    }
    const workoutPlans = await this.usersService.getWorkoutsFromUser(user);
    const deletedWorkoutPlan = await this.workoutPlanService.deleteWorkoutPlan(
      workoutPlans,
      id,
    );
    await this.usersService.unassignWorkoutPlan(user, deletedWorkoutPlan);
    return;
  }

  @Get('/:id')
  @UseGuards(JwtGuard)
  async findPlanById(
    @Param(
      'id',
      new ParseIntPipe({
        optional: false,
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      }),
    )
    id: number,
    @Payload('username') username: string,
  ): Promise<any> {
    const user: User = await this.usersService.getUser(username);
    if (!user) {
      throw new InternalServerErrorException('Error finding user!');
    }
    await this.usersService.getWorkoutsFromUser(user);
    const workoutPlan: WorkoutPlan =
      await this.workoutPlanService.getWorkoutPlanByID(id);
    await this.workoutPlanService.checkIfWorkoutPlanBelongsToUser(
      user.username,
      workoutPlan,
    );

    return plainToInstance(WorkoutPlanDto, workoutPlan, {
      groups: ['exercises'],
    });
  }

  @Post('/:id')
  @UseGuards(JwtGuard)
  async addExerciseToPlan(
    @Param(
      'id',
      new ParseIntPipe({
        optional: false,
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      }),
    )
    id: number,
    @Payload('username') username: string,
    @Body(new ValidationPipe({ transform: true }))
    addExerciseDto: AddExerciseToWorkoutPlanDto,
  ): Promise<any> {
    const user: User = await this.usersService.getUser(username);
    if (!user) {
      throw new InternalServerErrorException(
        'Server had trouble finding you in database!',
      );
    }
    const workoutPlan: WorkoutPlan =
      await this.workoutPlanService.getWorkoutPlanByID(id);
    await this.workoutPlanService.checkIfWorkoutPlanBelongsToUser(
      user.username,
      workoutPlan,
    );
    const exerciseAlreadyInWorkoutPlan: boolean =
      await this.workoutPlanService.checkIfExerciseAlreadyInWorkoutPlan(
        workoutPlan,
        addExerciseDto.name,
      );
    if (exerciseAlreadyInWorkoutPlan) {
      throw new BadRequestException(
        'Cannot add exercise that is already in your workout plan!',
      );
    }
    let exercise = await this.exerciseService.getExcerciseByName(
      addExerciseDto.name,
    );
    if (!exercise) {
      const exerciseFromWger: WgerExerciseDto = (
        await this.wgerService.getExercises(1, addExerciseDto.name)
      ).at(0);
      const name: string = exerciseFromWger.name;
      const description: string = exerciseFromWger.description;
      const category: string = await this.wgerService.getCategoryNameById(
        exerciseFromWger.category,
      );
      const equipment: string = await this.wgerService.getEquipmentNamesById(
        exerciseFromWger.equipment,
      );
      exercise = await this.exerciseService.createExercise(
        name,
        description,
        category,
        equipment,
      );
    }
    await this.workoutPlanService.addExercise(workoutPlan, exercise);

    return;
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtGuard)
  async deleteExerciseFromWorkoutPlan(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        optional: false,
      }),
    )
    id: number,
    @Payload('username') username: string,
    @Body(new ValidationPipe({ transform: true }))
    deleteExerciseDto: DeleteExerciseDto,
  ): Promise<any> {
    const user: User = await this.usersService.getUser(username);
    if (!user) {
      throw new InternalServerErrorException(
        'Server had trouble finding you in database!',
      );
    }
    const workoutPlans = await this.usersService.getWorkoutsFromUser(user);
    const workoutPlan = await this.usersService.getWorkoutById(
      workoutPlans,
      id,
    );
    const exercises = await this.workoutPlanService.getExercises(workoutPlan);
    const foundExercise = await this.exerciseService.findExerciseInWorkoutPlan(
      exercises,
      deleteExerciseDto.name,
    );
    await this.workoutPlanService.unassignExercise(workoutPlan, foundExercise);
    return;
  }
}
