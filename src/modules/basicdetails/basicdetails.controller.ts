import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BasicdetailsService } from './basicdetails.service';
import { CreateBasicdetailDto } from './dto/create-basicdetail.dto';
import { UpdateBasicdetailDto } from './dto/update-basicdetail.dto';

@Controller('basicdetails')
export class BasicdetailsController {
  constructor(private readonly basicdetailsService: BasicdetailsService) {}

  @Post()
  create(@Body() createBasicdetailDto: CreateBasicdetailDto) {
    return this.basicdetailsService.create(createBasicdetailDto);
  }

  @Get()
  findAll() {
    return this.basicdetailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.basicdetailsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBasicdetailDto: UpdateBasicdetailDto) {
    return this.basicdetailsService.update(+id, updateBasicdetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.basicdetailsService.remove(+id);
  }
}
