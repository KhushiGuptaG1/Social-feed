import { Controller, Post, Get, Body, UseGuards, Req, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { FeedsService } from './feeds.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('feeds')
@UseGuards(JwtAuthGuard)
export class FeedsController {
  constructor(private service: FeedsService) { }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 4 }], {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async create(
    @Req() req,
    @Body() body: { text: string },
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    const images = files.images ? files.images.map((f) => `/uploads/${f.filename}`) : [];
    console.log('Uploaded files:', files.images?.length || 0);
    console.log('Images URLs:', images);
    return this.service.create({ user: { id: req.user.userId } as any, text: body.text }, images);
  }

  @Get()
  async list(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.service.getFeeds(page, limit);
  }
}