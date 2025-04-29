import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { WhatsappGroupsService } from './whatsapp-groups.service';
import { CreateWhatsappGroupDto } from './dto/create-whatsapp-group.dto';
import { UpdateWhatsappGroupDto } from './dto/update-whatsapp-group.dto';
import { AllowAuthenticated } from '../../common/decorators/auth-decorator';
import { QueryWhatsAppDto } from './dto/query-whatsapp-group.dto';

@Controller('whatsapp-groups')
export class WhatsappGroupsController {
  constructor(private readonly whatsappGroupsService: WhatsappGroupsService) {}

  @Post('admin')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN')
  create(@Body() body: CreateWhatsappGroupDto) {
    return this.whatsappGroupsService.create(body);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query() query: QueryWhatsAppDto) {
    return this.whatsappGroupsService.findAll(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN')
  findOne(@Param('id') id: string) {
    return this.whatsappGroupsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN')
  update(@Param('id') id: string, @Body() body: UpdateWhatsappGroupDto) {
    return this.whatsappGroupsService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @AllowAuthenticated('ADMIN', 'SUPER_ADMIN')
  remove(@Param('id') id: string) {
    return this.whatsappGroupsService.remove(id);
  }
}
