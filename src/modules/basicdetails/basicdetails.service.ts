import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Auth } from '@prisma/client';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBasicdetailDto } from './dto/create-basicdetail.dto';
import { UpdateBasicdetailDto } from './dto/update-basicdetail.dto';

@Injectable()
export class BasicdetailsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreateBasicdetailDto, user: Auth) {
    const existingBasicDetails = this.prismaService.basicDetails.findUnique({
      where: {
        userId: user.id,
      },
    });
    if (existingBasicDetails) {
      throw new BadRequestException('Basic Details already added');
    }
    const basicDetails = await this.prismaService.basicDetails.create({
      data: {
        userId: user.id,
        fullName: body.fullName,
        gender: body.gender,
        dob: body.dob,
        maritalStatus: body.maritalStatus,
      },
    });
    return new ApiSuccessResponse(true, 'basic details added', basicDetails);
  }

  async findOne(user: Auth) {
    const basicDetails = await this.prismaService.basicDetails.findUnique({
      where: {
        userId: user.id,
      },
    });
    if (!basicDetails) {
      throw new NotFoundException('Basic details not found');
    }
    return new ApiSuccessResponse(true, 'Basic details fetched', basicDetails);
  }

  async update(id: string, body: UpdateBasicdetailDto, user: Auth) {
    const existingBasicDetails =
      await this.prismaService.basicDetails.findUnique({
        where: {
          id: id,
          userId: user.id,
        },
      });
    if (!existingBasicDetails) {
      throw new NotFoundException('Basic details not found');
    }

    const updatedBasicDetails = await this.prismaService.basicDetails.update({
      where: {
        id: id,
      },
      data: {
        ...body,
      },
    });
    return new ApiSuccessResponse(
      true,
      'Basic details updated',
      updatedBasicDetails,
    );
  }

  async remove(id: string, user: Auth) {
    const existingBasicDetails =
      await this.prismaService.basicDetails.findUnique({
        where: {
          id: id,
          userId: user.id,
        },
      });
    if (!existingBasicDetails) {
      throw new NotFoundException('Basic details not found');
    }

    await this.prismaService.basicDetails.delete({
      where: {
        id: id,
      },
    });
    return new ApiSuccessResponse(true, 'Basic details deleted', null);
  }
}
