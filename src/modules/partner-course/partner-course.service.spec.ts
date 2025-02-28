import { Test, TestingModule } from '@nestjs/testing';
import { PartnerCourseService } from './partner-course.service';

describe('PartnerCourseService', () => {
  let service: PartnerCourseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartnerCourseService],
    }).compile();

    service = module.get<PartnerCourseService>(PartnerCourseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
