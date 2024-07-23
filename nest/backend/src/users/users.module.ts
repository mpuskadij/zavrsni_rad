import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import { UsersService } from './users-service/users-service';
import { GuardsModule } from '../guards/guards.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user/user';
import { CrpytoModule } from '../crpyto/crpyto.module';
import { AuthenticationModule } from '../authentication/authentication.module';

@Module({
  imports: [
    GuardsModule,
    TypeOrmModule.forFeature([User]),
    CrpytoModule,
    AuthenticationModule,
  ],
  exports: [TypeOrmModule, UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
