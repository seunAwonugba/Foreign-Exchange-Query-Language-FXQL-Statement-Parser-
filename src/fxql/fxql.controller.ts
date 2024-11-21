import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { FxqlService } from './fxql.service';
import { FXQL_URL, RATES_PARSED } from '../constant/constants';
import { FxqlDto } from './dto/fxql.dto';

@Controller()
export class FxqlController {
  constructor(private fxqlService: FxqlService) {}

  /**
   * Parse FXQL statements
   *
   * @remarks This operation allows you to parse FXQL statements
   *
   */
  @Post(FXQL_URL)
  async parseFxql(@Body() fxqlDto: FxqlDto) {
    const fxql = fxqlDto.FXQL;
    const parseFxql = await this.fxqlService.create(fxql);
    return {
      message: RATES_PARSED,
      code: `FXQL-${HttpStatus.OK}`,
      data: parseFxql,
    };
  }
}
