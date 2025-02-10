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
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('AGENCY')
  update(
    @Body() body: UpdateAgencyJobQualificationDto,
    @Param('id') id: string,
    @GetUser() user: Auth,
  ) {
    return this.agencyJobQualificationService.update(user, id, body);
  }

  // Delete a job qualification by ID
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('AGENCY')
  remove(@GetUser() user: Auth, @Param('id') id: string) {
    return this.agencyJobQualificationService.remove(user, id);
  }
}
