import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RegistrationGuard implements CanActivate {
  validateParameters(username: string, password: string): boolean {
    if (username.length == 0 || password.length == 0) return false;
    if (!isNaN(Number(username))) return false;
    if (username.length < 5 || username.length > 25) return false;
    return true;
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const username = request.body.username;
    const password = request.body.password;
    return this.validateParameters(username, password);
  }
}
