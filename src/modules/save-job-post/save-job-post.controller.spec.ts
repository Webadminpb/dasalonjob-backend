import { Test, TestingModule } from '@nestjs/testing';
import { SaveJobPostController } from './save-job-post.controller';
import { SaveJobPostService } from './save-job-post.service';

describe('SaveJobPostController', () => {
  let controller: SaveJobPostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SaveJobPostController],
      providers: [SaveJobPostService],
    }).compile();

    controller = module.get<SaveJobPostController>(SaveJobPostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
