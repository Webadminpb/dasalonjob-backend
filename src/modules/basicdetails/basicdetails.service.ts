import { Injectable } from '@nestjs/common';
import { CreateBasicdetailDto } from './dto/create-basicdetail.dto';
import { UpdateBasicdetailDto } from './dto/update-basicdetail.dto';

@Injectable()
export class BasicdetailsService {
  create(createBasicdetailDto: CreateBasicdetailDto) {
    return 'This action adds a new basicdetail';
  }

  findAll() {
    return `This action returns all basicdetails`;
  }

  findOne(id: number) {
    return `This action returns a #${id} basicdetail`;
  }

  update(id: number, updateBasicdetailDto: UpdateBasicdetailDto) {
    return `This action updates a #${id} basicdetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} basicdetail`;
  }
}
