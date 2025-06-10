import { Injectable, OnModuleInit } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NOTIFICATION_EVENT } from './notification.event';

@Injectable()
export class NotificationListener implements OnModuleInit {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  onModuleInit() {
    this.eventEmitter.on(
      NOTIFICATION_EVENT ?? 'dnsjdnsjdnsj',
      async (payload: any) => {
        await this.notificationService.handleNotification(payload);
      },
    );
  }
}
