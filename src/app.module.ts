import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrimsaModule } from './modules/primsa/primsa.module';
import { AuthenModule } from './modules/authen/authen.module';
import { SendMailModule } from './modules/send-mail/send-mail.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot() , PrimsaModule, AuthenModule, SendMailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
