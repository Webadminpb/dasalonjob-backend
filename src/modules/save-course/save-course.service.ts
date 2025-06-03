import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSaveCourseDto } from './dto/create-save-course.dto';
import { UpdateSaveCourseDto } from './dto/update-save-course.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Auth, Prisma } from '@prisma/client';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { QuerySaveCourseDto } from './dto/query-save-course.dto';
import { getPaginationSkip, getPaginationTake } from 'src/common/utils/common';

@Injectable()
export class SaveCourseService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreateSaveCourseDto, user: Auth) {
    const { courseId } = body;
    const existingSaveCourse = await this.prismaService.saveCourse.findFirst({
      where: {
        courseId,
        userId: user.id,
      },
    });
    if (existingSaveCourse) {
      throw new BadRequestException('Already saved');
    }
    const saveCourse = await this.prismaService.saveCourse.create({
      data: {
        courseId,
        userId: user.id,
      },
    });
    return new ApiSuccessResponse(true, 'Saved successfully', saveCourse);
  }

  async findAllForApplicant(user: Auth, query: QuerySaveCourseDto) {
    const where: Prisma.SaveCourseWhereInput = {
      userId: user.id,
    };

    if (query.location || query.type) {
      where.course = {
        courseTypeAndLocation: {
          OR: [
            ...(query.location
              ? [
                  {
                    city: {
                      contains: query.location,
                      mode: 'insensitive',
                    } as any,
                  },
                  {
                    state: {
                      contains: query.location,
                      mode: 'insensitive',
                    } as any,
                  },
                ]
              : []),
            ...(query.type
              ? [
                  {
                    courseType: { equals: query.type as any },
                  },
                ]
              : []),
          ],
        },
      };
    }

    if (query.customDate) {
      const date = new Date(query.customDate);
      where.createdAt = {
        gte: new Date(date.setHours(0, 0, 0, 0)).toISOString(),
        lt: new Date(date.setHours(23, 59, 59, 999)).toISOString(),
      };
    }

    if (query.customerYear) {
      where.createdAt = {
        gte: new Date(query.customerYear, 0, 1).toISOString(),
        lt: new Date(query.customerYear + 1, 0, 1).toISOString(),
      };
    }
    const sortOrder = query.order === 'asc' ? 'asc' : 'desc';
    const sortBy = query.sort || 'createdAt';

    const [saveCourses, total] = await Promise.all([
      this.prismaService.saveCourse.findMany({
        where,
        include: {
          course: {
            include: {
              courseAcademy:{
                include:{
                  provider:{
                    include:{
                      venueBasicDetails:true,
                      logo:true
                    }
                  }
                }
              },
              courseDetails: {
                include: {
                  file: true,
                },
              },
              courseApplications: {
                where: {
                  userId: user?.id,
                },
                select: {
                  createdAt: true,
                },
              },
              courseTypeAndLocation: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      this.prismaService.saveCourse.count({ where }),
    ]);

    if (!saveCourses.length) {
      throw new NotFoundException('Saved course not found');
    }

    return new ApiSuccessResponse(true, 'Get all saved courses successfully', {
      saveCourses,
      total,
    });
  }

  async findAllForPartner(user: Auth, query: QuerySaveCourseDto) {
    const where: Prisma.SaveCourseWhereInput = {};

    if (query.location || query.type) {
      where.course = {
        courseTypeAndLocation: {
          OR: [
            ...(query.location
              ? [
                  {
                    city: {
                      contains: query.location,
                      mode: 'insensitive',
                    } as any,
                  },
                  {
                    state: {
                      contains: query.location,
                      mode: 'insensitive',
                    } as any,
                  },
                ]
              : []),
            ...(query.type
              ? [
                  {
                    courseType: { equals: query.type as any },
                  },
                ]
              : []),
          ],
        },
      };
    }

    if (user.id) {
      where.course = { userId: user.id };
    }

    const [saveCourses, total] = await Promise.all([
      this.prismaService.saveCourse.findMany({
        where,
        include: {
          course: {
            include: {
              courseTypeAndLocation: true,
            },
          },
        },
        skip: getPaginationSkip(query.page, query.limit),
        take: getPaginationTake(query.limit),
      }),
      this.prismaService.saveCourse.count({ where }),
    ]);

    if (!saveCourses.length) {
      throw new NotFoundException('Saved course not found');
    }

    return new ApiSuccessResponse(true, 'Get all saved courses successfully', {
      saveCourses,
      total,
    });
  }

  async findOne(id: string, user: Auth) {
    const saveJobPost = await this.prismaService.saveJobPost.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });
    if (!saveJobPost) {
      throw new NotFoundException('Save job post not found');
    }
    return new ApiSuccessResponse(
      true,
      'Get save job post successfully',
      saveJobPost,
    );
  }

  async update(id: string, body: UpdateSaveCourseDto, user: Auth) {
    const existingSaveCourse = await this.prismaService.saveCourse.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });
    if (!existingSaveCourse) {
      throw new NotFoundException('Saved Course not found');
    }

    const updatedSaveCourse = await this.prismaService.saveCourse.update({
      where: { id },
      data: body,
    });
    return new ApiSuccessResponse(
      true,
      'Saved Course updated successfully',
      updatedSaveCourse,
    );
  }

  async remove(id: string, user: Auth) {
    const existingSaveCourse = await this.prismaService.saveCourse.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });
    if (!existingSaveCourse) {
      throw new NotFoundException('Saved Course not found');
    }

    await this.prismaService.saveCourse.delete({
      where: { id },
    });
    return new ApiSuccessResponse(
      true,
      'Saved Course deleted successfully',
      null,
    );
  }
}
