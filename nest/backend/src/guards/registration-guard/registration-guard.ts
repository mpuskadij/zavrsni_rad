import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RegistrationGuard implements CanActivate {
  validateParameters(username: string, password: string): boolean {
    if (username?.length == 0 || password?.length == 0) return false;
    if (!isNaN(Number(username))) return false;
    if (username?.length < 5 || username?.length > 25) return false;
    if (password?.length < 8) return false;
    if (!isNaN(Number(password))) return false;
    if (!/[A-Z]/.test(password)) return false;
    return true;
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const username = request.body?.username;
    const password = request.body?.password;
    const validationResult = this.validateParameters(username, password);
    if (!validationResult) {
      throw new NotAcceptableException(
        'Username must not be a number and must be in range between 5-25 characters. Password must have a length of 8 characters minimum and contains 1 uppercase character and 1 number.',
      );
    }
    return true;
  }
}
