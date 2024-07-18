import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  async checkIfUsernameIsAlreadyInDatabase(username: string): Promise<boolean> {
    return false;
  }
}
