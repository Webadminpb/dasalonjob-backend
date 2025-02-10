import { Injectable, NotFoundException } from '@nestjs/common';
import { Auth } from '@prisma/client';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { CreateAgencyDetailsDto } from './dto/create-agency-details.dto';
import { UpdateAgencyDetailsDto } from './dto/update-agency-details.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class AgencyDetailsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreateAgencyDetailsDto, user: Auth) {
    const agencyDetails = await this.prismaService.agencyDetails.create({
      data: {
        businessName: body.businessName,
        ownerName: body.ownerName,
        email: body.email,
        phoneCode: body.phoneCode,
        phoneNumber: body.phoneNumber,
        fileId: body.fileId,
        userId: user.id,
      },
    });
    return new ApiSuccessResponse(true, 'Agency details added', agencyDetails);
  }

  async findMyAgencyDetails(user: Auth) {
    const agencyDetails = await this.prismaService.agencyDetails.findUnique({
      where: { userId: user.id },
      include: {
        file: true,
      },
    });
    if (!agencyDetails) {
      throw new NotFoundException('Agency details not found');
    }
    return new ApiSuccessResponse(true, 'Agency details found', agencyDetails);
  }

  async update(user: Auth, body: UpdateAgencyDetailsDto) {
    const existingAgencyDetails =
      await this.prismaService.agencyDetails.findUnique({
        where: { userId: user.id },
      });
    if (!existingAgencyDetails) {
      throw new NotFoundException('Agency details not found');
    }
    const updatedAgencyDetails = await this.prismaService.agencyDetails.update({
      where: { id: existingAgencyDetails.id },
      data: {
        ...body,
      },
    });
    return new ApiSuccessResponse(
      true,
      'Agency details updated',
      updatedAgencyDetails,
    );
  }

  async remove(user: Auth) {
    const existingAgencyDetails =
      await this.prismaService.agencyDetails.findUnique({
        where: { userId: user.id },
      });
    if (!existingAgencyDetails) {
      throw new NotFoundException('Agency details not found');
    }
    await this.prismaService.agencyDetails.delete({
      where: { id: existingAgencyDetails.id },
    });
    return new ApiSuccessResponse(true, 'Agency details deleted', null);
  }
}
