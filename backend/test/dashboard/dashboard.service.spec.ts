import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DashboardService } from '../src/modules/dashboard/services/dashboard.service';
import { Enterprise } from '../src/entities/enterprise.entity';

describe('DashboardService', () => {
  let service: DashboardService;
  let repository: Repository<Enterprise>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: getRepositoryToken(Enterprise),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    repository = module.get<Repository<Enterprise>>(getRepositoryToken(Enterprise));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add more tests here as needed
});