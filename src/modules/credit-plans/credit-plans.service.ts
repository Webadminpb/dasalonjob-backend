import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCreditPlanDto } from './dto/create-credit-plan.dto';
import { UpdateCreditPlanDto } from './dto/update-credit-plan.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { QueryCreditPlanbDto } from './dto/query-credit-plan.dto';
import { Prisma } from '@prisma/client';
import { getPaginationSkip, getPaginationTake } from 'src/common/utils/common';

@Injectable()
export class CreditPlansService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(body: CreateCreditPlanDto) {
    return new ApiSuccessResponse(
      true,
      'Credit Plan Created',
      await this.prismaService.creditPlan.create({
        data: {
          ...body,
        },
      }),
    );
  }

  async findAll(query: QueryCreditPlanbDto) {
    const where: Prisma.CreditPlanWhereInput = {};
    const [creditPlans, total] = await Promise.all([
      this.prismaService.creditPlan.findMany({
        where,
        skip: getPaginationSkip(query.page, query.limit),
        take: getPaginationTake(query.limit),
      }),
      this.prismaService.creditPlan.count({
        where,
      }),
    ]);
    return new ApiSuccessResponse(true, 'Data', { creditPlans, total });
  }

  async findOne(id: string) {
    const plan = await this.prismaService.creditPlan.findUnique({
      where: {
        id,
      },
    });
    if (!plan) {
      throw new NotFoundException('Credit Plan Not Found');
    }
    return new ApiSuccessResponse(true, 'Credit Plan Data', plan);
  }

  async update(id: string, body: UpdateCreditPlanDto) {
    const existingPlan = await this.prismaService.creditPlan.findUnique({
      where: {
        id,
      },
    });
    if (!existingPlan) {
      throw new NotFoundException('Credit Plan Not Found');
    }
    const updateCreditPlan = await this.prismaService.creditPlan.update({
      where: {
        id,
      },
      data: {
        ...body,
      },
    });
    return new ApiSuccessResponse(true, 'Update Credit Plan', updateCreditPlan);
  }

  async remove(id: string) {
    const existingPlan = await this.prismaService.creditPlan.findUnique({
      where: {
        id,
      },
    });
    if (!existingPlan) {
      throw new NotFoundException('Credit Plan Not Found');
    }
    await this.prismaService.creditPlan.delete({
      where: {
        id,
      },
    });
    return new ApiSuccessResponse(true, 'Delete Credit Plan', null);
  }
}
