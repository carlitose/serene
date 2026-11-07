const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const ts = require('typescript');
const { URL: ExpoURL } = require('whatwg-url-without-unicode');

const root = path.resolve(__dirname, '..');
const modules = new Map();

// Execute the real guard/rules/parser without Metro or new test dependencies.
function loadTypeScript(file) {
  file = path.resolve(file);
  if (!path.extname(file)) file += '.ts';
  if (modules.has(file)) return modules.get(file).exports;
  const module = { exports: {} };
  modules.set(file, module);
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const localRequire = (id) => {
    if (id.startsWith('@/')) return loadTypeScript(path.join(root, 'src', id.slice(2)));
    if (id.startsWith('.')) return loadTypeScript(path.resolve(path.dirname(file), id));
    return require(id);
  };
  const execute = vm.runInNewContext(`(function(require,module,exports){${source}\n})`, {
    URL: ExpoURL,
    console: { log() {} },
  });
  execute(localRequire, module, module.exports);
  return module.exports;
}

const { UrlGuardService } = loadTypeScript(path.join(root, 'src/services/urlGuard.service.ts'));
const evaluate = (url) => new UrlGuardService().evaluate(url);

for (const host of ['instagram.com', 'www.instagram.com']) {
  for (const suffix of ['', '/', '?apc=synthetic-fixture&next=%2Fdirect%2Finbox%2F', '/?apc=synthetic-fixture']) {
    test(`allows the exact HTTPS code-entry callback: ${host}, variant ${suffix ? 'with suffix' : 'plain'} ${suffix.length}`, () => {
      const url = `https://${host}/auth_platform/codeentry${suffix}`;
      const result = evaluate(url);
      assert.equal(result.result, 'allowed');
      assert.equal(result.shouldBlock, false);
      assert.equal(result.blockMode, 'soft');
      assert.equal(result.pageType, 'unknown');
      assert.equal(result.url, url, 'original callback and synthetic query must not be rewritten');
    });
  }
}

test('standard URL normalization still permits HTTPS with uppercase scheme/host', () => {
  assert.equal(evaluate('HTTPS://WWW.INSTAGRAM.COM/auth_platform/codeentry/').shouldBlock, false);
});

for (const [label, url] of [
  ['HTTP', 'http://www.instagram.com/auth_platform/codeentry/'],
  ['foreign host', 'https://example.test/auth_platform/codeentry/'],
  ['suffix lookalike', 'https://www.instagram.com.example.test/auth_platform/codeentry/'],
  ['prefix lookalike', 'https://notinstagram.com/auth_platform/codeentry/'],
  ['nonstandard port', 'https://www.instagram.com:8443/auth_platform/codeentry/'],
  ['extended callback path', 'https://www.instagram.com/auth_platform/codeentry/extra'],
  ['neighboring callback path', 'https://www.instagram.com/auth_platform/codeentry-other/'],
  ['other auth-platform path', 'https://www.instagram.com/auth_platform/other/'],
  ['query cannot authorize another host', 'https://example.test/auth_platform/codeentry/?next=https://www.instagram.com/accounts/login/'],
  ['relative input', '/auth_platform/codeentry/'],
  ['invalid input', 'not-a-url'],
]) {
  test(`does not grant a callback exception to ${label}`, () => {
    assert.equal(evaluate(url).shouldBlock, true);
  });
}

for (const [pathname, shouldBlock] of [
  ['/accounts/login/', false],
  ['/direct/inbox/', false],
  ['/explore/search/', false],
  ['/reel/synthetic-fixture/', true],
  ['/p/synthetic-fixture/', true],
  ['/stories/synthetic-fixture/42/', true],
  ['/explore/tags/synthetic-fixture/', true],
]) {
  test(`preserves existing filtering for ${pathname}`, () => {
    assert.equal(evaluate(`https://www.instagram.com${pathname}`).shouldBlock, shouldBlock);
  });
}
