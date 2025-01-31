import { Test, TestingModule } from '@nestjs/testing';
import { LangaugesController } from './languages.controller';
import { LangaugesService } from './languages.service';

describe('LangaugesController', () => {
  let controller: LangaugesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LangaugesController],
      providers: [LangaugesService],
    }).compile();

    controller = module.get<LangaugesController>(LangaugesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
