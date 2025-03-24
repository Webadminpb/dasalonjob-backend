import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UpdateContactdetailDto } from './dto/update-contactdetail.dto';
import { Auth } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';
import { CreateContactDetailsDto } from './dto/create-contactdetail.dto';

@Injectable()
export class ContactdetailsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreateContactDetailsDto, user: Auth) {
    const existingContactDetails =
      await this.prismaService.contactDetails.findUnique({
        where: {
          userId: user.id,
        },
      });
    if (existingContactDetails) {
      throw new BadRequestException('Contact Details already added');
    }
    const contactDetails = await this.prismaService.contactDetails.create({
      data: {
        userId: user.id,
        phoneCode: body.phoneCode,
        phoneNumber: body.phoneNumber,
        zipCode: body.zipCode,
        state: body.state,
        city: body.city,
        streetAddress: body.streetAddress,
        longitude: body.longitude,
        latitude: body.latitude,
      },
    });
    return new ApiSuccessResponse(
      true,
      'contact details added',
      contactDetails,
    );
  }

  async findMyContactDetails(user: Auth) {
    const contactDetails = await this.prismaService.contactDetails.findUnique({
      where: {
        userId: user.id,
      },
    });
    if (!contactDetails) {
      throw new NotFoundException('Contact details not found');
    }
    return new ApiSuccessResponse(
      true,
      'Contact details fetched',
      contactDetails,
    );
  }

  async update(id: string, body: UpdateContactdetailDto, user: Auth) {
    const existingContactDetails =
      await this.prismaService.contactDetails.findUnique({
        where: {
          id: id,
          userId: user.id,
        },
      });
    if (!existingContactDetails) {
      throw new NotFoundException('Contact details not found');
    }

    const updatedBasicDetails = await this.prismaService.contactDetails.update({
      where: {
        id: id,
      },
      data: {
        ...body,
      },
    });
    return new ApiSuccessResponse(
      true,
      'Contact details updated',
      updatedBasicDetails,
    );
  }

  async remove(id: string, user: Auth) {
    const existingContactDetails =
      await this.prismaService.contactDetails.findUnique({
        where: {
          id: id,
          userId: user.id,
        },
      });
    if (!existingContactDetails) {
      throw new NotFoundException('Contact details not found');
    }

    await this.prismaService.contactDetails.delete({
      where: {
        id: id,
      },
    });
    return new ApiSuccessResponse(true, 'Contact details deleted', null);
  }
}
