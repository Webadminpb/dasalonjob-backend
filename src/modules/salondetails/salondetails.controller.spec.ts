import { Test, TestingModule } from '@nestjs/testing';
import { SalondetailsController } from './salondetails.controller';
import { SalondetailsService } from './salondetails.service';

describe('SalondetailsController', () => {
  let controller: SalondetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalondetailsController],
      providers: [SalondetailsService],
    }).compile();

    controller = module.get<SalondetailsController>(SalondetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
