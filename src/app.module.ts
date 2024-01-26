import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrimsaModule } from './modules/primsa/primsa.module';
import { AuthenModule } from './modules/authen/authen.module';

@Module({
  imports: [PrimsaModule, AuthenModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
