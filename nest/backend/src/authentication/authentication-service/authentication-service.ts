import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async generateJWT(username: string, isAdmin: number): Promise<string> {
    const token = await this.jwtService.signAsync({
      username: username,
      isAdmin: isAdmin,
    });
    return token;
  }

  async validateJWT(token: string): Promise<boolean> {
    const result = await this.jwtService.verifyAsync(token);

    return result != null;
  }
}
