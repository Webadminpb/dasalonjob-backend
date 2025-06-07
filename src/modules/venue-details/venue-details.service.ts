import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Auth, Prisma } from '@prisma/client';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { CreateVenueDetailsDto } from './dto/create-venue-detail.dto';
import { UpdateVenueDetailsDto } from './dto/update-venue-detail.dto';
import { QueryVenueDetailsDto } from './dto/query-venue-details.dto';
import { getPaginationSkip, getPaginationTake } from 'src/common/utils/common';

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
        state: body.state,
        country: body.country,
        zipCode: body.zipCode,
        fileIds: body.fileIds,
        userId: user.id,
        franchise: body.franchise,
        businessType: body.businessType,
        latitude: body.latitide,
        longitude: body.longitude,
      },
    });
    return new ApiSuccessResponse(true, 'Venue details added', venueDetails);
  }

  async findMyVenueDetails(query: QueryVenueDetailsDto, user: Auth) {
    const where: Prisma.VenueDetailsWhereInput = {
      userId: user.id,
    };
    if (query.search) {
      where.name = {
        contains: query.search,
        mode: 'insensitive',
      };
    }

    if (query.date) {
      const date = new Date(query.date);
      where.createdAt = {
        gte: new Date(date.setHours(0, 0, 0, 0)).toISOString(),
        lt: new Date(date.setHours(23, 59, 59, 999)).toISOString(),
      };
    }

    if (query.year) {
      const year = new Date(query.year).getFullYear();
      where.createdAt = {
        gte: new Date(year, 0, 1).toISOString(),
        lt: new Date(year + 1, 0, 1).toISOString(),
      };
    }

    const venueDetails = await this.prismaService.venueDetails.findMany({
      where,
      include: {
        files: true,
      },
      skip: getPaginationSkip(query.page, query.limit),
      take: getPaginationTake(query.limit),
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
