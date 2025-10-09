import { Controller, Post, Get, Body, UseGuards, Req, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { FeedsService } from './feeds.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('feeds')
export class FeedsController {
  constructor(private service: FeedsService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 4 }]))
  async create(
    @Req() req,
    @Body() body: { text: string },
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    return this.service.create(
      { user: { id: req.user.userId } as any, text: body.text },
      files.images,
    );
  }

  @Get()
  async list(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.service.getFeeds(page, limit);
  }
}