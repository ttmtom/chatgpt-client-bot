import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: async () => {
        return {
          uri: process.env.MONGODB_URL,
        };
      },
    }),
    // add your module here
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
