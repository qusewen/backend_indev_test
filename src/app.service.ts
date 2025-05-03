import {ApiTags} from "@nestjs/swagger";

import { Injectable } from '@nestjs/common';
@Injectable()
export class AppService {
  getHello(): string {
    return 'Тестовое задание: https://github.com/qusewen/frontend-test'
  }
}
