// Eircode: 3-char routing key + 4-char unique identifier, e.g. "D02 X285", "D6W 1234".
// Letters are restricted to a set that avoids look-alike characters.
const LETTERS = "ACDEFHKNPRTVWXY";
const UNIQUE_CHAR = `[${LETTERS}0-9]`;
const ROUTING_KEY = `(?:[${LETTERS}][0-9]{2}|D6W)`;
const EIRCODE_RE = new RegExp(`^(${ROUTING_KEY})(${UNIQUE_CHAR}{4})$`);

function compact(input: string): string {
  return input.replace(/\s+/g, "").toUpperCase();
}

/** True if the input is a well-formed Eircode (spacing and case are ignored). */
export function isValidEircode(input: string): boolean {
  return EIRCODE_RE.test(compact(input));
}

/** Formats an Eircode as "A65 F4E2". Returns null if invalid. */
export function formatEircode(input: string): string | null {
  const m = EIRCODE_RE.exec(compact(input));
  return m ? `${m[1]} ${m[2]}` : null;
}

/** Returns the 3-character routing key (e.g. "D02"), or null if invalid. */
export function eircodeRoutingKey(input: string): string | null {
  const m = EIRCODE_RE.exec(compact(input));
  return m ? m[1]! : null;
}
