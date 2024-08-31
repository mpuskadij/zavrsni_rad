import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtGuard } from '../../guards/jwt/jwt.guard';
import { Payload } from '../../decorators/payload/payload.decorator';
import { UsersService } from '../../users/users-service/users-service';
import { User } from '../../entities/user/user';
import { JournalEntry } from '../../entities/journal-entry/journal-entry';
import { JournalService } from '../journal-service/journal-service';
import { plainToInstance } from 'class-transformer';
import { JournalEntryDto } from '../../dtos/journal-entry-dto/journal-entry-dto';
import { DeleteJournalEntryDto } from '../../dtos/journal-entry-dto/delete-journal-entry-dto';

@Controller('journal')
export class JournalController {
  constructor(
    private usersService: UsersService,
    private journalEntryService: JournalService,
  ) {}

  @Get()
  @UseGuards(JwtGuard)
  async getAllJournalEntries(
    @Payload('username') username: string,
  ): Promise<any> {
    const user = await this.usersService.getUser(username);
    if (!user) {
      throw new InternalServerErrorException('User not found in database!');
    }
    const journalEntries =
      await this.journalEntryService.getJournalEntries(user);
    return plainToInstance(JournalEntryDto, journalEntries);
  }

  @Get('/:id')
  @UseGuards(JwtGuard)
  async getOneEntry(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        optional: false,
      }),
    )
    id: number,
    @Payload('username') username: string,
  ): Promise<any> {
    const user = await this.usersService.getUser(username);
    if (!user) {
      throw new InternalServerErrorException('User not found in database!');
    }
    const journalEntries =
      await this.journalEntryService.getJournalEntries(user);

    const entry = await this.journalEntryService.getJournalEntryById(
      journalEntries,
      id,
    );

    return plainToInstance(JournalEntryDto, entry);
  }

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

    return;
  }

  @Put()
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateJournalEntry(
    @Payload('username') username: string,
    @Body(new ValidationPipe({ transform: true }))
    journalEntryToUpdate: JournalEntryDto,
  ): Promise<any> {
    const user = await this.usersService.getUser(username);
    if (!user) {
      throw new InternalServerErrorException('User not found!');
    }
    const journalEntries =
      await this.journalEntryService.getJournalEntries(user);
    await this.journalEntryService.updateEntry(
      journalEntries,
      journalEntryToUpdate,
    );
    return;
  }

  @Delete()
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteEntry(
    @Payload('username') username: string,
    @Body(new ValidationPipe({ transform: true }))
    journalEntryToDelete: DeleteJournalEntryDto,
  ): Promise<any> {
    const user = await this.usersService.getUser(username);
    if (!user) {
      throw new InternalServerErrorException('User not found!');
    }
    const journalEntries =
      await this.journalEntryService.getJournalEntries(user);
    const deletedJournalEntry = await this.journalEntryService.deleteEntry(
      journalEntries,
      journalEntryToDelete,
    );
    return;
  }
}
