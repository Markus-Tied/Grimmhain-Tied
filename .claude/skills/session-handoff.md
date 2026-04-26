---
name: session-handoff
description: Save and restore work context between Claude sessions. Creates timestamped handoff documents that preserve project state, decisions, and next steps. Use when asked to "save state", "create a handoff", "pause work", "resume previous session", or when context is getting long.
---

# Session Handoff

Transfer work context between sessions to prevent losing progress when context resets.

## When to Use

**Create a handoff when:**
- Context window is getting long
- Ending a work session mid-task
- Pausing work on a complex multi-step task
- Handing work off to another session or person

**Resume from handoff when:**
- Starting a new session on an ongoing task
- User says "continue where we left off"
- User references previous session work

## Creating a Handoff

Save to: `.claude/handoffs/YYYY-MM-DD-HH-MM-{task-slug}.md`

### Handoff Document Template

```markdown
# Handoff: [Task Name]
**Created:** YYYY-MM-DD HH:MM
**Previous Handoff:** [link if this is a continuation]

## Current State
What is done. What is working. Current status in one paragraph.

## Context
Background needed to understand the work:
- Why are we doing this?
- What constraints exist?
- What did we try that didn't work?
- Key decisions made so far

## Immediate Next Steps
1. [Specific, actionable next step]
2. [Second step]
3. [Third step]

These should be concrete enough that a fresh session can start immediately.

## Open Questions
- [ ] Question that needs answering before proceeding
- [ ] Decision that needs to be made

## Key Files
- `src/feature.ts` — Main implementation, currently broken at line 42
- `docs/spec.md` — Requirements document

## Decisions Made
| Decision | Reason | Date |
|----------|--------|------|
| Used PostgreSQL over MongoDB | Better for relational data | 2026-04-01 |

## Gotchas and Warnings
- Don't touch `legacy/auth.js` — it has undocumented side effects
- The test suite requires `docker compose up` first
```

## Resuming from Handoff

1. Find handoffs: list files in `.claude/handoffs/`
2. Check staleness: compare creation time to recent git commits
3. Load the document completely — read all sections
4. Verify assumptions still hold (check key files mentioned)
5. Start with first immediate next step

### Staleness Guide

| Time Since Creation | Status | Action |
|---------------------|--------|--------|
| < 2 hours | FRESH | Trust fully |
| 2–8 hours | SLIGHTLY STALE | Verify key files |
| 8–24 hours | STALE | Re-read code before proceeding |
| > 24 hours | VERY STALE | Treat as reference only, re-explore |

## Handoff Chaining

For long-running projects, chain handoffs:

```markdown
**Previous Handoff:** `.claude/handoffs/2026-04-01-14-00-auth-feature.md`
```

This creates a breadcrumb trail of context across multiple sessions.

## Validation Checklist

Before finalizing a handoff:

- [ ] Current state is accurate (not aspirational)
- [ ] Next steps are specific and actionable
- [ ] No secrets or credentials included
- [ ] Key files are listed with their purpose
- [ ] Decisions are documented with rationale
- [ ] Open questions are listed
