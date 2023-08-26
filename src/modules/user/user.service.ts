import { Injectable } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { User } from '../../database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoryService } from '../history/history.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
    private readonly historyService: HistoryService,
  ) {}

  async getUserById(userId: string) {
    return await this.userRepository.findOne({
      where: {
        userId: userId,
      },
    });
  }

  async userReg(userId: number) {
    if (!!(await this.getUserById(userId.toString()))) {
      throw new Error('already registered');
    }

    const newUser = new User(userId.toString());
    await this.userRepository.save(newUser);
    await this.historyService.createHistory(newUser.userId, 'default');

    return 'Registered';
  }

  async setSelectedModel(user: User, model: string) {
    user.model = model;
    await this.userRepository.save(user);
    return user.model;
  }

  async setSession(user: User, session: string) {
    const set = new Set<string>(user.sessions);
    if (!set.has(session)) {
      set.add(session);
      user.sessions = Array.from(set);
      await this.historyService.createHistory(user.userId, session);
    }
    user.session = session;

    await this.userRepository.save(user);
    return user.session;
  }

  async deleteSession(user: User, session: string) {
    await this.historyService.deleteHistory(user.userId, session);
    if (user.session === session) {
      user.session = 'default';
    }
    user.sessions = user.sessions.filter((name) => name !== session);
    await this.userRepository.save(user);
  }
}
