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
import {
  getPaginationSkip,
  getPaginationTake,
  getSortBy,
  getSortOrder,
} from 'src/common/utils/common';
import { startOfDay, subDays, format } from 'date-fns';
@Injectable()
export class ActivityService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllActivities(query: QueryActivityDto) {
    if (!query.userId) {
      throw new BadRequestException('User Id is required');
    }

    const sevenDaysAgo = startOfDay(subDays(new Date(), 6));

    const skip = getPaginationSkip(query.page, query.limit);
    const take = getPaginationTake(query.limit);

    const activities = await this.prismaService.activity.findMany({
      where: {
        userId: query.userId,
        createdAt: {
          gte: sevenDaysAgo.toISOString(),
        },
      },
      include: {
        course: {
          select: {
            courseDetails: {
              select: {
                courseName: true,
              },
            },
          },
        },
        courseApplication: {
          select: {
            course: {
              select: {
                courseDetails: {
                  select: {
                    courseName: true,
                  },
                },
              },
            },
          },
        },
        job: {
          select: {
            jobBasicInfo: {
              select: {
                title: true,
              },
            },
          },
        },
        jobApplication: {
          select: {
            jobPost: {
              select: {
                jobBasicInfo: {
                  select: {
                    title: true,
                  },
                },
              },
            },
          },
        },
      },
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const groupedByDateMap: Map<string, typeof activities> = new Map();

    for (const activity of activities) {
      const isoDate = startOfDay(new Date(activity.createdAt)).toISOString();

      if (!groupedByDateMap.has(isoDate)) {
        groupedByDateMap.set(isoDate, []);
      }

      groupedByDateMap.get(isoDate)!.push(activity);
    }

    const groupedByDateArray = Array.from(groupedByDateMap.entries()).map(
      ([date, acts]) => ({
        date,
        activities: acts,
      }),
    );

    return {
      success: true,
      message: 'Grouped activities by date',
      data: groupedByDateArray, // ✅ direct array
      total: groupedByDateArray?.length ?? 0,
    };
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

    const roleUserMap: Record<string, Set<string>> = {
      ADMIN: new Set(),
      PARTNER: new Set(),
      USER: new Set(),
      AGENCY: new Set(),
    };

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

      if (roleUserMap[role]) {
        roleUserMap[role].add(userId);
      }
    }

    // const [totalApplicants, totalPartners, totalAdmins] = await Promise.all([
    //   this.prismaService.auth.count({
    //     where: {
    //       role: 'USER',
    //     },
    //   }),
    //   this.prismaService.auth.count({
    //     where: {
    //       role: 'PARTNER',
    //     },
    //   }),
    //   this.prismaService.auth.count({
    //     where: {
    //       role: 'ADMIN',
    //     },
    //   }),
    // ]);

    const totalApplicants = roleUserMap.USER.size;
    const totalPartners = roleUserMap.PARTNER.size;
    const totalAdmins = roleUserMap.ADMIN.size;
    const totalAgencies = roleUserMap.AGENCY.size;
    return new ApiSuccessResponse(true, '', {
      result,
      totalApplicants,
      totalPartners,
      totalAdmins,
      totalAgencies,
    });
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
