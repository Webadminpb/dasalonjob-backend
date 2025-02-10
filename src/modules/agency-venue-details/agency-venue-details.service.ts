import { Injectable, NotFoundException } from '@nestjs/common';
import { Auth } from '@prisma/client';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateAgencyVenueDetailsDto } from './dto/create-agency-venue-detail.dto';
import { UpdateAgencyVenueDetailsDto } from './dto/update-agency-venue-detail.dto';

@Injectable()
export class AgencyVenueDetailsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreateAgencyVenueDetailsDto, user: Auth) {
    const agencyVenueDetails =
      await this.prismaService.agencyVenueDetails.create({
        data: {
          userId: user.id,
          email: body.email,
          firstName: body.firstName,
          lastName: body.lastName,
          gender: body.gender,
          jobRole: body.jobRole,
          phoneCode: body.phoneCode,
          phoneNumber: body.phoneNumber,
          fileId: body.fileId,
        },
      });
    return new ApiSuccessResponse(
      true,
      'Agency venue details added',
      agencyVenueDetails,
    );
  }

  async findMyAgencyVenueDetails(user: Auth) {
    const agencyVenueDetails =
      await this.prismaService.agencyVenueDetails.findMany({
        where: { userId: user.id },
        include: { file: true },
      });
    if (!agencyVenueDetails) {
      throw new NotFoundException('Agency venue details not found');
    }
    return new ApiSuccessResponse(
      true,
      'Agency venue details found',
      agencyVenueDetails,
    );
  }

  async update(user: Auth, id: string, body: UpdateAgencyVenueDetailsDto) {
    const existingDetails =
      await this.prismaService.agencyVenueDetails.findUnique({
        where: { userId: user.id, id },
      });
    if (!existingDetails) {
      throw new NotFoundException('Agency venue details not found');
    }
    const updatedDetails = await this.prismaService.agencyVenueDetails.update({
      where: { id: existingDetails.id },
      data: { ...body },
    });
    return new ApiSuccessResponse(
      true,
      'Agency venue details updated',
      updatedDetails,
    );
  }

  async remove(user: Auth, id: string) {
    const existingDetails =
      await this.prismaService.agencyVenueDetails.findUnique({
        where: { userId: user.id, id },
      });

    if (!existingDetails) {
      throw new NotFoundException('Agency venue details not found');
    }
    await this.prismaService.agencyVenueDetails.delete({
      where: { id: existingDetails.id },
    });
    return new ApiSuccessResponse(true, 'Agency venue details deleted', null);
  }
}
