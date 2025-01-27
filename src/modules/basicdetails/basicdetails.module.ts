import { Module } from '@nestjs/common';
import { BasicdetailsService } from './basicdetails.service';
import { BasicdetailsController } from './basicdetails.controller';

@Module({
  controllers: [BasicdetailsController],
  providers: [BasicdetailsService],
})
export class BasicdetailsModule {}
