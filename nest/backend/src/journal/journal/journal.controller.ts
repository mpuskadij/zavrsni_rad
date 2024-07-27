import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  InternalServerErrorException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../../guards/jwt/jwt.guard';
import { Payload } from '../../decorators/payload/payload.decorator';
import { UsersService } from '../../users/users-service/users-service';
import { User } from '../../entities/user/user';
import { JournalEntry } from '../../entities/journal-entry/journal-entry';
import { JournalService } from '../journal-service/journal-service';

@Controller('api/journal')
export class JournalController {
  constructor(
    private usersService: UsersService,
    private journalEntryService: JournalService,
  ) {}
  @Post()
  @UseGuards(JwtGuard)
  async createJournalEntry(
    @Payload('username') username: string,
    @Body('title') title: string,
    @Body('description') description: string,
  ): Promise<any> {
    if (!title || !description)
      throw new BadRequestException(
        'Title and/or description not sent or empty!',
      );
    const user: User = await this.usersService.getUser(username);
    if (user == null) {
      throw new InternalServerErrorException(
        'User with that username not found in database!',
      );
    }
    const journalEntry: JournalEntry =
      await this.journalEntryService.createJournalEntry(
        user,
        title,
        description,
      );
    await this.usersService.assignJournalEntry(user, journalEntry);

    return;
  }
}
