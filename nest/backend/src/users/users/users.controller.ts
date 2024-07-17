import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Post()
  async register(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<any> {
    if (!isNaN(Number(username))) {
      throw new HttpException(
        'Username should not be a number nad must not be empty!',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    if (password.length == 0) {
      throw new HttpException(
        'Password must not be empty!',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }
}
