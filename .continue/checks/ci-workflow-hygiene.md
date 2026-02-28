---
name: CI Workflow Hygiene
description: Flag deprecated GitHub Actions versions, missing timeouts, and undefined environment variables in workflow files.
---

# CI Workflow Hygiene

## Context

PR reviews on Secured-Finance/stablecoin-app consistently flag GitHub Actions hygiene issues that are not caught by ESLint or TypeScript. CodeRabbit and human reviewers have flagged: deprecated `actions/checkout@v3` (should be v4), Node.js version mismatches, missing `timeout-minutes` on long-running jobs, missing environment variable definitions across deployment environments, and unpinned action versions. These issues cause silent CI failures and deployment inconsistencies across environments.

Key workflow files: `.github/workflows/build.yml`, `.github/workflows/deploy.yml`, `.github/workflows/deploy-environment.yml`, `.github/workflows/build-and-deploy-all-workflow.yml`.

## What to Check

### 1. Deprecated or Outdated Action Versions

All `uses:` references should use current stable versions. Flag any action pinned to an outdated major version.

BAD:
```yaml
- uses: actions/checkout@v3
- uses: actions/setup-node@v3
- uses: actions/cache@v3
```

GOOD:
```yaml
- uses: actions/checkout@v4
- uses: actions/setup-node@v4
- uses: actions/cache@v4
```

### 2. Missing Job Timeouts

All jobs that run builds, deployments, or curl commands must have `timeout-minutes` set to prevent runaway runners consuming credits.

BAD:
```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - run: curl -X POST https://ipfs-endpoint/upload
```

GOOD:
```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - run: curl --max-time 60 -X POST https://ipfs-endpoint/upload
```

### 3. Undefined Environment Variables

Every `${{ secrets.VAR }}` or `${{ env.VAR }}` referenced in a step must be defined in the job or workflow `env:` block or as a documented repository secret. Flag any reference that appears without a corresponding definition.

BAD:
```yaml
- run: echo $FILEBASE_BUCKET
  # FILEBASE_BUCKET never defined in env: block
```

GOOD:
```yaml
env:
  FILEBASE_BUCKET: ${{ secrets.FILEBASE_BUCKET }}
steps:
  - run: echo $FILEBASE_BUCKET
```

## Key Files to Check

- `.github/workflows/build.yml`
- `.github/workflows/deploy.yml`
- `.github/workflows/deploy-environment.yml`
- `.github/workflows/build-and-deploy-all-workflow.yml`
- `.github/workflows/tag-version.yml`
- `.github/workflows/merge-into-main.yml`

## Exclusions

- Third-party actions that do not yet have v4 equivalents
- Jobs that call reusable workflows (timeout is set in the called workflow)
- Secrets intentionally injected via environment and documented in `.env.local.sample`
