import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import { UsersService } from './users-service/users-service';
import { GuardsModule } from 'src/guards/guards.module';

@Module({
  imports: [GuardsModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
