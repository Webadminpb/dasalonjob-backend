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
  Query,
} from '@nestjs/common';
import {
  AllowAuthenticated,
  GetUser,
} from 'src/common/decorators/auth-decorator';
import { JobOfferToSavedApplicantService } from './jobOfferToSavedApplicant.service';
import {
  CreateJobOfferToSavedApplicantDto,
  UpdateJobOfferToSavedApplicantDto,
} from './dto/create-jobOfferToSavedApplicant.dto';
import { Auth } from '@prisma/client';
import { QueryJobOfferToSavedApplicantDto } from './dto/query-jobOfferToSavedApplicant.dto';

@Controller('job-offer')
@AllowAuthenticated('AGENCY', 'USER')
export class JobOfferToSavedApplicantController {
  constructor(
    private readonly jobOfferService: JobOfferToSavedApplicantService,
  ) {}

  @Post('/agency')
  @HttpCode(HttpStatus.CREATED)
  createJobOffer(
    @Body() body: CreateJobOfferToSavedApplicantDto,
    @GetUser() user: Auth,
  ) {
    return this.jobOfferService.createJobOffer(user, body);
  }

  @Get('/applicant')
  @HttpCode(HttpStatus.OK)
  getJobOffers(
    @GetUser() user: Auth,
    @Query() query: QueryJobOfferToSavedApplicantDto,
  ) {
    return this.jobOfferService.getJobOffersForApplicant(query, user);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getJobOffer(@Param('id') id: string) {
    return this.jobOfferService.getJobOffer(id);
  }

  @Put('/applicant/:id')
  @HttpCode(HttpStatus.OK)
  updateJobOffer(
    @GetUser() user: Auth,
    @Param('id') id: string,
    @Body() body: UpdateJobOfferToSavedApplicantDto,
  ) {
    return this.jobOfferService.updateJobOfferStatus(id, body);
  }

  @Delete('/agency/:id')
  @HttpCode(HttpStatus.OK)
  deleteJobOffer(@Param('id') id: string) {
    return this.jobOfferService.deleteJobOffer(id);
  }
}
