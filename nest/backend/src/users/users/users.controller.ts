import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { RegistrationGuard } from '../../guards/registration-guard/registration-guard';
import { GoogleRecaptchaGuard } from '@nestlab/google-recaptcha';
import { UsersService } from '../users-service/users-service';
import { Response } from 'express';

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
  @HttpCode(200)
  @UseGuards(GoogleRecaptchaGuard, RegistrationGuard)
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    const validCredentials = await this.userService.checkLoginCredentials(
      username,
      password,
    );
    if (validCredentials == false) {
      throw new UnauthorizedException('Username and/or password not valid!');
    }
    const token = await this.userService.createJWT(username);
    response.cookie('token', token, { httpOnly: true });
    return;
  }
}
