import { Module } from '@nestjs/common';
import { ChatGptService } from './chatGpt.service';

@Module({
  imports: [],
  providers: [ChatGptService],
  exports: [ChatGptService],
})
export class ChatGptModule {}
