import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramModule } from '../modules/telegram/telegram.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { connectionName } from '../database/connection';
import entities from '../database/entities';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'mongodb',
          url: configService.get('MONGODB_URL'),
          authMechanism: 'DEFAULT',
          // host: configService.get('MONGODB_HOST'),
          // port: parseInt(configService.get('MONGODB_PORT')),
          // username: configService.get('MONGODB_USER'),
          // password: configService.get('MONGODB_PASSWORD'),
          database: connectionName,
          // tls: false,
          // useNewUrlParser: true,
          // useUnifiedTopology: true,
          // autoLoadEntities: true,
          // ssl: false,

          synchronize: true,
          entities,
        };
      },
    }),
    TelegramModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
