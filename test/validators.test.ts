import { test } from "node:test";
import assert from "node:assert/strict";
import * as v from "../src/index.ts";

test("eircode", () => {
  assert.ok(v.isValidEircode("D02 X285"));
  assert.ok(v.isValidEircode("a65f4e2"));
  assert.ok(v.isValidEircode("D6W 1A2B".replace("B", "C")));
  assert.ok(!v.isValidEircode("D02 X28"));
  assert.ok(!v.isValidEircode("B02 X285")); // B not used
  assert.ok(!v.isValidEircode("D02 XO85")); // O not used
  assert.equal(v.formatEircode("a65f4e2"), "A65 F4E2");
  assert.equal(v.eircodeRoutingKey("d6w1a2c"), "D6W");
  assert.equal(v.formatEircode("nope"), null);
});

test("ppsn", () => {
  assert.ok(v.isValidPPSN("1234567T"));
  assert.ok(v.isValidPPSN("1234567FA"));
  assert.ok(v.isValidPPSN("1234567 fa"));
  assert.ok(!v.isValidPPSN("1234567A"));
  assert.ok(!v.isValidPPSN("1234567TA"));
  assert.ok(!v.isValidPPSN("123456T"));
  assert.equal(v.formatPPSN(" 1234567t "), "1234567T");
});

test("iban", () => {
  assert.ok(v.isValidIrishIBAN("IE29AIBK93115212345678"));
  assert.ok(v.isValidIrishIBAN("ie29 aibk 9311 5212 3456 78"));
  assert.ok(!v.isValidIrishIBAN("IE28AIBK93115212345678"));
  assert.ok(!v.isValidIrishIBAN("GB29NWBK60161331926819"));
  assert.equal(v.formatIrishIBAN("IE29AIBK93115212345678"), "IE29 AIBK 9311 5212 3456 78");
  assert.deepEqual(v.parseIrishIBAN("IE29AIBK93115212345678"), {
    bankCode: "AIBK",
    sortCode: "93-11-52",
    accountNumber: "12345678",
  });
});

test("phone", () => {
  assert.equal(v.irishPhoneType("087 123 4567"), "mobile");
  assert.equal(v.irishPhoneType("+353 (0)87 123 4567"), "mobile");
  assert.equal(v.irishPhoneType("00353 1 234 5678"), "landline");
  assert.equal(v.irishPhoneType("091 123456"), "landline");
  assert.equal(v.irishPhoneType("1800 123 456"), "freephone");
  assert.equal(v.toE164("087-123-4567"), "+353871234567");
  assert.equal(v.formatIrishPhone("+353871234567"), "087 123 4567");
  assert.equal(v.formatIrishPhone("012345678"), "01 234 5678");
  assert.ok(!v.isValidIrishPhone("087 123 456"));
  assert.ok(!v.isValidIrishPhone("084 123 4567"));
  assert.ok(!v.isValidIrishPhone("+44 20 7946 0958"));
});
