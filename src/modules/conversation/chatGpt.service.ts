import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
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
}
