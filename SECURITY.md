# Security Policy

## Supported versions

This repository is a maintained snapshot of Bootstrap **v3.3.6**. Security
fixes are applied to `master` only. Upstream Bootstrap v3 reached end of life
and this fork vendors its own fixes; see [MODERNIZATION.md](MODERNIZATION.md)
for the planned upgrade path to a supported Bootstrap release.

| Version | Supported |
| ------- | --------- |
| 3.3.6 (this repository) | :white_check_mark: |
| < 3.3.6 | :x: |

## Reporting a vulnerability

**Please do not open a public issue for a security problem.**

Report vulnerabilities privately through GitHub's security advisory flow:

<https://github.com/PreCogSecurity/bootstrap/security/advisories/new>

Include the affected plugin/file, a minimal reproduction, the impact you
observed, and any suggested fix. We aim to acknowledge reports within five
business days and to publish an advisory once a fix is available.

## Known upstream advisories

Bootstrap 3.3.6 predates several security releases in the 3.4.x line. The most
relevant for applications that pass untrusted content into the library are:

- **CVE-2019-8331** — cross-site scripting in the tooltip and popover plugins
  when `html` content is enabled. Mitigation: never pass untrusted input to
  `data-content`, `data-template`, `title`, or `content`; prefer
  `html: false` and render untrusted text with `.text()`. The long-term fix is
  the sanitizer introduced in Bootstrap 3.4.0, tracked in MODERNIZATION.md.
- **CVE-2018-14041** — cross-site scripting in the `data-target` /
  `data-parent` selector handling of several plugins. Mitigation: only use
  selectors from trusted markup (never concatenate user input into
  `data-target`).

Applications should also set a Content-Security-Policy and avoid enabling
`html: true` for content they do not fully control.

## Dependency policy

- `npm audit --omit=dev --audit-level=high` is a blocking CI check: runtime
  dependencies must not carry a high or critical advisory.
- `.github/workflows/dependency-review.yml` blocks pull requests that
  introduce a high or critical advisory.
- Dependabot keeps npm, Bundler, Composer, and GitHub Actions dependencies
  patched.
- The legacy 2016 dev toolchain has a known advisory baseline that is reported
  informationally until the migration in MODERNIZATION.md is complete. It is
  **not** shipped to consumers and is not a runtime dependency.

## Handling secrets

No credentials belong in this repository. Local environment files are ignored
by `.gitignore`; use CI-provided secrets for any future deployment workflow.
