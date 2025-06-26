import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Auth, BusinessType, Prisma } from '@prisma/client';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import {
  getPaginationSkip,
  getPaginationTake,
  getSortBy,
  getSortOrder,
} from 'src/common/utils/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePartnerVenueDto } from './dto/create-partner-venue.dto';
import { QueryPartnerVenueDto } from './dto/query-partner-venue.dto';
import { UpdatePartnerVenueDto } from './dto/update-partner-venue.dto';
import { endOfDay, startOfDay, subDays } from 'date-fns';
import { ExtendedPartnerVenue } from 'src/common/utils/types';

@Injectable()
export class PartnerVenueService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreatePartnerVenueDto, user: Auth) {
    const userData = await this.prismaService.auth.findUnique({
      where: { id: user?.id },
      select: {
        profileImageId: true,
      },
    });
    if (!userData) throw new NotFoundException('Partner Account Not Found');
    const partnerVenue = await this.prismaService.partnerVenue.create({
      data: {
        venueBasicDetailsId: body.venueBasicDetailsId,
        salonBasicDetailsId: body.salonBasicDetailsId,
        venueAmenityIds: body.venueAmenityIds,
        venueMainBusinessDaysId: body.venueMainBusinessDaysId,
        venueWorkStationIds: body.venueWorkStationIds,
        userId: user.id,
        logoId: userData.profileImageId ? userData.profileImageId : null,
      },
    });
    return new ApiSuccessResponse(
      true,
      'Partner Venue created successfully',
      partnerVenue,
    );
  }

  async findAll(query: QueryPartnerVenueDto, user?: Auth) {
    console.log('userId ', user.id);
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
    if (query?.request === 'SENT') {
      console.log('query request', query.request);
      where.user = {
        agencyCollaborations: {
          some: {
            agencyId: user?.id,
            requestedBy: 'AGENCY',
          },
        },
      };
    }

    if (query?.request === 'INCOMING') {
      where.user = {
        agencyCollaborations: {
          some: {
            agencyId: user?.id,
            requestedBy: 'PARTNER',
          },
        },
      };
    }

    if (query?.request === 'APPROVED') {
      where.user = {
        OR: [
          {
            agencyCollaborations: {
              some: {
                agencyId: user?.id,
                agencyHasAccess: true,
                partnerHasAccess: true,
              },
            },
          },
          // {
          //   partnerCollaborations: {
          //     some: {
          //       partnerId: user?.id,
          //       agencyHasAccess: true,
          //       partnerHasAccess: true,
          //     },
          //   },
          // },
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
    if (query.locations) {
      where.venueBasicDetails = {
        city: {
          contains: query.locations,
          mode: 'insensitive',
        },
      };
    }

    const [
      partnerVenues,
      total,
      actives,
      inActives,
      sentCount,
      incomingCount,
      approvedCount,
    ] = await Promise.all([
      this.prismaService.partnerVenue.findMany({
        where,
        include: {
          _count: {
            select: {
              jobPosts: true,
              courseAcademy: {
                where: {
                  partnerCourses: {
                    some: {},
                  },
                },
              },
            },
          },
          venueBasicDetails: {
            include: {
              files: {
                select: {
                  url: true,
                },
              },
            },
          },
          logo: {
            select: {
              url: true,
            },
          },
          salonBasicDetails: true,
          venueAmenities: true,
          venueWorkStations: true,
          user: {
            select: {
              id: true,
              partnerPersonalData: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
              // partnerCollaborations: true,
              agencyCollaborations: true,
            },
          },
          venueMainBusinessDays: true,
          partnerAgencyJobPermissions: true,
        },
        skip: getPaginationSkip(query.page, query.limit),
        take: getPaginationTake(query.limit),
      }),
      this.prismaService.partnerVenue.count({
        where: {
          userId: query?.userId,
        },
      }),
      this.prismaService.partnerVenue.count({
        where: {
          userId: query?.userId,
          status: 'ACTIVE',
        },
      }),
      this.prismaService.partnerVenue.count({
        where: {
          userId: query?.userId,
          status: 'INACTIVE',
        },
      }),
      // 🔸 Sent (AGENCY)
      this.prismaService.partnerAgencyJobPermission.count({
        where: {
          agencyId: user?.id,
          requestedBy: user?.role == 'AGENCY' ? 'AGENCY' : 'PARTNER',
        },
      }),

      // 🔸 Incoming (PARTNER)
      this.prismaService.partnerAgencyJobPermission.count({
        where: {
          agencyId: user?.id,
          requestedBy: user?.role == 'PARTNER' ? 'PARTNER' : 'AGENCY',
        },
      }),

      // 🔸 Approved (both approved)
      this.prismaService.partnerAgencyJobPermission.count({
        where: {
          OR: [
            {
              agencyId: user?.id,
            },
            {
              venue: {
                userId: user?.id,
              },
            },
          ],
          agencyHasAccess: true,
          partnerHasAccess: true,
        },
      }),
    ]);

    if (!partnerVenues) {
      throw new BadRequestException('No Partner Venues found');
    }
    const extendedVenues: ExtendedPartnerVenue[] = partnerVenues.map(
      (venue) => {
        const userCollab = venue;
        // console.log('userCollab ', userCollab);
        let collaboration = null;
        // console.log('collaboration ', collaboration);

        if (!userCollab) {
          // console.log('userCollab line 258 ', userCollab);
          return { ...venue, collaborationStatus: 'Pending' };
        }
        // console.log('line 261');
        // collaboration =
        //   userCollab.partnerCollaborations.find(
        //     (c) => c.agencyId === user?.id,
        //   ) ||
        //   userCollab.agencyCollaborations.find((c) => c.agencyId === user?.id);
        collaboration = userCollab?.partnerAgencyJobPermissions.find(
          (c) => c?.agencyId === user?.id,
        );
        // console.log('line 271 ', collaboration);

        if (!collaboration) {
          // console.log('line 273');
          return { ...venue, collaborationStatus: 'Pending' };
        }

        const { partnerHasAccess, agencyHasAccess } = collaboration;
        // console.log('partnerHasAccess', partnerHasAccess);
        // console.log('agencyHasAccess', agencyHasAccess);

        let status: ExtendedPartnerVenue['collaborationStatus'] = 'Pending';
        // console.log('status ', status);

        if (partnerHasAccess === true && agencyHasAccess === false) {
          // console.log(
          //   'partnerHasAccess && agencyHasAccess ',
          //   partnerHasAccess && agencyHasAccess,
          // );
          status = 'Approved';
          // console.log('final status ', status);
        } else if (partnerHasAccess === true && agencyHasAccess === false) {
          status = 'Partner Requested';
          // console.log(
          //   'partnerHasAccess && !!agencyHasAccess ',
          //   partnerHasAccess === true && agencyHasAccess === false,
          // );
          // console.log('final status ', status);
        } else if (partnerHasAccess === false && agencyHasAccess === true) {
          status = 'Agency Requested';
          // console.log(
          //   '!!partnerHasAccess && agencyHasAccess ',
          //   partnerHasAccess === false && agencyHasAccess === true,
          // );
          // console.log('final status ', status);
        }
        // console.log('line 3010');
        return {
          ...venue,
          collaborationStatus: status,
        };
      },
    );
    let filteredVenues = extendedVenues;
    if (query.status) {
      console.log('query status ', query.status);
      console.log('filtered venues ', filteredVenues);
      filteredVenues = extendedVenues.filter(
        (venue) =>
          venue.collaborationStatus.toLocaleLowerCase() ===
          query.status.toLocaleLowerCase(),
      );
    }
    return new ApiSuccessResponse(true, 'Partner Venues found', {
      partnerVenues: filteredVenues,
      total,
      actives,
      inActives,
      sentCount,
      incomingCount,
      approvedCount,
    });
  }

  async findAllVenues(query: QueryPartnerVenueDto) {
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
        _count: {
          select: {
            jobPosts: true,
          },
        },
        venueBasicDetails: {
          include: {
            files: true,
          },
        },
        logo: true,
        salonBasicDetails: true,
        venueAmenities: true,
        venueWorkStations: true,
        user: true,
        venueMainBusinessDays: true,
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

    if (query.businessTypeId) {
      where.venueBasicDetails = {};
    }

    if (query.status) {
      where.status = query.status;
    }

    const orderBy = getSortOrder(query.order);
    const sortBy = getSortBy(query.sort);

    const partnerVenues = await this.prismaService.partnerVenue.findMany({
      where,
      include: {
        venueBasicDetails: {
          include: {
            businessType: {
              select: {
                id: true,
                name: true,
              },
            },
            files: {
              select: {
                url: true,
              },
            },
          },
        },
        logo: {
          select: {
            url: true,
          },
        },
        user: {
          select: {
            basicDetails: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: {
        [sortBy]: orderBy,
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
        logo: {
          select: {
            url: true,
          },
        },
        venueBasicDetails: {
          include: {
            files: true,
          },
        },
        venueMainBusinessDays: true,
        salonBasicDetails: true,
        venueAmenities: true,
        venueWorkStations: true,
        user: {
          include: {
            partnerSocialLinks: true,
          },
        },
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
    const todayStart = startOfDay(new Date()).toISOString();
    const todayEnd = endOfDay(new Date()).toISOString();

    const yesterdayStart = startOfDay(subDays(new Date(), 1)).toISOString();
    const yesterdayEnd = endOfDay(subDays(new Date(), 1)).toISOString();

    const [
      totalJobApplicants = 0,
      totalApplicantsToday = 0,
      totalApplicantsYesterday = 0,
      totalJobs = 0,
      totalJobsToday = 0,
      totalJobsYesterday = 0,
      totalCourses = 0,
      totalCoursesToday = 0,
      totalCoursesYesterday = 0,
      totalCourseApplicants = 0,
      totalCourseApplicantsToday = 0,
      totalCourseApplicantsYesterday = 0,
    ] = await Promise.all([
      this.prismaService.jobApplication.count({
        where: {
          jobPost: {
            userId: user.id,
          },
        },
      }),
      this.prismaService.jobApplication.count({
        where: {
          jobPost: {
            userId: user.id,
            createdAt: { gte: todayStart, lte: todayEnd },
          },
        },
      }),
      this.prismaService.jobApplication.count({
        where: {
          jobPost: {
            userId: user.id,
            createdAt: { gte: yesterdayStart, lte: yesterdayEnd },
          },
        },
      }),
      this.prismaService.jobPost.count({ where: { userId: user.id } }),
      this.prismaService.jobPost.count({
        where: {
          userId: user.id,
          createdAt: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      }),
      this.prismaService.jobPost.count({
        where: {
          userId: user.id,
          createdAt: {
            gte: yesterdayStart,
            lte: yesterdayEnd,
          },
        },
      }),
      this.prismaService.partnerCourse.count({ where: { userId: user.id } }),
      this.prismaService.partnerCourse.count({
        where: {
          userId: user.id,
          createdAt: { gte: todayStart, lte: todayEnd },
        },
      }),
      this.prismaService.partnerCourse.count({
        where: {
          userId: user.id,
          createdAt: {
            gte: yesterdayStart,
            lte: yesterdayEnd,
          },
        },
      }),
      this.prismaService.courseApplication.count({
        where: { course: { userId: user.id } },
      }),
      this.prismaService.courseApplication.count({
        where: {
          course: {
            userId: user.id,
            createdAt: { gte: todayStart, lte: todayEnd },
          },
        },
      }),
      this.prismaService.courseApplication.count({
        where: {
          course: {
            userId: user.id,
            createdAt: { gte: yesterdayStart, lte: yesterdayEnd },
          },
        },
      }),
    ]);
    return new ApiSuccessResponse(true, 'total', {
      totalJobApplicants,
      totalApplicantsToday,
      totalApplicantsYesterday,
      totalJobs,
      totalJobsToday,
      totalJobsYesterday,
      totalCourses,
      totalCoursesToday,
      totalCoursesYesterday,
      totalCourseApplicants,
      totalCourseApplicantsToday,
      totalCourseApplicantsYesterday,
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
      totalApplicants,
      totalPartnersToday = 0,
      totalPartnersYesterday = 0,
      totalPartners,
      totalJobsToday = 0,
      totalJobsYesterday = 0,
      totalJobs,
      totalCoursesToday = 0,
      totalCoursesYesterday = 0,
      totalCourses,
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
          role: 'USER',
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
      this.prismaService.auth.count({
        where: {
          role: 'PARTNER',
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
      this.prismaService.jobPost.count({}),
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
      this.prismaService.partnerCourse.count({}),
    ]);
    return new ApiSuccessResponse(true, 'total', {
      totalApplicantsToday,
      totalApplicantsYesterday,
      totalApplicants,
      totalPartnersToday,
      totalPartnersYesterday,
      totalPartners,
      totalJobsToday,
      totalJobsYesterday,
      totalJobs,
      totalCoursesToday,
      totalCoursesYesterday,
      totalCourses,
    });
  }

  async jobApplicationTotal(user: Auth) {
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
