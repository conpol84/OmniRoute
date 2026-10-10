import assert from "node:assert/strict";
import test from "node:test";
import {
  FIRBO_MCP_READONLY_SCOPES,
  isDedicatedFirboMcpReadOnlyScopes,
} from "../../../src/shared/constants/firboMcpReadOnlyKey";
import {
  buildApiKeyCreateScopes,
  mergeApiKeyPermissionScopes,
} from "../../../src/app/(dashboard)/dashboard/api-manager/apiManagerScopes";
import { createKeySchema } from "../../../src/shared/validation/schemas/keys";

const scopes = [...FIRBO_MCP_READONLY_SCOPES];

test("dedicated FIRBO MCP key has exactly six read-only scopes, no admin/inference/write", () => {
  assert.deepEqual(scopes, [
    "mcp:connect",
    "read:health",
    "read:quota",
    "read:usage",
    "read:models",
    "read:combos",
  ]);
  assert.equal(scopes.some((x) => /^(manage|admin|write:|execute:|pricing:)/.test(x)), false);
  assert.equal(isDedicatedFirboMcpReadOnlyScopes(scopes), true);
  assert.equal(isDedicatedFirboMcpReadOnlyScopes([...scopes].reverse()), true);
});

test("scope recognition denies all partial, duplicate or supersets", () => {
  assert.equal(isDedicatedFirboMcpReadOnlyScopes([...scopes, "manage"]), false);
  assert.equal(isDedicatedFirboMcpReadOnlyScopes([...scopes, "execute:completions"]), false);
  assert.equal(isDedicatedFirboMcpReadOnlyScopes([...scopes.slice(1), "read:health"]), false);
  assert.equal(isDedicatedFirboMcpReadOnlyScopes(["mcp:connect"]), false);
  assert.equal(isDedicatedFirboMcpReadOnlyScopes([]), false);
  assert.equal(isDedicatedFirboMcpReadOnlyScopes(undefined), false);
});

test("new MCP-only key ignores all unrelated form toggles", () => {
  const result = buildApiKeyCreateScopes({
    manageEnabled: true,
    selfUsageEnabled: true,
    selfAccountQuotaEnabled: true,
    bypassProviderQuotaPolicyEnabled: true,
    mcpReadOnly: true,
  });
  assert.deepEqual(result, scopes);
});

test("convert existing managed key explicitly REPLACES rather than unions permissions", () => {
  const result = mergeApiKeyPermissionScopes(
    ["manage", "admin", "write:combos", "execute:completions", "self:usage"],
    {
      manageEnabled: true,
      selfUsageEnabled: true,
      selfAccountQuotaEnabled: true,
      bypassProviderQuotaPolicyEnabled: true,
      mcpReadOnly: true,
    },
  );
  assert.deepEqual(result, scopes);
});

test("all existing non-MCP key creation defaults remain unchanged", () => {
  const normal = buildApiKeyCreateScopes({ manageEnabled: false });
  assert.deepEqual(normal, ["self:usage"]);
  const managed = buildApiKeyCreateScopes({ manageEnabled: true });
  assert.deepEqual(managed, ["manage", "self:usage"]);
});

test("legacy editing retains unrelated scopes unless explicit MCP conversion selected", () => {
  const result = mergeApiKeyPermissionScopes(["read:quota", "special:tenant"], {
    manageEnabled: false,
    selfUsageEnabled: true,
    selfAccountQuotaEnabled: false,
    bypassProviderQuotaPolicyEnabled: false,
  });
  assert.deepEqual(result, ["read:quota", "special:tenant", "self:usage"]);
});

test("create schema accepts only explicit dedicated MCP read-only preset and matching scopes", () => {
  const safe = createKeySchema.safeParse({
    name: "firbo-mcp-readonly",
    mcpReadOnly: true,
    scopes,
    allowUsageCommand: false,
  });
  assert.equal(safe.success, true, JSON.stringify(safe.error?.issues));
  for (const bad of [
    { scopes: [...scopes, "manage"] },
    { scopes: [...scopes, "execute:completions"] },
    { modelAccessMode: "all" },
    { allowedModels: ["gpt-6"] },
    { allowedCombos: ["*"] },
    { noLog: true },
    { allowUsageCommand: true },
    { chaosModeEnabled: true },
  ]) {
    assert.equal(
      createKeySchema.safeParse({ name: "firbo-mcp", mcpReadOnly: true, ...bad }).success,
      false,
      JSON.stringify(bad),
    );
  }
});

test("legacy create requests without new preset keep normal schema behavior", () => {
  assert.equal(createKeySchema.safeParse({ name: "normal-key" }).success, true);
  assert.equal(
    createKeySchema.safeParse({ name: "normal-key", scopes: ["manage"] }).success,
    true,
  );
});
