import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseBoolPipe,
  Post,
  Put,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { RegistrationGuard } from '../../guards/registration-guard/registration-guard';
import { GoogleRecaptchaGuard } from '@nestlab/google-recaptcha';
import { UsersService } from '../users-service/users-service';
import { Response } from 'express';
import { JwtGuard } from '../../guards/jwt/jwt.guard';
import { AdminGuard } from '../../guards/admin/admin.guard';
import { User } from '../../entities/user/user';
import { GetUsersDto } from '../../dtos/get-users-dto/get-users-dto';
import { plainToInstance } from 'class-transformer';
import { Payload } from '../../decorators/payload/payload.decorator';

@Controller('api/users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  @UseGuards(JwtGuard, AdminGuard)
  async getAllUsers(@Payload('username') username: string): Promise<any> {
    const allUsers = await this.userService.getAllUsers(username);

    return plainToInstance(GetUsersDto, allUsers);
  }

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

  @Put('/:username')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtGuard, AdminGuard)
  async updateActiveStatus(
    @Param('username') usernameToUpdateActiveStatus: string,
  ): Promise<any> {
    const userToUpdate = await this.userService.getUser(
      usernameToUpdateActiveStatus,
    );

    if (!userToUpdate) {
      throw new BadRequestException(
        'User with username ' + usernameToUpdateActiveStatus + ' not found!',
      );
    }

    await this.userService.changeStatus(userToUpdate);

    await this.userService.saveUserData(userToUpdate);
  }
}
