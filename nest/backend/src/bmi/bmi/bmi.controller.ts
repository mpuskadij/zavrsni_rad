import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../../guards/jwt/jwt.guard';
import { NewBmiEntryGuard } from '../../guards/new-bmi-entry/new-bmi-entry.guard';
import { Payload } from '../../decorators/payload/payload.decorator';
import { JwtPayload } from '../../authentication/jwt-payload/jwt-payload';
import { BmiService } from '../bmi-service/bmi-service';
import { plainToInstance } from 'class-transformer';
import { BmiEntryDto } from '../../dtos/bmi-entry-dto/bmi-entry-dto';

@Controller('api/bmi')
export class BmiController {
  constructor(private bmiService: BmiService) {}
  @Post()
  @UseGuards(JwtGuard, NewBmiEntryGuard)
  async createBmiEntry(
    @Body('weight') weight: number,
    @Body('height') height: number,
    @Payload('username') username: string,
  ): Promise<any> {
    const bmi = await this.bmiService.addNewBmiEntry(username, weight, height);
    return bmi;
  }

  @Get()
  @UseGuards(JwtGuard)
  async getAll(@Payload('username') username: string): Promise<any> {
    const bmiEntries = await this.bmiService.getAllBmiEntriesFromUser(username);
    return plainToInstance(BmiEntryDto, bmiEntries);
  }
}
