# Allow Instagram's code-entry login callback

## Artifact Graph
- Artifact ID: `spec:instagram-codeentry-login`
- Role: `spec`
- Standalone: true
- Children: [02 — Allow code entry](../tickets/instagram-codeentry-login/02-allow-codeentry.md)

## Type and Diagnosis
Bug analysis. After entering credentials, Instagram navigates to `/auth_platform/codeentry/`. Serene's UrlGuardService has no matching login exception/rule and applies its default hard block; useNavigation then cancels the navigation and shows BlockedScreen. A local execution of the actual guard, rules and URL parser reproduced the block both without a query and with a synthetic query. Existing `/accounts/login/` and messages are allowed. No real credential/token was used for reproduction, and no login was attempted by the agent.

## Target and Authorized Scope
Permit only the code-entry callback on HTTPS `instagram.com` and `www.instagram.com`, with an optional trailing slash. Preserve the original URL and all query values when allowing the request. Keep all existing content-filtering decisions unchanged, including reel/post blocking. Preserve the single-scene native bootstrap, application/bundle/team identity, data container and dependencies. Increment the iOS build number from 2 to 3 so the installed update can be identified.

## Implementation
Add a narrowly scoped exception inside UrlGuardService before the existing rules. Require the official host, HTTPS, and exact code-entry pathname; do not allow an entire domain or all auth_platform paths. Use an existing valid PageType rather than introducing a new runtime/type contract. Add dependency-free tests that execute the actual TypeScript modules with the already installed TypeScript compiler. Update the existing build-number assertion alongside app metadata.

## Acceptance Criteria
1. Both official HTTPS hosts allow `/auth_platform/codeentry` and `/auth_platform/codeentry/`, preserving the original input URL, with or without synthetic query data.
2. HTTP, foreign/lookalike hosts, nonstandard ports and neighboring/extended callback paths do not gain this exception; malformed input does not throw.
3. Existing account login/messages stay allowed and representative reel/post/story/explore-detail URLs keep their prior blocking decisions. The injected interceptor remains unchanged.
4. Targeted tests pass; full-project checks are reported truthfully, including known baseline failures.
5. Build 3 includes the changed JavaScript, the existing scene manifest and correct Fluentia Ad Hoc signing; installation updates the current app without uninstalling.
6. The user retries login with their own credentials after installation. A successful completed login is not claimed from unit tests or app-process survival alone.

## Security, Data and Non-goals
The screenshot/query contains authentication material. Never copy real query values into source, fixtures, commands, documentation, receipts or external requests. Use synthetic inputs only. Do not ask for credentials, operate password storage, change Freedom/device restrictions, clear app data or submit a real login. Existing raw-URL diagnostic/UI display and broader legacy host checks are outside this narrowly authorized fix; do not capture their secret-bearing output. No new dependencies, SDK changes, unrelated cleanup or automatic Git/provider delivery.

## Verification and Prior Evidence
Admission binds current local/remote master and a canonical ticket/CandidateRef. The initial guard reproduction is a retained RED mechanism observation on baseline 31a56142ffc5628dcb8bf67cf2f046d9f0e0d062; it does not verify the changed candidate. Run new callback tests RED then GREEN, followed by the mandatory npm test profile because runtime URL rules and build metadata change. Run available type/syntax/duplication checks once; missing tools and old failures remain visible. Review/QA are inline, not independent. Prebuild/archive/export and exact IPA checks cross the delivered packaging boundary. Reuse the previously successful generated fmt-only compiler workaround and iOS 15.1 override, restoring the generated file afterward. Do not repeat a successful native build without a causal reason. Previous lifecycle-fix build attempts and receipts remain separate evidence.

## Gates
- Attempt: this callback fix through implementation handoff and the authorized local iPhone update.
- Budget/time per attempt and maximum attempts: none set; retain every attempted check/build and its outcome/duration.
- Approval: the user's “Si pe favore” answers the explicit offer to correct the exception and install a new build while retaining reel/post blocks. No additional implementation-start decision is open. No commit/push/merge, new external spend, app deletion or Freedom change is included.
- Human verification: open after installation; only the user enters credentials and confirms whether authentication completes. This limits the final claim, not implementation/build admission.
- Exact versions: preserve current dependencies; no new version mandate.
- Existing blocks searched: guard/rules/parser, navigation/interceptor, package/app configuration, native build support, current local/origin master and previous check receipts. Both master heads start at 31a56142ffc5628dcb8bf67cf2f046d9f0e0d062. Known baseline: four PageType errors, absent ESLint/Knip, one existing index/search clone, and the documented Xcode/fmt compatibility requirement. These are disclosed, not silently repaired or counted as passing. A device refusal blocks only device delivery; never bypass it.
