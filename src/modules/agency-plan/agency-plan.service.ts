import { Injectable, NotFoundException } from '@nestjs/common';
import { Auth } from '@prisma/client';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAgencyPlanDto } from './dto/create-agency-plan.dto';
import { UpdateAgencyPlanDto } from './dto/update-agency-plan.dto';

@Injectable()
export class AgencyPlanService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreateAgencyPlanDto, user: Auth) {
    const agencyPlan = await this.prismaService.agencyPlan.create({
      data: {
        userId: user.id,
        plan: body.plan,
      },
    });
    return new ApiSuccessResponse(true, 'Agency plan created', agencyPlan);
  }

  async findMyAgencyPlans(user: Auth) {
    const agencyPlans = await this.prismaService.agencyPlan.findMany({
      where: { userId: user.id },
    });
    if (!agencyPlans.length) {
      throw new NotFoundException('Agency plans not found');
    }
    return new ApiSuccessResponse(true, 'Agency plans found', agencyPlans);
  }

  async update(body: UpdateAgencyPlanDto, user: Auth) {
    const existingPlan = await this.prismaService.agencyPlan.findUnique({
      where: { userId: user.id },
    });
    if (!existingPlan) {
      throw new NotFoundException('Agency plan not found');
    }
    const updatedPlan = await this.prismaService.agencyPlan.update({
      where: { id: existingPlan.id },
      data: { ...body },
    });
    return new ApiSuccessResponse(true, 'Agency plan updated', updatedPlan);
  }

  async remove(user: Auth) {
    const existingPlan = await this.prismaService.agencyPlan.findUnique({
      where: { userId: user.id },
    });
    if (!existingPlan) {
      throw new NotFoundException('Agency plan not found');
    }
    await this.prismaService.agencyPlan.delete({
      where: { id: existingPlan.id },
    });
    return new ApiSuccessResponse(true, 'Agency plan deleted', null);
  }
}
