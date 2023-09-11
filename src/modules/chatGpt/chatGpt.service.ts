import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  ChatGptChatArgs,
  ChatGptMessage,
  TChatGptChatSuccessResponse,
} from './chatGpt.type';

@Injectable()
export class ChatGptService {
  private axiosInstance: AxiosInstance;
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.CHATGPT_LAMBDA_ENDPOINT,
    });
    this.axiosInstance.defaults.headers.common['x-api-key'] =
      process.env.CHATGPT_LAMBDA_API_KEY;
  }

  async getList() {
    const res = await this.axiosInstance.get('/list');
    return res.data;
  }

  async chat(
    userId: string,
    session: string,
    chatId: number,
    model: string,
    messages: ChatGptMessage[],
  ) {
    console.log('---- chat');
    const res = await this.axiosInstance.post<
      ChatGptChatArgs,
      AxiosResponse<TChatGptChatSuccessResponse>
    >('/chat', JSON.stringify({ userId, session, chatId, model, messages }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  }
}
