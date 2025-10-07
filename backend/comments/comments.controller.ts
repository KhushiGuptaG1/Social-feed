import { Controller, Post, Get, Body, UseGuards, Req, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { CommentsService } from './comments.service';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private service: CommentsService) {}

  @Post()
  async create(@Req() req, @Body() body: { feedId: number; text: string }) {
    return this.service.create({ feed: { id: body.feedId } as any, user: { id: req.user.userId } as any, text: body.text });
  }

  @Get(':feedId')
  async getForFeed(@Param('feedId') feedId: number) {
    return this.service.getCommentsForFeed(feedId);
  }
}