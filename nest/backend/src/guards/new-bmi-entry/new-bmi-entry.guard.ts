import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class NewBmiEntryGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const height = request.body?.height;
    const weight = request.body?.weight;

    if (height != undefined && weight != undefined) {
      if (height > 0 && weight > 0) {
        return true;
      }
      throw new NotAcceptableException('Height and weight have to be > 0!');
    }
    throw new BadRequestException(
      'Server requires both height and weight to calcualte BMI!',
    );
  }
}
