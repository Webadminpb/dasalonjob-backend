import { Injectable, NotFoundException } from '@nestjs/common';
import { Auth } from '@prisma/client';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateAgencyJobDescriptionDto } from './dto/create-agency-job-description.dto';
import { UpdateAgencyJobDescriptionDto } from './dto/update-agency-job-description.dto';

@Injectable()
export class AgencyJobDescriptionService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreateAgencyJobDescriptionDto, user: Auth) {
    const agencyJobDescription =
      await this.prismaService.agencyJobDescription.create({
        data: {
          userId: user.id,
          description: body.description,
        },
      });
    return new ApiSuccessResponse(
      true,
      'Agency job description added',
      agencyJobDescription,
    );
  }

  async findMyAgencyJobDescriptions(user: Auth) {
    const agencyJobDescriptions =
      await this.prismaService.agencyJobDescription.findMany({
        where: { userId: user.id },
      });
    if (!agencyJobDescriptions) {
      throw new NotFoundException('Agency job descriptions not found');
    }
    return new ApiSuccessResponse(
      true,
      'Agency job descriptions found',
      agencyJobDescriptions,
    );
  }

  async update(user: Auth, body: UpdateAgencyJobDescriptionDto) {
    const existingDescription =
      await this.prismaService.agencyJobDescription.findUnique({
        where: { userId: user.id },
      });
    if (!existingDescription) {
      throw new NotFoundException('Agency job description not found');
    }
    const updatedDescription =
      await this.prismaService.agencyJobDescription.update({
        where: { id: existingDescription.id },
        data: { ...body },
      });
    return new ApiSuccessResponse(
      true,
      'Agency job description updated',
      updatedDescription,
    );
  }

  async remove(user: Auth) {
    const existingDescription =
      await this.prismaService.agencyJobDescription.findUnique({
        where: { userId: user.id },
      });
    if (!existingDescription) {
      throw new NotFoundException('Agency job description not found');
    }
    await this.prismaService.agencyJobDescription.delete({
      where: { id: existingDescription.id },
    });
    return new ApiSuccessResponse(true, 'Agency job description deleted', null);
  }
}
