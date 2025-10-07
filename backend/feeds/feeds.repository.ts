import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Feed } from './feed.entity';

@Injectable()
export class FeedsRepository {
  constructor(@InjectRepository(Feed) private repo: Repository<Feed>) {}

  async create(feed: Partial<Feed>): Promise<Feed> {
    return this.repo.save(feed);
  }

  async findAll(page: number, limit: number): Promise<Feed[]> {
    return this.repo.find({
      where: { uniqueReportsCount: LessThan(3) },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['user'],
    });
  }

  async findOne(id: number): Promise<Feed> {
    return this.repo.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async update(id: number, update: Partial<Feed>): Promise<Feed> {
    await this.repo.update(id, update);
    return this.findOne(id);
  }
}