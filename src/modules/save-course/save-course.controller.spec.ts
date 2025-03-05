import { Test, TestingModule } from '@nestjs/testing';
import { SaveCourseController } from './save-course.controller';
import { SaveCourseService } from './save-course.service';

describe('SaveCourseController', () => {
  let controller: SaveCourseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SaveCourseController],
      providers: [SaveCourseService],
    }).compile();

    controller = module.get<SaveCourseController>(SaveCourseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
