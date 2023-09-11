import { Injectable } from '@nestjs/common';
import { Command, On, Start, Update } from 'nestjs-telegraf';
import { Context, Telegram } from 'telegraf';
import { ChatGptService } from '../chatGpt/chatGpt.service';
import { Message as TGMessage } from 'telegraf/typings/core/types/typegram';
import { UserService } from '../user/user.service';
import { HistoryService } from '../history/history.service';
import { ChatGptChatResponse } from '../chatGpt/chatGpt.type';

@Update()
@Injectable()
export class TelegramService {
  private readonly bot: Telegram = new Telegram(process.env.TELEGRAM_BOT_TOKEN);
  constructor(
    private readonly chatGptService: ChatGptService,
    private readonly userService: UserService,
    private readonly historyService: HistoryService,
  ) {}

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply('Hi');
  }

  @Command('reg')
  async userRegister(ctx: Context) {
    if (ctx.from.is_bot) return 'is bot true, 88~';
    const text = (ctx.message as TGMessage.TextMessage)?.text ?? '';
    const [, secret] = text.split(' ');

    if (secret !== process.env.TELEGRAM_SECRET) return 'incorrect secret';

    const userId = ctx.from.id;
    try {
      return await this.userService.userReg(userId);
    } catch (err) {
      console.log('--- err', JSON.stringify(err, null, 2));
      return `error: ${err.message}`;
    }
  }

  @Command('list')
  async listHandler(ctx: Context) {
    const userTgId = String(ctx.from.id);
    const user = await this.userService.getUserById(userTgId);
    if (!user) {
      return 'Un-registered user';
    }

    const res = await this.chatGptService.getList();
    const text = (ctx.message as TGMessage.TextMessage)?.text ?? '';
    const [, model] = text.split(' ');
    if (!model) {
      return JSON.stringify(res, null, 2);
    }
    if (!res.includes(model)) {
      return `Invalid model ${model}`;
    }
    await this.userService.setSelectedModel(user, model);
    return `Using ${model}`;
  }

  @Command('system')
  async setupHandler(ctx: Context) {
    const userTgId = String(ctx.from.id);
    const user = await this.userService.getUserById(userTgId);
    if (!user) {
      return 'Un-registered user';
    }
    const text = (ctx.message as TGMessage.TextMessage)?.text ?? '';
    const [, ...prompt] = text.split(' ');
    await this.historyService.setSystemPrompt(
      user.userId,
      user.session,
      prompt.join(' '),
    );
    return `Role added`;
  }

  @Command(/session*/)
  async sessionHandler(ctx: Context) {
    const userTgId = String(ctx.from.id);
    const user = await this.userService.getUserById(userTgId);
    if (!user) {
      return 'Un-registered user';
    }
    const text = (ctx.message as TGMessage.TextMessage)?.text ?? '';
    const [command, session] = text.split(' ');
    switch (command) {
      case '/session': {
        const targetSession = session ?? 'default';
        await this.userService.setSession(user, targetSession);
        return `${targetSession} selected`;
      }
      case '/session_list': {
        return `current session: ${user.session} \n ${JSON.stringify(
          user.sessions,
          null,
          2,
        )}`;
      }
      case '/session_clear': {
        const targetSession = session ?? user.session;
        await this.historyService.clearHistories(user.userId, targetSession);
        return `${targetSession} cleared`;
      }
      case '/session_delete': {
        if (session === 'default') return "Can't delete default session";
        await this.userService.deleteSession(user, session);
        return `${session} deleted`;
      }
      default: {
        return "I don't understand english";
      }
    }
  }

  @On('message')
  async handleClientInput(ctx: Context) {
    const userTgId = String(ctx.from.id);
    const user = await this.userService.getUserById(userTgId);
    if (!user) {
      return 'Un-registered user';
    }
    const text = (ctx.message as TGMessage.TextMessage)?.text ?? '';

    const history = await this.historyService.getHistory(
      user.userId,
      user.session,
    );
    const histories = history.histories.map((history) => ({
      role: history.role,
      content: history.content,
    }));
    const usrMsg = {
      role: 'user',
      content: text,
    };

    histories.push(usrMsg);
    const res = await this.chatGptService.chat(
      user.userId,
      user.session,
      ctx.chat.id,
      user.model,
      histories,
    );
    await this.historyService.updateHistoryResponse(history, [usrMsg]);
    console.log(JSON.stringify(res));
    // res.forEach((message) => {
    //   ctx.reply(message.message.content);
    // });
    //
  }

  async sendMsg(
    userId: string,
    session: string,
    chatId: number,
    messages: ChatGptChatResponse,
  ) {
    const history = await this.historyService.getHistory(userId, session);
    const userMsgs = [];

    for (const msg of messages) {
      console.log('--- msg', JSON.stringify(msg));
      const { role, content } = msg.message;
      userMsgs.push({
        role,
        content,
      });
      await this.bot.sendMessage(chatId, content);
    }

    await this.historyService.updateHistoryResponse(history, userMsgs);
  }
}
