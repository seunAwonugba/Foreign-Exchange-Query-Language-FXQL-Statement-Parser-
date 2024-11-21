import { Module } from '@nestjs/common';
import { FxqlService } from './fxql.service';
import { FxqlController } from './fxql.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fxql } from './fxql.entity';
import { HelperModule } from '../helper/helper.module';

@Module({
  imports: [TypeOrmModule.forFeature([Fxql]), HelperModule],
  providers: [FxqlService],
  controllers: [FxqlController],
  exports: [TypeOrmModule],
})
export class FxqlModule {}
