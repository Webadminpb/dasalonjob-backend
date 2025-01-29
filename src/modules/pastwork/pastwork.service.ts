import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePastworkDto } from './dto/create-pastwork.dto';
import { UpdatePastworkDto } from './dto/update-pastwork.dto';
import { Auth } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { GetUser } from 'src/common/auth/auth-decorator';

@Injectable()
export class PastworkService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreatePastworkDto, user: Auth) {
    const pastWork = await this.prismaService.pastWork.create({
      data: {
        userId: user.id,
        videoLink: body.videoLink,
      },
    });
    return new ApiSuccessResponse(true, 'past work added ', pastWork);
  }

  async findMyPastWork(@GetUser() user: Auth) {
    const pastWork = await this.prismaService.pastWork.findUnique({
      where: {
        userId: user.id,
      },
    });
    if (!pastWork) {
      throw new NotFoundException('past work not found');
    }
    return new ApiSuccessResponse(true, 'past work data', pastWork);
  }

  async update(id: string, body: UpdatePastworkDto, user: Auth) {
    const existingPastWork = await this.prismaService.pastWork.findUnique({
      where: {
        userId: user.id,
        id,
      },
    });
    if (!existingPastWork) {
      throw new NotFoundException('past work not found');
    }
    const updatedPastWork = await this.prismaService.pastWork.update({
      where: { id: existingPastWork.id },
      data: { ...body },
    });
    return new ApiSuccessResponse(true, 'past work updated', updatedPastWork);
  }

  async remove(id: string, user: Auth) {
    const existingPastWork = await this.prismaService.pastWork.findUnique({
      where: {
        userId: user.id,
        id,
      },
    });
    if (!existingPastWork) {
      throw new NotFoundException('past work not found');
    }
    await this.prismaService.pastWork.delete({
      where: { id: existingPastWork.id },
    });
    return new ApiSuccessResponse(true, 'past work deleted', null);
  }
}
