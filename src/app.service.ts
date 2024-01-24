import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'My name Is Anh Ba Hóc Môn';
  }
}
