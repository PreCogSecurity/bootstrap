#!/usr/bin/env node
'use strict';

/*!
 * Syntax-check the JavaScript sources without executing them.
 *
 * The legacy Grunt/QUnit toolchain only runs on Node 6, so this small
 * dependency-free check gives CI and contributors a fast gate that works on
 * any supported Node version. It parses every file with `node --check`.
 */

var fs = require('fs');
var path = require('path');
var spawnSync = require('child_process').spawnSync;

var TARGETS = [
  { dir: 'js', pattern: /\.js$/ },
  { dir: path.join('js', 'tests', 'unit'), pattern: /\.js$/ },
  { dir: 'grunt', pattern: /\.js$/ },
  { dir: '.', pattern: /^(Gruntfile|package)\.js$/ }
];

var failures = [];

TARGETS.forEach(function (target) {
  fs.readdirSync(target.dir).forEach(function (name) {
    if (!target.pattern.test(name)) {
      return;
    }
    var filepath = path.join(target.dir, name);
    var result = spawnSync(process.execPath, ['--check', filepath], { encoding: 'utf8' });
    if (result.status !== 0) {
      failures.push(filepath + '\n' + String(result.stderr || result.stdout || '').trim());
    }
  });
});

if (failures.length > 0) {
  console.error('JavaScript syntax errors:\n\n' + failures.join('\n\n'));
  process.exit(1);
}

console.log('Syntax check passed.');
