import { Test, TestingModule } from '@nestjs/testing';
import { VenuebusinessservicesController } from './venuebusinessservices.controller';
import { VenuebusinessservicesService } from './venuebusinessservices.service';

describe('VenuebusinessservicesController', () => {
  let controller: VenuebusinessservicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VenuebusinessservicesController],
      providers: [VenuebusinessservicesService],
    }).compile();

    controller = module.get<VenuebusinessservicesController>(VenuebusinessservicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
