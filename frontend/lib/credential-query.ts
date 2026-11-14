export function parseCredentialValidityResult(payload: unknown): boolean {
  // Gno's vm/qeval_json returns an array of Amino TypedValue objects.
  // A bool is PrimitiveType ID 4, encoded as an 8-byte little-endian
  // integer in the TypedValue.N base64 field.
  if (!Array.isArray(payload) || payload.length === 0) {
    throw new Error("The registry returned no credential result.");
  }

  const first = payload[0];
  if (!first || typeof first !== "object") {
    throw new Error("The registry returned an invalid query result.");
  }

  const typed = first as {
    T?: { "@type"?: unknown; value?: unknown };
    N?: unknown;
  };

  if (
    typed.T?.["@type"] !== "/gno.PrimitiveType" ||
    typed.T?.value !== "4" ||
    typeof typed.N !== "string"
  ) {
    throw new Error("The registry returned an unrecognised credential result.");
  }

  let bytes: Buffer;
  try {
    bytes = Buffer.from(typed.N, "base64");
  } catch {
    throw new Error("The registry returned an invalid boolean encoding.");
  }

  if (bytes.length !== 8) {
    throw new Error("The registry returned an invalid boolean encoding.");
  }

  const value = bytes.readBigUInt64LE(0);
  if (value !== 0n && value !== 1n) {
    throw new Error("The registry returned an invalid boolean value.");
  }

  return value === 1n;
}
