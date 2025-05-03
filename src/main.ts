import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import 'dotenv/config';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
      .setTitle('API документация')
      .setDescription('Описание API для выполнения тестовго задания')
      .setVersion('1.0')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, document);

  app.use(cookieParser())
  app.enableCors({
    origin: '*',
    credentials: true
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
