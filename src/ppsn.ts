// PPS Number: 7 digits, a check letter, and an optional second letter (e.g. "1234567TA").
// Check letter = (sum(digit_i * weight_i) + secondLetterValue * 9) mod 23,
// where weights are 8..2, letters map A=1..V=22, and 0 maps to "W".
const PPSN_RE = /^(\d{7})([A-W])([A-IW]?)$/;
const WEIGHTS = [8, 7, 6, 5, 4, 3, 2];

function letterValue(ch: string): number {
  return ch === "" || ch === "W" ? 0 : ch.charCodeAt(0) - 64;
}

function checkLetterFor(digits: string, second: string): string {
  let sum = 0;
  for (let i = 0; i < 7; i++) sum += Number(digits[i]) * WEIGHTS[i]!;
  sum += letterValue(second) * 9;
  const r = sum % 23;
  return r === 0 ? "W" : String.fromCharCode(64 + r);
}

function compact(input: string): string {
  return input.replace(/[\s-]+/g, "").toUpperCase();
}

/** True if the input is a PPS Number with a correct check letter. */
export function isValidPPSN(input: string): boolean {
  const m = PPSN_RE.exec(compact(input));
  if (!m) return false;
  return checkLetterFor(m[1]!, m[3]!) === m[2];
}

/** Returns the normalised PPS Number (uppercase, no spaces), or null if invalid. */
export function formatPPSN(input: string): string | null {
  return isValidPPSN(input) ? compact(input) : null;
}
