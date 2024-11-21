export const FXQL_URL = 'fxql-statements';
export const FXQL_REQUIRED = 'FXQL statement is required';
export const FXQL_STRING = 'FXQL statement must be a string';
export const blockRegex =
  /([a-zA-Z]{3})-([a-zA-Z]{3})\s*\{\s*(?:BUY\s+(\S*))?\s*(?:SELL\s+(\S*))?\s*(?:CAP\s+(\S*))?\s*\}(?:\n|$)/g;
export const MAX_PAIRS = 1000; // Maximum currency pairs allowed per request
export const RATES_PARSED = 'Rates Parsed Successfully.';
export const missingSpaceRegex = /(\w{3})-(\w{3})\{/;
export const EMPTY_FXQL = 'Invalid: Empty FXQL statement';
export const MISSING_SPACE = 'Missing single space after currency pair';
export const MULTIPLE_NEW_LINE =
  'Invalid: Multiple newlines within a single FXQL statement';
export const NO_SEPARATION =
  'Invalid: Multiple FXQL statements should be separated by a single newline character';
