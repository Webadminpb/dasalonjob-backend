import { Test, TestingModule } from '@nestjs/testing';
import { PastworkController } from './pastwork.controller';
import { PastworkService } from './pastwork.service';

describe('PastworkController', () => {
  let controller: PastworkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PastworkController],
      providers: [PastworkService],
    }).compile();

    controller = module.get<PastworkController>(PastworkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
