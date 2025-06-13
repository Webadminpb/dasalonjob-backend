import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePartnerCourseDto } from './dto/create-partner-course.dto';
import { UpdatePartnerCourseDto } from './dto/update-partner-course.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { Auth, Prisma } from '@prisma/client';
import { QueryPartnerCourseDto } from './dto/query-partner-course.dto';
import { getPaginationSkip, getPaginationTake } from 'src/common/utils/common';
import { CreateCourseStatusDto } from './dto/status-partner-course.dto';
import { model } from 'mongoose';

@Injectable()
export class PartnerCourseService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreatePartnerCourseDto, user: Auth) {
    if (user.role == 'ADMIN' || user.role == 'SUPER_ADMIN') {
      const partnerCourse = await this.prismaService.partnerCourse.create({
        data: {
          userId: body.userId,
          courseDetailsId: body.courseDetailsId,
          courseContentId: body.courseContentId,
          courseAcademyId: body.courseAcademyId,
          courseTypeAndLocationId: body.courseTypeAndLocationId,
          status: body.status,
          isOpen: body.isOpen,
        },
      });
      return new ApiSuccessResponse(
        true,
        'Partner Course created successfully',
        partnerCourse,
      );
    }
    const partnerCourse = await this.prismaService.partnerCourse.create({
      data: {
        userId: user.id,
        courseDetailsId: body.courseDetailsId,
        courseContentId: body.courseContentId,
        courseAcademyId: body.courseAcademyId,
        courseTypeAndLocationId: body.courseTypeAndLocationId,
        status: body.status,
        isOpen: body.isOpen,
      },
    });
    await this.prismaService.activity.create({
      data: {
        userId: user.id,
        type: 'POSTED_COURSE',
      },
    });
    return new ApiSuccessResponse(
      true,
      'Partner Course created successfully',
      partnerCourse,
    );
  }

  async findAll(query: QueryPartnerCourseDto) {
    const where: Prisma.PartnerCourseWhereInput = {};
    if (query.partnerId) {
      where.userId = query.partnerId;
    }
    if (query.type) {
      where.courseTypeAndLocation.courseType = query.type;
    }
    if (query.location) {
      where.courseTypeAndLocation.city = query.location;
    }
    if (query.status) {
      where.status = query.status;
    }
    if (query.customDate) {
      where.createdAt = {
        gte: new Date(query.customDate).toISOString(),
      };
    }
    if (query.search) {
      where.OR = [
        {
          courseDetails: {
            courseName: {
              contains: query.search,
              mode: 'insensitive',
            },
          },
        },
        {
          courseContent: {
            description: {
              contains: query.search,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    const [partnerCourses, total, openTotal, fullfieldTotal] =
      await Promise.all([
        this.prismaService.partnerCourse.findMany({
          where,
          include: {
            courseDetails: {
              include: {
                file: true,
              },
            },
            courseContent: true,
            courseAcademy: {
              select: {
                provider: {
                  include: {
                    logo: true,
                    venueBasicDetails: true,
                  },
                },
              },
            },

            courseTypeAndLocation: true,
            _count: {
              select: {
                saveCourses: true,
                courseApplications: true,
              },

              // saveCourses: {
              //   select: {
              //     id: true,
              //   },
              // },
              // courseApplications: {
              //   select: {
              //     id: true,
              //   },
            },
          },
          skip: getPaginationSkip(query.page, query.limit),
          take: getPaginationTake(query.limit),
        }),
        this.prismaService.partnerCourse.count({
          where,
        }),
        this.prismaService.partnerCourse.count({
          where: {
            isOpen: true,
          },
        }),
        this.prismaService.partnerCourse.count({
          where: {
            isOpen: false,
          },
        }),
      ]);
    if (!partnerCourses) {
      throw new BadRequestException('No partner courses found');
    }
    // const formattedCourses = partnerCourses.map((course) => ({
    //   ...course,
    //   totalSaves: course.saveCourses.length,
    //   totalApplications: course.courseApplications.length,
    // }));

    return new ApiSuccessResponse(true, 'Partner courses found', {
      partnerCourses: partnerCourses,
      total,
      openTotal,
      fullfieldTotal,
    });
  }

  async findOneForPartner(id: string, user: Auth) {
    const [partnerCourse, totalSaved, totalApplicant] = await Promise.all([
      await this.prismaService.partnerCourse.findUnique({
        where: {
          id: id,
        },
        include: {
          courseDetails: {
            include: {
              file: true,
            },
          },
          courseAcademy: {
            include: {
              provider: {
                include: {
                  logo: true,
                  venueBasicDetails: true,
                },
              },
            },
          },
          courseContent: true,
          courseTypeAndLocation: true,
        },
      }),
      await this.prismaService.courseApplication.count({
        where: {
          course: {
            userId: user.id,
          },
        },
      }),
      await this.prismaService.jobApplication.count({
        where: {
          jobPost: {
            userId: user.id,
          },
        },
      }),
    ]);
    if (!partnerCourse) {
      throw new BadRequestException('Partner course not found');
    }
    return new ApiSuccessResponse(true, 'Partner course found', {
      partnerCourse,
      totalSaved,
      totalApplicant,
    });
  }

  async findOneForApplicant(id: string, user?: Auth) {
    const course = await this.prismaService.partnerCourse.findUnique({
      where: {
        id: id,
      },
      include: {
        courseDetails: {
          include: {
            file: true,
          },
        },
        saveCourses: {
          where: {
            userId: user?.id,
          },
        },
        courseApplications: {
          where: {
            userId: user?.id,
          },
        },
        courseContent: true,
        courseAcademy: {
          include: {
            provider: {
              include: {
                logo: true,
                venueBasicDetails: true,
              },
            },
          },
        },
        courseTypeAndLocation: true,
      },
    });
    if (!course) {
      throw new BadRequestException('Course not found');
    }
    const updatePartnerCourse = await this.prismaService.partnerCourse.update({
      data: { views: { increment: 1 } },
      where: {
        id: id,
      },
    });
    const totalSaved = await this.prismaService.saveCourse.count({
      where: {
        courseId: id,
      },
    });
    const totalApplicant = await this.prismaService.courseApplication.count({
      where: {
        course: {
          id: id,
        },
      },
    });

    return new ApiSuccessResponse(true, 'Course found', {
      partnerCourse: course,
      totalSaved,
      totalApplicant,
    });
  }

  async findOneForGuest(id: string, user?: Auth) {
    const [course, _, totalSaved, totalApplicant] =
      await this.prismaService.$transaction([
        this.prismaService.partnerCourse.findUnique({
          where: {
            id: id,
          },
          include: {
            courseDetails: {
              include: {
                file: true,
              },
            },
            courseContent: true,
            courseAcademy: {
              include: {
                provider: {
                  include: {
                    logo: true,
                    venueBasicDetails: true,
                  },
                },
              },
            },
            courseTypeAndLocation: true,
          },
        }),
        this.prismaService.partnerCourse.update({
          data: { views: { increment: 1 } },
          where: {
            id: id,
          },
        }),
        this.prismaService.saveCourse.count({
          where: {
            courseId: id,
          },
        }),
        this.prismaService.courseApplication.count({
          where: {
            course: {
              id: id,
            },
          },
        }),
      ]);
    if (!course) {
      throw new BadRequestException('Course not found');
    }
    return new ApiSuccessResponse(true, 'Course found', {
      partnerCourse: course,
      totalSaved,
      totalApplicant,
    });
  }

  async update(id: string, body: UpdatePartnerCourseDto, user: Auth) {
    const existingPartnerCourse =
      await this.prismaService.partnerCourse.findUnique({
        where: {
          id: id,
        },
      });
    if (!existingPartnerCourse) {
      throw new BadRequestException('Partner course not found');
    }
    const partnerCourse = await this.prismaService.partnerCourse.update({
      where: {
        id: id,
      },
      data: {
        courseDetailsId: body.courseDetailsId,
        courseContentId: body.courseContentId,
        courseAcademyId: body.courseAcademyId,
        courseTypeAndLocationId: body.courseTypeAndLocationId,
        status: body.status,
        isOpen: body.isOpen,
      },
    });
    return new ApiSuccessResponse(
      true,
      'Partner course updated successfully',
      partnerCourse,
    );
  }

  async remove(id: string) {
    const existingPartnerCourse =
      await this.prismaService.partnerCourse.findUnique({
        where: {
          id: id,
        },
      });
    if (!existingPartnerCourse) {
      throw new BadRequestException('Partner course not found');
    }
    const partnerCourse = await this.prismaService.partnerCourse.delete({
      where: {
        id: id,
      },
    });
    return new ApiSuccessResponse(
      true,
      'Partner course deleted successfully',
      partnerCourse,
    );
  }

  async getCourseStatusTotal() {
    const [totalApplicants, totalActives, totalPendings, totalFullfields] =
      await Promise.all([
        this.prismaService.courseApplication.count(),
        this.prismaService.partnerCourse.count({ where: { isOpen: true } }),
        this.prismaService.partnerCourse.count({
          where: { status: 'Pending' },
        }),
        this.prismaService.partnerCourse.count({
          where: { isOpen: false },
        }),
      ]);

    return new ApiSuccessResponse(true, 'Job post status total', {
      totalApplicants,
      totalActives,
      totalPendings,
      totalFullfields,
    });
  }

  async updateCourseStatusByIdForAdmin(
    body: CreateCourseStatusDto,
    user: Auth,
  ) {
    const existingCourse = await this.prismaService.partnerCourse.findUnique({
      where: {
        id: body.id,
      },
    });
    if (!existingCourse) {
      throw new NotFoundException('Course Not Found');
    }

    const updateCourse = await this.prismaService.partnerCourse.update({
      where: {
        id: existingCourse.id,
      },
      data: {
        status: body.status,
      },
    });
    if (body.status == 'Approved') {
      await this.prismaService.activity.create({
        data: {
          userId: user.id,
          type: 'APPROVE_COURSE',
        },
      });
    } else if (body.status == 'Rejected') {
      await this.prismaService.activity.create({
        data: {
          userId: user.id,
          type: 'REJECT_COURSE',
        },
      });
    }
    return new ApiSuccessResponse(
      true,
      'Course Updated Successfully',
      updateCourse,
    );
  }

  // async findAllForAdmin(query: QueryPartnerCourseDto, user?: Auth) {
  //   const where: Prisma.PartnerCourseWhereInput = {};
  //   const courseDetailsFilter: Prisma.CourseDetailsWhereInput = {};
  //   console.log('where line 467 ', where);
  //   if (query.partnerId) {
  //     where.userId = query.partnerId;
  //   }

  //   if (query.locations) {
  //     // where.courseTypeAndLocation.city = query.location;
  //     where.OR = [
  //       {
  //         courseTypeAndLocation: {
  //           city: {
  //             in: query.locations.split('_'),
  //           },
  //         },
  //       },
  //       {
  //         courseAcademy: {
  //           provider: {
  //             venueBasicDetails: {
  //               city: {
  //                 in: query.locations.split('_'),
  //               },
  //             },
  //           },
  //         },
  //       },
  //     ];
  //   }
  //   if (query.status) {
  //     where.status = query.status;
  //   }

  //   if (query.skillIds) {
  //     courseDetailsFilter.skillIds = {
  //       hasSome: query.skillIds.split('_'),
  //     };
  //   }

  //   // if (query.minPrice || query.maxPrice) {
  //   //   console.log('query.minPrice ', query.minPrice);
  //   //   console.log('query.maxPrice ', query.maxPrice);
  //   //   const priceFilter: Prisma.FloatFilter = {
  //   //     ...(query.minPrice && { gte: parseFloat(query.minPrice) }),
  //   //     ...(query.maxPrice && { lte: parseFloat(query.maxPrice) }),
  //   //   };
  //   //   console.log('price filter ', priceFilter);
  //   //   courseDetailsFilter.OR = [
  //   //     { offerPrice: priceFilter },
  //   //     {
  //   //       AND: [{ offerPrice: { equals: undefined } }, { price: priceFilter }],
  //   //     },
  //   //   ];
  //   //   console.log('course details ', courseDetailsFilter);
  //   // }

  //   if (query.minPrice !== undefined && query.maxPrice !== undefined) {
  //     const min = parseFloat(query.minPrice);
  //     const max = parseFloat(query.maxPrice);

  //     const priceFilter: Prisma.FloatFilter = {
  //       gte: min,
  //       lte: max,
  //     };

  //     courseDetailsFilter.OR = [
  //       // Case 1: offerPrice is set and between min and max
  //       {
  //         AND: [
  //           {
  //             offerPrice: {
  //               not: null,
  //             },
  //           },
  //           {
  //             offerPrice: {
  //               not: 0,
  //             },
  //           },
  //           {
  //             offerPrice: {
  //               gte: min,
  //               lte: max,
  //             },
  //           },
  //         ],
  //       },
  //       // Case 2: offerPrice is null or 0, so fallback to price
  //       {
  //         AND: [
  //           {
  //             OR: [
  //               {
  //                 offerPrice: null,
  //               },
  //               {
  //                 offerPrice: {
  //                   equals: 0,
  //                 },
  //               },
  //             ],
  //           },
  //           {
  //             price: {
  //               gte: min,
  //               lte: max,
  //             },
  //           },
  //         ],
  //       },
  //     ];
  //   }

  //   if (query.startDate && query.endDate) {
  //     courseDetailsFilter.AND = [
  //       {
  //         startDate: {
  //           gte: new Date(query.startDate).toISOString(),
  //         },
  //       },
  //       {
  //         endDate: {
  //           lte: new Date(query.endDate).toISOString(),
  //         },
  //       },
  //     ];
  //   }

  //   // Final courseDetails condition
  //   if (Object.keys(courseDetailsFilter).length > 0) {
  //     console.log('line 542 ', courseDetailsFilter);
  //     where.courseDetails = {
  //       is: courseDetailsFilter,
  //     };
  //     console.log('line 546 ', JSON.stringify(where));
  //   }
  //   if (query.search) {
  //     where.OR = [
  //       {
  //         courseDetails: {
  //           courseName: {
  //             contains: query.search,
  //             mode: 'insensitive',
  //           },
  //         },
  //       },
  //       {
  //         courseContent: {
  //           description: {
  //             contains: query.search,
  //             mode: 'insensitive',
  //           },
  //         },
  //       },
  //     ];
  //   }
  //   // if (query.customDate) {
  //   //   where.createdAt = {
  //   //     gte: new Date(query.customDate).toISOString(),
  //   //   };
  //   // }
  //   console.log('line 471 ', query.type);
  //   if (query.type) {
  //     console.log('query type ', query.type);
  //     where.courseTypeAndLocation = {
  //       courseType: query.type,
  //     };
  //     console.log('where line 477 ', where);
  //   }
  //   console.log('last where ', where);
  //   const [partnerCourses, total, openTotal, fullfieldTotal] =
  //     await Promise.all([
  //       this.prismaService.partnerCourse.findMany({
  //         where,
  //         include: {
  //           courseDetails: {
  //             include: {
  //               file: true,
  //             },
  //           },
  //           _count: {
  //             select: {
  //               courseApplications: true,
  //             },
  //           },
  //           courseContent: true,
  //           courseAcademy: {
  //             include: {
  //               provider: {
  //                 include: {
  //                   logo: true,
  //                   venueBasicDetails: true,
  //                 },
  //               },
  //             },
  //           },
  //           courseTypeAndLocation: true,
  //           saveCourses: {
  //             where: {
  //               userId: user?.id,
  //             },
  //           },
  //           courseApplications: {
  //             where: {
  //               userId: user?.id,
  //             },
  //           },
  //         },
  //         skip: getPaginationSkip(query.page, query.limit),
  //         take: getPaginationTake(query.limit),
  //       }),
  //       this.prismaService.partnerCourse.count({
  //         // where,
  //       }),
  //       this.prismaService.partnerCourse.count({
  //         where: {
  //           isOpen: true,
  //         },
  //       }),
  //       this.prismaService.partnerCourse.count({
  //         where: {
  //           isOpen: false,
  //         },
  //       }),
  //     ]);
  //   if (!partnerCourses) {
  //     throw new BadRequestException('No partner courses found');
  //   }
  //   return new ApiSuccessResponse(true, 'Partner courses found', {
  //     partnerCourses,
  //     total,
  //     openTotal,
  //     fullfieldTotal,
  //   });
  // }

  async findAllForAdmin(query: QueryPartnerCourseDto, user?: Auth) {
    const where: Prisma.PartnerCourseWhereInput = {};
    const courseDetailsFilter: Prisma.CourseDetailsWhereInput = {};

    if (query.partnerId) {
      where.userId = query.partnerId;
    }

    if (query.locations) {
      where.OR = [
        {
          courseTypeAndLocation: {
            city: {
              in: query.locations.split('_'),
            },
          },
        },
        {
          courseAcademy: {
            provider: {
              venueBasicDetails: {
                city: {
                  in: query.locations.split('_'),
                },
              },
            },
          },
        },
      ];
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.skillIds) {
      courseDetailsFilter.skillIds = {
        hasSome: query.skillIds.split('_'),
      };
    }

    if (query.startDate && query.endDate) {
      courseDetailsFilter.AND = [
        {
          startDate: {
            gte: new Date(query.startDate).toISOString(),
          },
        },
        {
          endDate: {
            lte: new Date(query.endDate).toISOString(),
          },
        },
      ];
    }

    if (Object.keys(courseDetailsFilter).length > 0) {
      where.courseDetails = {
        is: courseDetailsFilter,
      };
    }

    if (query.search) {
      where.OR = [
        {
          courseDetails: {
            courseName: {
              contains: query.search,
              mode: 'insensitive',
            },
          },
        },
        {
          courseContent: {
            description: {
              contains: query.search,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    if (query.type) {
      where.courseTypeAndLocation = {
        courseType: query.type,
      };
    }

    const skip = getPaginationSkip(query.page, query.limit);
    const take = getPaginationTake(query.limit);

    const [partnerCourses, total, openTotal, fullfieldTotal] =
      await Promise.all([
        this.prismaService.partnerCourse.findMany({
          where,
          include: {
            courseDetails: { include: { file: true } },
            _count: { select: { courseApplications: true } },
            courseContent: true,
            courseAcademy: {
              include: {
                provider: {
                  include: {
                    logo: true,
                    venueBasicDetails: true,
                  },
                },
              },
            },
            courseTypeAndLocation: true,
            saveCourses: {
              where: { userId: user?.id },
            },
            courseApplications: {
              where: { userId: user?.id },
            },
          },
          skip,
          take,
        }),

        this.prismaService.partnerCourse.count({ where }), // total without filtering
        this.prismaService.partnerCourse.count({ where: { isOpen: true } }),
        this.prismaService.partnerCourse.count({ where: { isOpen: false } }),
      ]);

    // Apply price filtering in memory
    let filteredCourses = partnerCourses;

    if (query.minPrice !== undefined && query.maxPrice !== undefined) {
      const min = parseFloat(query.minPrice);
      const max = parseFloat(query.maxPrice);

      filteredCourses = partnerCourses.filter((course) => {
        const details = course.courseDetails;
        if (!details) return false;

        const offer = details.offerPrice;
        const base = details.price;

        if (offer !== null && offer !== 0) {
          return offer >= min && offer <= max;
        } else {
          return base >= min && base <= max;
        }
      });
    }

    return new ApiSuccessResponse(true, 'Partner courses found', {
      partnerCourses: filteredCourses,
      total,
      openTotal,
      fullfieldTotal,
    });
  }
}
