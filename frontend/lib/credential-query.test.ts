import { describe, expect, it } from "vitest";
import { parseCredentialValidityResult } from "./credential-query";

describe("parseCredentialValidityResult", () => {
  it("decodes Gno Amino bool true", () => {
    expect(parseCredentialValidityResult([
      { T: { "@type": "/gno.PrimitiveType", value: "4" }, N: "AQAAAAAAAAA=" },
    ])).toBe(true);
  });

  it("decodes Gno Amino bool false", () => {
    expect(parseCredentialValidityResult([
      { T: { "@type": "/gno.PrimitiveType", value: "4" }, N: "AAAAAAAAAAA=" },
    ])).toBe(false);
  });

  it("rejects an empty result list", () => {
    expect(() => parseCredentialValidityResult([])).toThrow("no credential result");
  });

  it("rejects a non-array payload", () => {
    expect(() => parseCredentialValidityResult({ results: [] })).toThrow("no credential result");
  });

  it("rejects a non-boolean Gno primitive type", () => {
    expect(() => parseCredentialValidityResult([
      { T: { "@type": "/gno.PrimitiveType", value: "32" }, N: "AQAAAAAAAAA=" },
    ])).toThrow("unrecognised");
  });

  it("rejects malformed boolean encodings", () => {
    expect(() => parseCredentialValidityResult([
      { T: { "@type": "/gno.PrimitiveType", value: "4" }, N: "AQ==" },
    ])).toThrow("invalid boolean encoding");
  });

  it("rejects boolean values other than zero and one", () => {
    expect(() => parseCredentialValidityResult([
      { T: { "@type": "/gno.PrimitiveType", value: "4" }, N: "AgAAAAAAAAA=" },
    ])).toThrow("invalid boolean value");
  });

  it("rejects null payloads", () => {
    expect(() => parseCredentialValidityResult(null)).toThrow("no credential result");
  });
});
