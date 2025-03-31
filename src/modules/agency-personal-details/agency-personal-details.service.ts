import { Injectable, NotFoundException } from '@nestjs/common';
import { Auth } from '@prisma/client';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateAgencyPersonalDetailsDto } from './dto/create-agency-personal-detail.dto';
import { UpdateAgencyPersonalDetailsDto } from './dto/update-agency-personal-detail.dto';

@Injectable()
export class AgencyPersonalDetailsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreateAgencyPersonalDetailsDto, user: Auth) {
    const personalDetails =
      await this.prismaService.agencyPersonalDetails.create({
        data: {
          firstName: body.firstName,
          lastName: body.lastName,
          gender: body.gender,
          dob: new Date(body.dob).toISOString(),
          userId: user.id,
        },
      });
    return new ApiSuccessResponse(
      true,
      'Personal details added',
      personalDetails,
    );
  }

  async findMyDetails(user: Auth) {
    const personalDetails =
      await this.prismaService.agencyPersonalDetails.findUnique({
        where: { userId: user.id },
      });
    if (!personalDetails) {
      throw new NotFoundException('Personal details not found');
    }
    return new ApiSuccessResponse(
      true,
      'Personal details found',
      personalDetails,
    );
  }

  async findAgencyDetailsById(id: string) {
    const personalDetails =
      await this.prismaService.agencyPersonalDetails.findUnique({
        where: { id },
      });
    if (!personalDetails) {
      throw new NotFoundException('Personal details not found');
    }
    return new ApiSuccessResponse(
      true,
      'Personal details found',
      personalDetails,
    );
  }

  async update(user: Auth, body: UpdateAgencyPersonalDetailsDto) {
    const existingDetails =
      await this.prismaService.agencyPersonalDetails.findUnique({
        where: { userId: user.id },
      });
    if (!existingDetails) {
      throw new NotFoundException('Personal details not found');
    }

    const updatedDetails =
      await this.prismaService.agencyPersonalDetails.update({
        where: { id: existingDetails.id },
        data: {
          ...body,
          ...(body.dob && { dob: new Date(body.dob).toISOString() }),
        },
      });
    return new ApiSuccessResponse(
      true,
      'Personal details updated',
      updatedDetails,
    );
  }

  async remove(user: Auth) {
    const existingDetails =
      await this.prismaService.agencyPersonalDetails.findUnique({
        where: { userId: user.id },
      });
    if (!existingDetails) {
      throw new NotFoundException('Personal details not found');
    }
    await this.prismaService.agencyPersonalDetails.delete({
      where: { id: existingDetails.id },
    });
    return new ApiSuccessResponse(true, 'Personal details deleted', null);
  }
}
