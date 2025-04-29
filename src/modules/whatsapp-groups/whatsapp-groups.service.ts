import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWhatsappGroupDto } from './dto/create-whatsapp-group.dto';
import { UpdateWhatsappGroupDto } from './dto/update-whatsapp-group.dto';
import { PrismaService } from '../prisma/prisma.service';
// import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { ApiSuccessResponse } from '../../common/api-response/api-success';
import { QueryWhatsAppDto } from './dto/query-whatsapp-group.dto';
import { Prisma } from '@prisma/client';
// import { getPaginationSkip, getPaginationTake } from 'src/common/utils/common';
import {
  getPaginationSkip,
  getPaginationTake,
} from '../../common/utils/common';

@Injectable()
export class WhatsappGroupsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreateWhatsappGroupDto) {
    const group = await this.prismaService.whatsAppGroup.create({
      data: {
        name: body.name,
        link: body.link,
        city: body.city,
        description: body.description,
      },
    });
    return new ApiSuccessResponse(
      true,
      'WhatsApp Group Created Successfully',
      group,
    );
  }

  async findAll(query: QueryWhatsAppDto) {
    const where: Prisma.WhatsAppGroupWhereInput = {};
    // if (query.search) {
    //   where.city = query.city;
    // }
    if (query.search) {
      where.OR = [
        {
          name: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          city: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
      ];
    }
    const [groups, total] = await Promise.all([
      this.prismaService.whatsAppGroup.findMany({
        where,
        skip: getPaginationSkip(query.page, query.limit),
        take: getPaginationTake(query.limit),
      }),
      this.prismaService.whatsAppGroup.count({ where }),
    ]);
    return new ApiSuccessResponse(true, 'Groups Data ', { groups, total });
  }

  async findOne(id: string) {
    const group = await this.prismaService.whatsAppGroup.findUnique({
      where: {
        id,
      },
    });
    if (!group) {
      throw new NotFoundException('WhatsApp Group Not Found');
    }
    return new ApiSuccessResponse(true, 'WhatsApp Group Date', group);
  }

  async update(id: string, body: UpdateWhatsappGroupDto) {
    const group = await this.prismaService.whatsAppGroup.findUnique({
      where: {
        id,
      },
    });
    if (!group) {
      throw new NotFoundException('WhatsApp Group Not Found');
    }
    const updatedGroup = await this.prismaService.whatsAppGroup.update({
      where: {
        id,
      },
      data: {
        ...body,
      },
    });
    return new ApiSuccessResponse(
      true,
      'WhatsApp Group Updated Successfully',
      updatedGroup,
    );
  }

  async remove(id: string) {
    const group = await this.prismaService.whatsAppGroup.findUnique({
      where: {
        id,
      },
    });
    if (!group) {
      throw new NotFoundException('WhatsApp Group Not Found');
    }
    await this.prismaService.whatsAppGroup.delete({
      where: {
        id,
      },
    });
    return new ApiSuccessResponse(
      true,
      'WhatsApp Group Deleted Successfully',
      null,
    );
  }

  async createWhatsAppGroup(dto: CreateWhatsappGroupDto): Promise<any> {
    const createWhatsAppGroup = await this.prismaService.whatsAppGroup.create({
      data: {
        link: dto.link,
        name: dto.name,
        city: dto.city,
        description: dto.description,
      },
    });

    return new ApiSuccessResponse(
      true,
      'WhatsApp group created successfully',
      createWhatsAppGroup,
    );
  }

  async getWhatAppGroups(query: QueryWhatsAppDto) {
    const where: Prisma.WhatsAppGroupWhereInput = {};

    const whatsAppGroups = await this.prismaService.whatsAppGroup.findMany();
  }

  #queryBuilder(query: QueryWhatsAppDto) {
    const where: Prisma.WhatsAppGroupWhereInput = {};
    if (query.city) {
      where.city = query.city;
    }

    if (query.search) {
      where.name = {
        contains: query.search,
        mode: 'insensitive',
      };
    }
    const skip = getPaginationSkip(query.page, query.limit);
    const page = getPaginationTake(query.limit);

    // return { where, skip, limit };
  }
}
