#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const downloadsConfigPath = path.join(__dirname, 'frontend', 'src', 'config', 'downloads.ts');
const source = fs.readFileSync(downloadsConfigPath, 'utf8');

const fail = (message) => {
  console.error(`Release config validation failed: ${message}`);
  process.exit(1);
};

const currentVersionMatch = source.match(/CURRENT_VERSION\s*=\s*'([^']+)'/);
if (!currentVersionMatch) {
  fail('Could not find CURRENT_VERSION.');
}

const currentVersion = currentVersionMatch[1];
const versionMatches = Array.from(source.matchAll(/version:\s*'([^']+)'/g)).map((match) => match[1]);

if (versionMatches.length === 0) {
  fail('No version history entries were found.');
}

if (versionMatches[0] !== currentVersion) {
  fail(`CURRENT_VERSION (${currentVersion}) does not match the first VERSION_HISTORY entry (${versionMatches[0]}).`);
}

const uniqueVersions = new Set(versionMatches);
if (uniqueVersions.size !== versionMatches.length) {
  fail('Duplicate versions were found in VERSION_HISTORY.');
}

const semverPattern = /^\d+\.\d+\.\d+$/;
const invalidVersions = versionMatches.filter((version) => !semverPattern.test(version));
if (invalidVersions.length > 0) {
  fail(`Invalid semver values found: ${invalidVersions.join(', ')}`);
}

const semverToTuple = (version) => version.split('.').map(Number);
for (let index = 1; index < versionMatches.length; index += 1) {
  const previous = semverToTuple(versionMatches[index - 1]);
  const current = semverToTuple(versionMatches[index]);

  const isDescending =
    previous[0] > current[0] ||
    (previous[0] === current[0] && previous[1] > current[1]) ||
    (previous[0] === current[0] && previous[1] === current[1] && previous[2] > current[2]);

  if (!isDescending) {
    fail(`VERSION_HISTORY must be in descending order. Problem near ${versionMatches[index - 1]} -> ${versionMatches[index]}.`);
  }
}

const forbiddenMarkers = [
  'yourusername',
  'github.com/yourusername',
  '<your MixFade repository URL>',
];

const foundMarkers = forbiddenMarkers.filter((marker) => source.includes(marker));
if (foundMarkers.length > 0) {
  fail(`Placeholder markers found in downloads config: ${foundMarkers.join(', ')}`);
}

if (!source.includes('https://mixfade.s3.us-east-1.amazonaws.com/releases')) {
  fail('Expected MixFade S3 release base URL is missing.');
}

console.log(`Release config validation passed for ${currentVersion}.`);
