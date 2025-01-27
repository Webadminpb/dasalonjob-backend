import { PartialType } from '@nestjs/mapped-types';
import { CreateBasicdetailDto } from './create-basicdetail.dto';

export class UpdateBasicdetailDto extends PartialType(CreateBasicdetailDto) {}
