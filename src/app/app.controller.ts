import { Controller, Get, HttpCode } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PingRes } from './responseType/pingRes';

@ApiTags('Root')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/ping')
  @ApiOperation({ summary: 'Health check func' })
  @HttpCode(200)
  pingServer(): PingRes {
    return this.appService.sayHello();
  }
}
