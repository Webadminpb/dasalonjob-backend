import { Test, TestingModule } from '@nestjs/testing';
import { WhatsappGroupsService } from './whatsapp-groups.service';
import { PrismaService } from '../prisma/prisma.service';
import { ApiSuccessResponse } from '../../common/api-response/api-success';

const mockPrismaService = {
  whatsAppGroup: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('WhatsAppGroupsService', () => {
  let service: WhatsappGroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WhatsappGroupsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<WhatsappGroupsService>(WhatsappGroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a whatsApp group', async () => {
    const createDto = {
      name: 'Group 1',
      link: 'http://link',
      city: 'City',
      description: 'Group description',
    };
    const result = { id: '1', ...createDto };

    mockPrismaService.whatsAppGroup.create.mockResolvedValue(result);
    const response = await service.create(createDto);
    expect(response).toEqual(
      new ApiSuccessResponse(
        true,
        'WhatsApp Group Created Successfully',
        result,
      ),
    );
  });

  it('should return all whatsApp groups', async () => {
    const query = { search: '', page: 1, limit: 10 };
    const groups = [
      {
        id: '1',
        name: 'Group 1',
        city: 'City',
        description: 'Group 1 description',
      },
    ];
    const total = 1;

    mockPrismaService.whatsAppGroup.findMany.mockResolvedValue(groups);
    mockPrismaService.whatsAppGroup.count.mockResolvedValue(total);

    const response = await service.findAll(query);
    expect(response).toEqual(
      new ApiSuccessResponse(true, 'Groups Data ', { groups, total }), // <-- Corrected message
    );
  });

  it('should update a whatsApp group', async () => {
    const updateDto = {
      name: 'Updated Group Name',
      city: 'Updated City',
      description: 'Updated Description',
    };
    const updatedGroup = { id: '1', ...updateDto };

    mockPrismaService.whatsAppGroup.findUnique.mockResolvedValue({ id: '1' });
    mockPrismaService.whatsAppGroup.update.mockResolvedValue(updatedGroup); // <-- Corrected
    const response = await service.update('1', updateDto);
    expect(response).toEqual(
      new ApiSuccessResponse(
        true,
        'WhatsApp Group Updated Successfully', // <-- Corrected message
        updatedGroup,
      ),
    );
  });

  it('should delete a whatsapp group', async () => {
    const groupId = '1';
    const deleteGroup = null;

    mockPrismaService.whatsAppGroup.findUnique.mockResolvedValue({
      id: groupId,
    });
    mockPrismaService.whatsAppGroup.delete.mockResolvedValue(deleteGroup); // <-- Ensure delete returns this
    const response = await service.remove(groupId);
    expect(response).toEqual(
      new ApiSuccessResponse(
        true,
        'WhatsApp Group Deleted Successfully',
        deleteGroup, // <-- Corrected from `null` to expected object
      ),
    );
  });
});
