# iOS 27 scene lifecycle startup fix

## Artifact Graph
- Artifact ID: `spec:ios-27-scene-lifecycle`
- Role: `spec`
- Standalone: true
- Children: [01 — Scene lifecycle startup](../tickets/ios-27-scene-lifecycle/01-scene-lifecycle-startup.md)

## Type
Bug analysis and implementation specification.

## Observed Behavior and Evidence
The Ad Hoc app installs, starts, and immediately terminates with `EXC_BREAKPOINT / SIGTRAP` on iOS 27.2. The top crash frame is `___UIApplicationEvaluateRuntimeIssueForNoSceneLifecycleAdoption_block_invoke`. The installed executable UUID matches the archive and dSYM. Its Info.plist has `DTSDKName=iphoneos27.2` but no `UIApplicationSceneManifest`; its AppDelegate constructs `UIWindow(frame:)` in the legacy launch callback. The signed IPA contains its JavaScript bundle, and installation/signing checks passed.

## Target Behavior
A reproducible native iOS build adopts a single UIWindowScene and opens Serene on the physical iPhone without immediately exiting. Expo prebuild must recreate the correction from versioned source. Existing React Native factory initialization, custom URL entry points and app lifecycle subscriber callbacks remain supported.

## Goals and Invariants
- Retain Expo SDK 54, React Native 0.81.5 and existing dependency versions.
- Keep bundle identifier `com.carlogiuseppesergi.sereneapp`, scheme `serene`, application version 1.0.0 and minimum iOS 15.1; increment the iOS build number to 2.
- Use the already authorized Fluentia team `735BVBTSDR` for this and subsequent configured iOS builds.
- Configure one scene, construct UIWindow from UIWindowScene and start the existing Expo React Native factory in that window.
- Preserve cold/warm URL delivery and Expo active/background/foreground callbacks.
- Preserve Instagram filtering, tabs and account behavior; no application business-logic changes.
- Install as an update of the existing Fluentia-signed app; no deletion or further Freedom changes.

## Implementation Slice
One local Expo config plugin owns generated AppDelegate adaptation and the scene manifest. Keep the Swift scene delegate as a versioned plugin asset and append it to the existing compiled AppDelegate source, avoiding extra Xcode project membership edits. Reject unknown or conflicting native bootstrap shapes rather than silently producing a partial migration. Apply the plugin idempotently. Add dependency-free Node tests exercising the real plugin mods, baseline native template, repeat application, failure cases and preservation of unrelated configuration/URL handlers. Register the plugin and test command in project configuration.

## External Contracts and Data
Apple's UIKit scene lifecycle and Expo config-plugin APIs are the changed integration boundaries. There is no data migration, new permission, new service, dependency upgrade, broad device-policy change or provider publication. Updating the app must not require another uninstall.

## Acceptance Criteria
1. Applying configured mods produces a single-scene manifest and a scene delegate using UIWindow(windowScene:).
2. The legacy window/bootstrap block is removed from didFinishLaunching; the Expo factory remains bound before scene connection.
3. Reapplying the plugin does not duplicate generated code, and unsupported/ambiguous bootstrap inputs fail visibly.
4. Existing URL handlers, initial URL delivery and Expo lifecycle forwarding remain represented and checked.
5. A real iOS prebuild applies the versioned plugin; source tests and available static checks run with truthful results.
6. The corrected signed IPA includes the scene manifest, build 2, embedded JS and the intended iPhone in its Ad Hoc profile.
7. Installation updates the existing app without deletion, and a physical-device launch remains alive for at least 30 seconds while displaying the initial Serene screen.

## Verification and Prior Attempts
Baseline RED is the observed immediate signal-5 exit on the previous IPA. Run Node plugin tests, syntax checks, TypeScript, the configured lint command, and graph/package checks. Do not claim unavailable tools as passing. The initial project has no test script, ESLint executable/configuration, Knip or JSCPD installation; expose these baseline limitations rather than add dependencies by inference. Review and QA run inline, not independently. Native validation includes real prebuild, archive/export, exact artifact/signing checks, update installation, bounded process observation and a visible screen check. Test URL entry points when the device/tooling permits; distinguish source assertions from live observations.

The previous unchanged-source packaging attempts are retained in the existing private build receipt: failures from device registration, fmt consteval, Yoga diagnostics and a global interpreter crash, followed by a successful fmt-only archive and Ad Hoc export. They belong to the previous IPA, not this candidate. Existing Xcode 27 build constraints require an iOS 15.1 build override and a temporary fmt-only compiler flag; reuse the demonstrated narrow workaround and restore generated configuration afterward. No full app suite has previously passed.

## Gates
- Attempt: this fix through implementation handoff and separately authorized local iPhone installation.
- Budget and time per attempt: none set.
- Maximum attempts and quality retry limit: none set; every retry must have a causal reason and preserve previous outcomes.
- Approvals: local implementation, checks, native build and installation authorized by the user's “Certo correggi e installa”. Existing Fluentia signing and target-iPhone scope are retained. No commit, push, PR, merge, publication or external spend is authorized or required.
- Exact version gate: no new version mandate; preserve current project dependency versions for this bounded fix.
- Existing blocks searched: app.json, package.json, eas.json, .gitignore, native bootstrap, previous diagnostic/build receipts, installed tooling and current origin/master. Source checkout and origin/master both start at 77d888487cb1ed3f67ce93707d71361d14509492. Known scene-lifecycle and native compiler blockers are addressed above. Missing optional/static tooling limits claims, not local implementation. A new device credential or device-enforced refusal blocks only the operation needing it.

## Out of Scope
Instagram universal links/share extensions, SDK/dependency upgrades, new multiwindow support, Android behavior, unrelated refactors, Freedom configuration and Git/provider delivery.

## Primary Documentation
- https://developer.apple.com/documentation/technotes/tn3187-migrating-to-the-uikit-scene-based-life-cycle
- https://docs.expo.dev/config-plugins/plugins/
