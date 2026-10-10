# FIRBO MCP: verified scope denial and owner-only repair

Owner evidence, 2026-10-10: authenticated MCP status enabled/online/scopes true, Streamable HTTP working, 110 advertised tools including all five FIRBO-approved reads. One explicitly authorized health call returned isError=true; actual OmniRoute Audit Log contains scope_denied:missing_scopes. The dedicated key requires read:health.

The deployed API Manager currently lacks a dedicated MCP read-scopes preset. This Draft PR adds one through the EXISTING OmniRoute API-key creation and permission editing paths. It does not deploy automatically. This alternative uses the EXISTING production management API, not a second system. It can operate before this PR is deployed, only when deliberately run by the signed-in OmniRoute owner.

## One existing key, same-origin only

Sign into https://gateway.firboai.app/dashboard/api-manager as the owner. Open browser Developer Tools Console on this exact page. Review the following JavaScript before executing. It uses the existing authenticated dashboard session; it never reads, stores or prints the API key secret. It identifies exactly one key named firbo-mcp-readonly, refuses ambiguous matches, shows an explicit owner confirmation, uses the EXISTING audited PATCH /api/keys/[id], and verifies metadata with GET /api/keys. No retries, no cross-origin requests, no models/tool calls, no Docker changes.

This conversion REMOVES any old scopes, including manage/admin/write/execute, and blocks model inference. Do not perform it if another application currently relies on this same key.

~~~javascript
(async () => {
  const origin = "https://gateway.firboai.app";
  const keyName = "firbo-mcp-readonly";
  const scopes = [
    "mcp:connect", "read:health", "read:quota",
    "read:usage", "read:models", "read:combos",
  ];
  const exact = (value) => Array.isArray(value) &&
    value.length === scopes.length &&
    new Set(value).size === scopes.length &&
    scopes.every((x) => value.includes(x));

  if (location.origin !== origin) {
    console.log(JSON.stringify({ status: "wrong_origin_stop" }));
    return;
  }
  const readKeys = async () => {
    const r = await fetch("/api/keys", {
      credentials: "same-origin",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!r.ok) throw new Error("list_http_" + r.status);
    const data = await r.json();
    const keys = Array.isArray(data.keys) ? data.keys : [];
    const matches = keys.filter((k) => k?.name === keyName);
    return matches.length === 1 ? matches[0] : null;
  };
  let key;
  try { key = await readKeys(); } catch {
    console.log(JSON.stringify({ status: "list_failed_no_write" }));
    return;
  }
  if (!key?.id) {
    console.log(JSON.stringify({ status: "missing_or_ambiguous_stop" }));
    return;
  }
  const restricted = (k) => exact(k?.scopes) &&
    k.modelAccessMode === "restricted" &&
    Array.isArray(k.allowedModels) && k.allowedModels.length === 0 &&
    Array.isArray(k.allowedCombos) && k.allowedCombos.length === 0;
  if (restricted(key)) {
    console.log(JSON.stringify({ status: "already_restricted_no_write" }));
    return;
  }
  if (!window.confirm(
    "Convert exactly ONE firbo-mcp-readonly API key to SIX MCP read-only scopes? " +
    "This REVOKES other scopes and disables inference. Other clients may stop working."
  )) {
    console.log(JSON.stringify({ status: "owner_cancelled_no_write" }));
    return;
  }
  const request = {
    scopes,
    modelAccessMode: "restricted", allowedModels: [],
    allowedCombos: [], connectionAccessMode: "all",
    allowedConnections: [], autoResolve: false,
    allowAutoCombos: false, noLog: false,
    allowUsageCommand: false, usageLimitEnabled: false,
  };
  let response;
  try {
    response = await fetch("/api/keys/" + encodeURIComponent(key.id), {
      method: "PATCH",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
  } catch {
    console.log(JSON.stringify({ status: "patch_ambiguous_no_retry" }));
    return;
  }
  if (!response.ok) {
    console.log(JSON.stringify({ status: "patch_failed_no_retry", http: response.status }));
    return;
  }
  let current;
  try { current = await readKeys(); } catch {
    console.log(JSON.stringify({ status: "patch_accepted_verify_unavailable" }));
    return;
  }
  const ok = current?.id === key.id && restricted(current);
  console.log(JSON.stringify({
    status: ok ? "mcp_readonly_verified" : "patch_accepted_not_verified",
    required_scopes: scopes.length,
    read_health_present: !!current?.scopes?.includes("read:health"),
    model_access: ok ? "denied" : "not_verified",
    key_secret_exposed: false,
    retries: 0,
  }));
})().catch(() => console.log(JSON.stringify({ status: "unexpected_stop_no_retry" })));
~~~

If any step fails or an update is ambiguous, STOP. Do not blindly retry. This does NOT enable FIRBO_OMNI_MCP_PILOT_ENABLED or the FIRBO Supabase Edge code. Do not turn OFF Omni MCP scope enforcement or use the gateway inference/management key for this MCP integration.

After metadata verification, the operator may separately authorize ONE pinned --read-health check and confirm a successful entry in OmniRoute's existing MCP Audit Log. Then test existing FIRBO egress, platform-admin RBAC, and foreign-company denial before a controlled release. The native Ollama HTTP404 is a separate unshipped Docker image issue.
