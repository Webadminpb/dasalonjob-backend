import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseApplicationDto } from './dto/create-course-application.dto';
import { UpdateCourseApplicationDto } from './dto/update-course-application.dto';
import { Auth, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { QueryCourseApplicationDto } from './dto/query-course-application.dto';
import { getPaginationSkip, getPaginationTake } from 'src/common/common';

@Injectable()
export class CourseApplicationService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(body: CreateCourseApplicationDto, user: Auth) {
    const isCourseExisted =
      await this.prismaService.courseApplication.findUnique({
        where: {
          userId_courseId: { userId: user.id, courseId: body.courseId },
        },
      });
    if (!isCourseExisted) {
      throw new NotFoundException('Course Data Not Found');
    }
    const courseApplication = await this.prismaService.courseApplication.create(
      {
        data: {
          courseId: body.courseId,
          userId: user.id,
        },
      },
    );
    return new ApiSuccessResponse(
      true,
      'course application created ',
      courseApplication,
    );
  }

  async findAllCourseApplicationsForApplicant(
    query: QueryCourseApplicationDto,
    user: Auth,
  ) {
    const where: Prisma.CourseApplicationWhereInput = {};
    if (user.id) {
      where.userId = user.id;
    }

    if (query.customDate) {
      const date = new Date(query.customDate);
      where.createdAt = {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lt: new Date(date.setHours(23, 59, 59, 999)),
      };
    }

    if (query.customerYear) {
      const year = new Date(query.customerYear).getFullYear();
      where.createdAt = {
        gte: new Date(year, 0, 1),
        lt: new Date(year + 1, 0, 1),
      };
    }
    const [courses, total] = await Promise.all([
      this.prismaService.courseApplication.findMany({
        where,
        skip: getPaginationSkip(query.page, query.limit),
        take: getPaginationTake(query.limit),
      }),
      this.prismaService.courseApplication.count({
        where,
        skip: getPaginationSkip(query.page, query.limit),
        take: getPaginationTake(query.limit),
      }),
    ]);

    return new ApiSuccessResponse(true, 'Course Applications Data ', {
      courses,
      total,
    });
  }

  async findAllCourseApplicationsForPartner(
    query: QueryCourseApplicationDto,
    user: Auth,
  ) {
    const where: Prisma.CourseApplicationWhereInput = {
      course: {
        userId: user.id,
      },
    };
    if (query.courseId) {
      where.courseId = query.courseId;
    }
    if (query.search) {
      where.user = {
        basicDetails: {
          OR: [
            {
              firstName: {
                contains: query.search,
                mode: 'insensitive',
              },
            },
            {
              lastName: {
                contains: query.search,
                mode: 'insensitive',
              },
            },
          ],
        },
      };
    }
    if (query.location) {
      where.user = where.user || {};
      where.user.contactDetails = where.user.contactDetails || {};
      where.user.contactDetails.city = query.location;
    }
    if (query.customDate) {
      const date = new Date(query.customDate);
      where.createdAt = {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lt: new Date(date.setHours(23, 59, 59, 999)),
      };
    }

    if (query.customerYear) {
      where.createdAt = {
        gte: new Date(query.customerYear, 0, 1),
        lt: new Date(query.customerYear + 1, 0, 1),
      };
    }
    if (query.languageId) {
      where.user.languages = { some: { languageId: query.languageId } };
    }
    if (query.search) {
      where.OR = [
        {
          user: {
            basicDetails: {
              firstName: { contains: query.search, mode: 'insensitive' },
            },
          },
        },
        {
          user: {
            basicDetails: {
              lastName: { contains: query.search, mode: 'insensitive' },
            },
          },
        },
        {
          user: {
            contactDetails: {
              phoneNumber: {
                contains: query.search,
                mode: 'insensitive',
              },
            },
          },
        },
      ];
    }

    const sortOrder = query.order === 'asc' ? 'asc' : 'desc';
    const sortBy = query.sort || 'createdAt';

    const existingCourse = await this.prismaService.partnerCourse.findUnique({
      where: { id: query.courseId },
    });

    if (!existingCourse) {
      throw new NotFoundException('Course Not Found');
    }
    const [courseApplications, total] = await Promise.all([
      this.prismaService.courseApplication.findMany({
        where,
        skip: getPaginationSkip(query.page, query.limit),
        take: getPaginationTake(query.limit),
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          course: true,
          user: {
            include: {
              basicDetails: true,
              contactDetails: true,
              languages: true,
            },
          },
        },
      }),
      this.prismaService.courseApplication.count(),
    ]);
    if (!courseApplications) {
      throw new NotFoundException('Course Applications Not Found');
    }
    return new ApiSuccessResponse(true, 'Course Applications', {
      courseApplications,
      total,
    });
  }
}
