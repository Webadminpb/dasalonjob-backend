import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Auth } from '@prisma/client';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth-decorator';
import { AgencyJobQualificationService } from './agency-job-qualification.service';
import { CreateAgencyJobQualificationDto } from './dto/create-agency-job-qualification.dto';
import { UpdateAgencyJobQualificationDto } from './dto/update-agency-job-qualification.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('agency')
@Controller('agency-job-qualification')
export class AgencyJobQualificationController {
  constructor(
    private readonly agencyJobQualificationService: AgencyJobQualificationService,
  ) {}

  // Create a new job qualification
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('AGENCY')
  create(@Body() body: CreateAgencyJobQualificationDto, @GetUser() user: Auth) {
    return this.agencyJobQualificationService.create(body, user);
  }

  // Get all job qualifications for the current user
  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('AGENCY')
  findMyAgencyJobQualifications(@GetUser() user: Auth) {
    return this.agencyJobQualificationService.findMyAgencyJobQualifications(
      user,
    );
  }

  // Update a job qualification by ID
  @Put()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('AGENCY')
  update(
    @Body() body: UpdateAgencyJobQualificationDto,
    @Param('id') id: string,
    @GetUser() user: Auth,
  ) {
    return this.agencyJobQualificationService.update(user, body);
  }

  // Delete a job qualification by ID
  @Delete()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('AGENCY')
  remove(@GetUser() user: Auth) {
    return this.agencyJobQualificationService.remove(user);
  }
}
