import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrimsaModule } from './modules/primsa/primsa.module';
import { AuthenModule } from './modules/authen/authen.module';
import { SendMailModule } from './modules/send-mail/send-mail.module';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { CartModule } from './modules/cart/cart.module';
import { ReceiptsModule } from './modules/receipts/receipts.module';

@Module({
  imports: [ConfigModule.forRoot() , PrimsaModule, AuthenModule, SendMailModule, CategoriesModule, ProductsModule, CartModule, ReceiptsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
