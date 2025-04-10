import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';

import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { getPaginationSkip, getPaginationTake } from 'src/common/utils/common';
import { Prisma } from '@prisma/client';
import {
  CreateSubscriptionDto,
  QuerySubscriptionDto,
  UpdateSubscriptionDto,
} from './dto/subscription.dto';
import { PaymentHistoryService } from './payment-history/payment-history.service';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async createSubscription(dto: CreateSubscriptionDto) {
    const { userId, planId, startDate, endDate } = dto;

    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });
    if (!plan) throw new NotFoundException('Subscription Plan not found');

    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate
      ? new Date(endDate)
      : new Date(
          new Date(start).setDate(start.getDate() + plan.durationInDays),
        );

    const subscription = await this.prisma.subscription.create({
      data: {
        userId,
        planId,
        startDate: new Date(start).toISOString(),
        endDate: new Date(end).toISOString(),
      },
    });

    return new ApiSuccessResponse(
      true,
      'Subscription Created Successfully',
      subscription,
    );
  }

  async getAllSubscriptions(dto: QuerySubscriptionDto) {
    const where: Prisma.SubscriptionWhereInput = {
      ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      ...(dto.userId && { userId: dto.userId }),
      ...(dto.agencyId && { agencyId: dto.agencyId }),
    };

    const [subscriptions, total] = await Promise.all([
      this.prisma.subscription.findMany({
        where,
        skip: getPaginationSkip(dto.page, dto.limit),
        take: getPaginationTake(dto.limit),
        include: {
          plan: true,
        },
      }),
      this.prisma.subscription.count({ where }),
    ]);

    return new ApiSuccessResponse(true, 'All Subscriptions Fetched', {
      subscriptions,
      total,
    });
  }

  async getSubscription(id: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
      include: { plan: true },
    });

    if (!subscription) throw new NotFoundException('Subscription not found');

    return new ApiSuccessResponse(true, 'Subscription Fetched', subscription);
  }

  async updateSubscription(id: string, dto: UpdateSubscriptionDto) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
    });
    if (!subscription) throw new NotFoundException('Subscription not found');

    const updated = await this.prisma.subscription.update({
      where: { id },
      data: dto,
    });

    return new ApiSuccessResponse(true, 'Subscription Updated', updated);
  }

  async deleteSubscription(id: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
    });
    if (!subscription) throw new NotFoundException('Subscription not found');

    await this.prisma.subscription.delete({ where: { id } });

    return new ApiSuccessResponse(true, 'Subscription Deleted', null);
  }
}
