import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { FeedsModule } from '../feeds/feeds.module';
import { CommentsModule } from '../comments/comments.module';
import { ReportsModule } from '../reports/reports.module';
import { LogsModule } from '../logs/logs.module';
import { AllExceptionsFilter } from '../common/filters/all-exceptions.filter';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password', // Change this
      database: 'social_feed',
      autoLoadEntities: true,
      synchronize: true, // Dev only
    }),
    MongooseModule.forRoot('mongodb://localhost/error_logs'),
    CacheModule.register({
      isGlobal: true,
      store: redisStore as any,
      host: 'localhost',
      port: 6379,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    UsersModule,
    FeedsModule,
    CommentsModule,
    ReportsModule,
    LogsModule,
  ],
  providers: [AllExceptionsFilter],
})
export class AppModule { }