import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return ' update prismaclient nhé anh ba ';
  }
}
