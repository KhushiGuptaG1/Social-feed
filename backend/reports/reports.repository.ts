import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';

@Injectable()
export class ReportsRepository {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  async create(report: Partial<Report>): Promise<Report> {
    return this.repo.save(report);
  }

  async findByFeedAndUser(feedId: number, userId: number): Promise<Report> {
    return this.repo.findOne({
      where: { feed: { id: feedId }, user: { id: userId } },
    });
  }
}