import { describe, expect, it } from "vitest";
import { nextTabIndex } from "./tabs";

describe("diagnostic workspace tabs", () => {
  it("moves forward and wraps with ArrowRight", () => {
    expect(nextTabIndex(0, "ArrowRight", 3)).toBe(1);
    expect(nextTabIndex(2, "ArrowRight", 3)).toBe(0);
  });

  it("moves backward and wraps with ArrowLeft", () => {
    expect(nextTabIndex(0, "ArrowLeft", 3)).toBe(2);
    expect(nextTabIndex(2, "ArrowLeft", 3)).toBe(1);
  });

  it("supports Home and End and ignores other keys", () => {
    expect(nextTabIndex(1, "Home", 3)).toBe(0);
    expect(nextTabIndex(1, "End", 3)).toBe(2);
    expect(nextTabIndex(1, "Enter", 3)).toBeNull();
  });
});
