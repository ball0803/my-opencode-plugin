import { describe, it, expect } from "bun:test";
import { createBuiltinMcps } from "./index";

describe("createBuiltinMcps", () => {
  it("returns all built-in MCP servers when none disabled", () => {
    // #given
    const disabledMcps: any[] = [];

    // #when
    const mcps = createBuiltinMcps(disabledMcps);

    // #then
    expect(Object.keys(mcps).length).toBe(3);
    expect(mcps).toHaveProperty("websearch_exa");
    expect(mcps).toHaveProperty("context7");
    expect(mcps).toHaveProperty("grep_app");
  });

  it("excludes disabled MCP servers", () => {
    // #given
    const disabledMcps = ["websearch_exa"];

    // #when
    const mcps = createBuiltinMcps(disabledMcps);

    // #then
    expect(Object.keys(mcps).length).toBe(2);
    expect(mcps).not.toHaveProperty("websearch_exa");
    expect(mcps).toHaveProperty("context7");
    expect(mcps).toHaveProperty("grep_app");
  });

  it("excludes multiple disabled MCP servers", () => {
    // #given
    const disabledMcps = ["websearch_exa", "context7"];

    // #when
    const mcps = createBuiltinMcps(disabledMcps);

    // #then
    expect(Object.keys(mcps).length).toBe(1);
    expect(mcps).not.toHaveProperty("websearch_exa");
    expect(mcps).not.toHaveProperty("context7");
    expect(mcps).toHaveProperty("grep_app");
  });

  it("returns empty object when all servers disabled", () => {
    // #given
    const disabledMcps = ["websearch_exa", "context7", "grep_app"];

    // #when
    const mcps = createBuiltinMcps(disabledMcps);

    // #then
    expect(Object.keys(mcps).length).toBe(0);
  });
});
