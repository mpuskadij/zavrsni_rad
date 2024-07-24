import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../guards/jwt/jwt.guard';
import { NewBmiEntryGuard } from '../../guards/new-bmi-entry/new-bmi-entry.guard';
import { Payload } from '../../decorators/payload/payload.decorator';
import { JwtPayload } from '../../authentication/jwt-payload/jwt-payload';

@Controller('api/bmi')
export class BmiController {
  @Post()
  @UseGuards(JwtGuard, NewBmiEntryGuard)
  async createBmiEntry(
    @Body('weight') weight: number,
    @Body('height') height: number,
    @Payload() payload: JwtPayload,
  ): Promise<any> {
    return;
  }
}
