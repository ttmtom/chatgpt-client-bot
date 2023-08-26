import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../database/entities';
import { HistoryModule } from '../history/history.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), HistoryModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
