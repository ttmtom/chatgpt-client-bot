import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { TelegramService } from './telegram.service';
import { ChatGptModule } from '../chatGpt/chatGpt.module';
import { UserModule } from '../user/user.module';
import { HistoryModule } from '../history/history.module';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        token: configService.get('TELEGRAM_BOT_TOKEN'),
      }),
      inject: [ConfigService],
    }),
    ChatGptModule,
    UserModule,
    HistoryModule,
  ],
  providers: [TelegramService],
})
export class TelegramModule {}
