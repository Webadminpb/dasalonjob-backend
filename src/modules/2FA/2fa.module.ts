import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {SnsServiceForSingapore } from './services/otp.sg.service';
import { EmailService } from './services/email.service';
import { OtpController } from './controllers/otp.controller';
import { SnsServiceForIndia } from './services/otp.in.service';
@Module({
  imports: [ConfigModule],
  providers: [
    SnsServiceForSingapore,
    EmailService,
    SnsServiceForIndia
  ],
  controllers: [OtpController],
    exports: [SnsServiceForSingapore,EmailService,SnsServiceForIndia],
    })
export class AwsPinpointModule {}
