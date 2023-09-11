import {
  Body,
  Controller,
  Headers,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TelegramService } from './telegram.service';
import { SendMessageDto } from './telegram.type';

@ApiTags('telegram')
@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}
  @Post('/sendMsg')
  async sendMsg(@Body() sendMsg: SendMessageDto, @Headers() headers) {
    console.log('--- send message ', sendMsg);
    if (
      !headers['x-api-secret'] ||
      headers['x-api-secret'] !== process.env.ENDPOINT_SECRET
    ) {
      throw new UnauthorizedException();
    }
    await this.telegramService.sendMsg(
      sendMsg.userId,
      sendMsg.session,
      sendMsg.chatId,
      sendMsg.messages,
    );
    return { success: true };
  }
}
