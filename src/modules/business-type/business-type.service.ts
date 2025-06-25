import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusinessTypeDto } from './dto/create-business-type.dto';
import { UpdateBusinessTypeDto } from './dto/update-business-type.dto';
import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { QueryBusinessTypeDto } from './dto/query-business-type.dto';
import { getPaginationSkip, getPaginationTake } from 'src/common/utils/common';

export class BusinessTypeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreateBusinessTypeDto) {
    const data = await this.prisma.businessType.create({
      data: {
        name: body.name,
        fileId: body.fileId,
        status: body.status,
      },
    });
    return new ApiSuccessResponse(true, 'Business Type created success', data);
  }

  async update(id: string, body: UpdateBusinessTypeDto) {
    const isExists = await this.prisma.businessType.findUnique({
      where: { id },
    });
    if (!isExists) throw new NotFoundException('Business Type not found');
    const updatedBusinessType = await this.prisma.businessType.update({
      where: { id },
      data: { name: body.name, fileId: body.fileId, status: body.status },
    });
    return new ApiSuccessResponse(
      true,
      'BusinessType Updated successfully',
      updatedBusinessType,
    );
  }

  async delete(id: string) {
    const isExists = await this.prisma.businessType.findUnique({
      where: { id },
    });
    if (!isExists) throw new NotFoundException('Business Type not found');

    await this.prisma.businessType.delete({ where: { id } });
    return new ApiSuccessResponse(
      true,
      'BusinessType deleted successfully',
      null,
    );
  }

  async findOne(id: string) {
    const businessType = await this.prisma.businessType.findUnique({
      where: { id },
    });
    if (!businessType) throw new NotFoundException('Business Type not found');

    return new ApiSuccessResponse(
      true,
      'Business Type data fetched successfully',
      businessType,
    );
  }

  async findMany(query: QueryBusinessTypeDto) {
    const where: Prisma.BusinessTypeWhereInput = {};
    if (query.search) {
      where.name = {
        contains: query.search,
        mode: 'insensitive',
      };
    }
    const skip = getPaginationSkip(query.page, query.limit);
    const take = getPaginationTake(query.limit);

    const [businessTypes, total] = await Promise.allSettled([
      this.prisma.businessType.findMany({
        where,
        include: { file: true },
        skip,
        take,
      }),
      this.prisma.businessType.count({}),
    ]);
    return new ApiSuccessResponse(true, 'Business Types fetched successfully', {
      businessTypes,
      total,
    });
  }
}
