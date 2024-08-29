import {
  Body,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  ParseIntPipe,
  Put,
  Redirect,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '../../guards/admin/admin.guard';
import { JwtGuard } from '../../guards/jwt/jwt.guard';
import { VirtualTimeService } from '../virtual-time-service/virtual-time-service';
import { plainToInstance } from 'class-transformer';
import { TimeDto } from '../../dtos/time-dto/time-dto';

@Controller('time')
export class TimeController {
  constructor(private virtualTimeService: VirtualTimeService) {}
  @Get()
  @UseGuards(JwtGuard)
  async getServerTime(): Promise<any> {
    try {
      const serverTime = await this.virtualTimeService.getTime();
      const timeDto: TimeDto = { time: serverTime };
      return timeDto;
    } catch (error) {
      throw new InternalServerErrorException(
        'Server had trouble getting time!',
      );
    }
  }

  @Put()
  @UseGuards(JwtGuard, AdminGuard)
  async updateOffset(
    @Body('offset', new ParseIntPipe({ optional: false })) offset: number,
  ): Promise<any> {
    await this.virtualTimeService.setTime(offset);

    try {
      const serverTime = await this.virtualTimeService.getTime();
      const timeDto: TimeDto = { time: serverTime };
      return timeDto;
    } catch (error) {
      throw new InternalServerErrorException(
        'Server had trouble getting time!',
      );
    }
  }
}
