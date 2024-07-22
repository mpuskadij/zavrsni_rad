import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
  constructor(private jwtService: JwtService) {}
  async generateJWT(username: string, isAdmin: number): Promise<string> {
    const token = await this.jwtService.signAsync({
      username: username,
      isAdmin: isAdmin,
    });
    return token;
  }
}
