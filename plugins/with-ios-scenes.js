const fs = require('node:fs');
const path = require('node:path');
const { withAppDelegate, withInfoPlist } = require('expo/config-plugins');

const startMarker = '// @generated Serene UIScene lifecycle';
const endMarker = '// @end generated Serene UIScene lifecycle';
const delegateClass = '$(PRODUCT_MODULE_NAME).SereneSceneDelegate';
const factoryProperty = '  var reactNativeFactory: RCTReactNativeFactory?';
const launchProperty = '  var sceneLaunchOptions: [UIApplication.LaunchOptionsKey: Any]?';
const legacyBootstrap = `#if os(iOS) || os(tvOS)
    window = UIWindow(frame: UIScreen.main.bounds)
    factory.startReactNative(
      withModuleName: "main",
      in: window,
      launchOptions: launchOptions)
#endif`;

function replaceOnce(contents, original, replacement) {
  const parts = contents.split(original);
  if (parts.length !== 2) {
    throw new Error('Unsupported or ambiguous Expo Swift bootstrap; scene migration was not applied.');
  }
  return parts.join(replacement);
}

function adaptAppDelegate(contents) {
  const scene = fs.readFileSync(path.join(__dirname, 'ios/SceneDelegate.swift.template'), 'utf8').trim();
  const generated = `${startMarker}\n${scene}\n${endMarker}`;

  if (contents.includes(startMarker)) {
    if (contents.includes(legacyBootstrap) || !contents.includes(launchProperty) ||
        !contents.includes('sceneLaunchOptions = launchOptions')) {
      throw new Error('Partial scene bootstrap migration detected.');
    }
    const before = contents.split(startMarker);
    const after = contents.split(endMarker);
    if (before.length !== 2 || after.length !== 2 || contents.indexOf(endMarker) < contents.indexOf(startMarker)) {
      throw new Error('Ambiguous generated scene bootstrap markers.');
    }
    return `${before[0]}${generated}${after[1]}`;
  }

  if (contents.includes(endMarker) || contents.includes('class SereneSceneDelegate:') || contents.includes(launchProperty)) {
    throw new Error('Conflicting or partial scene bootstrap migration detected.');
  }
  let result = replaceOnce(contents, factoryProperty, `${factoryProperty}\n${launchProperty}`);
  result = replaceOnce(result, legacyBootstrap, '    sceneLaunchOptions = launchOptions');
  if (!/^import UIKit$/m.test(result)) result = `import UIKit\n${result}`;
  return `${result.trimEnd()}\n\n${generated}\n`;
}

module.exports = function withIosScenes(config) {
  config = withInfoPlist(config, (mod) => {
    const manifest = mod.modResults.UIApplicationSceneManifest ?? {};
    const configurations = manifest.UISceneConfigurations ?? {};
    const existing = configurations.UIWindowSceneSessionRoleApplication ?? [];
    if (!Array.isArray(existing) || existing.length > 1 ||
        existing.some((scene) => scene.UISceneDelegateClassName !== delegateClass)) {
      throw new Error('An existing scene configuration is owned by another delegate.');
    }
    mod.modResults.UIApplicationSceneManifest = {
      ...manifest,
      UIApplicationSupportsMultipleScenes: false,
      UISceneConfigurations: {
        ...configurations,
        UIWindowSceneSessionRoleApplication: [{
          UISceneConfigurationName: 'Serene',
          UISceneDelegateClassName: delegateClass,
        }],
      },
    };
    return mod;
  });

  return withAppDelegate(config, (mod) => {
    if (mod.modResults.language !== 'swift') {
      throw new Error('Serene scene lifecycle requires the Expo Swift AppDelegate.');
    }
    mod.modResults.contents = adaptAppDelegate(mod.modResults.contents);
    return mod;
  });
};
