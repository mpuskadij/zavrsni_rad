import {
  Controller,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../../guards/jwt/jwt.guard';

@Controller('api/bmi')
export class BmiController {
  @Post()
  @UseGuards(JwtGuard)
  async createBmiEntry(): Promise<any> {
    return;
  }
}
