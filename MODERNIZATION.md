# Modernization plan

This repository is a snapshot of Bootstrap v3.3.6. Its build and test
toolchain is frozen at the 2016 versions that built the original release:
Grunt 0.4.x, `grunt-contrib-qunit` 0.7, PhantomJS 1.9, and Node.js 6. That
toolchain is why `npm install` and `npm test` only reproduce on Node 6.

## Why the toolchain was not replaced in this pass

A full runner swap is a re-platforming change, not a clean-up:

- The QUnit suite (11 plugin files under `js/tests/unit/`) runs through
  PhantomJS and reports istanbul coverage through `grunt-qunit-istanbul`.
  Replacing the runner without executing the suite would risk silently
  deleting the only working test signal in the repository.
- This working copy has no PhantomJS binary and no package registry access, so
  the legacy suite cannot be executed here. Shipping an unverified runner swap
  would trade a working (if old) suite for a broken one.
- The improvement pass therefore made the surrounding guarantees
  machine-checkable instead: reproducible lockfiles, blocking dependency
  gates, dependency-update automation, security policy, and CI hygiene.

## Planned migration (ordered, each step independently verifiable)

1. **Runner replacement**
   - Bump `grunt` to `^1.6.1` and replace `grunt-contrib-qunit@0.7` /
     `grunt-qunit-istanbul` with a maintained headless runner
     (`grunt-contrib-qunit@10`, which drives Puppeteer) or a standalone
     Playwright + `qunit` harness.
   - Keep the existing Grunt task names (`test`, `test-js`, `lint`, `qunit`)
     so `package.json` scripts and CI do not change again.
   - Preserve the coverage thresholds (`85/85/85/70`) using
     `karma-coverage`/`istanbul-lib` against the same `js/*.js` sources.
   - Acceptance: `npm ci && npm test` exits 0 on Node 20/22 with the same
     number of QUnit tests (count `QUnit.test` occurrences) and no PhantomJS
     dependency in the tree.

2. **Supported Node LTS**
   - After step 1, change `.nvmrc`, `engines.node`, and
     `actions/setup-node` to Node 22.
   - Delete the `cp grunt/npm-shrinkwrap.json ./` workaround and switch CI to
     `npm ci` against `package-lock.json`.
   - Acceptance: CI green on a fresh checkout with no npm-shrinkwrap file.

3. **Security backports from Bootstrap 3.4.x**
   - Backport the `Selector` escape/find utilities and the tooltip/popover
     sanitizer introduced upstream in 3.4.0, with unit tests, to close
     CVE-2018-14041 and CVE-2019-8331 (see SECURITY.md).
   - Acceptance: new QUnit tests cover selector injection and `html: true`
     content sanitization; the full suite passes.

4. **Dependency refresh**
   - Regenerate `package-lock.json` after the toolchain bump; keep
     `grunt/npm-shrinkwrap.json` only while Node 6 support is still needed.
   - `composer.lock` is committed so Composer installs are reproducible.

## Current guardrails (already in place)

- `npm audit --omit=dev --audit-level=high` blocks high/critical runtime
  advisories in CI.
- `.github/workflows/dependency-review.yml` blocks pull requests that
  introduce high/critical advisories.
- `.github/dependabot.yml` proposes minor/patch and security updates weekly.
- `package.json` exposes `test`, `test:unit`, `test:coverage`, and
  `test:lint` so the suite is discoverable to tooling and contributors.
