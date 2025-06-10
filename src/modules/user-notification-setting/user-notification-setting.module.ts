import { Module } from '@nestjs/common';
import { UserNotificationSettingService } from './user-notification-setting.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserNotificationSettingController } from './user-notification-setting.controller';

@Module({
  imports: [],
  providers: [UserNotificationSettingService, PrismaService, JwtService],
  controllers: [UserNotificationSettingController],
  exports: [],
})
export class UserNotificationSettingModule {}
