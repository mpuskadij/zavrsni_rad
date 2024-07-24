import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../guards/jwt/jwt.guard';
import { NewBmiEntryGuard } from '../../guards/new-bmi-entry/new-bmi-entry.guard';

@Controller('api/bmi')
export class BmiController {
  @Post()
  @UseGuards(JwtGuard, NewBmiEntryGuard)
  async createBmiEntry(): Promise<any> {
    return;
  }
}
