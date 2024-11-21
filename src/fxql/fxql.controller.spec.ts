import { Test } from '@nestjs/testing';
import { FxqlController } from './fxql.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HelperModule } from '../helper/helper.module';
import { Fxql } from './fxql.entity';
import { FxqlService } from './fxql.service';
import { describe } from 'node:test';
import { BadRequestException, HttpStatus } from '@nestjs/common';
import { MISSING_SPACE, RATES_PARSED } from '../constant/constants';
import { Repository } from 'typeorm';

describe('FxqlController', () => {
  let fxqlcontroller: FxqlController;
  let fxqlService: FxqlService;
  let fxqlRepository: Repository<Fxql>;
  let parse;

  const repositoryToken = getRepositoryToken(Fxql);
  describe('FxqlController', () => {
    beforeEach(async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [HelperModule],
        providers: [
          FxqlService,
          {
            provide: repositoryToken,
            useValue: {
              create: jest.fn(),
              save: jest.fn((data) => Promise.resolve(data)), // Mock implementation
            },
          },
        ],
        controllers: [FxqlController],
      }).compile();

      fxqlService = moduleRef.get(FxqlService);
      fxqlcontroller = moduleRef.get(FxqlController);
      fxqlRepository = moduleRef.get(repositoryToken);
    });

    describe('parse', () => {
      it('repository defined', () => {
        expect(fxqlRepository).toBeDefined();
      });

      it('parse fxql statement', async () => {
        const body = {
          FXQL: 'USD-GBP {\\n BUY 100\\n SELL 200\\n CAP 93800\\n}',
        };

        parse = await fxqlcontroller.parseFxql(body);
        expect(parse.message).toBe(RATES_PARSED);
      });

      it('invalid currency case', async () => {
        const body = {
          FXQL: 'usd-GBP {\\n BUY 100\\n SELL 200\\n CAP 93800\\n}',
        };

        // Expect the controller to throw an error
        await expect(fxqlcontroller.parseFxql(body)).rejects.toThrowError(
          new BadRequestException({
            message: "Invalid: 'usd' should be 'USD'",
            code: `FXQL-${HttpStatus.BAD_REQUEST}`,
          }),
        );
      });

      it('space after currency pair', async () => {
        const body = {
          FXQL: 'USD-GBP{\\n BUY 100\\n SELL 200\\n CAP 93800\\n}', // Missing space after "USD-GBP"
        };

        // Expect the controller to throw an error
        await expect(fxqlcontroller.parseFxql(body)).rejects.toThrowError(
          new BadRequestException({
            message: MISSING_SPACE,
            code: `FXQL-${HttpStatus.BAD_REQUEST}`,
          }),
        );
      });

      it('valid numeric amount', async () => {
        const body = {
          FXQL: 'USD-GBP {\\n BUY abc\\n SELL 200\\n CAP 93800\\n}',
        };

        // Expect the controller to throw an error
        await expect(fxqlcontroller.parseFxql(body)).rejects.toThrowError(
          new BadRequestException({
            message: "Invalid: 'abc' is not a valid numeric amount",
            code: `FXQL-${HttpStatus.BAD_REQUEST}`,
          }),
        );
      });

      it('valid numeric amount', async () => {
        const body = {
          FXQL: 'USD-GBP {\\n BUY 100\\n SELL 200\\n CAP -93800\\n}',
        };

        // Expect the controller to throw an error
        await expect(fxqlcontroller.parseFxql(body)).rejects.toThrowError(
          new BadRequestException({
            message: 'Invalid: CAP cannot be a negative number',
            code: `FXQL-${HttpStatus.BAD_REQUEST}`,
          }),
        );
      });

      it('Invalid: Empty FXQL statement', async () => {
        const body = {
          FXQL: 'USD-GBP {}',
        };

        // Expect the controller to throw an error
        await expect(fxqlcontroller.parseFxql(body)).rejects.toThrowError(
          new BadRequestException({
            message: 'Invalid: Empty FXQL statement',
            code: `FXQL-${HttpStatus.BAD_REQUEST}`,
          }),
        );
      });

      it('Multiple FXQL statements should be separated by a single newline character', async () => {
        const body = {
          FXQL: 'USD-GBP {\\n  BUY 0.85\\n  SELL 0.90\\n  CAP 10000\\n}EUR-JPY {\\n  BUY 145.20\\n  SELL 146.50\\n  CAP 50000\\n}\\n\\nNGN-USD {\\n  BUY 0.0022\\n  SELL 0.0023\\n  CAP 2000000\\n}',
        };

        // Expect the controller to throw an error
        await expect(fxqlcontroller.parseFxql(body)).rejects.toThrowError(
          new BadRequestException({
            message:
              'Invalid: Multiple FXQL statements should be separated by a single newline character',
            code: `FXQL-${HttpStatus.BAD_REQUEST}`,
          }),
        );
      });
    });
  });
});
