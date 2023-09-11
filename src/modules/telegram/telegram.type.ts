import { ChatGptChatResponse } from '../chatGpt/chatGpt.type';

export type SendMessageDto = {
  chatId: number;
  userId: string;
  session: string;
  messages: ChatGptChatResponse;
};
