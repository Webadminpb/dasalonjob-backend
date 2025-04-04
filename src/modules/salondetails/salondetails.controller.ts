import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  HttpStatus,
  HttpCode,
  Put,
  Param,
} from '@nestjs/common';
import { SalondetailsService } from './salondetails.service';
import { CreateSalonDetailsDto } from './dto/create-salondetail.dto';
import { UpdateSalonDetailDto } from './dto/update-salondetail.dto';
import { Auth } from '@prisma/client';
import {
  AllowAuthenticated,
  GetUser,
} from 'src/common/decorators/auth-decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('partner')
@ApiBearerAuth()
@Controller('salon-details')
export class SalondetailsController {
  constructor(private readonly salondetailsService: SalondetailsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('PARTNER')
  @ApiOperation({ summary: 'Create salon details' })
  @ApiBody({ type: CreateSalonDetailsDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Salon details created successfully.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  create(@Body() body: CreateSalonDetailsDto, @GetUser() user: Auth) {
    return this.salondetailsService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  @ApiOperation({ summary: 'Get salon details' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Salon details retrieved successfully.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  findMySalonDetails(@GetUser() user: Auth) {
    return this.salondetailsService.findMySalonDetails(user);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  @ApiOperation({ summary: 'Update salon details' })
  @ApiBody({ type: UpdateSalonDetailDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Salon details updated successfully.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  update(
    @Param('id') id: string,
    @Body() body: UpdateSalonDetailDto,
    @GetUser() user: Auth,
  ) {
    return this.salondetailsService.update(id, user, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete salon details' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Salon details deleted successfully.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  remove(@GetUser() user: Auth, @Param('id') id: string) {
    return this.salondetailsService.remove(id, user);
  }
}
