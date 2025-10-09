import 'dotenv/config';
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { LogsService } from "./logs/logs.service";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors({ origin: process.env.CORS_ORIGIN || '*' });
  app.useStaticAssets(join(process.cwd(), "uploads"), {
    prefix: "/uploads",
  });

  const config = new DocumentBuilder()
    .setTitle("Social Feed API")
    .setDescription("API for social feed module")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document);

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
