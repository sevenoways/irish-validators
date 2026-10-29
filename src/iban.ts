// Irish IBAN: "IE" + 2 check digits + 4-letter bank code + 6-digit sort code + 8-digit account.
const IE_IBAN_RE = /^IE(\d{2})([A-Z]{4})(\d{6})(\d{8})$/;

function compact(input: string): string {
  return input.replace(/\s+/g, "").toUpperCase();
}

function mod97(iban: string): number {
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  let remainder = 0;
  for (const ch of rearranged) {
    const value = ch >= "A" ? String(ch.charCodeAt(0) - 55) : ch;
    for (const d of value) remainder = (remainder * 10 + Number(d)) % 97;
  }
  return remainder;
}

/** True if the input is a well-formed Irish IBAN with valid check digits. */
export function isValidIrishIBAN(input: string): boolean {
  const iban = compact(input);
  return IE_IBAN_RE.test(iban) && mod97(iban) === 1;
}

/** Formats as "IE29 AIBK 9311 5212 3456 78". Returns null if invalid. */
export function formatIrishIBAN(input: string): string | null {
  if (!isValidIrishIBAN(input)) return null;
  return compact(input).replace(/(.{4})(?=.)/g, "$1 ");
}

export interface IrishIBANParts {
  bankCode: string;
  sortCode: string;
  accountNumber: string;
}

/** Splits a valid Irish IBAN into bank code, sort code (xx-xx-xx) and account number. */
export function parseIrishIBAN(input: string): IrishIBANParts | null {
  const iban = compact(input);
  const m = IE_IBAN_RE.exec(iban);
  if (!m || mod97(iban) !== 1) return null;
  const sort = m[3]!;
  return {
    bankCode: m[2]!,
    sortCode: `${sort.slice(0, 2)}-${sort.slice(2, 4)}-${sort.slice(4)}`,
    accountNumber: m[4]!,
  };
}
