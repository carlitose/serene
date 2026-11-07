---
ticket_schema: 1
ticket_id: "01"
execution_mode: AFK
blocked_by: []
---

# Adopt the iOS scene lifecycle and verify the Ad Hoc update

## Artifact Graph
- Artifact ID: `ticket:ios-27-scene-lifecycle:01`
- Role: `ticket`
- Parent: [iOS 27 scene lifecycle](../../specs/ios-27-scene-lifecycle.md)

## Parent Spec
[iOS 27 scene lifecycle](../../specs/ios-27-scene-lifecycle.md), especially Target Behavior, Goals and Invariants, Implementation Slice, Acceptance Criteria and Verification.

## What to Build
A versioned local Expo config plugin plus Swift scene-delegate asset that adapts the SDK 54 native bootstrap and scene manifest reproducibly, preserving the existing factory, URL handling and lifecycle callbacks. Register it, test it without new dependencies, increment iOS build number to 2 and persist the authorized Fluentia team. Generate and validate an Ad Hoc update and observe the corrected app on the connected iPhone.

## Allowed Scope
`app.json`, `package.json`, `plugins/**`, `tests/**`, `docs/specs/ios-27-scene-lifecycle.md`, `docs/tickets/ios-27-scene-lifecycle/**`, and a concise README if needed to run the tests/build. Native prebuild output under ignored `ios/**` and owned temporary/Downloads build artifacts may be regenerated and inspected; do not delete the installed app or change Freedom. No dependency/lockfile changes or unrelated application-source edits.

## Acceptance Criteria
- [ ] The real configured plugin produces a single UIApplicationSceneManifest and a UIWindowScene-backed native window.
- [ ] AppDelegate initializes/binds the existing Expo factory without creating the legacy launch window.
- [ ] Plugin application is idempotent and fails on unknown, duplicate or conflicting input.
- [ ] Existing URL handlers and lifecycle forwarding are preserved, with cold/warm entry-point coverage at the feasible test boundaries.
- [ ] Dependency-free tests and available checks run, with baseline lint/tooling gaps reported honestly.
- [ ] A real prebuild/archive/export uses the plugin and signs build 2 for the same bundle/team and authorized iPhone.
- [ ] The installed update remains alive for at least 30 seconds and renders the initial screen, without app deletion.

## Frontier
Ready: diagnosis, implementation and local-device delivery are authorized. No implementation-start human decision is outstanding. A runtime or device refusal remains an observable delivery gate, not permission to bypass it.

## Gates
- Attempt: this fix through handoff and the authorized iPhone update.
- Budget and time per attempt: none set.
- Maximum attempts and quality retry limit: none set; preserve attempts and require a causal retry reason.
- Approvals: user “Certo correggi e installa” covers implementation, checks, local archive/export and updating Serene on the existing iPhone. No commit, push, PR, merge, publication, new external spend, additional app deletion or Freedom change.
- Exact version: keep existing dependency versions; no new user version gate.
- Existing blocks: missing UIScene lifecycle and known Xcode 27 fmt/deployment-target compatibility requirements. Reuse the already demonstrated narrow generated-config workaround and restore it after archiving. Initial lint/Knip/JSCPD tooling is absent; unexecuted checks cannot pass. Current local and remote master both begin at 77d888487cb1ed3f67ce93707d71361d14509492. No runner, delegation or scheduler.

## Step-by-Step Implementation Plan
1. Freeze the source identity and canonical ticket digest; admit targeted verification against the current candidate.
2. Add RED tests for the public config-plugin mods and baseline Swift fixture.
3. Implement scene-manifest and AppDelegate adaptation, the scene-delegate asset, idempotency/error checks, URL/lifecycle forwarding and configuration registration.
4. Run GREEN tests/static checks, simplify only if behavior is unchanged, freeze the candidate and review inline.
5. Apply prebuild without cleaning/deleting native work, archive/export with the existing paid-team identity, and verify the exact artifact.
6. Install over the current same-team app, observe its process and UI, and retain receipts and explicit limitations.

## Testing Plan
Use Node's built-in test runner and syntax checks; run `npm run typecheck` and `npm run lint` without fabricating missing tools. Validate graph links and canonical ticket round trip. Perform real prebuild/native compilation, scene-manifest/profile/signature checks and local iPhone update. Observe actual startup survival and initial screen; test warm/cold custom URL routing where feasible. Do not substitute source-text assertions for device behavior or repeat a full successful suite without a causal/policy reason.

## Out of Scope
Dependency upgrades, Instagram-link interception, multiwindow behavior, Android, unrelated code cleanup, Freedom changes, additional data deletion and Git/provider publication.
