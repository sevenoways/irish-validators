// Irish phone numbers. Accepts national ("087 123 4567") and international
// ("+353 87 123 4567", "00353...") forms. Republic of Ireland only.
export type IrishPhoneType = "mobile" | "landline" | "freephone" | "shared-cost" | "premium";

interface Parsed {
  national: string; // significant number without leading 0, e.g. "871234567"
  type: IrishPhoneType;
}

function parse(input: string): Parsed | null {
  let s = input.replace(/[\s().-]+/g, "");
  if (s.startsWith("+353")) s = s.slice(4);
  else if (s.startsWith("00353")) s = s.slice(5);
  else if (s.startsWith("0")) s = s.slice(1);
  else if (!/^1(8|5)/.test(s)) return null; // 1800/1850/15xx are dialled without a 0
  if (s.startsWith("0")) s = s.slice(1); // tolerate "+353 (0) 87..."
  if (!/^\d+$/.test(s)) return null;

  if (/^8[35679]\d{7}$/.test(s)) return { national: s, type: "mobile" };
  if (/^1800\d{6}$/.test(s)) return { national: s, type: "freephone" };
  if (/^18(18|50)\d{6}$/.test(s)) return { national: s, type: "shared-cost" };
  if (/^15\d{8}$/.test(s)) return { national: s, type: "premium" };
  // Dublin (01) uses 7-digit subscriber numbers; other area codes are 2-3 digits
  // with 5-7 digit subscriber numbers, giving 7-9 significant digits overall.
  if (/^1\d{7}$/.test(s)) return { national: s, type: "landline" };
  if (/^[2-9]\d{6,8}$/.test(s) && !s.startsWith("8")) return { national: s, type: "landline" };
  return null;
}

/** True if the input looks like a valid Republic of Ireland phone number. */
export function isValidIrishPhone(input: string): boolean {
  return parse(input) !== null;
}

/** Returns the number type, or null if invalid. */
export function irishPhoneType(input: string): IrishPhoneType | null {
  return parse(input)?.type ?? null;
}

/** Returns the number in E.164 form, e.g. "+353871234567". */
export function toE164(input: string): string | null {
  const p = parse(input);
  return p ? `+353${p.national}` : null;
}

/** Returns a readable national form, e.g. "087 123 4567" or "01 234 5678". */
export function formatIrishPhone(input: string): string | null {
  const p = parse(input);
  if (!p) return null;
  const n = p.national;
  if (p.type === "mobile") return `0${n.slice(0, 2)} ${n.slice(2, 5)} ${n.slice(5)}`;
  if (p.type !== "landline") return `${n.slice(0, 4)} ${n.slice(4, 7)} ${n.slice(7)}`;
  if (n.startsWith("1")) return `01 ${n.slice(1, 4)} ${n.slice(4)}`;
  // Without a full area-code table we assume a 2-digit code (e.g. 091, 021).
  return `0${n.slice(0, 2)} ${n.slice(2)}`;
}
