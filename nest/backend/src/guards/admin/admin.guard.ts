import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const payload = request.jwtPayload;
    if (payload) {
      const admin = payload.isAdmin;
      if (admin) {
        return true;
      }
    }
    throw new UnauthorizedException('User is not an admin!');
  }
}
