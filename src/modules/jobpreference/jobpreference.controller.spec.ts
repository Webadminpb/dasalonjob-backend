import { Test, TestingModule } from '@nestjs/testing';
import { JobpreferenceController } from './jobpreference.controller';
import { JobpreferenceService } from './jobpreference.service';

describe('JobpreferenceController', () => {
  let controller: JobpreferenceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobpreferenceController],
      providers: [JobpreferenceService],
    }).compile();

    controller = module.get<JobpreferenceController>(JobpreferenceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
