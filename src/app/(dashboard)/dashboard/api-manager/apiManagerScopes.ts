import { SELF_ACCOUNT_QUOTA_SCOPE, SELF_USAGE_SCOPE } from "@/shared/constants/selfServiceScopes";
import { API_KEY_BYPASS_PROVIDER_QUOTA_SCOPE } from "@/shared/constants/apiKeyPolicyScopes";
import { FIRBO_MCP_READONLY_SCOPES } from "@/shared/constants/firboMcpReadOnlyKey";

const MANAGEMENT_SCOPE = "manage";

export interface CreateScopeOptions {
  manageEnabled: boolean;
  mcpReadOnly?: boolean;
  selfUsageEnabled?: boolean;
  selfAccountQuotaEnabled?: boolean;
  bypassProviderQuotaPolicyEnabled?: boolean;
}

export interface PermissionScopeOptions {
  manageEnabled: boolean;
  mcpReadOnly?: boolean;
  selfUsageEnabled: boolean;
  selfAccountQuotaEnabled: boolean;
  bypassProviderQuotaPolicyEnabled: boolean;
}

export function buildApiKeyCreateScopes(options: CreateScopeOptions): string[] {
  if (options.mcpReadOnly === true) return [...FIRBO_MCP_READONLY_SCOPES];
  const scopes: string[] = [];
  const selfUsageEnabled = options.selfUsageEnabled ?? true;
  if (options.manageEnabled) scopes.push(MANAGEMENT_SCOPE);
  if (selfUsageEnabled) scopes.push(SELF_USAGE_SCOPE);
  if (selfUsageEnabled && options.selfAccountQuotaEnabled === true) {
    scopes.push(SELF_ACCOUNT_QUOTA_SCOPE);
  }
  if (options.bypassProviderQuotaPolicyEnabled === true) {
    scopes.push(API_KEY_BYPASS_PROVIDER_QUOTA_SCOPE);
  }
  return scopes;
}

export function mergeApiKeyPermissionScopes(
  currentScopes: readonly string[] | null | undefined,
  options: PermissionScopeOptions
): string[] {
  // Explicit replacement operation, never a union with old manage/admin/write scopes.
  if (options.mcpReadOnly === true) return [...FIRBO_MCP_READONLY_SCOPES];
  const scopes = new Set((currentScopes ?? []).filter((scope) => typeof scope === "string"));

  setScope(scopes, MANAGEMENT_SCOPE, options.manageEnabled);
  setScope(scopes, SELF_USAGE_SCOPE, options.selfUsageEnabled);
  setScope(
    scopes,
    SELF_ACCOUNT_QUOTA_SCOPE,
    options.selfUsageEnabled && options.selfAccountQuotaEnabled
  );
  setScope(scopes, API_KEY_BYPASS_PROVIDER_QUOTA_SCOPE, options.bypassProviderQuotaPolicyEnabled);

  return [...scopes];
}

function setScope(scopes: Set<string>, scope: string, enabled: boolean): void {
  if (enabled) {
    scopes.add(scope);
  } else {
    scopes.delete(scope);
  }
}
