import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Feed } from '../feeds/feed.entity';
import { User } from '../users/users.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Feed)
  feed: Feed;

  @ManyToOne(() => User)
  user: User;

  @Column('text')
  text: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}