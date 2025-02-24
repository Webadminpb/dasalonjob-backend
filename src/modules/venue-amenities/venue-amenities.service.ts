import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { CreateVenueAmenitiesDto } from './dto/create-venue-amenity.dto';
import { Auth } from '@prisma/client';
import { UpdateVenueAmenityDto } from './dto/update-venue-amenity.dto';

@Injectable()
export class VenueAmenitiesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreateVenueAmenitiesDto, user: Auth) {
    const venueAmenities = await this.prismaService.venueAmenities.create({
      data: {
        amenities: body.amenities,
        userId: user.id,
      },
    });
    return new ApiSuccessResponse(
      true,
      'Venue Amenities created successfully',
      venueAmenities,
    );
  }

  async findAll(user: Auth) {
    const venueAmenities = await this.prismaService.venueAmenities.findMany({
      where: { userId: user.id },
    });
    if (!venueAmenities) {
      throw new BadRequestException('No Venue Amenities found');
    }
    return new ApiSuccessResponse(true, 'Venue Amenities found', {
      venueAmenities,
    });
  }

  async findOne(id: string) {
    const venueAmenities = await this.prismaService.venueAmenities.findUnique({
      where: {
        id: id,
      },
    });
    if (!venueAmenities) {
      throw new BadRequestException('Venue Amenities not found');
    }
    return new ApiSuccessResponse(
      true,
      'Venue Amenities found',
      venueAmenities,
    );
  }

  async update(id: string, body: UpdateVenueAmenityDto, user: Auth) {
    const existingVenueAmenities =
      await this.prismaService.venueAmenities.findUnique({
        where: {
          id: id,
        },
      });
    if (!existingVenueAmenities) {
      throw new BadRequestException('Venue Amenities not found');
    }
    const venueAmenities = await this.prismaService.venueAmenities.update({
      where: {
        id: id,
      },
      data: {
        amenities: body.amenities,
        userId: user.id,
      },
    });
    return new ApiSuccessResponse(
      true,
      'Venue Amenities updated successfully',
      venueAmenities,
    );
  }

  async remove(id: string, user: Auth) {
    const existingVenueAmenities =
      await this.prismaService.venueAmenities.findUnique({
        where: {
          id: id,
          userId: user.id,
        },
      });
    if (!existingVenueAmenities) {
      throw new BadRequestException('Venue Amenities not found');
    }
    const venueAmenities = await this.prismaService.venueAmenities.delete({
      where: {
        id: id,
      },
    });
    return new ApiSuccessResponse(
      true,
      'Venue Amenities deleted successfully',
      venueAmenities,
    );
  }
}
