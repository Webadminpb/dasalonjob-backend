import { Test, TestingModule } from '@nestjs/testing';
import { PartnerCourseController } from './partner-course.controller';
import { PartnerCourseService } from './partner-course.service';

describe('PartnerCourseController', () => {
  let controller: PartnerCourseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartnerCourseController],
      providers: [PartnerCourseService],
    }).compile();

    controller = module.get<PartnerCourseController>(PartnerCourseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
