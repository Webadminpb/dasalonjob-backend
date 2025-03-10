import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { Auth } from '@prisma/client';
import { CreatePartnerPersonalDataDto } from './dto/create-partner-personal-datum.dto';
import { UpdatePartnerPersonalDataDto } from './dto/update-partner-personal-datum.dto';

@Injectable()
export class PartnerPersonalDataService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreatePartnerPersonalDataDto, user: Auth) {
    const partnerPersonalData =
      await this.prismaService.partnerPersonalData.create({
        data: {
          userId: user.id,
          firstName: body.firstName,
          lastName: body.lastName,
          dob: body.dob,
          gender: body.gender,
        },
      });
    return new ApiSuccessResponse(
      true,
      'PartnerPersonalData created successfully',
      partnerPersonalData,
    );
  }

  async findAll(user: Auth) {
    const partnerPersonalData =
      await this.prismaService.partnerPersonalData.findMany({
        where: {
          userId: user.id,
        },
      });
    if (!partnerPersonalData) {
      throw new BadRequestException('No partner personal data found');
    }
    return new ApiSuccessResponse(true, 'Partner personal data found', {
      partnerPersonalData,
    });
  }

  async findOne(id: string) {
    const partnerPersonalData =
      await this.prismaService.partnerPersonalData.findUnique({
        where: {
          id: id,
        },
      });
    if (!partnerPersonalData) {
      throw new BadRequestException('Partner personal data not found');
    }
    return new ApiSuccessResponse(
      true,
      'Partner personal data found',
      partnerPersonalData,
    );
  }
  async findMy(user: Auth) {
    const partnerPersonalData =
      await this.prismaService.partnerPersonalData.findUnique({
        where: {
          userId: user.id,
        },
      });
    if (!partnerPersonalData) {
      throw new BadRequestException('Partner personal data not found');
    }
    return new ApiSuccessResponse(
      true,
      'Partner personal data found',
      partnerPersonalData,
    );
  }

  async update(id: string, body: UpdatePartnerPersonalDataDto, user: Auth) {
    const existingPartnerPersonalData =
      await this.prismaService.partnerPersonalData.findUnique({
        where: {
          id: id,
        },
      });
    if (!existingPartnerPersonalData) {
      throw new BadRequestException('Partner personal data not found');
    }
    const partnerPersonalData =
      await this.prismaService.partnerPersonalData.update({
        where: {
          id: id,
        },
        data: {
          userId: user.id,
          firstName: body.firstName,
          lastName: body.lastName,
          dob: body.dob,
          gender: body.gender,
        },
      });
    return new ApiSuccessResponse(
      true,
      'Partner personal data updated successfully',
      partnerPersonalData,
    );
  }

  async remove(id: string, user: Auth) {
    const existingPartnerPersonalData =
      await this.prismaService.partnerPersonalData.findUnique({
        where: {
          id: id,
          userId: user.id,
        },
      });
    if (!existingPartnerPersonalData) {
      throw new BadRequestException('Partner personal data not found');
    }
    const partnerPersonalData =
      await this.prismaService.partnerPersonalData.delete({
        where: {
          id: id,
        },
      });
    return new ApiSuccessResponse(
      true,
      'Partner personal data deleted successfully',
      partnerPersonalData,
    );
  }
}
