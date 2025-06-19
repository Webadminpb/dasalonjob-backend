import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WsDispatcher } from './dispatcher/ws.dispatcher';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prismaService: PrismaService,
    private wsDispatcher: WsDispatcher,
  ) {}

  async handleNotification(payload: any) {
    if (payload?.isBroadCast) {
      // if (setting?.isSystemApp) {
      //   return;
      // }
      const settings =
        await this.prismaService.userNotificationSetting.findMany({
          where: {
            OR: [
              {
                isSystemApp: true,
              },
              {
                isEmail: true,
              },
              {
                isWhatsApp: true,
              },
              {
                isSMS: true,
              },
            ],
          },
          select: {
            userId: true,
            isSystemApp: true,
            isEmail: true,
            isWhatsApp: true,
            isSMS: true,
          },
        });

      await Promise.all(
        settings.map(async (setting) => {
          const userPayload = { ...payload, userId: setting.userId };
          // await this.prismaService.notification.create({
          //   data: userPayload,
          // });

          if (setting.isSystemApp) {
            await this.wsDispatcher.dispatch(userPayload);
          }
        }),
      );
      return;

      // if (setting?.isEmail) {
      //   return;
      // }

      // if (setting?.isWhatsApp) {
      //   return;
      // }

      // if (setting?.isSMS) {
      //   return;
      // }
    } else {
      const setting =
        await this.prismaService.userNotificationSetting.findUnique({
          where: { userId: payload.userId },
        });

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
}
