import { Test, TestingModule } from '@nestjs/testing';
import { ContactdetailsController } from './contactdetails.controller';
import { ContactdetailsService } from './contactdetails.service';

describe('ContactdetailsController', () => {
  let controller: ContactdetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactdetailsController],
      providers: [ContactdetailsService],
    }).compile();

    controller = module.get<ContactdetailsController>(ContactdetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
