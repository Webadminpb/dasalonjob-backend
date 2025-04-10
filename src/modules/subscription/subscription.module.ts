import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { PlanController } from './plans/plan.controller';
import { PlanService } from './plans/plan.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { PaymentController } from './payment-history/payment-history.controller';
import { PaymentHistoryService } from './payment-history/payment-history.service';

@Module({
  controllers: [SubscriptionController, PlanController, PaymentController],
  providers: [
    SubscriptionService,
    PlanService,
    PrismaService,
    JwtService,
    PaymentHistoryService,
  ],
})
export class SubscriptionModule {}
