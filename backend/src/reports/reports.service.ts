import { Injectable, BadRequestException } from '@nestjs/common';
import { ReportsRepository } from './reports.repository';
import { Report } from './report.entity';
import { FeedsService } from '../feeds/feeds.service';

@Injectable()
export class ReportsService {
  constructor(
    private repo: ReportsRepository,
    private feedsService: FeedsService,
  ) {}

  /**
   * Creates a report if not already reported.
   * @param report Report data.
   * @returns Created report.
   */
  async create(report: Partial<Report>): Promise<Report> {
    const existing = await this.repo.findByFeedAndUser(report.feed.id, report.user.id);
    if (existing) throw new BadRequestException('Already reported');
    const created = await this.repo.create(report);
    await this.feedsService.incrementReportCount(report.feed.id);
    return created;
  }
}