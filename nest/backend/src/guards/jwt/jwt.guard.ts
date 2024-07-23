import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../authentication/authentication-service/authentication-service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private authenticationService: AuthenticationService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const cookies = request.cookies;
    if (cookies != undefined) {
      const token = cookies['token'];
      if (token != undefined) {
        return this.authenticationService.validateJWT(token).then((result) => {
          return result;
        });
      }
    }
    throw new UnauthorizedException('JWT is not valid!');
  }
}
