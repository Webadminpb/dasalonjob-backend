import { BadRequestException, Injectable } from '@nestjs/common';
import { Auth, Prisma } from '@prisma/client';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { getPaginationSkip, getPaginationTake } from 'src/common/utils/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePartnerVenueDto } from './dto/create-partner-venue.dto';
import { QueryPartnerVenueDto } from './dto/query-partner-venue.dto';
import { UpdatePartnerVenueDto } from './dto/update-partner-venue.dto';
import { endOfDay, startOfDay, subDays } from 'date-fns';

@Injectable()
export class PartnerVenueService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreatePartnerVenueDto, user: Auth) {
    const partnerVenue = await this.prismaService.partnerVenue.create({
      data: {
        venueBasicDetailsId: body.venueBasicDetailsId,
        salonBasicDetailsId: body.salonBasicDetailsId,
        venueAmenityIds: body.venueAmenityIds,
        venueMainBusinessDaysId: body.venueMainBusinessDaysId,
        venueWorkStationIds: body.venueWorkStationIds,
        userId: user.id,
      },
    });
    return new ApiSuccessResponse(
      true,
      'Partner Venue created successfully',
      partnerVenue,
    );
  }

  async findAll(user: Auth, query: QueryPartnerVenueDto) {
    const where: Prisma.PartnerVenueWhereInput = {};
    if (query.userId) {
      where.userId = query.userId;
    }
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
        gte: new Date(`${year}-01-01T00:00:00.000Z`).toISOString(),
        lte: new Date(`${year}-12-61T23:59:59.999Z`).toISOString(),
      };
    }

    if (query.gender) {
      where.venueBasicDetails = {
        gender: query.gender,
      };
    }

    const partnerVenues = await this.prismaService.partnerVenue.findMany({
      where,
      include: {
        venueBasicDetails: {
          include: {
            files: true,
          },
        },
        salonBasicDetails: true,
        venueAmenities: true,
        venueWorkStations: true,
        user: true,
        venueMainBusinessDays: true,
      },
      skip: getPaginationSkip(query.page, query.limit),
      take: getPaginationTake(query.limit),
    });
    console.log('partner veneues ', partnerVenues);

    if (!partnerVenues) {
      throw new BadRequestException('No Partner Venues found');
    }
    return new ApiSuccessResponse(true, 'Partner Venues found', {
      partnerVenues,
    });
  }

  async findAllForAdmin(query: QueryPartnerVenueDto) {
    const where: Prisma.PartnerVenueWhereInput = {};
    // if (query.userId) {
    //   where.userId = query.userId;
    // }
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
        gte: new Date(`${year}-01-01T00:00:00.000Z`).toISOString(),
        lte: new Date(`${year}-12-61T23:59:59.999Z`).toISOString(),
      };
    }

    if (query.gender) {
      where.venueBasicDetails = {
        gender: query.gender,
      };
    }

    const partnerVenues = await this.prismaService.partnerVenue.findMany({
      where,
      include: {
        venueBasicDetails: {
          include: {
            files: true,
          },
        },
        salonBasicDetails: true,
        venueAmenities: true,
        venueWorkStations: true,
        user: true,
        venueMainBusinessDays: true,
      },
      skip: getPaginationSkip(query.page, query.limit),
      take: getPaginationTake(query.limit),
    });
    console.log('partner veneues ', partnerVenues);

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
        venueBasicDetails: {
          include: {
            files: true,
          },
        },
        venueMainBusinessDays: true,
        salonBasicDetails: true,
        venueAmenities: true,
        venueWorkStations: true,
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
        ...body,
        userId: user.id,
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
    const [
      totalJobs = 0,
      totalCourses = 0,
      totalJobApplicants = 0,
      totalCourseApplicants = 0,
    ] = await Promise.all([
      this.prismaService.jobPost.count({ where: { userId: user.id } }),
      this.prismaService.partnerCourse.count({ where: { userId: user.id } }),
      this.prismaService.jobApplication.count({
        where: { jobPost: { userId: user.id } },
      }),
      this.prismaService.courseApplication.count({
        where: { course: { userId: user.id } },
      }),
    ]);
    return new ApiSuccessResponse(true, 'total', {
      totalJobs,
      totalCourses,
      totalJobApplicants,
      totalCourseApplicants,
    });
  }

  async adminDashboardTotal() {
    const todayStart = startOfDay(new Date()).toISOString();
    const todayEnd = endOfDay(new Date()).toISOString();

    const yesterdayStart = startOfDay(subDays(new Date(), 1)).toISOString();
    const yesterdayEnd = endOfDay(subDays(new Date(), 1)).toISOString();
    const [
      totalApplicantsToday = 0,
      totalApplicantsYesterday = 0,
      totalPartnersToday = 0,
      totalPartnersYesterday = 0,
      totalJobsToday = 0,
      totalJobsYesterday = 0,
      totalCoursesToday = 0,
      totalCoursesYesterday = 0,
    ] = await Promise.all([
      this.prismaService.auth.count({
        where: {
          role: 'USER',

          createdAt: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      }),
      this.prismaService.auth.count({
        where: {
          role: 'USER',

          createdAt: {
            gte: yesterdayStart,
            lte: yesterdayEnd,
          },
        },
      }),
      this.prismaService.auth.count({
        where: {
          role: 'PARTNER',
          createdAt: { gte: todayStart, lte: todayEnd },
        },
      }),
      this.prismaService.auth.count({
        where: {
          role: 'PARTNER',
          createdAt: { gte: yesterdayStart, lte: yesterdayEnd },
        },
      }),
      this.prismaService.jobPost.count({
        where: {
          createdAt: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      }),
      this.prismaService.jobPost.count({
        where: {
          createdAt: {
            gte: yesterdayStart,
            lte: yesterdayEnd,
          },
        },
      }),
      this.prismaService.partnerCourse.count({
        where: {
          createdAt: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      }),
      this.prismaService.partnerCourse.count({
        where: {
          createdAt: {
            gte: yesterdayStart,
            lte: yesterdayEnd,
          },
        },
      }),
    ]);
    return new ApiSuccessResponse(true, 'total', {
      totalApplicantsToday,
      totalApplicantsYesterday,
      totalPartnersToday,
      totalPartnersYesterday,
      totalJobsToday,
      totalJobsYesterday,
      totalCoursesToday,
      totalCoursesYesterday,
    });
  }

  async jobApplicationTotal(user: Auth) {
    console.log('userId ', user);

    const [applied, shortlisted, rejected, accepted] = await Promise.all([
      this.prismaService.jobApplication.count({
        where: {
          jobPost: {
            userId: user.id,
          },
          status: 'Applied',
        },
      }),
      this.prismaService.jobApplication.count({
        where: {
          jobPost: {
            userId: user.id,
          },
          status: 'Shortlisted',
        },
      }),
      this.prismaService.jobApplication.count({
        where: {
          jobPost: {
            userId: user.id,
          },
          status: 'Rejected',
        },
      }),
      this.prismaService.jobApplication.count({
        where: {
          jobPost: {
            userId: user.id,
          },
          status: 'Accepted',
        },
      }),
    ]);

    return new ApiSuccessResponse(true, 'Total Job Applications', {
      applied,
      shortlisted,
      rejected,
      accepted,
    });
  }
}
