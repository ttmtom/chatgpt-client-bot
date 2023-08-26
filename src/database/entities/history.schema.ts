import { Column, Entity, Index, ObjectIdColumn } from 'typeorm';

@Entity('history')
export class History {
  @ObjectIdColumn()
  id: string;

  @Index()
  @Column()
  userId: string;

  @Index()
  @Column()
  session: string;

  @Column()
  histories: {
    role: string;
    content: string;
    timestamp: Date;
  }[];

  @Column()
  createdAt: Date;

  constructor(userId: string, session: string) {
    this.id = `${userId}-${session}`;
    this.userId = userId;
    this.session = session;
    this.histories = [];
    this.createdAt = new Date();
  }
}
