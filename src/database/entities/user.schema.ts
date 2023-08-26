import { Column, Entity, Index, ObjectIdColumn } from 'typeorm';
import * as uuid from 'uuid';

@Entity('user')
export class User {
  @ObjectIdColumn()
  id: string;

  @Column()
  @Index()
  userId: string;

  @Column()
  sessions: string[];

  @Column()
  createdAt: Date;

  @Column()
  session: string;

  @Column()
  model: string;

  constructor(userId: string) {
    this.id = uuid.v4().toString();
    this.userId = userId;
    this.createdAt = new Date();
    this.session = 'default';
    this.sessions = ['default'];
    this.model = 'gpt-4';
  }
}
