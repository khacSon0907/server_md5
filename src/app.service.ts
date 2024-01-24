import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return ' Không gì là không thể (trích) <abatanbinh>';
  }
}
