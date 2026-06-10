const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const path = require('node:path');
const test = require('node:test');

const ts = require('../frontend/node_modules/typescript');

const repoRoot = path.resolve(__dirname, '..');
const frontendSrc = path.join(repoRoot, 'frontend', 'src');

const readSource = (...segments) => fs.readFileSync(path.join(frontendSrc, ...segments), 'utf8');

const loadTsModule = (...segments) => {
  const filename = path.join(frontendSrc, ...segments);
  const source = fs.readFileSync(filename, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
    fileName: filename,
  });
  const mod = new Module(filename, module);
  mod.filename = filename;
  mod.paths = Module._nodeModulePaths(path.dirname(filename));
  mod._compile(outputText, filename);
  return mod.exports;
};

test('public app routes stay wired to the expected landing pages', () => {
  const appSource = readSource('App.tsx');

  assert.match(appSource, /<BrowserRouter>/);
  assert.match(appSource, /<Navigation \/>/);

  const routes = [...appSource.matchAll(/<Route\s+path="([^"]+)"\s+element={<([A-Za-z]+)\s*\/>}\s*\/>/g)]
    .map(([, routePath, component]) => ({ routePath, component }));

  assert.deepEqual(routes, [
    { routePath: '/', component: 'Home' },
    { routePath: '/download', component: 'DownloadPage' },
    { routePath: '/bug-report', component: 'BugReport' },
    { routePath: '/help/*', component: 'DocsPage' },
    { routePath: '*', component: 'NotFound' },
  ]);
});

test('home page keeps primary download calls to action wired', () => {
  const homeSource = readSource('pages', 'Home.tsx');

  assert.match(homeSource, /<Link to="\/download">/);
  assert.match(homeSource, /<Link to="\/download\?tab=features">/);
  assert.match(homeSource, /Available as a free download for Windows/);
});

test('download page keeps email gate and direct download integration wired', () => {
  const downloadSource = readSource('pages', 'Download.tsx');

  assert.match(downloadSource, /import EmailGateModal from "@\/components\/EmailGateModal"/);
  assert.match(downloadSource, /import \{ DOWNLOAD_URLS, VERSION_HISTORY, CURRENT_VERSION \} from "@\/config\/downloads"/);
  assert.match(downloadSource, /import \{ initiateDownload \} from "@\/services\/api"/);
  assert.match(downloadSource, /await initiateDownload\(sessionId, '', pendingDownload\.platform, pendingDownload\.version\)/);
  assert.match(downloadSource, /onClick=\{\(\) => handleDownloadClick\('windows'\)\}/);
  assert.match(downloadSource, /<EmailGateModal/);
  assert.match(downloadSource, /onSuccess=\{handleEmailSuccess\}/);
});

test('current download config is internally consistent', () => {
  const {
    CURRENT_VERSION,
    DOWNLOAD_URLS,
    VERSION_HISTORY,
    PLATFORM_MAPPINGS,
  } = loadTsModule('config', 'downloads.ts');

  assert.match(CURRENT_VERSION, /^\d+\.\d+\.\d+$/);
  assert.equal(VERSION_HISTORY[0].version, CURRENT_VERSION);
  assert.deepEqual(Object.keys(DOWNLOAD_URLS).sort(), ['linux', 'macos', 'windows']);
  assert.deepEqual(Object.keys(PLATFORM_MAPPINGS).sort(), ['linux', 'macos', 'windows']);

  const currentWindows = DOWNLOAD_URLS.windows;
  assert.equal(currentWindows.url, VERSION_HISTORY[0].downloads.windows.url);
  assert.equal(currentWindows.filename, `MixFade Setup ${CURRENT_VERSION}.exe`);
  assert.match(currentWindows.url, new RegExp(`/v${CURRENT_VERSION.replaceAll('.', '\\.')}/MixFade%20Setup%20${CURRENT_VERSION.replaceAll('.', '\\.') }\\.exe$`));

  for (const [index, release] of VERSION_HISTORY.entries()) {
    assert.match(release.version, /^\d+\.\d+\.\d+$/);
    assert.ok(release.date, `release ${release.version} has a date`);
    assert.ok(release.changes.length > 0, `release ${release.version} has changes`);

    for (const platform of ['windows', 'macos', 'linux']) {
      const download = release.downloads[platform];
      assert.ok(download.url, `release ${release.version} has ${platform} url`);
      assert.ok(download.filename, `release ${release.version} has ${platform} filename`);
      assert.ok(download.size, `release ${release.version} has ${platform} size`);
    }

    if (index > 0) {
      assert.ok(
        new Date(VERSION_HISTORY[index - 1].date) >= new Date(release.date),
        `release ${release.version} is not newer than previous entry`
      );
    }
  }
});

