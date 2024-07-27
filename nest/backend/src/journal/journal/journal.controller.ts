import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../guards/jwt/jwt.guard';
import { Payload } from '../../decorators/payload/payload.decorator';

@Controller('api/journal')
export class JournalController {
  @Post()
  @UseGuards(JwtGuard)
  async getAll(@Payload('username') username: string): Promise<any> {
    return;
  }
}
