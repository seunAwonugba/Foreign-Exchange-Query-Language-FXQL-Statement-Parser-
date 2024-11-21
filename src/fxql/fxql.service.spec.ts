import { Test, TestingModule } from '@nestjs/testing';
import { FxqlService } from './fxql.service';

describe('FxqlService', () => {
  let fxqlService: FxqlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FxqlService],
    }).compile();

    fxqlService = module.get<FxqlService>(FxqlService);
  });

  it('should be defined', () => {
    expect(fxqlService).toBeDefined();
  });
});
