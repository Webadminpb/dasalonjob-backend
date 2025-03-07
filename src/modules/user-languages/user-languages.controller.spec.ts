import { Test, TestingModule } from '@nestjs/testing';
import { UserLanguagesController } from './user-languages.controller';
import { UserLanguagesService } from './user-languages.service';

describe('UserLanguagesController', () => {
  let controller: UserLanguagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserLanguagesController],
      providers: [UserLanguagesService],
    }).compile();

    controller = module.get<UserLanguagesController>(UserLanguagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
