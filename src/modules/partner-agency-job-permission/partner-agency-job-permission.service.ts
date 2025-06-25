import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Auth, CollaborationInitiator, Prisma, Role } from '@prisma/client';
import { CreatePartnerAgencyPermissionDto } from './dto/create-partner-agency-job-permission.dto';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { QueryPartnerAgencyPermissionDto } from './dto/query-partner-agency-job-permission.dto';
import {
  getPaginationSkip,
  getPaginationTake,
  getSortBy,
  getSortOrder,
} from 'src/common/utils/common';
import { UpdatePartnerAgencyPermissionDto } from './dto/update-partner-agency-job-permission.dto';

@Injectable()
export class PartnerAgencyPermissionService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreatePartnerAgencyPermissionDto, user: Auth) {
    const existingPermission =
      await this.prismaService.partnerAgencyJobPermission.findUnique({
        where: {
          agencyId_partnerId: {
            agencyId: body.agencyId,
            partnerId: body.partnerId,
          },
        },
      });

    if (existingPermission) {
      throw new BadRequestException('Permission already exists');
    }

    const permission =
      await this.prismaService.partnerAgencyJobPermission.create({
        data: {
          partnerId: body.partnerId,
          agencyId: body.agencyId,
          requestedBy: body.requestedBy,
          partnerHasAccess: body.partnerHasAccess,
          agencyHasAccess: body.agencyHasAccess,
        },
      });

    return new ApiSuccessResponse(true, 'Permission created', permission);
  }

  async findAll(query: QueryPartnerAgencyPermissionDto) {
    const where: Prisma.PartnerAgencyJobPermissionWhereInput = {};

    if (query.partnerId) {
      where.partnerId = query.partnerId;
    }

    if (query.agencyId) {
      where.agencyId = query.agencyId;
    }

    if (query.partnerHasAccess !== undefined) {
      where.partnerHasAccess = query.partnerHasAccess;
    }

    if (query.agencyHasAccess !== undefined) {
      where.agencyHasAccess = query.agencyHasAccess;
    }

    const skip = getPaginationSkip(query.page, query.limit);
    const take = getPaginationTake(query.limit);
    const sortOrder = getSortOrder(query.order);
    const orderBy = getSortBy(query.sort);

    const [permissions, total] = await Promise.all([
      this.prismaService.partnerAgencyJobPermission.findMany({
        where,
        include: {
          partner: true,
          agency: true,
        },
        skip,
        take,
        orderBy: {
          [orderBy]: sortOrder,
        },
      }),
      this.prismaService.partnerAgencyJobPermission.count({ where }),
    ]);

    return new ApiSuccessResponse(true, 'Permissions fetched', {
      total,
      permissions,
    });
  }

  async findOne(id: string) {
    const permission =
      await this.prismaService.partnerAgencyJobPermission.findUnique({
        where: { id },
        include: {
          partner: true,
          agency: true,
        },
      });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    return new ApiSuccessResponse(true, 'Permission fetched', permission);
  }

  async update(id: string, body: UpdatePartnerAgencyPermissionDto) {
    const existingPermission =
      await this.prismaService.partnerAgencyJobPermission.findUnique({
        where: { id },
      });

    if (!existingPermission) {
      throw new NotFoundException('Permission not found');
    }

    const updatedPermission =
      await this.prismaService.partnerAgencyJobPermission.update({
        where: { id },
        data: {
          partnerHasAccess: body.partnerHasAccess,
          agencyHasAccess: body.agencyHasAccess,
        },
      });

    return new ApiSuccessResponse(
      true,
      'Permission updated',
      updatedPermission,
    );
  }

  async remove(id: string) {
    const existingPermission =
      await this.prismaService.partnerAgencyJobPermission.findUnique({
        where: { id },
      });

    if (!existingPermission) {
      throw new NotFoundException('Permission not found');
    }

    await this.prismaService.partnerAgencyJobPermission.delete({
      where: { id },
    });

    return new ApiSuccessResponse(true, 'Permission deleted', null);
  }

  async checkPermission(partnerId: string, agencyId: string) {
    const permission =
      await this.prismaService.partnerAgencyJobPermission.findUnique({
        where: {
          agencyId_partnerId: {
            agencyId,
            partnerId,
          },
        },
      });

    return (
      permission?.partnerHasAccess === true &&
      permission?.agencyHasAccess === true
    );
  }

  async approvePermission(id: string, approver: Auth) {
    const existing =
      await this.prismaService.partnerAgencyJobPermission.findUnique({
        where: { id },
      });
    if (!existing) throw new NotFoundException('Permission not found');

    const isPartner = approver.role === 'PARTNER';

    const updated = await this.prismaService.partnerAgencyJobPermission.update({
      where: { id },
      data: {
        approvedBy: isPartner ? Role.PARTNER : Role.AGENCY,
        approvedAt: new Date()?.toDateString(),
        partnerHasAccess: isPartner ? true : existing.partnerHasAccess,
        agencyHasAccess: isPartner ? existing.agencyHasAccess : true,
      },
    });

    return new ApiSuccessResponse(true, 'Permission approved', updated);
  }

  async getPendingRequests(role: CollaborationInitiator, userId: string) {
    const where: Prisma.PartnerAgencyJobPermissionWhereInput = {};
    if (role === Role.PARTNER) {
      (where.partnerId = userId), (where.agencyHasAccess = false);
    } else {
      (where.agencyId = userId), (where.partnerHasAccess = false);
    }

    const [results, total] = await Promise.all([
      this.prismaService.partnerAgencyJobPermission.findMany({
        where,
        include: {
          partner: true,
          agency: true,
        },
      }),
      this.prismaService.partnerAgencyJobPermission.count({
        where,
      }),
    ]);

    return new ApiSuccessResponse(true, 'Pending requests fetched', {
      results,
      total,
    });
  }
}
