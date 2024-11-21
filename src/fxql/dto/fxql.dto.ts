import { IsNotEmpty } from 'class-validator';
import { FXQL_REQUIRED } from '../../constant/constants';

export class FxqlDto {
  @IsNotEmpty({ message: FXQL_REQUIRED })
  FXQL: string;
}
