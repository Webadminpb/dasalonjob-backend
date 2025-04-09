import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreatePlanDto, QueryPlanDto, UpdatePlanDto } from './dto/plan.dto';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { Prisma } from '@prisma/client';
import { getPaginationSkip, getPaginationTake } from 'src/common/utils/common';

@Injectable()
export class PlanService {
  constructor(private readonly prismaService: PrismaService) {}

  async createSubscriptionPlan(dto: CreatePlanDto) {
    const { name, currency, price, durationInDays, isActive } = dto;
    const newPlan = await this.prismaService.subscriptionPlan.create({
      data: {
        name,
        currency,
        price,
        durationInDays,
        isActive,
      },
    });
    return new ApiSuccessResponse(
      true,
      'Subscription Plan Created Successfully',
      newPlan,
    );
  }

  async getAllSubscriptionPlans(dto: QueryPlanDto) {
    const where: Prisma.SubscriptionPlanWhereInput = {};
    if (dto.isActive != undefined) {
      if (dto.isActive === true) {
        where.isActive = dto.isActive;
      } else if (dto.isActive === false) {
        where.isActive = dto.isActive;
      }
    }
    if (dto.search) {
      where.name = dto.search;
    }

    const [plans, total] = await Promise.all([
      this.prismaService.subscriptionPlan.findMany({
        where,
        skip: getPaginationSkip(dto.page, dto.limit),
        take: getPaginationTake(dto.limit),
      }),
      this.prismaService.subscriptionPlan.count({}),
    ]);

    return new ApiSuccessResponse(true, 'Get All Subscriptions Plan', {
      plans,
      total,
    });
  }

  async getSubscriptionPlan(id: string) {
    const existingPlan = await this.prismaService.subscriptionPlan.findUnique({
      where: {
        id,
      },
    });

    if (!existingPlan) {
      throw new NotFoundException('Plans Not Found');
    }

    return new ApiSuccessResponse(
      true,
      'Subscription Plan Fetched Successfully',
      existingPlan,
    );
  }

  async updateSubscriptionPlan(id: string, dto: UpdatePlanDto) {
    const existingPlan = await this.prismaService.subscriptionPlan.findUnique({
      where: {
        id,
      },
    });
    if (!existingPlan) {
      throw new NotFoundException('Plans Not Found');
    }
    const updatePlan = await this.prismaService.subscriptionPlan.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });
    return new ApiSuccessResponse(
      true,
      'Subscription Plan Updated Successfully',
      updatePlan,
    );
  }

  async deleteSubscriptionPlan(id: string) {
    const existingPlan = await this.prismaService.subscriptionPlan.findUnique({
      where: {
        id,
      },
    });
    if (!existingPlan) {
      throw new NotFoundException('Plans Not Found');
    }
    await this.prismaService.subscriptionPlan.delete({
      where: {
        id,
      },
    });
    return new ApiSuccessResponse(
      true,
      'Subscription Plan Deleted Successfully',
      null,
    );
  }
}
