import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fxql } from './fxql.entity';
import { HelperService } from '../helper/helper.service';

@Injectable()
export class FxqlService {
  constructor(
    @InjectRepository(Fxql)
    private readonly fxqlRepository: Repository<Fxql>,
    private helperService: HelperService,
  ) {}

  async create(fxql: string) {
    const parseStatement = this.helperService.parseStatements(fxql);

    const create = await this.fxqlRepository.save(parseStatement);

    const data = create.map((item) => {
      return {
        EntryId: item.id,
        SourceCurrency: item.SourceCurrency,
        DestinationCurrency: item.DestinationCurrency,
        SellPrice: item.SellPrice,
        BuyPrice: item.BuyPrice,
        CapAmount: item.CapAmount,
      };
    });

    return data;
  }
}
