import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { QueryActivityDto } from './dto/query-activity.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { createDateBeforeFilter } from 'src/common/validation';

@Injectable()
export class ActivityService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllActivitiesForApplicant(query: QueryActivityDto) {
    if (!query.userId) {
      throw new BadRequestException('User Id is required');
    }

    const dateFilter = createDateBeforeFilter(query.lastFetchedDate);

    const jobsApplied = await this.prismaService.jobApplication.findMany({
      where: {
        userId: query.userId,
        status: 'Applied',
        createdAt: dateFilter,
      },
      orderBy: { createdAt: 'desc' },
    });

    const coursesEnrolled = await this.prismaService.courseApplication.findMany(
      {
        where: {
          userId: query.userId,
          createdAt: dateFilter,
        },
        orderBy: { createdAt: 'desc' },
      },
    );
    return new ApiSuccessResponse(
      true,
      'Applicant activity fetched successfully',
      {
        jobsApplied,
        coursesEnrolled,
      },
    );
  }

  async getAllActivitiesForPartner(query: QueryActivityDto) {
    if (!query.userId) {
      throw new BadRequestException('User Id is required');
    }

    const dateFilter = createDateBeforeFilter(query.lastFetchedDate);

    const jobPosts = await this.prismaService.jobPost.findMany({
      where: {
        userId: query.userId,
        createdAt: dateFilter,
      },
      orderBy: { createdAt: 'desc' },
    });

    const partnerCourses = await this.prismaService.partnerCourse.findMany({
      where: {
        userId: query.userId,
        createdAt: dateFilter,
      },
      orderBy: { createdAt: 'desc' },
    });
    return new ApiSuccessResponse(
      true,
      'Partner activity fetched successfully',
      {
        jobPosts,
        partnerCourses,
      },
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} activity`;
  }

  update(id: number, updateActivityDto: UpdateActivityDto) {
    return `This action updates a #${id} activity`;
  }

  remove(id: number) {
    return `This action removes a #${id} activity`;
  }
}
