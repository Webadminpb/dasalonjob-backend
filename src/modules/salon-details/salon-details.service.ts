import { Injectable, NotFoundException } from '@nestjs/common';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSalonDetailsDto } from './dto/create-salondetail.dto';
import { UpdateSalonDetailDto } from './dto/update-salondetail.dto';
import { Auth } from '@prisma/client';

@Injectable()
export class SalondetailsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreateSalonDetailsDto, user: Auth) {
    const salonDetails = await this.prismaService.salonDetails.create({
      data: {
        businessName: body.businessName,
        email: body.email,
        ownerName: body.email,
        phoneCode: body.phoneCode,
        phoneNumber: body.phoneNumber,
        userId: user.id,
        fileIds: body.fileIds,
        firstName: body.firstName,
        lastName: body.lastName,
        ...(body?.dob && { dob: new Date(body?.dob)?.toISOString() }),
        gender: body.gender,
      },
    });
    return new ApiSuccessResponse(true, 'Salon details added', salonDetails);
  }

  async findMySalonDetails(user: Auth) {
    const salonDetails = await this.prismaService.salonDetails.findMany({
      where: { userId: user.id },
    });
    if (!salonDetails) {
      throw new NotFoundException('Salon details not found');
    }
    return new ApiSuccessResponse(true, 'Salon details found', {
      salonDetails,
    });
  }

  async update(id: string, user: Auth, body: UpdateSalonDetailDto) {
    const existingSalonDetails =
      await this.prismaService.salonDetails.findUnique({
        where: { id, userId: user.id },
      });
    if (!existingSalonDetails) {
      throw new NotFoundException('Salon details not found');
    }
    const updatedSalonDetails = await this.prismaService.salonDetails.update({
      where: { id: existingSalonDetails.id },
      data: {
        businessName: body.businessName,
        email: body.email,
        ownerName: body.email,
        phoneCode: body.phoneCode,
        phoneNumber: body.phoneNumber,
        fileIds: body.fileIds,
        firstName: body.firstName,
        lastName: body.lastName,
        ...(body.dob && { dob: new Date(body.dob).toISOString() }),
      },
    });
    return new ApiSuccessResponse(
      true,
      'Salon details updated',
      updatedSalonDetails,
    );
  }

  async remove(id: string, user: Auth) {
    const existingSalonDetails =
      await this.prismaService.salonDetails.findUnique({
        where: { id, userId: user.id },
      });
    if (!existingSalonDetails) {
      throw new NotFoundException('Salon details not found');
    }
    await this.prismaService.salonDetails.delete({
      where: { id: existingSalonDetails.id },
    });
    return new ApiSuccessResponse(true, 'Salon details deleted', null);
  }
}
