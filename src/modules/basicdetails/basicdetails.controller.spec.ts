import { Test, TestingModule } from '@nestjs/testing';
import { BasicdetailsController } from './basicdetails.controller';
import { BasicdetailsService } from './basicdetails.service';

describe('BasicdetailsController', () => {
  let controller: BasicdetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BasicdetailsController],
      providers: [BasicdetailsService],
    }).compile();

    controller = module.get<BasicdetailsController>(BasicdetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
