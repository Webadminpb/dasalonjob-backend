import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Auth } from '@prisma/client';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { CreateVenueDetailsDto } from './dto/create-venuedetail.dto';
import { UpdateVenueDetailsDto } from './dto/update-venuedetail.dto';

@Injectable()
export class VenueDetailsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreateVenueDetailsDto, user: Auth) {
    const venueDetails = await this.prismaService.venueDetails.create({
      data: {
        name: body.name,
        email: body.email,
        phoneCode: body.phoneCode,
        phoneNumber: body.phoneNumber,
        city: body.city,
        streetAddress: body.streetAddress,
        gender: body.gender,
        zipCode: body.zipCode,
        fileIds: body.fileIds,
        userId: user.id,
        businessType: body.businessType,
      },
    });
    return new ApiSuccessResponse(true, 'Venue details added', venueDetails);
  }

  async findMyVenueDetails(user: Auth) {
    const venueDetails = await this.prismaService.venueDetails.findMany({
      where: { userId: user.id },
      include: {
        files: true,
      },
    });
    if (!venueDetails) {
      throw new NotFoundException('Venue details not found');
    }
    return new ApiSuccessResponse(true, 'Venue details found', venueDetails);
  }

  async update(id: string, user: Auth, body: UpdateVenueDetailsDto) {
    const existingVenueDetails =
      await this.prismaService.venueDetails.findUnique({
        where: { id, userId: user.id },
      });
    if (!existingVenueDetails) {
      throw new NotFoundException('Venue details not found');
    }
    const updatedVenueDetails = await this.prismaService.venueDetails.update({
      where: { id: existingVenueDetails.id },
      data: {
        ...body,
      },
    });
    return new ApiSuccessResponse(
      true,
      'Venue details updated',
      updatedVenueDetails,
    );
  }

  async remove(id: string, user: Auth) {
    const existingVenueDetails =
      await this.prismaService.venueDetails.findUnique({
        where: { id, userId: user.id },
      });
    if (!existingVenueDetails) {
      throw new NotFoundException('Venue details not found');
    }
    await this.prismaService.venueDetails.delete({
      where: { id: existingVenueDetails.id },
    });
    return new ApiSuccessResponse(true, 'Venue details deleted', null);
  }
}
