import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FxqlModule } from './fxql/fxql.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { Fxql } from './fxql/fxql.entity';
import { HelperModule } from './helper/helper.module';

@Module({
  imports: [
    FxqlModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      username: process.env.DB_USERNAME,
      database: process.env.DEV_DB,
      port: Number(process.env.DB_PORT),
      password: process.env.DB_PASSWORD,
      entities: [Fxql],
      synchronize: true,
      autoLoadEntities: true,
    }),
    HelperModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
