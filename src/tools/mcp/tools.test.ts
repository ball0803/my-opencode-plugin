import { describe, it, expect } from "bun:test";
import { applyGrepFilter } from "./tools";

describe("applyGrepFilter", () => {
  it("filters lines matching pattern", () => {
    // #given
    const output = `line1: hello world
line2: foo bar
line3: hello again
line4: baz qux`;

    // #when
    const result = applyGrepFilter(output, "hello");

    // #then
    expect(result).toContain("line1: hello world");
    expect(result).toContain("line3: hello again");
    expect(result).not.toContain("foo bar");
    expect(result).not.toContain("baz qux");
  });

  it("returns original output when pattern is undefined", () => {
    // #given
    const output = "some output";

    // #when
    const result = applyGrepFilter(output, undefined);

    // #then
    expect(result).toBe(output);
  });

  it("returns message when no lines match", () => {
    // #given
    const output = "line1\nline2\nline3";

    // #when
    const result = applyGrepFilter(output, "xyz");

    // #then
    expect(result).toContain("[grep] No lines matched pattern");
  });

  it("handles invalid regex gracefully", () => {
    // #given
    const output = "some output";

    // #when
    const result = applyGrepFilter(output, "[invalid");

    // #then
    expect(result).toBe(output);
  });
});
