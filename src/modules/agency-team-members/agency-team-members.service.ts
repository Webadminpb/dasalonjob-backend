import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { Auth, Role } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { CreateAgencyTeamMemberDto } from './dto/create-agency-team-member.dto';
import { UpdateAgencyTeamMemberDto } from './dto/update-agency-team-member.dto';
import { QueryAgencyTeamMembersDto } from './dto/query-agency-team-member.dto';
import { getPaginationSkip, getPaginationTake } from 'src/common/utils/common';

@Injectable()
export class AgencyTeamService {
  constructor(private readonly prisma: PrismaService) {}

  async addTeamMember(agencyOwner: Auth, dto: CreateAgencyTeamMemberDto) {
    const member = await this.prisma.auth.findUnique({
      where: { id: dto.memberId },
    });
    if (!member) {
      throw new NotFoundException('Member not found');
    }

    // Check if already part of team
    const existingTeamMember = await this.prisma.agencyTeam.findFirst({
      where: {
        agencyId: agencyOwner.id,
        memberId: dto.memberId,
      },
    });
    if (existingTeamMember) {
      throw new ConflictException('Member already part of your team');
    }

    // Validate role
    if (!['STAFF', 'MANAGER'].includes(dto.role)) {
      throw new ForbiddenException('Invalid role assignment');
    }

    const teamMember = await this.prisma.agencyTeam.create({
      data: {
        agencyId: agencyOwner.id,
        memberId: dto.memberId,
        // role: dto.role,
      },
      include: {
        member: {
          select: {
            id: true,
            email: true,
            role: true,
            profileImage: true,
          },
        },
      },
    });

    return new ApiSuccessResponse(
      true,
      'Team member added successfully',
      teamMember,
    );
  }

  async getTeamMembers(agencyOwner: Auth, query: QueryAgencyTeamMembersDto) {
    const where: any = {
      agencyId: agencyOwner.id,
    };

    if (query.role) {
      where.role = query.role;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      where.member = {
        OR: [
          { email: { contains: query.search, mode: 'insensitive' } },
          { phone: { contains: query.search, mode: 'insensitive' } },
        ],
      };
    }

    const orderBy = {
      [query.sort || 'createdAt']: query.order || 'desc',
    };

    const skip = getPaginationSkip(query.page, query.limit);
    const take = getPaginationTake(query.limit);

    const [teamMembers, total] = await Promise.all([
      this.prisma.agencyTeam.findMany({
        where,
        include: {
          member: {
            select: {
              id: true,
              email: true,
              phone: true,
              role: true,
              profileImage: true,
              createdAt: true,
            },
          },
        },
        skip,
        take,
        orderBy,
      }),
      this.prisma.agencyTeam.count({ where }),
    ]);

    return new ApiSuccessResponse(true, 'Team members retrieved', {
      total,
      teamMembers,
      page: query.page || 1,
      limit: take,
    });
  }

  async getTeamMember(agencyOwner: Auth, memberId: string) {
    const teamMember = await this.prisma.agencyTeam.findFirst({
      where: {
        agencyId: agencyOwner.id,
        memberId,
      },
      include: {
        member: {
          select: {
            id: true,
            email: true,
            phone: true,
            role: true,
            profileImage: true,
            createdAt: true,
            basicDetails: true,
            contactDetails: true,
          },
        },
      },
    });

    if (!teamMember) {
      throw new NotFoundException('Team member not found');
    }

    return new ApiSuccessResponse(
      true,
      'Team member details retrieved',
      teamMember,
    );
  }

  async updateTeamMember(
    agencyOwner: Auth,
    memberId: string,
    dto: UpdateAgencyTeamMemberDto,
  ) {
    const teamMember = await this.prisma.agencyTeam.findFirst({
      where: {
        agencyId: agencyOwner.id,
        memberId,
      },
    });

    if (!teamMember) {
      throw new NotFoundException('Team member not found');
    }

    const updated = await this.prisma.agencyTeam.update({
      where: { id: teamMember.id },
      data: {
        ...dto,
      },
      include: {
        member: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return new ApiSuccessResponse(
      true,
      'Team member updated successfully',
      updated,
    );
  }

  async removeTeamMember(agencyOwner: Auth, memberId: string) {
    const teamMember = await this.prisma.agencyTeam.findFirst({
      where: {
        agencyId: agencyOwner.id,
        memberId,
      },
    });

    if (!teamMember) {
      throw new NotFoundException('Team member not found');
    }

    await this.prisma.agencyTeam.delete({
      where: { id: teamMember.id },
    });

    return new ApiSuccessResponse(
      true,
      'Team member removed successfully',
      null,
    );
  }
}
