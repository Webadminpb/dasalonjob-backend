import { Injectable, NotFoundException } from '@nestjs/common';
import { Auth, JobType, Gender } from '@prisma/client';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateAgencyJobBasicInfoDto } from './dto/create-agency-job-basic-info.dto';
import { UpdateAgencyJobBasicInfoDto } from './dto/update-agency-job-basic-info.dto';

@Injectable()
export class AgencyJobBasicInfoService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreateAgencyJobBasicInfoDto, user: Auth) {
    const agencyJobBasicInfo =
      await this.prismaService.agencyJobBasicInfo.create({
        data: {
          userId: user.id,
          title: body.title,
          profile: body.profile,
          jobType: body.jobType,
          totalOpening: body.totalOpening,
          gender: body.gender,
          salaryRange: body.salaryRange,
          deadline: body.deadline,
        },
      });
    return new ApiSuccessResponse(
      true,
      'Agency job basic info added',
      agencyJobBasicInfo,
    );
  }

  async findMyAgencyJobBasicInfo(user: Auth) {
    const agencyJobBasicInfo =
      await this.prismaService.agencyJobBasicInfo.findMany({
        where: { userId: user.id },
      });
    if (!agencyJobBasicInfo) {
      throw new NotFoundException('Agency job basic info not found');
    }
    return new ApiSuccessResponse(
      true,
      'Agency job basic info found',
      agencyJobBasicInfo,
    );
  }

  async update(user: Auth, body: UpdateAgencyJobBasicInfoDto) {
    const existingInfo = await this.prismaService.agencyJobBasicInfo.findUnique(
      {
        where: { userId: user.id },
      },
    );
    if (!existingInfo) {
      throw new NotFoundException('Agency job basic info not found');
    }
    const updatedInfo = await this.prismaService.agencyJobBasicInfo.update({
      where: { id: existingInfo.id },
      data: { ...body },
    });
    return new ApiSuccessResponse(
      true,
      'Agency job basic info updated',
      updatedInfo,
    );
  }

  async remove(user: Auth) {
    const existingInfo = await this.prismaService.agencyJobBasicInfo.findUnique(
      {
        where: { userId: user.id },
      },
    );
    if (!existingInfo) {
      throw new NotFoundException('Agency job basic info not found');
    }
    await this.prismaService.agencyJobBasicInfo.delete({
      where: { id: existingInfo.id },
    });
    return new ApiSuccessResponse(true, 'Agency job basic info deleted', null);
  }
}
