# AGENT_GUIDE.md

## Objective
Deliver small, reviewable, testable changes.
Prefer correctness, reproducibility, and low-risk edits over broad refactors.

## Working style
- Read the current code path before editing.
- For non-trivial work, write a short plan first.
- Keep diffs small and logically grouped.
- Do not modify unrelated files.
- Surface uncertainty early.
- If a task needs secrets, external credentials, production access, or destructive actions, stop and ask for approval.

## Code rules
- Preserve the current architecture unless there is a clear reason to change it.
- Match existing naming, formatting, and file organization.
- Prefer explicit, maintainable code over clever code.
- Avoid new dependencies unless they are necessary.
- Keep comments short and useful.

## Testing rules
- Run the smallest relevant check first.
- After changes, run relevant lint, typecheck, and tests for the touched scope.
- If the full suite is expensive, say what was run and what was not run.
- Do not claim a fix is complete without stating verification.

## Git rules
- Do not create branches, commits, tags, or push unless explicitly asked.
- Do not rewrite history.
- Keep commit suggestions short and conventional.

## Safety rules
- Do not touch production infra, billing, auth, secrets, or destructive scripts without explicit approval.
- Treat migrations, schema changes, lockfile churn, and global config edits as high-review changes.
- Never expose secrets from env files, configs, logs, or shell history.

## Output format
When finishing a task, always report:
1. What changed
2. Why it changed
3. How it was verified
4. Risks / follow-ups

## Project commands
- Install: `make setup`
- Dev: `make dev`
- Lint: `make lint`
- Typecheck: `make typecheck`
- Test: `make test`
- Targeted test: `make test-file FILE=<path>`

## Definition of done
A task is done only if:
- code is updated,
- relevant validation was run,
- unrelated files were not changed,
- handoff notes are clear.
