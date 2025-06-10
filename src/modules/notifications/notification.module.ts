import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationListener } from './notification.listener';
import { NotificationGateway } from './notification.gateway';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [
    NotificationService,
    NotificationListener,
    NotificationGateway,
    PrismaService,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
