import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  InternalServerErrorException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RegistrationGuard } from '../../guards/registration-guard/registration-guard';
import { GoogleRecaptchaGuard } from '@nestlab/google-recaptcha';
import { UsersService } from '../users-service/users-service';

@Controller('api/users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('register')
  @UseGuards(GoogleRecaptchaGuard, RegistrationGuard)
  async register(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<any> {
    const userAddedStatus: boolean = await this.userService.addUser(
      username,
      password,
    );
    if (userAddedStatus == false) {
      throw new ConflictException(
        'Username already exists! Please choose another username.',
      );
    }
    return;
  }

  @Post('login')
  @UseGuards(GoogleRecaptchaGuard, RegistrationGuard)
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<any> {
    throw new BadRequestException('Username not valid');
  }
}
