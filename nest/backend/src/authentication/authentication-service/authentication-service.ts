import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../jwt-payload/jwt-payload';

@Injectable()
export class AuthenticationService {
  constructor(private jwtService: JwtService) {}

  async generateJWT(username: string, isAdmin: boolean): Promise<string> {
    if (!username || isAdmin === undefined || isAdmin === null) {
      throw new InternalServerErrorException(
        'Server had trouble generating JWT!',
      );
    }
    const payload: JwtPayload = { isAdmin: isAdmin, username: username };
    const token = await this.jwtService.signAsync(payload);
    return token;
  }

  async validateJWT(token: string): Promise<JwtPayload> {
    try {
      const result = await this.jwtService.verifyAsync<JwtPayload>(token);
      return result;
    } catch (error) {
      throw new UnauthorizedException('JWT is invalid!');
    }
  }
}
