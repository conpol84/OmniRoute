# FIRBO / OmniRoute MCP-only key — verified incident and reviewed repair

## Verified owner evidence (2026-10-10)

The existing gateway's authenticated Streamable HTTP status is enabled/online and enforces scopes. The owner listed 110 real MCP tools, including all five approved FIRBO read-only names. Exactly one owner-authorized `omniroute_get_health` failed; the existing OmniRoute Audit Log recorded `scope_denied:missing_scopes` with 0ms duration. The dedicated key was allowed to connect, but did not have the `read:health` permission.

This is a **correct security rejection**, not proof that the gateway, Docker or Ollama is broken. Do NOT disable `OMNIROUTE_MCP_ENFORCE_SCOPES`, rotate live inference keys blindly, reuse a broad management/admin key as a shortcut, or replay the failed health call automatically.

## The safe existing-system source fix

[OmniRoute Draft PR #1](https://github.com/conpol84/OmniRoute/pull/1) introduces an explicit **FIRBO MCP read-only key** option in the already existing Dashboard → API Manager **Create Key** and **Edit Permissions** pages.

The server issues exactly six scopes:

- `mcp:connect`
- `read:health`
- `read:quota`
- `read:usage`
- `read:models`
- `read:combos`

It strips management, other scopes and model/combos allowlists instead of joining permissions, and saves existing-key conversions through the existing authenticated, audited key-permissions endpoint. The central `CLIENT_API` authorization gate independently rejects this exact MCP-only key with HTTP 403 when used for chat, model listing, images, embeddings, audio and other ordinary model-facing endpoints. Ordinary API keys are unchanged.

**Important: Draft source is NOT currently deployed.** This option will NOT appear on the live dashboard until the code is reviewed, built, released on the existing Hostinger OmniRoute service, and independently observed. No second MCP server or token store is created.

## Owner action AFTER an approved tested gateway release

1. Log into the existing [OmniRoute API Manager](https://gateway.firboai.app/dashboard/api-manager).
2. Locate the existing `firbo-mcp-readonly` key. If this key is used by any unrelated application, do NOT convert it; create a new dedicated MCP key with the new preset instead.
3. Choose the new **FIRBO MCP read-only** option in the Create Key dialog, or in the specific key's Edit Permissions dialog choose **Convert to FIRBO MCP read-only**.
4. Confirm that this replaces all existing scopes and disables model/combo access. Save once; do not retry on ambiguous outcomes. Use the key-secret only in the authorized owner terminal or existing integrations; never paste it into ChatGPT.
5. Read back the six scopes through the authenticated API Manager and verify there are no `manage`, `admin`, `write:*` or `execute:*` grants. If a new key was created, rotate/revoke the old dedicated key **only after** re-pointing its known consumer.
6. Separately, run exactly ONE pinned operator `--read-health` probe with the private MCP-only key. Require a successful corresponding record in the existing OmniRoute MCP Audit Log before promoting the existing FIRBO `mcp` Edge source. The FIRBO shared pilot remains OFF until platform-admin and foreign-tenant denials, egress, audit receipts and rollback are all verified.

## No Chrome DevTools or custom JavaScript

This runbook deliberately requires **no browser Console, pasted JavaScript or self-XSS warning bypass**. The previous manual Console workaround caused user friction and is not the supported release workflow. Do not ask an operator to search for UI controls that have not yet been deployed.

## Distinct next project blockers

The FIRBO existing MCP Edge still needs the separately tested PR #144 bounded 110-tool catalog fix and safe tenant/audit acceptance. The live Hostinger `firbo-api` Docker image still exposes an old native local-Qwen route returning HTTP 404; its staged source image requires a separate verified rollback-gated deployment. Preserve one FIRBO CEO, shared sessions/memory, one MCP integration, one task/audit ledger; do not touch PickFantasy/TradeAthletes production.
