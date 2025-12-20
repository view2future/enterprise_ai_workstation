import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnterprisesService } from '../src/modules/enterprises/services/enterprises.service';
import { Enterprise } from '../src/entities/enterprise.entity';

describe('EnterprisesService', () => {
  let service: EnterprisesService;
  let repository: Repository<Enterprise>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnterprisesService,
        {
          provide: getRepositoryToken(Enterprise),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<EnterprisesService>(EnterprisesService);
    repository = module.get<Repository<Enterprise>>(getRepositoryToken(Enterprise));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add more tests here as needed
});