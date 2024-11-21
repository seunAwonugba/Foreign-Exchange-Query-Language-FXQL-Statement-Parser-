import { IsNotEmpty, IsString } from 'class-validator';
import { FXQL_REQUIRED, FXQL_STRING } from '../../constant/constants';

export class FxqlDto {
  @IsNotEmpty({ message: FXQL_REQUIRED })
  @IsString({ message: FXQL_STRING })
  FXQL: string;
}
