# irish-validators

Validate and format Irish identifiers. TypeScript, zero dependencies.

| Thing | Validate | Format / parse |
|---|---|---|
| **Eircode** | `isValidEircode` | `formatEircode`, `eircodeRoutingKey` |
| **PPS Number** (with check letter) | `isValidPPSN` | `formatPPSN` |
| **Irish IBAN** (mod-97 checked) | `isValidIrishIBAN` | `formatIrishIBAN`, `parseIrishIBAN` |
| **Phone number** (ROI) | `isValidIrishPhone` | `formatIrishPhone`, `toE164`, `irishPhoneType` |

## Install

```bash
npm install github:sevenoways/irish-validators
```

## Usage

```ts
import {
  isValidEircode, formatEircode,
  isValidPPSN,
  isValidIrishIBAN, parseIrishIBAN,
  toE164, irishPhoneType,
} from "irish-validators";

formatEircode("a65f4e2");            // "A65 F4E2"
isValidEircode("D6W 1A2C");          // true

isValidPPSN("1234567T");             // true  (check letter verified)
isValidPPSN("1234567A");             // false

isValidIrishIBAN("IE29 AIBK 9311 5212 3456 78"); // true
parseIrishIBAN("IE29AIBK93115212345678");
// { bankCode: "AIBK", sortCode: "93-11-52", accountNumber: "12345678" }

toE164("087 123 4567");              // "+353871234567"
irishPhoneType("1800 123 456");      // "freephone"
```

All functions ignore spacing and case. Format/parse functions return `null` for invalid input.

## What is checked

- **Eircode**: routing key (letter + 2 digits, or `D6W`) and 4-character unique identifier from the official character set. It checks the format only and doesn't confirm the address exists.
- **PPSN**: 7 digits, check letter (weighted mod 23), and an optional second letter.
- **IBAN**: `IE` + 22 characters, with the ISO 13616 mod-97 check.
- **Phone**: mobiles (083/085/086/087/089), Dublin and regional landlines, 1800/1850/1818/15xx. National formatting of non-Dublin landlines assumes a 2-digit area code.

## Development

```bash
npm install
npm test        # runs TypeScript tests directly on Node 22.6+
npm run build
```

PRs welcome, especially for area-code formatting and more test fixtures.

## License

MIT © Seven O Ways
