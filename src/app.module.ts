import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { BasicdetailsModule } from './modules/basicdetails/basicdetails.module';

@Module({
  imports: [AuthModule, BasicdetailsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
