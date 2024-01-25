import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return ' test lai thui chai zo len anh ba';
  }
}
