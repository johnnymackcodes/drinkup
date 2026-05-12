# Security Policy

Thanks for taking the time to help keep drinkup safe.

## Scope

drinkup is a static client-side web app. It has no server, no accounts, no
database, and stores no data outside the user's own browser (URL and, in the
future, `localStorage`). The realistic threat surface is small: XSS via the
URL query string, supply-chain issues in dependencies, or build-output
tampering.

## Supported versions

Only the latest commit on `master` is supported. Older versions will not
receive fixes.

## Reporting a vulnerability

**Please do not open a public issue for security reports.**

Use GitHub's private vulnerability reporting:

1. Go to the repository's **Security** tab.
2. Click **Report a vulnerability**.
3. Describe the issue, steps to reproduce, and impact.

If GitHub's private reporting isn't an option for you, you may also contact
the maintainer through their GitHub profile.

### What to include

- A clear description of the issue and why it's a security concern.
- Steps to reproduce (a URL, a minimal repro, or a code snippet).
- The affected commit SHA or version.
- Your assessment of severity and impact.

### What to expect

- Acknowledgement within a few days.
- An initial assessment and proposed fix or mitigation within ~2 weeks for
  confirmed issues.
- Credit in the release notes if you'd like it.

## Out of scope

- Vulnerabilities in dependencies that aren't actually reachable from this
  app's code paths. (Please file those upstream.)
- Issues that require physical access to the user's device or a compromised
  browser.
- Best-practice / hardening suggestions without a concrete exploit are
  welcome as regular GitHub issues, not security reports.
