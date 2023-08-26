import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { History } from '../../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([History])],
  providers: [HistoryService],
  exports: [HistoryService],
})
export class HistoryModule {}
