import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Auth } from '@prisma/client';
import { CreateJobBasicInfoDto } from './dto/create-jobbasicinfo.dto';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { UpdateJobBasicInfoDto } from './dto/update-jobbasicinfo.dto';

@Injectable()
export class JobBasicInfoService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreateJobBasicInfoDto, user: Auth) {
    const jobBasicInfo = await this.prismaService.jobBasicInfo.create({
      data: {
        title: body.title,
        profile: body.profile,
        jobType: body.jobType,
        totalOpening: body.totalOpening,
        gender: body.gender,
        salaryRange: body.salaryRange,
        deadline: body.deadline,
        userId: user.id,
      },
    });
    return new ApiSuccessResponse(true, 'Job basic info added', jobBasicInfo);
  }

  async findMyJobBasicInfo(user: Auth) {
    const jobBasicInfo = await this.prismaService.jobBasicInfo.findUnique({
      where: { userId: user.id },
    });
    if (!jobBasicInfo) {
      throw new NotFoundException('Job basic info not found');
    }
    return new ApiSuccessResponse(true, 'Job basic info found', jobBasicInfo);
  }

  async update(user: Auth, body: UpdateJobBasicInfoDto) {
    const existingJobBasicInfo =
      await this.prismaService.jobBasicInfo.findUnique({
        where: { userId: user.id },
      });
    if (!existingJobBasicInfo) {
      throw new NotFoundException('Job basic info not found');
    }
    const updatedJobBasicInfo = await this.prismaService.jobBasicInfo.update({
      where: { id: existingJobBasicInfo.id },
      data: {
        ...body,
      },
    });
    return new ApiSuccessResponse(
      true,
      'Job basic info updated',
      updatedJobBasicInfo,
    );
  }

  async remove(user: Auth) {
    const existingJobBasicInfo =
      await this.prismaService.jobBasicInfo.findUnique({
        where: { userId: user.id },
      });
    if (!existingJobBasicInfo) {
      throw new NotFoundException('Job basic info not found');
    }
    await this.prismaService.jobBasicInfo.delete({
      where: { id: existingJobBasicInfo.id },
    });
    return new ApiSuccessResponse(true, 'Job basic info deleted', null);
  }
}
