import { Injectable } from '@nestjs/common';
import { NotificationGateway } from '../notification.gateway';

@Injectable()
export class WsDispatcher {
  constructor(private readonly wasGateway: NotificationGateway) {}

  async dispatch(payload: any) {
    this.wasGateway.sendToUser(payload.userId, payload);
  }
}
