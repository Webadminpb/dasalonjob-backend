import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  CreatePaymentDto,
  QueryPaymentDto,
  UpdatePaymentDto,
} from './dto/payment.dto';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { Prisma } from '@prisma/client';
import { getPaginationSkip, getPaginationTake } from 'src/common/utils/common';

@Injectable()
export class PaymentHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async createPayment(dto: CreatePaymentDto) {
    const {
      amount,
      currency,
      subscriptionId,
      paymentStatus,
      paymentMethod,
      userId,
    } = dto;

    const payment = await this.prisma.subscriptionPaymentHistory.create({
      data: {
        amount,
        currency,
        subscriptionId,
        paymentMethod,
        paymentStatus,
        userId,
      },
    });

    return new ApiSuccessResponse(true, 'Payment Created', payment);
  }

  async getAllPayments(query: QueryPaymentDto) {
    const where: Prisma.SubscriptionPaymentHistoryWhereInput = {};
    if (query.userId) {
      where.userId = query.userId;
    }

    const [payments, total] = await Promise.all([
      this.prisma.subscriptionPaymentHistory.findMany({
        where,
        skip: getPaginationSkip(query.page, query.limit),
        take: getPaginationTake(query.limit),
      }),
      this.prisma.subscriptionPaymentHistory.count({ where }),
    ]);

    return new ApiSuccessResponse(true, 'Payments fetched successfully', {
      payments,
      total,
    });
  }

  async getPayment(id: string) {
    const payment = await this.prisma.subscriptionPaymentHistory.findUnique({
      where: { id },
    });
    if (!payment) throw new NotFoundException('Payment not found');

    return new ApiSuccessResponse(true, 'Payment fetched', payment);
  }

  async updatePayment(id: string, dto: UpdatePaymentDto) {
    const existing = await this.prisma.subscriptionPaymentHistory.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('Payment not found');

    const updated = await this.prisma.subscriptionPaymentHistory.update({
      where: { id },
      data: dto,
    });

    return new ApiSuccessResponse(true, 'Payment updated', updated);
  }

  async deletePayment(id: string) {
    const existing = await this.prisma.subscriptionPaymentHistory.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('Payment not found');

    await this.prisma.subscriptionPaymentHistory.delete({ where: { id } });
    return new ApiSuccessResponse(true, 'Payment deleted', null);
  }
}
