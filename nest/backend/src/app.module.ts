import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuardsModule } from './guards/guards.module';
import { EntitiesModule } from './entities/entities.module';
import { User } from './entities/user/user';

@Module({
  imports: [
    UsersModule,
    GuardsModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './database/database.sqlite',
      synchronize: true,
      entities: [User],
    }),
    EntitiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
