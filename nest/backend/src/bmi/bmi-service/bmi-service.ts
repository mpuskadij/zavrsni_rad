import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bmientry } from '../../entities/bmientry/bmientry';
import { Repository } from 'typeorm';
import { UsersService } from '../../users/users-service/users-service';
import { User } from 'src/entities/user/user';
import { BmiEntryDto } from '../../dtos/bmi-entry-dto/bmi-entry-dto';
import { VirtualTimeService } from '../../admin/virtual-time-service/virtual-time-service';

@Injectable()
export class BmiService {
  constructor(
    @InjectRepository(Bmientry) private bmiRepository: Repository<Bmientry>,
    private usersService: UsersService,
    private virtualTimeService: VirtualTimeService,
  ) {}
  async addNewBmiEntry(
    username: string,
    weight: number,
    height: number,
  ): Promise<number> {
    if (weight <= 0 || height <= 0) {
      throw new NotAcceptableException('Weight cannot be 0 or less than 0!');
    }
    const squaredHeight: number = Math.pow(height, 2);
    const user = await this.usersService.getUser(username);
    if (user == null) {
      throw new InternalServerErrorException(
        'Username could not be found in database!',
      );
    }
    const hasAtLeastOneBmiEntry = user.bmiEntries.length > 0;
    if (hasAtLeastOneBmiEntry) {
      await this.haveAtLeastSevenDaysPassed(
        user.bmiEntries.find((entry) => Math.max(entry.dateAdded.getTime()))
          .dateAdded,
      );
    }
    const bmi: number = Number((weight / squaredHeight).toPrecision(3));
    const bmiEntry: Bmientry = this.bmiRepository.create({
      bmi: bmi,
      dateAdded: await this.virtualTimeService.getTime(),
    });
    user.bmiEntries.push(bmiEntry);
    try {
      const saveResult: User = await this.usersService.saveUserData(user);
    } catch (error) {
      throw new InternalServerErrorException('Error adding entry to database!');
    }
    return bmi;
  }

  private async haveAtLeastSevenDaysPassed(
    dateFromLatestBmiEntryOfUser: Date,
  ): Promise<void> {
    const dateFromLatestBmiEntry = new Date(dateFromLatestBmiEntryOfUser);
    const currentDate = await this.virtualTimeService.getTime();
    currentDate.setHours(0, 0, 0, 0);
    dateFromLatestBmiEntry.setHours(0, 0, 0, 0);
    const differenceInMiliseconds = Math.abs(
      currentDate.getTime() - dateFromLatestBmiEntry.getTime(),
    );
    const differenceInDays = Math.floor(
      differenceInMiliseconds / (1000 * 60 * 60 * 24),
    );
    if (differenceInDays < 7) {
      throw new ForbiddenException(
        'New BMI entry can be inserted after at least 7 days!',
      );
    }
    return;
  }

  async getAllBmiEntriesFromUser(username: string): Promise<Bmientry[]> {
    const user = await this.usersService.getUser(username);
    const userNotFound = user == null;
    const hasNoBmiEntries = user?.bmiEntries.length == 0;
    if (userNotFound) {
      throw new InternalServerErrorException(
        'User with that username not found!',
      );
    } else if (hasNoBmiEntries) {
      throw new ForbiddenException('No BMI entries found!');
    }
    return user.bmiEntries;
  }
}
