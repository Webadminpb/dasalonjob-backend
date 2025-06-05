import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Auth } from '@prisma/client';
import { CreateJobBasicInfoDto } from './dto/create-job-basic-info.dto';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { UpdateJobBasicInfoDto } from './dto/update-job-basic-info.dto';

@Injectable()
export class JobBasicInfoService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreateJobBasicInfoDto, user: Auth) {
    if (
      user.role == 'ADMIN' ||
      user.role == 'SUPER_ADMIN' ||
      user.role == 'AGENCY'
    ) {
      const jobBasicInfo = await this.prismaService.jobBasicInfo.create({
        data: {
          title: body.title,
          venueId: body.venueId,
          profileId: body.profileId,
          jobType: body.jobType,
          totalOpening: body.totalOpening,
          gender: body.gender,
          start: body.start,
          end: body.end,
          deadline: new Date(body.deadline).toISOString(),
          userId: body.userId,
        },
      });
      return new ApiSuccessResponse(true, 'Job basic info added', jobBasicInfo);
    }
    const jobBasicInfo = await this.prismaService.jobBasicInfo.create({
      data: {
        title: body.title,
        venueId: body.venueId,
        profileId: body.profileId,
        jobType: body.jobType,
        totalOpening: body.totalOpening,
        gender: body.gender,
        start: body.start,
        end: body.end,
        deadline: new Date(body.deadline).toISOString(),
        userId: user.id,
      },
    });
    return new ApiSuccessResponse(true, 'Job basic info added', jobBasicInfo);
  }

  async findMyJobBasicInfo(user: Auth) {
    const jobBasicInfo = await this.prismaService.jobBasicInfo.findMany({
      where: { userId: user.id },
    });
    if (!jobBasicInfo) {
      throw new NotFoundException('Job basic info not found');
    }
    return new ApiSuccessResponse(true, 'Job basic info found', {
      jobBasicInfo,
    });
  }

  async update(id: string, user: Auth, body: UpdateJobBasicInfoDto) {
    const existingJobBasicInfo =
      await this.prismaService.jobBasicInfo.findUnique({
        where: { id },
      });
    if (!existingJobBasicInfo) {
      throw new NotFoundException('Job basic info not found');
    }
    const updatedJobBasicInfo = await this.prismaService.jobBasicInfo.update({
      where: { id: existingJobBasicInfo.id },
      data: {
        title: body.title,
        venueId: body.venueId,
        profileId: body.profileId,
        jobType: body.jobType,
        totalOpening: body.totalOpening,
        gender: body.gender,
        start: body.start,
        end: body.end,
        deadline: new Date(body.deadline).toISOString(),
      },
    });
    return new ApiSuccessResponse(
      true,
      'Job basic info updated',
      updatedJobBasicInfo,
    );
  }

  async remove(id: string, user: Auth) {
    const existingJobBasicInfo =
      await this.prismaService.jobBasicInfo.findUnique({
        where: { id },
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
