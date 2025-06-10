import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrUpdateUserNotificationSetting } from './dto/create-user-notification-setting.dto';
import { Auth } from '@prisma/client';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';

@Injectable()
export class UserNotificationSettingService {
  constructor(private readonly prisma: PrismaService) {}

  async addOrUpdateNotificationSetting(
    body: CreateOrUpdateUserNotificationSetting,
    user: Auth,
  ) {
    const isExist = await this.prisma.userNotificationSetting.findUnique({
      where: { userId: user.id },
    });
    if (isExist) {
      const updatedSetting = await this.prisma.userNotificationSetting.update({
        where: {
          userId: user.id,
        },
        data: {
          ...body,
        },
      });

      return new ApiSuccessResponse(
        true,
        'Notification Settings Updated...',
        updatedSetting,
      );
    } else {
      const newSetting = await this.prisma.userNotificationSetting.create({
        data: {
          userId: user.id,
          ...body,
        },
      });

      return new ApiSuccessResponse(
        true,
        'Notification Setting Created Successfully',
        newSetting,
      );
    }
  }

  async getNotificationSettings(user: Auth) {
    const settings = await this.prisma.userNotificationSetting.findUnique({
      where: {
        userId: user.id,
      },
    });
    if (!settings)
      throw new NotFoundException('Notification Setting Not Found');

    return new ApiSuccessResponse(true, 'User Notification Settings', settings);
  }
}
