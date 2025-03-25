import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
          dob: new Date(body.dob).toISOString(),
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
          dob: new Date(body.dob).toISOString(),
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

  async getBusinessDetailsByPartnerId(partnerId: string) {
    const partnerBusinessData = await this.prismaService.auth.findUnique({
      where: { id: partnerId },
      include: {
        partnerSocialLinks: true,
        partnerPersonalData: true,
      },
    });
    if (!partnerBusinessData) {
      throw new NotFoundException('BusinessData Not Found');
    }
  }

  async getPartnerDetailsByPartnerId(partnerId: string) {
    const partnerBusinessData = await this.prismaService.auth.findUnique({
      where: { id: partnerId },
      include: {
        partnerPersonalData: true,
      },
    });
    if (!partnerBusinessData) {
      throw new NotFoundException('BusinessData Not Found');
    }
    return new ApiSuccessResponse(
      true,
      'partner profile data',
      partnerBusinessData,
    );
  }

  async getPartnerVenuesByPartnerId(partnerId: string) {
    const partnerVenuesData = await this.prismaService.partnerVenue.findMany({
      where: { userId: partnerId },
    });
    if (!partnerVenuesData) {
      throw new NotFoundException('Venues Not Found');
    }
    return new ApiSuccessResponse(true, 'partner Venues data', {
      partnerVenuesData,
    });
  }

  async getPartnerJobsByPartnerId(partnerId: string) {
    const partnerJobsData = await this.prismaService.jobPost.findMany({
      where: { userId: partnerId },
    });
    if (!partnerJobsData) {
      throw new NotFoundException('Jobs Data Not Found');
    }
    return new ApiSuccessResponse(true, 'partner Jobs data', {
      partnerJobsData,
    });
  }

  async getPartnerCoursesByPartnerId(partnerId: string) {
    const partnerCoursesData = await this.prismaService.partnerCourse.findMany({
      where: { userId: partnerId },
    });
    if (!partnerCoursesData) {
      throw new NotFoundException('BusinessData Not Found');
    }
    return new ApiSuccessResponse(true, 'partner profile data', {
      partnerCoursesData,
    });
  }
}
