const assert = require('node:assert/strict');
const test = require('node:test');

const SecurityUtils = require('../backend/src/utils/security');

test('sanitizeInput removes markup and trims surrounding whitespace', () => {
  assert.equal(
    SecurityUtils.sanitizeInput('  <script>alert("x")</script> MixFade  '),
    'MixFade',
  );
});

test('validateEmail normalizes valid email addresses', () => {
  const result = SecurityUtils.validateEmail('  DJ@Example.COM  ');

  assert.equal(result.isValid, true);
  assert.equal(result.sanitized, 'dj@example.com');
  assert.deepEqual(result.errors, []);
});

test('validateEmail rejects blocked disposable domains', () => {
  const result = SecurityUtils.validateEmail('user@10minutemail.com');

  assert.equal(result.isValid, false);
  assert.deepEqual(result.errors, ['Email domain is not allowed']);
});

test('validatePlatform falls back to windows for unsupported platforms', () => {
  assert.equal(SecurityUtils.validatePlatform('linux'), 'linux');
  assert.equal(SecurityUtils.validatePlatform('freebsd'), 'windows');
});

test('validateVersion accepts semver and rejects malformed values', () => {
  assert.equal(SecurityUtils.validateVersion('1.2.3'), '1.2.3');
  assert.equal(SecurityUtils.validateVersion('1.2'), '0.9.4');
  assert.equal(SecurityUtils.validateVersion('<script>1.2.3</script>'), '0.9.4');
});
