import { Injectable } from '@nestjs/common';
import { CreditType } from '@prisma/client';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSpendCreditDto } from './dto/create-credit.dto';

@Injectable()
export class CreditsService {
  constructor(private readonly prisma: PrismaService) {}

  async purchaseCreditPlan(userId: string, creditPlanId: string) {
    const creditPlan = await this.prisma.creditPlan.findUnique({
      where: { id: creditPlanId },
    });

    if (!creditPlan) throw new Error('Credit plan not found');

    const purchase = await this.prisma.creditPurchase.create({
      data: {
        userId,
        creditPlanId,
        jobCredits: creditPlan.totalJobs,
        courseCredits: creditPlan.totalCourses,
        amountPaid: creditPlan.price,
      },
    });

    await this.updateUserCredits(
      userId,
      {
        jobCredits: creditPlan.totalJobs,
        courseCredits: creditPlan.totalCourses,
      },
      'ADD',
    );

    return new ApiSuccessResponse(true, 'Credit plan purchased successfully', {
      purchaseId: purchase.id,
    });
  }

  private async updateUserCredits(
    userId: string,
    credits: { jobCredits?: number; courseCredits?: number },
    operation: 'ADD' | 'SUBTRACT',
  ) {
    const userCredit = await this.prisma.userCredit.upsert({
      where: { userId },
      create: {
        userId,
        totalJobCredits: credits.jobCredits || 0,
        totalCourseCredits: credits.courseCredits || 0,
        remainingJobCredits: credits.jobCredits || 0,
        remainingCourseCredits: credits.courseCredits || 0,
      },
      update: {
        totalJobCredits:
          operation === 'ADD'
            ? { increment: credits.jobCredits || 0 }
            : { decrement: credits.jobCredits || 0 },
        totalCourseCredits:
          operation === 'ADD'
            ? { increment: credits.courseCredits || 0 }
            : { decrement: credits.courseCredits || 0 },
        remainingJobCredits:
          operation === 'ADD'
            ? { increment: credits.jobCredits || 0 }
            : { decrement: credits.jobCredits || 0 },
        remainingCourseCredits:
          operation === 'ADD'
            ? { increment: credits.courseCredits || 0 }
            : { decrement: credits.courseCredits || 0 },
      },
    });

    return userCredit;
  }

  async checkCredits(
    userId: string,
    creditType: CreditType,
    amount: number = 1,
  ) {
    const userCredit = await this.prisma.userCredit.findUnique({
      where: { userId },
    });

    if (!userCredit) return false;

    if (creditType === 'JOB') {
      return userCredit.remainingJobCredits >= amount;
    } else {
      return userCredit.remainingCourseCredits >= amount;
    }
  }

  async spendCredits(userId: string, body: CreateSpendCreditDto) {
    const hasCredits = await this.checkCredits(userId, body.creditType);
    if (!hasCredits) throw new Error('Insufficient credits');

    const spending = await this.prisma.creditSpending.create({
      data: {
        userId,
        creditType: body.creditType,
        creditSpent: 1,
        ...body.applicationData,
      },
    });

    await this.updateUserCredits(
      userId,
      {
        jobCredits: body.creditType === 'JOB' ? 1 : 0,
        courseCredits: body.creditType === 'COURSE' ? 1 : 0,
      },
      'SUBTRACT',
    );

    return spending;
  }

  async getCreditBalance(userId: string) {
    return this.prisma.userCredit.findUnique({
      where: { userId },
      select: {
        totalJobCredits: true,
        totalCourseCredits: true,
        remainingJobCredits: true,
        remainingCourseCredits: true,
      },
    });
  }

  async getCreditHistory(userId: string) {
    const purchases = await this.prisma.creditPurchase.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const spendings = await this.prisma.creditSpending.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        jobApplication: {
          include: {
            jobPost: true,
          },
        },
        courseApplication: {
          include: {
            course: true,
          },
        },
      },
    });

    return new ApiSuccessResponse(true, 'purchases and spending', {
      purchases,
      spendings,
    });
  }
}
