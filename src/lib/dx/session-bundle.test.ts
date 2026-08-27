import { describe, expect, it } from "vitest";
import { createSession } from "./engine";
import { createSessionBundle, parseSessionBundle } from "./session-bundle";

const session = createSession({
  vehicle: { year: 2020, make: "Toyota", model: "RAV4" },
  concern: "cranks but will not start",
});

describe("diagnostic session bundles", () => {
  it("round-trips sessions in a versioned portable bundle", () => {
    const encoded = createSessionBundle([session], 1_700_000_000_000);
    const parsed = parseSessionBundle(encoded);

    expect(JSON.parse(encoded)).toMatchObject({
      format: "diagnostic-session-bundle",
      version: 1,
      exportedAt: 1_700_000_000_000,
    });
    expect(parsed).toEqual([session]);
  });

  it("rejects malformed bundles before they can be imported", () => {
    expect(() => parseSessionBundle('{"format":"diagnostic-session-bundle","version":1,"sessions":[{}]}')).toThrow(
      /invalid diagnostic session bundle/i,
    );
  });

  it("rejects bundles with an unsupported version or format", () => {
    expect(() => parseSessionBundle(JSON.stringify({ format: "diagnostic-session-bundle", version: 2, sessions: [] }))).toThrow(
      /unsupported diagnostic session bundle version/i,
    );
    expect(() => parseSessionBundle(JSON.stringify({ format: "other", version: 1, sessions: [] }))).toThrow(
      /invalid diagnostic session bundle/i,
    );
  });
});
