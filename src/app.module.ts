import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { AwsPinpointModule } from './modules/2FA/2fa.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/dasalonjob'),
    AuthModule,
    AwsPinpointModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
