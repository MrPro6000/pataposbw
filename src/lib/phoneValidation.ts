/**
 * Botswana phone number validation utilities.
 * - Country code: +267
 * - Mobile numbers: 8 digits starting with 7
 */

/** Strip non-digits and optional 267 prefix, returning raw local digits */
export const stripBotswanaPrefix = (value: string): string =>
  value.replace(/\D/g, "").replace(/^267/, "");

/** Validate that a local number (without +267) is a valid Botswana mobile number */
export const isValidBotswanaNumber = (localDigits: string): boolean =>
  /^7\d{7}$/.test(localDigits);

/** Validate a full phone string (may include +267 or 267 prefix) */
export const validateBotswanaPhone = (phone: string): boolean =>
  isValidBotswanaNumber(stripBotswanaPrefix(phone));

/** Format to international: +267XXXXXXXX */
export const formatBotswanaInternational = (localDigits: string): string =>
  "+267" + localDigits;

/** Standard error message */
export const BOTSWANA_PHONE_ERROR = "Invalid Botswana mobile number. Must start with 7 and be 8 digits.";
