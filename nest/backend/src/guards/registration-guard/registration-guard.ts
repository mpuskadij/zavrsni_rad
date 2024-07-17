import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RegistrationGuard implements CanActivate {
  validateParameters(username: string, password: string): boolean {
    return false;
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
