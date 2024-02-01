import { Global, Module } from '@nestjs/common';
import { SendMailService } from './send-mail.service';

@Global()
@Module({
  providers: [SendMailService],
  exports:[SendMailService]
})
export class SendMailModule {}
