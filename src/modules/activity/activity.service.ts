import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { QueryActivityDto } from './dto/query-activity.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { createDateBeforeFilter } from 'src/common/validation';
import {
  getPaginationSkip,
  getPaginationTake,
  getSortBy,
  getSortOrder,
} from 'src/common/common';

@Injectable()
export class ActivityService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllActivities(query: QueryActivityDto) {
    const { where, skip, take, orderBy, sortBy } =
      await this.queryBuilder(query);

    const activities = await this.prismaService.activity.findMany({
      where,
      skip,
      take,
      orderBy: {
        [orderBy]: [sortBy],
      },
    });

    return new ApiSuccessResponse(
      true,
      'Applicant activity fetched successfully',
      { activities },
    );
  }

  private async queryBuilder(query: QueryActivityDto) {
    if (!query.userId) {
      throw new BadRequestException('User Id is required');
    }
    const where: Prisma.ActivityWhereInput = {};
    if (query.userId) {
      where.userId = query.userId;
    }

    const orderBy = getSortOrder(query.order);
    const sortBy = getSortBy(query.sort);
    const skip = getPaginationSkip(query.page, query.limit);
    const take = getPaginationTake(query.limit);

    return { where, orderBy, sortBy, skip, take };
  }
}
