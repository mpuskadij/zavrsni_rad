import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user/user';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async checkIfUsernameIsAlreadyInDatabase(username: string): Promise<boolean> {
    return await this.userRepository.existsBy({ username });
  }
}
