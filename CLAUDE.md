# CLAUDE.md

Read `./AGENT_GUIDE.md` first and follow it as the primary project guide.

## Local project notes
- Prefer minimal diffs.
- Prefer targeted tests before full-suite tests.
- State assumptions explicitly.
- Do not change unrelated files to "clean things up".
- For UI work, summarize visible behavior changes.
- For backend work, summarize endpoint, schema, and rollback impact.

## Repository map
- Source: project root (`index.html`, `script.js`, `style.css`, `server.py`, `scraper.py`)
- Generated data: `data.js`
- Logs and task records: `tasks/`

## Working procedure
1. Read `AGENT_GUIDE.md`
2. Inspect the relevant code path
3. Make a short plan for non-trivial work
4. Edit only directly relevant files
5. Run the smallest useful validation
6. Report change summary in the required handoff format
7. Append a work log entry to `tasks/log.md`

## Logging rule
After every completed task, append a new entry to `tasks/log.md`.

Use this format:

## YYYY-MM-DD HH:MM

### Task
<short summary>

### Files changed
- <file 1>
- <file 2>

### Why
<reason for the change>

### Verification
- <command or manual check>
- <result>

### Risks / Follow-ups
- <remaining risk or next step>

Rules:
- Append only. Do not delete prior entries.
- If no files were changed, write `Files changed: none`.
- If verification was not run, state exactly why.
- Keep entries concise but specific.

## Task playbooks
- Implementation: `.claude/skills/implement/SKILL.md`
- Review: `.claude/skills/review/SKILL.md`
- Testing: `.claude/skills/test/SKILL.md`

## Workflow

For non-trivial tasks:
- Write plan to `tasks/todo.md` before starting

After every task:
- Append result to `tasks/log.md`

Do not skip logging.