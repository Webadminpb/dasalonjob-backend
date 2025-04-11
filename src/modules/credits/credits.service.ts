import { Injectable } from '@nestjs/common';
import { CreditType } from '@prisma/client';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSpendCreditDto } from './dto/create-credit.dto';
import { getPaginationSkip } from 'src/common/utils/common';

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

  async getUserCreditsSummary(userId: string) {
    const purchases = await this.prisma.creditPurchase.aggregate({
      where: { userId },
      _sum: {
        jobCredits: true,
        courseCredits: true,
      },
    });

    const totalPurchasedCredits =
      (purchases._sum.jobCredits || 0) + (purchases._sum.courseCredits || 0);

    const spendings = await this.prisma.creditSpending.aggregate({
      where: { userId },
      _sum: {
        creditSpent: true,
      },
    });

    const totalSpentCredits = spendings._sum.creditSpent || 0;
    const remainingCredits = totalPurchasedCredits - totalSpentCredits;

    return {
      totalPurchasedCredits,
      totalSpentCredits,
      remainingCredits,
    };
  }

  async getWalletTransactions(
    userId: string,
    page = 1,
    limit = 10,
    search?: string,
    dateRange?: string,
  ) {
    const skip = getPaginationSkip(page, limit);
    const dateFilter = this.#getDateFilter(dateRange);

    const commonWhere = {
      userId,
      ...(dateFilter && {
        createdAt: {
          gte: dateFilter.$gte.toISOString(),
          lt: dateFilter.$lt.toISOString(),
        },
      }),
    };

    const [purchases, spendings] = await Promise.all([
      this.prisma.creditPurchase.findMany({
        where: commonWhere,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          jobCredits: true,
          courseCredits: true,
          amountPaid: true,
          createdAt: true,
        },
      }),
      this.prisma.creditSpending.findMany({
        where: commonWhere,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          creditType: true,
          creditSpent: true,
          jobApplicantionId: true,
          courseApplicationId: true,
          createdAt: true,
        },
      }),
    ]);

    const purchasesMapped = purchases.map((purchase) => ({
      type: 'PURCHASE',
      credit: purchase.jobCredits + purchase.courseCredits,
      jobCredits: purchase.jobCredits,
      courseCredits: purchase.courseCredits,
      amount: purchase.amountPaid,
      createdAt: purchase.createdAt,
    }));

    const spendingsMapped = spendings.map((spending) => ({
      type: 'SPENDING',
      creditType: spending.creditType,
      creditSpent: spending.creditSpent,
      appliedTo:
        spending.jobApplicantionId || spending.courseApplicationId || null,
      createdAt: spending.createdAt,
    }));

    const transactions = [...purchasesMapped, ...spendingsMapped].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return new ApiSuccessResponse(true, 'Paginated Wallet Transactions', {
      transactions,
      page,
      limit,
      total: transactions.length,
    });
  }

  #getDateFilter(range?: string): { $gte?: Date; $lt?: Date } | null {
    if (!range) return null;

    const now = new Date();
    const start = new Date(now);
    const end = new Date(now);

    switch (range) {
      case 'this_week':
        start.setDate(now.getDate() - now.getDay());
        start.setHours(0, 0, 0, 0);
        end.setDate(start.getDate() + 7);
        break;

      case 'last_week':
        start.setDate(now.getDate() - now.getDay() - 7);
        start.setHours(0, 0, 0, 0);
        end.setDate(start.getDate() + 7);
        break;

      case 'this_month':
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(start.getMonth() + 1);
        end.setDate(1);
        break;

      case 'last_month':
        start.setMonth(start.getMonth() - 1);
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(start.getMonth() + 1);
        end.setDate(1);
        break;

      default:
        return null;
    }
    return { $gte: start, $lt: end };
  }
}
