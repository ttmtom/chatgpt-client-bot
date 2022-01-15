import { Injectable } from '@nestjs/common';
import { PingRes } from './responseType/pingRes';

@Injectable()
export class AppService {
  sayHello(): PingRes {
    return {
      message: 'Hello World!',
    };
  }
}
