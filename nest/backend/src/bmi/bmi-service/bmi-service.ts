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

@Injectable()
export class BmiService {
  constructor(
    @InjectRepository(Bmientry) private bmiRepository: Repository<Bmientry>,
    private usersService: UsersService,
  ) {}
  async addNewBmiEntry(
    username: string,
    weight: number,
    height: number,
  ): Promise<boolean> {
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
      dateAdded: new Date(),
      username: user.username,
      user: user,
    });
    user.bmiEntries.push(bmiEntry);
    const saveResult: boolean = await this.usersService.saveUserData(user);
    if (saveResult == false) {
      throw new InternalServerErrorException('Error adding entry to database!');
    }
    return true;
  }

  private async haveAtLeastSevenDaysPassed(
    dateFromLatestBmiEntryOfUser: Date,
  ): Promise<void> {
    const dateFromLatestBmiEntry = new Date(dateFromLatestBmiEntryOfUser);
    const currentDate = new Date();
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
    return null;
  }
}
