import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';
import { Feed } from '../feeds/feed.entity';
import { User } from '../users/users.entity';

@Unique(['feed', 'user'])
@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Feed)
  feed: Feed;

  @ManyToOne(() => User)
  user: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}