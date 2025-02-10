import { Injectable, NotFoundException } from '@nestjs/common';
import { Auth } from '@prisma/client';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAgencyJobBenefitsDto } from './dto/create-agency-job-benefit.dto';
import { UpdateAgencyJobBenefitsDto } from './dto/update-agency-job-benefit.dto';

@Injectable()
export class AgencyJobBenefitsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreateAgencyJobBenefitsDto, user: Auth) {
    const agencyJobBenefits = await this.prismaService.agencyJobBenefits.create(
      {
        data: {
          userId: user.id,
          benefits: body.benefits,
        },
      },
    );
    return new ApiSuccessResponse(
      true,
      'Agency job benefits added',
      agencyJobBenefits,
    );
  }

  async findMyAgencyJobBenefits(user: Auth) {
    const agencyJobBenefits =
      await this.prismaService.agencyJobBenefits.findMany({
        where: { userId: user.id },
      });
    if (!agencyJobBenefits.length) {
      throw new NotFoundException('Agency job benefits not found');
    }
    return new ApiSuccessResponse(
      true,
      'Agency job benefits found',
      agencyJobBenefits,
    );
  }

  async update(user: Auth, body: UpdateAgencyJobBenefitsDto) {
    const existingBenefits =
      await this.prismaService.agencyJobBenefits.findUnique({
        where: { userId: user.id },
      });
    if (!existingBenefits) {
      throw new NotFoundException('Agency job benefits not found');
    }
    const updatedBenefits = await this.prismaService.agencyJobBenefits.update({
      where: { id: existingBenefits.id },
      data: { ...body },
    });
    return new ApiSuccessResponse(
      true,
      'Agency job benefits updated',
      updatedBenefits,
    );
  }

  async remove(user: Auth) {
    const existingBenefits =
      await this.prismaService.agencyJobBenefits.findUnique({
        where: { userId: user.id },
      });
    if (!existingBenefits) {
      throw new NotFoundException('Agency job benefits not found');
    }
    await this.prismaService.agencyJobBenefits.delete({
      where: { id: existingBenefits.id },
    });
    return new ApiSuccessResponse(true, 'Agency job benefits deleted', null);
  }
}
