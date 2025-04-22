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
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '@prisma/client';
import {
  AllowAuthenticated,
  GetUser,
} from 'src/common/decorators/auth-decorator';
import { CreateASaveJobPostDto } from './dto/create-save-job-post.dto';
import { UpdateSaveJobPostDto } from './dto/update-save-job-post.dto';
import { SaveJobPostService } from './save-job-post.service';

@ApiTags('applicant')
@Controller('save-job-post')
export class SaveJobPostController {
  constructor(private readonly saveJobPostService: SaveJobPostService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @AllowAuthenticated('USER', 'AGENCY')
  create(@Body() body: CreateASaveJobPostDto, @GetUser() user: Auth) {
    return this.saveJobPostService.create(body, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER', 'AGENCY')
  findAll(@GetUser() user: Auth) {
    return this.saveJobPostService.findAll(user);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER', 'AGENCY')
  findOne(@Param('id') id: string, @GetUser() user: Auth) {
    return this.saveJobPostService.findOne(id, user);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER', 'AGENCY')
  update(
    @Param('id') id: string,
    @Body() body: UpdateSaveJobPostDto,
    @GetUser() user: Auth,
  ) {
    return this.saveJobPostService.update(id, body, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('USER', 'AGENCY')
  remove(@Param('id') id: string, @GetUser() user: Auth) {
    return this.saveJobPostService.remove(id, user);
  }
}
