import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feed } from './feed.entity';
import { FeedsRepository } from './feeds.repository';
import { FeedsService } from './feeds.service';
import { FeedsController } from './feeds.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Feed]), CloudinaryModule],
  providers: [FeedsService, FeedsRepository],
  controllers: [FeedsController],
  exports: [FeedsService],
})
export class FeedsModule {}