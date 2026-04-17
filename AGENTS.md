# AGENTS.md

Read `./AGENT_GUIDE.md` first and follow it as the primary project guide.

## Local project notes
- Prefer minimal diffs.
- Prefer targeted tests before full-suite tests.
- State assumptions explicitly.
- Do not change unrelated files to "clean things up".
- For UI work, summarize visible behavior changes.
- For backend work, summarize endpoint, schema, and rollback impact.

## Repository map
- Source: `src/`
- Tests: `tests/`
- Docs: `docs/`

## Working procedure
1. Read `AGENT_GUIDE.md`
2. Inspect the relevant code path
3. Make a short plan
4. Edit only directly relevant files
5. Run the smallest useful validation
6. Report change summary in the required handoff format

## Task playbooks
- Implementation: `.Codex/skills/implement/SKILL.md`
- Review: `.Codex/skills/review/SKILL.md`
- Testing: `.Codex/skills/test/SKILL.md`
