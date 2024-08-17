import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication-service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtPayload } from '../jwt-payload/jwt-payload';

describe('AuthenticationService (unit tests)', () => {
  let provider: AuthenticationService;
  const mockJwtService = { signAsync: jest.fn(), verifyAsync: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        AuthenticationService,
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    provider = module.get<AuthenticationService>(AuthenticationService);
  });

  const username = 'marin';
  const isAdmin = false;

  describe('generateJWT', () => {
    it('should throw exception if username is falsy', async () => {
      const token = () => provider.generateJWT('', isAdmin);

      expect(token).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw exception if admin rights not provided', async () => {
      const token = () => provider.generateJWT('marin', undefined);

      expect(token).rejects.toThrow(InternalServerErrorException);
    });

    it('should return token when signed', async () => {
      const jwt = 'asdasfasf';
      mockJwtService.signAsync.mockResolvedValue(jwt);

      const token = await provider.generateJWT('marin', true);

      expect(token).toStrictEqual(jwt);
    });
  });

  describe('validateJWT', () => {
    it('should return true if jwt is valid', async () => {
      const payload: JwtPayload = { isAdmin: false, username: username };
      mockJwtService.verifyAsync.mockResolvedValue(payload);
      const token: string = 'asdasdasdasdasf';
      const result: JwtPayload = await provider.validateJWT(token);
      expect(result).toBeDefined();
      expect(result).not.toBeNull();
      expect(result.username).toEqual(username);
      expect(result.isAdmin).toEqual(false);
    });

    it('should throw exception if jwt is invalid', async () => {
      mockJwtService.verifyAsync.mockRejectedValue(new Error('Not valid!'));
      const token: string = 'asdasdasdasdasd';
      try {
        const result: JwtPayload = await provider.validateJWT(token);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
});
