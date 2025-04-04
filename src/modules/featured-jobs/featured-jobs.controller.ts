import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Put,
  Query,
} from '@nestjs/common';
import { CreateFeaturedJobDto } from './dto/create-featured-job.dto';
import { UpdateFeaturedJobDto } from './dto/update-featured-job.dto';
import {
  AllowAuthenticated,
  GetUser,
} from 'src/common/decorators/auth-decorator';
import { Auth } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { QueryFeaturedJobDto } from './dto/query-featured-job.dto';
import { FeaturedJobService } from './featured-jobs.service';

@ApiTags('admin/featured-jobs')
@Controller('featured-jobs')
export class FeaturedJobController {
  constructor(private readonly featuredJobService: FeaturedJobService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN')
  create(@Body() body: CreateFeaturedJobDto, @GetUser() user: Auth) {
    return this.featuredJobService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query() query: QueryFeaturedJobDto) {
    return this.featuredJobService.findAll(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN')
  findOne(@Param('id') id: string) {
    return this.featuredJobService.findOne(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN')
  update(
    @Param('id') id: string,
    @Body() body: UpdateFeaturedJobDto,
    @GetUser() user: Auth,
  ) {
    return this.featuredJobService.update(id, body, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN')
  remove(@Param('id') id: string) {
    return this.featuredJobService.remove(id);
  }

  @Post(':id/record-impression')
  @HttpCode(HttpStatus.OK)
  recordImpression(@Param('id') id: string) {
    return this.featuredJobService.recordImpression(id);
  }

  @Post(':id/record-click')
  @HttpCode(HttpStatus.OK)
  recordClick(@Param('id') id: string) {
    return this.featuredJobService.recordClick(id);
  }
}
