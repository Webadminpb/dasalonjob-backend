import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Auth } from '@prisma/client';
import { CreateJobBenefitsDto } from './dto/create-jobbenefit.dto';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { UpdateJobBenefitsDto } from './dto/update-jobbenefit.dto';

@Injectable()
export class JobBenefitsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreateJobBenefitsDto, user: Auth) {
    if (user.role == 'ADMIN' || user.role || 'SUPER_ADMIN') {
      const jobBenefits = await this.prismaService.jobBenefits.create({
        data: {
          benefits: body.benefits,
          userId: body.userId,
        },
      });
      return new ApiSuccessResponse(true, 'Job benefits added', jobBenefits);
    }
    const jobBenefits = await this.prismaService.jobBenefits.create({
      data: {
        benefits: body.benefits,
        userId: user.id,
      },
    });
    return new ApiSuccessResponse(true, 'Job benefits added', jobBenefits);
  }

  async findMyJobBenefits(user: Auth) {
    const jobBenefits = await this.prismaService.jobBenefits.findMany({
      where: { userId: user.id },
    });
    if (!jobBenefits) {
      throw new NotFoundException('Job benefits not found');
    }
    return new ApiSuccessResponse(true, 'Job benefits found', { jobBenefits });
  }

  async update(id: string, user: Auth, body: UpdateJobBenefitsDto) {
    const existingJobBenefits = await this.prismaService.jobBenefits.findUnique(
      {
        where: { id },
      },
    );
    if (!existingJobBenefits) {
      throw new NotFoundException('Job benefits not found');
    }
    const updatedJobBenefits = await this.prismaService.jobBenefits.update({
      where: { id: existingJobBenefits.id },
      data: {
        benefits: body.benefits,
      },
    });
    return new ApiSuccessResponse(
      true,
      'Job benefits updated',
      updatedJobBenefits,
    );
  }

  async remove(id: string, user: Auth) {
    const existingJobBenefits = await this.prismaService.jobBenefits.findUnique(
      {
        where: { id },
      },
    );
    if (!existingJobBenefits) {
      throw new NotFoundException('Job benefits not found');
    }
    await this.prismaService.jobBenefits.delete({
      where: { id: existingJobBenefits.id },
    });
    return new ApiSuccessResponse(true, 'Job benefits deleted', null);
  }
}
