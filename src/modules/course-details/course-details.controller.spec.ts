import { Test, TestingModule } from '@nestjs/testing';
import { CourseDetailsController } from './course-details.controller';
import { CourseDetailsService } from './course-details.service';

describe('CourseDetailsController', () => {
  let controller: CourseDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseDetailsController],
      providers: [CourseDetailsService],
    }).compile();

    controller = module.get<CourseDetailsController>(CourseDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
