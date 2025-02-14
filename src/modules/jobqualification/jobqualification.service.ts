import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Auth } from '@prisma/client';
import { CreateJobQualificationDto } from './dto/create-jobqualification.dto';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { UpdateJobQualificationDto } from './dto/update-jobqualification.dto';

@Injectable()
export class JobQualificationService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreateJobQualificationDto, user: Auth) {
    const jobQualification = await this.prismaService.jobQualification.create({
      data: {
        certification: body.certification,
        isProfessional: body.isProfessional,
        education: body.education,
        minExperience: body.minExperience,
        userId: user.id,
      },
    });
    return new ApiSuccessResponse(
      true,
      'Job qualification added',
      jobQualification,
    );
  }

  async findMyJobQualification(user: Auth) {
    const jobQualification = await this.prismaService.jobQualification.findMany(
      {
        where: { userId: user.id },
      },
    );
    if (!jobQualification) {
      throw new NotFoundException('Job qualification not found');
    }
    return new ApiSuccessResponse(true, 'Job qualification found', {
      jobQualification,
    });
  }

  async update(id: string, user: Auth, body: UpdateJobQualificationDto) {
    const existingJobQualification =
      await this.prismaService.jobQualification.findUnique({
        where: { userId: user.id, id },
      });
    if (!existingJobQualification) {
      throw new NotFoundException('Job qualification not found');
    }
    const updatedJobQualification =
      await this.prismaService.jobQualification.update({
        where: { id: existingJobQualification.id },
        data: {
          ...body,
        },
      });
    return new ApiSuccessResponse(
      true,
      'Job qualification updated',
      updatedJobQualification,
    );
  }

  async remove(id: string, user: Auth) {
    const existingJobQualification =
      await this.prismaService.jobQualification.findUnique({
        where: { userId: user.id, id },
      });
    if (!existingJobQualification) {
      throw new NotFoundException('Job qualification not found');
    }
    await this.prismaService.jobQualification.delete({
      where: { id: existingJobQualification.id },
    });
    return new ApiSuccessResponse(true, 'Job qualification deleted', null);
  }
}
