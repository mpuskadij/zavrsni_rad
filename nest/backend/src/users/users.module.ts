import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import { UsersService } from './users-service/users-service';
import { GuardsModule } from '../guards/guards.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user/user';
import { CrpytoModule } from '../crpyto/crpyto.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { Bmientry } from '../entities/bmientry/bmientry';
import { UserFood } from '../entities/user_food/user_food';

@Module({
  imports: [
    GuardsModule,
    TypeOrmModule.forFeature([User, UserFood]),
    CrpytoModule,
    AuthenticationModule,
  ],
  exports: [TypeOrmModule, UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
