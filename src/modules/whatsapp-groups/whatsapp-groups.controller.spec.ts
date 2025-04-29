import { Test, TestingModule } from '@nestjs/testing';
import { WhatsappGroupsController } from './whatsapp-groups.controller';
import { WhatsappGroupsService } from './whatsapp-groups.service';
import { CreateWhatsappGroupDto } from './dto/create-whatsapp-group.dto';
import { QueryWhatsAppDto } from './dto/query-whatsapp-group.dto';
import { UpdateWhatsappGroupDto } from './dto/update-whatsapp-group.dto';

describe('WhatsAppGroupsController', () => {
  let controller: WhatsappGroupsController;
  let service: WhatsappGroupsService;

  const mockService = {
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WhatsappGroupsController],
      providers: [
        {
          provide: WhatsappGroupsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<WhatsappGroupsController>(WhatsappGroupsController);
    service = module.get<WhatsappGroupsService>(WhatsappGroupsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create method with body', async () => {
    const dto: CreateWhatsappGroupDto = {
      name: 'Test Group',
      description: 'Group for testing',
      city: 'Test City',
    };

    const result = { success: true, message: 'Group Created', data: dto };
    mockService.create.mockResolvedValue(result);
    const response = await controller.create(dto);
    expect(response).toEqual(result);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  //   it('should call findAll with query', async () => {
  //     const query: QueryWhatsAppDto = { page: 1, limit: 10 };
  //     const result = {
  //       success: true,
  //       message: 'Group Data',
  //       data: { groups: [], total: 0 },
  //     };

  //     mockService.findAll.mockResolvedValue(result);
  //     const response = await controller.findAll(query);

  //     expect(response).toBe(result);
  //     expect(service.findAll).toHaveBeenCalledWith(query);
  //   });

  it('should call findOne with id', async () => {
    const id = '1';
    const result = { success: true, message: 'Group Found', data: { id } };

    mockService.findOne.mockResolvedValue(result);
    const response = await controller.findOne(id);

    expect(response).toBe(result);
    expect(service.findOne).toHaveBeenCalledWith(id);
  });

  it('should call update with id and body', async () => {
    const id = '1';
    const dto: UpdateWhatsappGroupDto = {
      name: 'Updated Group',
      description: 'Updated Description',
      city: 'Updated City',
    };

    const result = {
      success: true,
      message: 'WhatsApp Group Updated Successfully',
      data: dto,
    };

    mockService.update.mockResolvedValue(result);
    const response = await controller.update(id, dto);

    expect(response).toEqual(result);
    expect(service.update).toHaveBeenCalledWith(id, dto);
  });

  it('should call remove with id', async () => {
    const id = '1';
    const result = {
      success: true,
      message: 'Group Deleted',
    };

    mockService.remove.mockResolvedValue(result);
    const response = await controller.remove(id);

    expect(response).toBe(result);
    expect(service.remove).toHaveBeenCalledWith(id);
  });
});
