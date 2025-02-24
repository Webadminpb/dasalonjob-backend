import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePartnerVenueDto } from './dto/create-partner-venue.dto';
import { UpdatePartnerVenueDto } from './dto/update-partner-venue.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { Auth } from '@prisma/client';

@Injectable()
export class PartnerVenueService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreatePartnerVenueDto) {
    const partnerVenue = await this.prismaService.partnerVenue.create({
      data: {
        venueBasicDetailsId: body.venueBasicDetailsId,
        salonBasicDetailsId: body.salonBasicDetailsId,
        venueAmenityIds: body.venueAmenityIds,
        venueWorkStationId: body.venueWorkStationId,
        userId: body.userId,
      },
    });
    return new ApiSuccessResponse(
      true,
      'Partner Venue created successfully',
      partnerVenue,
    );
  }

  async findAll(user: Auth) {
    const partnerVenues = await this.prismaService.partnerVenue.findMany({
      where: { userId: user.id },
      include: {
        venueBasicDetails: true,
        salonBasicDetails: true,
        venueAmenities: true,
        venueWorkStation: true,
        user: true,
      },
    });

    if (!partnerVenues) {
      throw new BadRequestException('No Partner Venues found');
    }
    return new ApiSuccessResponse(true, 'Partner Venues found', {
      partnerVenues,
    });
  }

  async findOne(id: string) {
    const partnerVenue = await this.prismaService.partnerVenue.findUnique({
      where: {
        id: id,
      },
      include: {
        venueBasicDetails: true,
        salonBasicDetails: true,
        venueAmenities: true,
        venueWorkStation: true,
        user: true,
      },
    });
    if (!partnerVenue) {
      throw new BadRequestException('Partner Venue not found');
    }
    return new ApiSuccessResponse(true, 'Partner Venue found', partnerVenue);
  }

  async update(id: string, body: UpdatePartnerVenueDto, user: Auth) {
    const existingPartnerVenue =
      await this.prismaService.partnerVenue.findUnique({
        where: {
          id: id,
          userId: user.id,
        },
      });
    if (!existingPartnerVenue) {
      throw new BadRequestException('Partner Venue not found');
    }
    const partnerVenue = await this.prismaService.partnerVenue.update({
      where: {
        id: id,
      },
      data: {
        venueBasicDetailsId: body.venueBasicDetailsId,
        salonBasicDetailsId: body.salonBasicDetailsId,
        venueAmenityIds: body.venueAmenityIds,
        venueWorkStationId: body.venueWorkStationId,
        userId: body.userId,
      },
    });
    return new ApiSuccessResponse(
      true,
      'Partner Venue updated successfully',
      partnerVenue,
    );
  }

  async remove(id: string, user: Auth) {
    const existingPartnerVenue =
      await this.prismaService.partnerVenue.findUnique({
        where: {
          id: id,
          userId: user.id,
        },
      });
    if (!existingPartnerVenue) {
      throw new BadRequestException('Partner Venue not found');
    }
    const partnerVenue = await this.prismaService.partnerVenue.delete({
      where: {
        id: id,
      },
    });
    return new ApiSuccessResponse(
      true,
      'Partner Venue deleted successfully',
      partnerVenue,
    );
  }
}
