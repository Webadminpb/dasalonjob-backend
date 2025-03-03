import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePartnerVenueDto } from './dto/create-partner-venue.dto';
import { UpdatePartnerVenueDto } from './dto/update-partner-venue.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { Auth, Prisma } from '@prisma/client';
import { Query } from 'mongoose';
import { QueryPartnerVenueDto } from './dto/query-partner-venue.dto';
import { getPaginationSkip, getPaginationTake } from 'src/common/common';
import { addDays } from 'date-fns';

@Injectable()
export class PartnerVenueService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreatePartnerVenueDto) {
    const partnerVenue = await this.prismaService.partnerVenue.create({
      data: {
        venueBasicDetailsId: body.venueBasicDetailsId,
        salonBasicDetailsId: body.salonBasicDetailsId,
        venueAmenityIds: body.venueAmenityIds,
        venueWorkStationId: body.venueWorkStationId,
        userId: body.userId,
      },
    });
    return new ApiSuccessResponse(
      true,
      'Partner Venue created successfully',
      partnerVenue,
    );
  }

  async findAll(user: Auth, query: QueryPartnerVenueDto) {
    const where: Prisma.PartnerVenueWhereInput = {
      userId: user.id,
    };
    if (query.search) {
      where.venueBasicDetails = {
        OR: [
          {
            name: {
              contains: query.search,
              mode: 'insensitive',
            },
          },
        ],
      };
    }

    if (query.date) {
      const year = query.date;
      where.createdAt = {
        gte: new Date(`${year}-01-01T00:00:00.000Z`),
        lte: new Date(`${year}-12-31T23:59:59.999Z`),
      };
    }

    if (query.gender) {
      where.venueBasicDetails = {
        gender: query.gender,
      };
    }

    const partnerVenues = await this.prismaService.partnerVenue.findMany({
      where: { userId: user.id },
      include: {
        venueBasicDetails: true,
        salonBasicDetails: true,
        venueAmenities: true,
        venueWorkStation: true,
        user: true,
      },
      skip: getPaginationSkip(query.page, query.limit),
      take: getPaginationTake(query.limit),
    });

    if (!partnerVenues) {
      throw new BadRequestException('No Partner Venues found');
    }
    return new ApiSuccessResponse(true, 'Partner Venues found', {
      partnerVenues,
    });
  }

  async findOne(id: string) {
    const partnerVenue = await this.prismaService.partnerVenue.findUnique({
      where: {
        id: id,
      },
      include: {
        venueBasicDetails: true,
        salonBasicDetails: true,
        venueAmenities: true,
        venueWorkStation: true,
        user: true,
      },
    });
    if (!partnerVenue) {
      throw new BadRequestException('Partner Venue not found');
    }
    return new ApiSuccessResponse(true, 'Partner Venue found', partnerVenue);
  }

  async update(id: string, body: UpdatePartnerVenueDto, user: Auth) {
    const existingPartnerVenue =
      await this.prismaService.partnerVenue.findUnique({
        where: {
          id: id,
          userId: user.id,
        },
      });
    if (!existingPartnerVenue) {
      throw new BadRequestException('Partner Venue not found');
    }
    const partnerVenue = await this.prismaService.partnerVenue.update({
      where: {
        id: id,
      },
      data: {
        venueBasicDetailsId: body.venueBasicDetailsId,
        salonBasicDetailsId: body.salonBasicDetailsId,
        venueAmenityIds: body.venueAmenityIds,
        venueWorkStationId: body.venueWorkStationId,
        userId: body.userId,
      },
    });
    return new ApiSuccessResponse(
      true,
      'Partner Venue updated successfully',
      partnerVenue,
    );
  }

  async remove(id: string, user: Auth) {
    const existingPartnerVenue =
      await this.prismaService.partnerVenue.findUnique({
        where: {
          id: id,
          userId: user.id,
        },
      });
    if (!existingPartnerVenue) {
      throw new BadRequestException('Partner Venue not found');
    }
    const partnerVenue = await this.prismaService.partnerVenue.delete({
      where: {
        id: id,
      },
    });
    return new ApiSuccessResponse(
      true,
      'Partner Venue deleted successfully',
      partnerVenue,
    );
  }

  async dashboardTotal(user: Auth) {
    const [totalJobs, totalCourses] = await Promise.all([
      this.prismaService.jobPost.count({ where: { userId: user.id } }),
      this.prismaService.partnerCourse.count({ where: { userId: user.id } }),
    ]);
    return new ApiSuccessResponse(true, 'total', { totalJobs, totalCourses });
  }

  async jobApplicationTotal(user: Auth) {
    const [applied, shortlisted, rejected, accepted] = await Promise.all([
      this.prismaService.jobApplication.count({
        where: { userId: user.id, status: 'Applied' },
      }),
      this.prismaService.jobApplication.count({
        where: { userId: user.id, status: 'Shortlisted' },
      }),
      this.prismaService.jobApplication.count({
        where: { userId: user.id, status: 'Rejected' },
      }),
      this.prismaService.jobApplication.count({
        where: { userId: user.id, status: 'Accepted' },
      }),
    ]);
    return new ApiSuccessResponse(true, 'total', {
      applied,
      shortlisted,
      rejected,
      accepted,
    });
  }
}
