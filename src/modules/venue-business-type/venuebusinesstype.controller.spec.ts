import { Test, TestingModule } from '@nestjs/testing';
import { VenuebusinesstypeController } from './venuebusinesstype.controller';
import { VenuebusinesstypeService } from './venuebusinesstype.service';

describe('VenuebusinesstypeController', () => {
  let controller: VenuebusinesstypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VenuebusinesstypeController],
      providers: [VenuebusinesstypeService],
    }).compile();

    controller = module.get<VenuebusinesstypeController>(VenuebusinesstypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
