import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private readonly prismaService: PrismaService) {}

  async handleNotification(payload: any) {
    const setting = await this.prismaService.userNotificationSetting.findUnique(
      {
        where: { userId: payload.userId },
      },
    );

    await this.prismaService.notification.create({
      data: {
        ...payload,
        userId: payload.userId,
      },
    });

    if (setting?.isSystemApp) {
      return;
    }

    if (setting?.isEmail) {
      return;
    }

    if (setting?.isWhatsApp) {
      return;
    }

    if (setting?.isSMS) {
      return;
    }
  }
}
