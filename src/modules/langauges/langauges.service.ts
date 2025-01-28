import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLangaugeDto } from './dto/create-langauge.dto';
import { UpdateLangaugeDto } from './dto/update-langauge.dto';
import { Auth } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';

@Injectable()
export class LangaugesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreateLangaugeDto, user: Auth) {
    const langauge = await this.prismaService.langauges.create({
      data: {
        userId: user.id,
        langauge: body.langauge,
        proficiency: body.proficiency,
      },
    });
    return new ApiSuccessResponse(
      true,
      'new langauge addedd successfully',
      langauge,
    );
  }

  async findAllUserLangauges(user: Auth) {
    const langauges = this.prismaService.langauges.findMany({
      where: {
        userId: user.id,
      },
    });
    if (!langauges) {
      throw new NotFoundException('Lanagauge not found');
    }
    return new ApiSuccessResponse(true, 'langauages', { langauges });
  }

  async findOne(id: string) {
    const langauage = await this.prismaService.langauges.findUnique({
      where: {
        id,
      },
    });
    if (!langauage) {
      throw new NotFoundException('langauage not found');
    }
    return new ApiSuccessResponse(true, 'Langauage data ', langauage);
  }

  async update(id: string, body: UpdateLangaugeDto, user: Auth) {
    const existingLangauage = await this.prismaService.langauges.findUnique({
      where: {
        id,
        userId: user.id,
      },
    });
    if (!existingLangauage) {
      throw new NotFoundException('langauage not found');
    }
    const langauge = await this.prismaService.langauges.update({
      where: { id },
      data: {
        ...body,
      },
    });
    return new ApiSuccessResponse(true, 'Langauage updated', langauge);
  }

  async remove(id: string, user: Auth) {
    const existingLangauage = await this.prismaService.langauges.findUnique({
      where: {
        id,
        userId: user.id,
      },
    });
    if (!existingLangauage) {
      throw new NotFoundException('langauage not found');
    }
    await this.prismaService.langauges.delete({
      where: { id },
    });
    return new ApiSuccessResponse(true, 'Langauage deleted', null);
  }
}
