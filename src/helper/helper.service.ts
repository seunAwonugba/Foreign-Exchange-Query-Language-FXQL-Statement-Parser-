import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import {
  blockRegex,
  EMPTY_FXQL,
  MAX_PAIRS,
  MISSING_SPACE,
  missingSpaceRegex,
  MULTIPLE_NEW_LINE,
  NO_SEPARATION,
} from '../constant/constants';

@Injectable()
export class HelperService {
  parseStatements(fxql: string) {
    this.detectImproperSeparation(fxql);
    const cleanedFxql = fxql.replace(/\\n/g, '\n').trim(); // Handle escaped newlines

    // Detect missing newline between blocks
    this.missingSpaceAfterCurrencyPair(cleanedFxql);

    const entries = [];
    const matches = [...cleanedFxql.matchAll(blockRegex)]; // Extract all matches as an array

    // Validate count against the constraint
    if (matches.length > MAX_PAIRS) {
      throw new BadRequestException(
        `Request exceeds the maximum limit of ${MAX_PAIRS} currency pairs.`,
      );
    }

    for (const match of matches) {
      if (match.length < 6) continue; // Skip invalid matches

      const [_, sourceCurrency, destinationCurrency, buy, sell, cap] = match;

      // Check for empty blocks
      if (!buy && !sell && !cap) {
        throw new BadRequestException({
          message: EMPTY_FXQL,
          code: `FXQL-${HttpStatus.BAD_REQUEST}`,
        });
      }
      // Reuse validateCurrency function
      this.validateCurrency(sourceCurrency);
      this.validateCurrency(destinationCurrency);

      // Validate numeric values for BUY, SELL, and CAP

      this.validateNumericAmount(buy, 'BUY');
      this.validateNumericAmount(sell, 'SELL');
      this.validateNumericAmount(cap, 'CAP');

      entries.push({
        SourceCurrency: sourceCurrency,
        DestinationCurrency: destinationCurrency,
        BuyPrice: parseFloat(buy),
        SellPrice: parseFloat(sell),
        CapAmount: parseInt(cap, 10),
      });
    }

    if (entries.length === 0) {
      throw new BadRequestException(
        'Invalid FXQL format or no valid entries found.',
      );
    }

    return entries;
  }

  validateCurrency(currency: string) {
    if (!/^[A-Z]{3}$/.test(currency)) {
      throw new BadRequestException({
        message: `Invalid: '${currency}' should be '${currency.toUpperCase()}'`,
        code: `FXQL-${HttpStatus.BAD_REQUEST}`,
      });
    }
  }

  missingSpaceAfterCurrencyPair(fxql: string) {
    if (missingSpaceRegex.test(fxql)) {
      throw new BadRequestException({
        message: MISSING_SPACE,
        code: `FXQL-${HttpStatus.BAD_REQUEST}`,
      });
    }

    return fxql;
  }

  validateNumericAmount(value: string, fieldName: string) {
    const parsedValue = parseFloat(value);

    // Check if the value is numeric
    if (isNaN(parsedValue)) {
      throw new BadRequestException({
        message: `Invalid: '${value}' is not a valid numeric amount`,
        code: `FXQL-${HttpStatus.BAD_REQUEST}`,
      });
    }

    // Check for negative values
    if (parsedValue < 0) {
      throw new BadRequestException({
        message: `Invalid: ${fieldName.toUpperCase()} cannot be a negative number`,
        code: `FXQL-${HttpStatus.BAD_REQUEST}`,
      });
    }
  }
  detectImproperSeparation(fxql: string) {
    // Match cases where blocks are not separated by exactly one newline
    const improperSeparationRegex = /\}\n{2,}[A-Z]{3}-[A-Z]{3}\s*\{/g;

    if (improperSeparationRegex.test(fxql)) {
      throw new BadRequestException(
        'Invalid: Multiple FXQL statements should be separated by a single newline character.',
      );
    }

    // Match cases where blocks are concatenated directly without a newline
    const noSeparationRegex = /\}\s*[A-Z]{3}-[A-Z]{3}\s*\{/g;

    if (noSeparationRegex.test(fxql)) {
      throw new BadRequestException({
        message: NO_SEPARATION,
        code: `FXQL-${HttpStatus.BAD_REQUEST}`,
      });
    }
  }

  detectMultipleNewlinesWithinBlock(fxql: string) {
    const multipleNewlinesRegex = /\{\s*(?:[^\}]*)\n\s*\n(?:[^\}]*)\}/g;
    if (multipleNewlinesRegex.test(fxql)) {
      throw new BadRequestException({
        message: MULTIPLE_NEW_LINE,
        code: `FXQL-${HttpStatus.BAD_REQUEST}`,
      });
    }
  }
}
