import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ApiSuccessResponse } from 'src/common/api-response/api-success';

@Injectable()
export class CountryService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(body: CreateCountryDto) {
    const country = await this.prismaService.country.create({
      data: {
        name: body.name,
        code: body.code,
        currencyName: body.currencyName,
        currencySymbol: body.currencySymbol,
        currencyCode: body.currencyCode,
        pincodeLength: body.pincodeLength,
        phoneNumberLength: body.phoneNumberLength,
        status: body.status,
      },
    });
    return new ApiSuccessResponse(
      true,
      'Country created successfully',
      country,
    );
  }

  findAll() {
    const countries = this.prismaService.country.findMany();
    if (!countries) {
      throw new BadRequestException('No countries found');
    }
    return new ApiSuccessResponse(true, 'Countries found', countries);
  }

  findOne(id: string) {
    const country = this.prismaService.country.findUnique({
      where: {
        id: id,
      },
    });
    if (!country) {
      throw new BadRequestException('Country not found');
    }
    return new ApiSuccessResponse(true, 'Country found', country);
  }

  async update(id: string, body: UpdateCountryDto) {
    const existingCountry = await this.prismaService.country.findUnique({
      where: {
        id: id,
      },
    });
    if (!existingCountry) {
      throw new BadRequestException('Country not found');
    }
    const country = await this.prismaService.country.update({
      where: {
        id: id,
      },
      data: {
        name: body.name,
        code: body.code,
        currencyName: body.currencyName,
        currencySymbol: body.currencySymbol,
        currencyCode: body.currencyCode,
        pincodeLength: body.pincodeLength,
        phoneNumberLength: body.phoneNumberLength,
        status: body.status,
      },
    });
    return new ApiSuccessResponse(
      true,
      'Country updated successfully',
      country,
    );
  }

  async remove(id: string) {
    const existingCountry = await this.prismaService.country.findUnique({
      where: {
        id: id,
      },
    });
    if (!existingCountry) {
      throw new BadRequestException('Country not found');
    }
    const country = await this.prismaService.country.delete({
      where: {
        id: id,
      },
    });
    return new ApiSuccessResponse(
      true,
      'Country updated successfully',
      country,
    );
  }
}
