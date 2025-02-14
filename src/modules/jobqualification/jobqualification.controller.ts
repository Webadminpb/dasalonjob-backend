import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  HttpStatus,
  HttpCode,
  Put,
  Param,
} from '@nestjs/common';
import { Auth } from '@prisma/client';
import { JobQualificationService } from './jobqualification.service';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth-decorator';
import { CreateJobQualificationDto } from './dto/create-jobqualification.dto';
import { UpdateJobQualificationDto } from './dto/update-jobqualification.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('partner')
@Controller('job-qualification')
export class JobQualificationController {
  constructor(
    private readonly jobQualificationService: JobQualificationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('PARTNER')
  create(@Body() body: CreateJobQualificationDto, @GetUser() user: Auth) {
    return this.jobQualificationService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  findMyJobQualification(@GetUser() user: Auth) {
    return this.jobQualificationService.findMyJobQualification(user);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  update(
    @Body() body: UpdateJobQualificationDto,
    @GetUser() user: Auth,
    @Param('id') id: string,
  ) {
    return this.jobQualificationService.update(id, user, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('PARTNER')
  remove(@GetUser() user: Auth, @Param('id') id: string) {
    return this.jobQualificationService.remove(id, user);
  }
}
