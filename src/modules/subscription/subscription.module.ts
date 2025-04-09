import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { PlanController } from './plans/plan.controller';
import { PlanService } from './plans/plan.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { PaymentController } from './payments/payment.controller';
import { PaymentService } from './payments/payment.service';

@Module({
  controllers: [SubscriptionController, PlanController, PaymentController],
  providers: [
    SubscriptionService,
    PlanService,
    PrismaService,
    JwtService,
    PaymentService,
  ],
})
export class SubscriptionModule {}
