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
import { AdminGuard } from 'src/guards/admin/admin.guard';
import { JwtGuard } from 'src/guards/jwt/jwt.guard';
import { VirtualTimeService } from '../virtual-time-service/virtual-time-service';

@Controller('api/time')
export class TimeController {
  constructor(private virtualTimeService: VirtualTimeService) {}
  @Get()
  @UseGuards(JwtGuard)
  async getServerTime(): Promise<any> {
    try {
      const serverTime = await this.virtualTimeService.getTime();
      return serverTime;
    } catch (error) {
      throw new InternalServerErrorException(
        'Server had trouble getting time!',
      );
    }
  }

  @Put()
  @UseGuards(JwtGuard, AdminGuard)
  async updateOffset(
    @Body(new ParseIntPipe({ optional: false })) offset: number,
  ): Promise<any> {
    await this.virtualTimeService.setTime(offset);

    try {
      const serverTime = await this.virtualTimeService.getTime();
      return serverTime;
    } catch (error) {
      throw new InternalServerErrorException(
        'Server had trouble getting time!',
      );
    }
  }
}
