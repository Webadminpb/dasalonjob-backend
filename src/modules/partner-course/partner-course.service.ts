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
import { getPaginationSkip, getPaginationTake } from 'src/common/common';
import { CreateCourseStatusDto } from './dto/status-partner-course.dto';

@Injectable()
export class PartnerCourseService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreatePartnerCourseDto, user: Auth) {
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
    return new ApiSuccessResponse(
      true,
      'PartnerCourse created successfully',
      partnerCourse,
    );
  }

  async findAll(query: QueryPartnerCourseDto, user: Auth) {
    const where: Prisma.PartnerCourseWhereInput = {
      userId: user.id,
    };
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
            courseAcademy: false,
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
    const [partnerCourse, totalSaved] = await Promise.all([
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
    ]);
    if (!partnerCourse) {
      throw new BadRequestException('Partner course not found');
    }
    return new ApiSuccessResponse(true, 'Partner course found', {
      partnerCourse,
      totalSaved,
    });
  }

  async findOneForApplicant(id: string) {
    const [course, _] = await this.prismaService.$transaction([
      this.prismaService.partnerCourse.findUnique({
        where: {
          id: id,
        },
        include: {
          courseDetails: true,
          courseContent: true,
          courseAcademy: true,
          courseTypeAndLocation: true,
        },
      }),
      this.prismaService.partnerCourse.update({
        data: { views: { increment: 1 } },
        where: {
          id: id,
        },
      }),
    ]);
    if (!course) {
      throw new BadRequestException('Course not found');
    }
    return new ApiSuccessResponse(true, 'Course found', course);
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
        userId: user.id,
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
        this.prismaService.auth.count({ where: { role: 'USER' } }),
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

  async updateCourseStatusByIdForAdmin(body: CreateCourseStatusDto) {
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
    return new ApiSuccessResponse(
      true,
      'Course Updated Successfully',
      updateCourse,
    );
  }

  async findAllForAdmin(query: QueryPartnerCourseDto) {
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
    if (query.customDate) {
      where.createdAt = {
        gte: new Date(query.customDate).toISOString(),
      };
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
            courseAcademy: false,
            courseTypeAndLocation: true,
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
    return new ApiSuccessResponse(true, 'Partner courses found', {
      partnerCourses,
      total,
      openTotal,
      fullfieldTotal,
    });
  }
}
