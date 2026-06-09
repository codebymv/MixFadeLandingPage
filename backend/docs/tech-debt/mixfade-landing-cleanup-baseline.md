# MixFade Landing Cleanup Baseline

## CI Gate Checkpoint

The landing repo now has a GitHub Actions validation workflow at
`.github/workflows/ci.yml`.

Canonical local validation remains:

```bash
npm run check
```

The CI workflow installs root, frontend, and backend dependencies with `npm ci`
and then runs the same `npm run check` command used locally.

Current scope:

- Landing deploy remains out of scope for this checkpoint.
- Download metadata remains controlled by `frontend/src/config/downloads.ts`.
- The current public MixFade version remains `0.9.8`.
- The workflow does not require secrets and does not run Railway or S3 deploys.

Latest verification:

- `npm run check`: passes.
