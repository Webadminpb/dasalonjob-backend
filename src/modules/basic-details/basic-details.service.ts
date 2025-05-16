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
    const existingBasicDetails =
      await this.prismaService.basicDetails.findUnique({
        where: {
          userId: user.id,
        },
      });
    console.log(existingBasicDetails);
    if (existingBasicDetails) {
      throw new BadRequestException('Basic Details already added');
    }
    console.log('dob ', body.dob, typeof body.dob);
    const basicDetails = await this.prismaService.basicDetails.create({
      data: {
        userId: user.id,
        firstName: body.firstName,
        lastName: body.lastName,
        gender: body.gender,
        dob: body.dob as any,
        martialStatus: body.martialStatus,
        fileId: body.fileId,
      },
    });
    return new ApiSuccessResponse(true, 'basic details added', basicDetails);
  }

  async findMyBasicDetails(user: Auth) {
    const basicDetails = await this.prismaService.basicDetails.findUnique({
      where: {
        userId: user.id,
      },
      include: {
        file: true,
        user: true,
      },
    });
    if (!basicDetails) {
      throw new NotFoundException('Basic details not found');
    }
    return new ApiSuccessResponse(true, 'Basic details fetched', basicDetails);
  }

  async update(body: UpdateBasicdetailDto, user: Auth) {
    const existingBasicDetails =
      await this.prismaService.basicDetails.findUnique({
        where: {
          userId: user.id,
        },
      });
    if (!existingBasicDetails) {
      throw new NotFoundException('Basic details not found');
    }
    console.log('dob ', body?.dob, typeof body?.dob);
    const updatedBasicDetails = await this.prismaService.basicDetails.update({
      where: {
        id: existingBasicDetails.id,
      },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        gender: body.gender,
        dob: body.dob as any,
        martialStatus: body.martialStatus,
        fileId: body.fileId,
      },
    });
    return new ApiSuccessResponse(
      true,
      'Basic details updated',
      updatedBasicDetails,
    );
  }

  async remove(user: Auth) {
    const existingBasicDetails =
      await this.prismaService.basicDetails.findUnique({
        where: {
          userId: user.id,
        },
      });
    if (!existingBasicDetails) {
      throw new NotFoundException('Basic details not found');
    }

    await this.prismaService.basicDetails.delete({
      where: {
        id: existingBasicDetails.id,
      },
    });
    return new ApiSuccessResponse(true, 'Basic details deleted', null);
  }
}
