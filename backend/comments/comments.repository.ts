import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';

@Injectable()
export class CommentsRepository {
  constructor(@InjectRepository(Comment) private repo: Repository<Comment>) {}

  async create(comment: Partial<Comment>): Promise<Comment> {
    return this.repo.save(comment);
  }

  async findByFeed(feedId: number): Promise<Comment[]> {
    return this.repo.find({
      where: { feed: { id: feedId } },
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }
}