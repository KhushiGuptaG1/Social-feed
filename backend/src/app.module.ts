import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MongooseModule } from "@nestjs/mongoose";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { FeedsModule } from "./feeds/feeds.module";
import { CommentsModule } from "./comments/comments.module";
import { ReportsModule } from "./reports/reports.module";
import { LogsModule } from "./logs/logs.module";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
import cloudinaryConfig from "./config/cloudinary.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [cloudinaryConfig],
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "password", // Change this
      database: "social_feed",
      autoLoadEntities: true,
      synchronize: true, // Dev only
    }),

    CacheModule.register({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    FeedsModule,
    CommentsModule,
    ReportsModule,
  ],
  providers: [AllExceptionsFilter],
})
export class AppModule {}
