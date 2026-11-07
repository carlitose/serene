const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const fixture = fs.readFileSync(path.join(__dirname, 'fixtures/AppDelegate.swift.txt'), 'utf8');
const pluginPath = '../plugins/with-ios-scenes';

async function applyMod(name, modResults) {
  const config = require(pluginPath)({ name: 'Serene', slug: 'serene' });
  const result = await config.mods.ios[name]({
    ...config,
    modResults,
    modRequest: { projectRoot: root, platform: 'ios' },
  });
  return result.modResults;
}

const swift = (contents = fixture) => ({ language: 'swift', contents });

test('project registers the scene plugin, paid team and distinguishable build', () => {
  const { expo } = require('../app.json');
  assert.ok(expo.plugins.includes('./plugins/with-ios-scenes'));
  assert.equal(expo.ios.appleTeamId, '735BVBTSDR');
  assert.equal(expo.ios.buildNumber, '3');
  assert.equal(expo.ios.bundleIdentifier, 'com.carlogiuseppesergi.sereneapp');
  assert.equal(expo.scheme, 'serene');
});

test('Info.plist mod configures a single native scene and preserves other keys', async () => {
  const info = await applyMod('infoPlist', { NSCameraUsageDescription: 'keep', CustomKey: 42 });
  assert.equal(info.NSCameraUsageDescription, 'keep');
  assert.equal(info.CustomKey, 42);
  assert.equal(info.UIApplicationSceneManifest.UIApplicationSupportsMultipleScenes, false);
  assert.deepEqual(info.UIApplicationSceneManifest.UISceneConfigurations.UIWindowSceneSessionRoleApplication, [{
    UISceneConfigurationName: 'Serene',
    UISceneDelegateClassName: '$(PRODUCT_MODULE_NAME).SereneSceneDelegate',
  }]);
  assert.deepEqual(await applyMod('infoPlist', info), info);
});

test('Info.plist mod rejects a scene delegate owned by another configuration', async () => {
  await assert.rejects(applyMod('infoPlist', {
    UIApplicationSceneManifest: { UISceneConfigurations: {
      UIWindowSceneSessionRoleApplication: [{ UISceneDelegateClassName: 'Other.SceneDelegate' }],
    } },
  }), /scene configuration/i);
});

test('Swift mod moves the native window startup to the scene and retains the factory', async () => {
  const { contents } = await applyMod('appDelegate', swift());
  assert.ok(!contents.includes('window = UIWindow(frame: UIScreen.main.bounds)'));
  assert.ok(contents.includes('sceneLaunchOptions = launchOptions'));
  assert.ok(contents.includes('bindReactNativeFactory(factory)'));
  assert.ok(contents.includes('class SereneSceneDelegate: UIResponder, UIWindowSceneDelegate'));
  assert.ok(contents.includes('UIWindow(windowScene: windowScene)'));
  assert.equal((contents.match(/factory\.startReactNative\(/g) || []).length, 1);
  assert.ok(contents.indexOf('bindReactNativeFactory(factory)') < contents.indexOf('sceneLaunchOptions = launchOptions'));
});

test('app delegate transformation is idempotent', async () => {
  const once = await applyMod('appDelegate', swift());
  const twice = await applyMod('appDelegate', once);
  assert.equal(twice.contents, once.contents);
  assert.equal((twice.contents.match(/class SereneSceneDelegate:/g) || []).length, 1);
  assert.equal((twice.contents.match(/var sceneLaunchOptions:/g) || []).length, 1);
});

test('existing custom URL and universal-link handlers remain unchanged', async () => {
  const { contents } = await applyMod('appDelegate', swift());
  const originalHandlers = fixture.slice(fixture.indexOf('  // Linking API'), fixture.indexOf('\nclass ReactNativeDelegate'));
  assert.ok(contents.includes(originalHandlers));
  assert.ok(contents.includes('func scene(_ scene: UIScene, openURLContexts'));
  assert.ok(contents.includes('continue userActivity: NSUserActivity'));
  assert.ok(contents.includes('open: context.url'));
  assert.ok(contents.includes('restorationHandler: { _ in }'));
});

test('scene startup carries cold URLs and browsing activities into React launch options', async () => {
  const { contents } = await applyMod('appDelegate', swift());
  assert.ok(contents.includes('connectionOptions.urlContexts.first?.url'));
  assert.ok(contents.includes('connectionOptions.userActivities.first(where:'));
  assert.ok(contents.includes('NSUserActivityTypeBrowsingWeb'));
  assert.ok(contents.includes('launchOptions[.url] = url'));
});

test('scene lifecycle forwards all existing Expo application-state callbacks', async () => {
  const { contents } = await applyMod('appDelegate', swift());
  for (const callback of ['applicationDidBecomeActive', 'applicationWillResignActive', 'applicationWillEnterForeground', 'applicationDidEnterBackground']) {
    assert.ok(contents.includes(`${callback}(UIApplication.shared)`), callback);
  }
});

test('unsupported Objective-C app delegates fail visibly', async () => {
  await assert.rejects(applyMod('appDelegate', { language: 'objc', contents: fixture }), /Swift/);
});

test('unrecognized native bootstrap fails instead of silently emitting a partial migration', async () => {
  await assert.rejects(applyMod('appDelegate', swift('import Expo\nclass ChangedAppDelegate {}\n')), /bootstrap/i);
});

test('duplicate native startup blocks are rejected', async () => {
  const legacyStart = fixture.slice(fixture.indexOf('#if os(iOS)'), fixture.indexOf('#endif') + '#endif'.length);
  await assert.rejects(applyMod('appDelegate', swift(fixture + '\n' + legacyStart)), /bootstrap/i);
});

test('a marker cannot hide an incomplete legacy bootstrap migration', async () => {
  await assert.rejects(applyMod('appDelegate', swift(fixture + '\n// @generated Serene UIScene lifecycle\n')), /bootstrap|partial/i);
});
