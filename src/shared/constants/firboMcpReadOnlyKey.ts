/** FIRBO's existing MCP client needs EXACTLY these scopes to query the shared OmniRoute gateway.
 * Dedicated MCP keys must never inherit dashboard management, inference or write capabilities.
 */
export const FIRBO_MCP_READONLY_SCOPES = [
  "mcp:connect",
  "read:health",
  "read:quota",
  "read:usage",
  "read:models",
  "read:combos",
] as const;

/** Exact scope-set recognition; other API-key workflows remain untouched. */
export function isDedicatedFirboMcpReadOnlyScopes(
  scopes: readonly string[] | null | undefined
): boolean {
  if (!Array.isArray(scopes) || scopes.length !== FIRBO_MCP_READONLY_SCOPES.length) return false;
  const expected = new Set<string>(FIRBO_MCP_READONLY_SCOPES);
  return new Set(scopes).size === expected.size && scopes.every((scope) => expected.has(scope));
}
