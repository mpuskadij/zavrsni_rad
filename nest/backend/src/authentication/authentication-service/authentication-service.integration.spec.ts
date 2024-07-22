import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication-service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

describe('AuthenticationService', () => {
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
  const isAdmin = 0;

  describe('generateJWT (integration tests)', () => {
    it('should generate JWT', async () => {
      const token: string = await provider.generateJWT(username, isAdmin);

      expect(token).not.toBeNull();
    });
  });
});
