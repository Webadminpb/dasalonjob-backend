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

  async findAll(query: QueryCourseApplicationDto, user: Auth) {
    const where: Prisma.CourseApplicationWhereInput = {};
    if (user.id) {
      where.userId = user.id;
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

  findOne(id: number) {
    return `This action returns a #${id} courseApplication`;
  }

  update(id: number, updateCourseApplicationDto: UpdateCourseApplicationDto) {
    return `This action updates a #${id} courseApplication`;
  }

  remove(id: number) {
    return `This action removes a #${id} courseApplication`;
  }
}
