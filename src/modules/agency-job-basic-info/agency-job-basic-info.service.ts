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
          deadline: new Date(body.deadline).toISOString(),
        },
      });

    if (body.partnerIds && body.partnerIds.length > 0) {
      await this.prismaService.agencyJobPartner.createMany({
        data: body.partnerIds.map((partnerId) => ({
          agencyJobId: agencyJobBasicInfo.id,
          partnerId,
        })),
      });
    }
    return new ApiSuccessResponse(
      true,
      'Agency job basic info added',
      agencyJobBasicInfo,
    );
  }

  async findMyAgencyJobBasicInfo(user: Auth) {
    const agencyJobBasicInfo =
      await this.prismaService.agencyJobBasicInfo.findUnique({
        where: { userId: user.id },
        include: {
          partners: true,
        },
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
        include: { partners: true },
      },
    );

    if (!existingInfo) {
      throw new NotFoundException('Agency job basic info not found');
    }

    // Create update data object
    const updateData: any = {};

    // Handle basic fields
    if (body.title !== undefined) updateData.title = body.title;
    if (body.profile !== undefined) updateData.profile = body.profile;
    if (body.jobType !== undefined) updateData.jobType = body.jobType;
    if (body.totalOpening !== undefined)
      updateData.totalOpening = body.totalOpening;
    if (body.gender !== undefined) updateData.gender = body.gender;
    if (body.salaryRange !== undefined)
      updateData.salaryRange = body.salaryRange;
    if (body.deadline !== undefined) updateData.deadline = body.deadline;

    // Handle partners relationship correctly
    if (body.partnerIds !== undefined) {
      updateData.partners = {
        deleteMany: {}, // First remove all existing partners
        create: body.partnerIds.map((partnerId) => ({
          partnerId: partnerId,
        })),
      };
    }

    // Update the record
    const updatedInfo = await this.prismaService.agencyJobBasicInfo.update({
      where: { id: existingInfo.id },
      data: updateData,
      include: { partners: true }, // Include partners in response
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
    await this.prismaService.agencyJobPartner.deleteMany({
      where: { agencyJobId: existingInfo.id },
    });

    await this.prismaService.agencyJobBasicInfo.delete({
      where: { id: existingInfo.id },
    });
    return new ApiSuccessResponse(true, 'Agency job basic info deleted', null);
  }
}
