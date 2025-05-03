import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {ApiOperation, ApiTags} from "@nestjs/swagger";

@ApiTags('App - Тестовое задание')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Получение ссылки на тестовое задание' })
  getHello(): string {
    return this.appService.getHello();
  }
}
