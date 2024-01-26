import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return ' anh ba test lai roi nua nek';
  }
}
