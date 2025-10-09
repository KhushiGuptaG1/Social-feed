import { Injectable } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { Comment } from './comment.entity';

@Injectable()
export class CommentsService {
  constructor(private repo: CommentsRepository) {}

  /**
   * Creates a comment.
   * @param comment Comment data.
   * @returns Created comment.
   */
  async create(comment: Partial<Comment>): Promise<Comment> {
    return this.repo.create(comment);
  }

  /**
   * Gets comments for a feed.
   * @param feedId Feed ID.
   * @returns Comments.
   */
  async getCommentsForFeed(feedId: number): Promise<Comment[]> {
    return this.repo.findByFeed(feedId);
  }
}