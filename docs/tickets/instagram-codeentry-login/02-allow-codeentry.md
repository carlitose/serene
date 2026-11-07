---
ticket_schema: 1
ticket_id: "02"
execution_mode: HITL
blocked_by: []
---

# Allow Instagram code-entry navigation and install build 3

## Artifact Graph
- Artifact ID: `ticket:instagram-codeentry-login:02`
- Role: `ticket`
- Parent: [Callback specification](../../specs/instagram-codeentry-login.md)

## Parent Spec
[instagram-codeentry-login.md](../../specs/instagram-codeentry-login.md), Target and Authorized Scope, Acceptance Criteria, Security and Gates.

## What to Build
Add the exact, HTTPS/official-host-only code-entry exception to UrlGuardService, real-module regression tests, and build 3 metadata. Generate/sign/install the same-team Ad Hoc update without deleting the app or changing its native scene bootstrap. The user owns the final authenticated login attempt.

## Allowed Paths
`src/services/urlGuard.service.ts`, `tests/url-guard.test.cjs`, `tests/ios-scenes.test.cjs`, `app.json`, this spec/ticket pair, and owned temporary/private Downloads receipts. Ignored native prebuild output may be regenerated; the temporary generated fmt config must be restored. Preserve unrelated source, dependencies, lockfile, filtering rules, interceptor and device settings.

## Acceptance Criteria
- [ ] Exact code-entry URLs on official HTTPS hosts are allowed and their original query is preserved.
- [ ] HTTP, lookalikes/foreign hosts, nonstandard ports and unrelated/extended paths gain no exception; invalid URL input does not throw.
- [ ] Existing login/messages and representative restricted-content decisions are preserved.
- [ ] Focused tests plus the mandatory npm test profile run; known static-check failures/gaps remain visible.
- [ ] The exported IPA is build 3, includes the changed JS and scene manifest, has valid Fluentia signing/profile and updates the current app without deletion.
- [ ] The user retries their own credentials and reports whether login completes; do not fabricate authenticated success.

## Frontier
Implementation-ready. HITL is for the post-installation authenticated login check only; no secret or human decision is needed to implement/build the bounded fix.

## Gates
- Attempt: callback fix through handoff and authorized local iPhone installation.
- Budget/time per attempt and maximum attempts: none set; retain all attempts, outcomes and durations.
- Approval: user “Si pe favore” approves the preceding explicit offer to correct the login exception and install a new build while preserving reel/post blocks. No commit/push/merge, external spend, app deletion or Freedom change is included.
- Human verification: open after installation; the user alone enters credentials and confirms authentication. This is not an implementation-start block.
- Exact versions: preserve current dependencies; no new user version gate.
- Existing blocks: current local/origin master 31a56142ffc5628dcb8bf67cf2f046d9f0e0d062; four existing PageType errors, absent ESLint/Knip, existing index/search duplication and known native fmt/Xcode workaround. Do not silently widen scope or waive a device-enforced refusal.

## Step-by-Step Implementation Plan
1. Validate canonical inputs, current candidate identity and delivered artifact graph.
2. Add RED tests using the actual TypeScript guard/rules/parser and synthetic URLs only.
3. Add the narrow exception with a valid existing PageType, update build metadata/assertion, and reach GREEN.
4. Inspect/simplify only if useful, freeze and review inline; execute admitted available checks with truthful outcomes.
5. Prebuild/archive/export once with the proven narrow compiler workaround; restore generated config, check the exact artifact, and install it as an update.
6. Leave credentials to the user and report the final human-verification gate explicitly.

## Testing Plan
Test both official hosts, optional slash, synthetic query preservation, HTTP/lookalike/foreign host/port/path negatives, invalid input and representative existing allow/block behavior. Run npm test because guard behavior and artifact metadata changed; do not repeat it just for receipt/docs changes. Run available typecheck/lint/duplication checks without adding dependencies. Native/package/signature/profile/build checks precede installation. Device readback proves installation, not completed login. Do not capture real callback query values or credential-bearing app-console output.

## Out of Scope
General host-rule redesign, additional unobserved OAuth routes, content-filter relaxation, dependency upgrades, broad privacy/logging refactors, Freedom, credential handling and Git/provider delivery.
