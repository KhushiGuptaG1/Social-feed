import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { FeedsRepository } from './feeds.repository';
import { Feed } from './feed.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class FeedsService {
  constructor(
    private repo: FeedsRepository,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) { }

  /**
   * Creates a feed.
   * @param feed Feed data.
   * @param images Image URLs.
   * @returns Created feed.
   */
  async create(feed: Partial<Feed>, images: string[]): Promise<Feed> {
    feed.images = images;
    const created = await this.repo.create(feed);
    // Invalidate cache for page 1
    await this.cache.del('feeds_1_10');
    return created;
  }

  /**
   * Gets paginated feeds.
   * @param page Page number.
   * @param limit Limit per page.
   * @returns Feeds.
   */
  async getFeeds(page: number, limit: number = 10): Promise<Feed[]> {
    const cacheKey = `feeds_${page}_${limit}`;
    let feeds = await this.cache.get<Feed[]>(cacheKey);
    if (!feeds) {
      feeds = await this.repo.findAll(page, limit);
      await this.cache.set(cacheKey, feeds, 60); // TTL 60s
    }
    return feeds;
  }

  /**
   * Increments report count for a feed.
   * @param feedId Feed ID.
   */
  async incrementReportCount(feedId: number) {
    const feed = await this.repo.findOne(feedId);
    if (!feed) throw new BadRequestException('Feed not found');
    feed.uniqueReportsCount += 1;
    await this.repo.update(feedId, { uniqueReportsCount: feed.uniqueReportsCount });
  }
}