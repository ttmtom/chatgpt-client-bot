import { Injectable } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { History } from '../../database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatGptMessage } from '../chatGpt/chatGpt.type';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private readonly historyRepository: MongoRepository<History>,
  ) {}

  async getHistory(userId: string, session: string) {
    return await this.historyRepository.findOne({
      where: {
        userId,
        session,
      },
    });
  }

  async updateHistoryResponse(history: History, userMsgs: ChatGptMessage[]) {
    const now = new Date();
    history.histories.push(
      ...userMsgs.map((msg) => ({
        ...msg,
        timestamp: now,
      })),
    );
    await this.historyRepository.save(history);
  }

  async createHistory(userId: string, sessionName: string) {
    const history = await this.getHistory(userId, sessionName);
    if (history) return history;

    const newHistory = new History(userId, sessionName);

    return await this.historyRepository.save(newHistory);
  }

  async clearHistories(userId: string, sessionName: string) {
    const history = await this.historyRepository.findOne({
      where: {
        userId,
        session: sessionName,
      },
    });

    if (!history) return;

    history.histories = [];
    await this.historyRepository.save(history);
  }

  async deleteHistory(userId: string, session: string) {
    const history = await this.getHistory(userId, session);
    if (!history) return;

    await this.historyRepository.remove(history);
  }

  async setSystemPrompt(userId: string, sessionName: string, prompt: string) {
    const history = await this.historyRepository.findOne({
      where: {
        userId,
        session: sessionName,
      },
    });

    if (!history) return;
    history.histories.push({
      role: 'system',
      content: prompt,
      timestamp: new Date(),
    });
    await this.historyRepository.save(history);
  }
}
