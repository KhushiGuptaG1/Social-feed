import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { ReportsService } from './reports.service';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private service: ReportsService) {}

  @Post()
  async create(@Req() req, @Body() body: { feedId: number }) {
    return this.service.create({ feed: { id: body.feedId } as any, user: { id: req.user.userId } as any });
  }
}