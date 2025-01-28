import { Test, TestingModule } from '@nestjs/testing';
import { ContactdetailsService } from './contactdetails.service';

describe('ContactdetailsService', () => {
  let service: ContactdetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContactdetailsService],
    }).compile();

    service = module.get<ContactdetailsService>(ContactdetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
