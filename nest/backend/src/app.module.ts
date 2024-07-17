import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuardsModule } from './guards/guards.module';
import { EntitiesModule } from './entities/entities.module';

@Module({
  imports: [
    UsersModule,
    GuardsModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './database/database.sqlite',
      synchronize: true,
      entities: [],
    }),
    EntitiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
