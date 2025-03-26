import { Test, TestingModule } from '@nestjs/testing';
import { VenuebusinessdaysController } from './venuebusinessdays.controller';
import { VenuebusinessdaysService } from './venuebusinessdays.service';

describe('VenuebusinessdaysController', () => {
  let controller: VenuebusinessdaysController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VenuebusinessdaysController],
      providers: [VenuebusinessdaysService],
    }).compile();

    controller = module.get<VenuebusinessdaysController>(VenuebusinessdaysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
