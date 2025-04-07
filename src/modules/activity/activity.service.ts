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
import { startOfDay, subDays } from 'date-fns';
import { format } from 'date-fns';

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

  async getWeeklyActivity() {
    const sevenDaysAgo = startOfDay(subDays(new Date(), 7));

    // Fetch all logins with joined user info
    const logins = await this.prismaService.loginHistory.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo as any,
        },
      },
      select: {
        createdAt: true,
        userId: true,
        user: {
          select: {
            role: true,
          },
        },
      },
    });

    const seen = new Set<string>(); // day|role|userId
    const result: Record<string, Record<string, number>> = {};

    for (const login of logins) {
      const day = format(new Date(login.createdAt), 'EEEE'); // e.g. "Monday"
      const role = login.user?.role ?? 'unknown';
      const userId = String(login.userId);
      const key = `${day}|${role}|${userId}`;

      if (seen.has(key)) continue;
      seen.add(key);

      if (!result[day]) result[day] = {};
      if (!result[day][role]) result[day][role] = 0;
      result[day][role]++;
    }

    return new ApiSuccessResponse(true, '', result);
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
