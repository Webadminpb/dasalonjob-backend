import { Test, TestingModule } from '@nestjs/testing';
import { SaveCourseService } from './save-course.service';

describe('SaveCourseService', () => {
  let service: SaveCourseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SaveCourseService],
    }).compile();

    service = module.get<SaveCourseService>(SaveCourseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
