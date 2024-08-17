import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication-service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '../jwt-payload/jwt-payload';

describe('AuthenticationService (integration tests)', () => {
  let provider: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          global: true,
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [AuthenticationService],
    }).compile();

    provider = module.get<AuthenticationService>(AuthenticationService);
  });

  const username = 'marin';
  const isAdmin = false;

  describe('generateJWT', () => {
    it('should generate JWT', async () => {
      const token: string = await provider.generateJWT(username, isAdmin);
      const tokenParts: string[] = token.split('.');
      expect(token).not.toBeNull();
      expect(tokenParts).toHaveLength(3);
    });
  });

  describe('validateJWT', () => {
    it('should return true if jwt is valid', async () => {
      const token: string = await provider.generateJWT(username, isAdmin);
      const result: JwtPayload = await provider.validateJWT(token);
      expect(result).toBeDefined();
      expect(result).not.toBeNull();
      expect(result.username).toEqual(username);
      expect(result.isAdmin).toEqual(false);
    });

    it('should throw exception if jwt is invalid', async () => {
      const token: string = await provider.generateJWT(username, isAdmin);
      try {
        const result: JwtPayload = await provider.validateJWT(token + 's');
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
});
