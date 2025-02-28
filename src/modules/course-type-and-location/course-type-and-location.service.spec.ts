import { Test, TestingModule } from '@nestjs/testing';
import { CourseTypeAndLocationService } from './course-type-and-location.service';

describe('CourseTypeAndLocationService', () => {
  let service: CourseTypeAndLocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseTypeAndLocationService],
    }).compile();

    service = module.get<CourseTypeAndLocationService>(CourseTypeAndLocationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
