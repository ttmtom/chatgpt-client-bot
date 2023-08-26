import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  ChatGptChatArgs,
  ChatGptChatResponse,
  ChatGptMessage,
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

  async chat(model: string, messages: ChatGptMessage[]) {
    const res = await this.axiosInstance.post<
      ChatGptChatArgs,
      AxiosResponse<ChatGptChatResponse>
    >('/chat', JSON.stringify({ model, messages }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  }
}
