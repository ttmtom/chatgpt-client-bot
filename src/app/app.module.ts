import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { connectionName } from 'src/database/connection';
import entities from 'src/database/entities';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      name: connectionName,
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'workspace',
      entities,
      synchronize: true,
    }),
    // add your module here
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
