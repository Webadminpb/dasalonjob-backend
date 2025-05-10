import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAgencyDetailsDto } from '../agency-details/dto/create-agency-details.dto';
import { Auth } from '@prisma/client';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import {
  agencyContactDetailSchema,
  CreateAgencyContactDetailDto,
  UpdateAgencyContactDetailDto,
} from './dto/agency-contact-details.dto';

@Injectable()
export class AgencyContactDetailService {
  constructor(private readonly prismaService: PrismaService) {}

  async createAgencyContactDetails(
    body: CreateAgencyContactDetailDto,
    user: Auth,
  ) {
    const existingAgencyContactDetails =
      await this.prismaService.agencyContactDetails.findUnique({
        where: {
          userId: user.id,
        },
      });
    if (existingAgencyContactDetails)
      throw new BadRequestException('Agency Contact Details Already Existed');

    const newAgencyContactDetails =
      await this.prismaService.agencyContactDetails.create({
        data: {
          userId: user.id,
          ...body,
        },
      });

    return new ApiSuccessResponse(
      true,
      'Agency Contact Details Created',
      newAgencyContactDetails,
    );
  }

  async getAgencyContactDetails(user: Auth) {
    const agencyContactDetails =
      await this.prismaService.agencyContactDetails.findUnique({
        where: { userId: user.id },
      });

    if (!agencyContactDetails)
      throw new NotFoundException('Agency Contact Details Not Found');

    return new ApiSuccessResponse(
      true,
      'Agency Contact Details',
      agencyContactDetails,
    );
  }

  async updateAgencyContactDetails(
    body: UpdateAgencyContactDetailDto,
    user: Auth,
  ) {
    const existingAgencyContactDetails =
      await this.prismaService.agencyContactDetails.findUnique({
        where: {
          userId: user.id,
        },
      });
    if (!existingAgencyContactDetails)
      throw new NotFoundException('Agency Contact Details Not Found');

    const updateAgencyContactDetails =
      await this.prismaService.agencyContactDetails.update({
        where: { userId: user.id },
        data: {
          ...body,
        },
      });

    return new ApiSuccessResponse(
      true,
      'Update Agency Contact Details',
      updateAgencyContactDetails,
    );
  }
}
