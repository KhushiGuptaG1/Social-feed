import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { ReportsRepository } from './reports.repository';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { FeedsModule } from '../feeds/feeds.module';

@Module({
  imports: [TypeOrmModule.forFeature([Report]), FeedsModule],
  providers: [ReportsService, ReportsRepository],
  controllers: [ReportsController],
})
export class ReportsModule {}