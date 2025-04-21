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
import { SponsoredJobService } from './sponsored-job-service';
import { CreateSponsoredJobDto } from './dto/create-sponsored-job.dto';
import { AllowAuthenticated } from 'src/common/decorators/auth-decorator';
import { QuerySponsoredJobDto } from './dto/query-sponsored-job.dto';
import { UpdateSponsoredJobDto } from './dto/update-sponsored-job.dto';

@Controller('sponsored-jobs')
export class SponsoredJobController {
  constructor(private readonly sponsoredJobService: SponsoredJobService) {}

  @Post('/admin')
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN')
  createSponsoredJob(@Body() body: CreateSponsoredJobDto) {
    return this.sponsoredJobService.createSponsoredjob(body);
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  getSponsoredJobs(@Query() query: QuerySponsoredJobDto) {
    return this.sponsoredJobService.getSponsoredJobs(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated()
  getSponsoredJobById(@Param('id') id: string) {
    return this.sponsoredJobService.getSponsoredJobById(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN')
  deleteSponsoredJob(@Param('id') id: string) {
    return this.sponsoredJobService.deleteSponsoredJobById(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN')
  updateSponsoredJob(
    @Param('id') id: string,
    @Body() body: UpdateSponsoredJobDto,
  ) {
    return this.sponsoredJobService.updateSponsoredJob(id, body);
  }
}
