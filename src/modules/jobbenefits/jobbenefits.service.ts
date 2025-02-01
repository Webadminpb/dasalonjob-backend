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
    const jobBenefits = await this.prismaService.jobBenefits.create({
      data: {
        benefits: body.benefits,
        userId: user.id,
      },
    });
    return new ApiSuccessResponse(true, 'Job benefits added', jobBenefits);
  }

  async findMyJobBenefits(user: Auth) {
    const jobBenefits = await this.prismaService.jobBenefits.findUnique({
      where: { userId: user.id },
    });
    if (!jobBenefits) {
      throw new NotFoundException('Job benefits not found');
    }
    return new ApiSuccessResponse(true, 'Job benefits found', jobBenefits);
  }

  async update(user: Auth, body: UpdateJobBenefitsDto) {
    const existingJobBenefits = await this.prismaService.jobBenefits.findUnique(
      {
        where: { userId: user.id },
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

  async remove(user: Auth) {
    const existingJobBenefits = await this.prismaService.jobBenefits.findUnique(
      {
        where: { userId: user.id },
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
