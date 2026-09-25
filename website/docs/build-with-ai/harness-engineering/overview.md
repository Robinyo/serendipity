# Overview

> How Solar Pro 4 (Hermes) and the Mac Mini's Ollama models are wired together as a coding harness for this repository.

## Topology

```
Mac Book Air (host)
  └── Hermes desktop app
        └── Solar Pro 4  (primary agent — Upstage, via Nous provider)
              ├── reads .hermes.md  (repo-level instructions)
              ├── reads .knowledge/  (canonical project knowledge)
              ├── loads skills  (on demand, by topic)
              ├── uses memory  (persistent cross-session facts)
              ├── uses session_search  (recover earlier turns)
              └── calls Mac Mini via HTTP when a code task benefits from a second opinion

Mac Mini (M5 Pro, 64 GB, 192.168.2.1)
  └── Ollama
        ├── qwen2.5-coder:14b  (supplementary reviewer — ~2024 training)
        └── qwen2.5-coder:7b   (fast supplementary reviewer)
```

**Model roles:**

| Model | Where | Role | Training cutoff |
|---|---|---|---|
| Solar Pro 4 | Hermes on MBA, API (Upstage/Nous) | Primary — version-specific work, authoritative decisions, doc authorship | 2026-02 |
| Qwen 2.5 Coder 14B | Ollama on Mini, `http://192.168.2.1:11434` | Supplementary reviewer — code review, exploratory QA | ~2024 |
| Qwen 2.5 Coder 7B | Ollama on Mini, same endpoint | Fast supplementary reviewer | ~2024 |

Solar Pro 4 knows Spring Boot 4, Angular v22, and Java 25 from training (cutoff 2026-02). The Mini's Qwen models do not reliably know those versions (their training predates them), so they are consulted as opinionated reviewers, not as authoritative sources on version-specific correctness. The `.continue/rules/` file gives them version hints when they are used.

## What each layer contributes

### `.hermes.md` — repo-level instructions (root)

`/Users/rob/workspace/Hermes/serendipity/.hermes.md` (4,552 bytes, last updated 2026-09-16).

This is the equivalent of the tutorial's `AGENTS.md`/`CLAUDE.md`. It tells Hermes:

- The repo has a canonical knowledge layer in `.knowledge/` (Open Knowledge Format monorepo), separate from the rendered `website/docs/` Docusaurus site.
- The `.knowledge/` files are the single source of truth for project facts, decisions, and architecture. `website/docs/` is a rendered, procedural layer.
- The index of what lives where: `.knowledge/index.md`, `.knowledge/log.md` (ADR log), `.knowledge/backend/`, `.knowledge/frontend/`, `.knowledge/integration/`.
- Source-of-truth rules: Party Service entity model is authoritative; no Serendipity `User` table (Keycloak users only); identity attributes live in the ID token; `username` not `preferred_username`; `manager` attribute semantics.
- The two-layer model: `.knowledge/` (canonical) vs `website/docs/` (rendered).
- Open items and what's deferred.

### `.knowledge/` — canonical project knowledge

`/.knowledge/` is the Open Knowledge Format monorepo. When Hermes needs a project fact — architecture decision, security model, backend/frontend structure, API contracts — it reads the relevant `.knowledge/` file first, not memory or inference.

| File | What it is |
|---|---|
| `.knowledge/index.md` | Global monorepo map and entry point |
| `.knowledge/log.md` | Architecture decision log (ADR-0001 through ADR-0005) |
| `.knowledge/backend/index.md` | Spring Boot backend architecture: modules, build, runtime topology |
| `.knowledge/backend/security.md` | Security model: Keycloak, two-token model, roles, groups, `manager` attribute, enforcement |
| `.knowledge/frontend/index.md` | Angular 22 + BFF flow + token relay + `/api.me` |
| `.knowledge/integration/api-contracts.md` | API contract layer (placeholder in v1; current surface + target state) |

The `.knowledge/` layer serves the same role as the tutorial's "system-of-record docs" — it is the place Hermes checks before inferring or recalling.

### Skills — on-demand specialised knowledge

Skills are Hermes's mechanism for loading specialised workflows when a task matches. They are Hermes app-level, not repo files. Examples relevant to Serendipity work:

- `systemic-debugging` — 4-phase root-cause debugging
- `test-driven-development` — RED-GREEN-REFACTOR enforcement
- `codebase-inspection` — pygount-based LOC/ language ratios
- `dogfood` — exploratory QA of web apps
- `documentation-consistency` — prevent stale cross-references after edits
- `github` — gh CLI: PRs, issues, reviews, repos
- `requesting-code-review` — pre-commit review: security scan, quality gates

Skills encode the _how_ for recurring task types. They are loaded when the task matches, and they carry the user's preferred approach and quality standards for that task type.

### `.continuerc` + `.continue/rules/` — version guidance for local models

`/.continuerc` (project root) configures the two Ollama models on the Mac Mini:

```json
{
  "models": [
    {
      "name": "Qwen 2.5 Coder 14B",
      "provider": "ollama",
      "apiBase": "http://192.168.2.1:11434",
      "model": "qwen2.5-coder:14b",
      "customInstructions": "Read .continue/rules/serendipity-versions.md before responding..."
    },
    {
      "name": "Qwen 2.5 Coder 7B (fast)",
      "provider": "ollama",
      "apiBase": "http://192.168.2.1:11434",
      "model": "qwen2.5-coder:7b",
      "customInstructions": "..."
    }
  ]
}
```

`/.continue/rules/serendipity-versions.md` (~11.5 KB, 206 lines) is the version guidance document the local models read. It is grounded in the actual project files and covers:

- Angular v22.1.1, Spring Boot 4.0.1, Spring Cloud 2025.1.0, Java 25
- Serendipity security model (Keycloak, two-token model, roles, groups, `manager` attribute)
- Role tiers (partner → analyst) and the sample org (Shane Longman)
- The `.knowledge/` doc map
- Model-selection guidance (Solar Pro 4 vs Qwen) — when to use which
- The resolved `username` vs `preferred_username` note (line 55 of `application.yml`)

This layer exists because the Mini's models can't rely on pre-training for Spring Boot 4 / Angular v22 / Java 25. The rules file is the system-prompt-equivalent that gives them version hints.

### Memory — persistent cross-session facts

Hermes memory carries facts across sessions. For Serendipity, the memory entries include:

- The user is Rob Ferguson — owner of GitHub repo `Robinyo/serendipity` (open source Customer Engagement Platform, GNU AGPL v3.0).
- Preference: do not push to GitHub unless explicitly asked — user controls when local changes go remote.
- Preference: read short markdown doc files before assuming they're stubs.
- Serendipity docs structure: two new docs planned (high-level Identity overview; User Provisioning design doc).
- User is precise about Keycloak/OIDC terminology and expects corrections to be consistent across the whole document.
- The Mermaid bold-label convention: `**text**` inside backtick-quoted `" "` strings.
- The `manager` attribute resolution approach (Option A: LDAP DN → Keycloak sub at import time, via `description`-as-sub-carrier + DN-based lookup).
- The Shane Longman sample org structure (DIT, users, roles, groups, reporting lines, resolved KC subs).
- Credentials are [REDACTED] in all docs and summaries.

Memory is for facts that apply to _every_ session regardless of task. Procedures and workflows belong in skills, not memory.

### Session continuity — compaction + session_search

Hermes uses context compaction to keep long sessions tractable. When a session is compacted, the earlier turns become a summary/reference (the "Historical Task Snapshot" format), and the model is expected to treat it as background, not as active instructions.

`session_search` is the tool for recovering detail from compacted sessions. When the summary omits something the model needs (exact command output, file contents, error text, earlier reasoning), it can recover it with `session_search(query='<keywords>', session_id='...')`.

This is the Serendipity equivalent of the tutorial's session handoff and progress log — but it is Hermes-managed, not a repo file. There is no `claude-progress.md` or `session-handoff.md` in the repo; the handoff is the compaction summary, and recovery is via session_search.

### No feature_list.json, no init.sh, no evaluator rubric

Compared to the tutorial's recommended minimal pack:

| Tutorial file | Serendipity equivalent | Status |
|---|---|---|
| `AGENTS.md` / `CLAUDE.md` | `.hermes.md` | ✅ Exists — repo-level instructions |
| `feature_list.json` | — | ❌ Not present — work is tracked via git commits + session context |
| `claude-progress.md` | session compaction + session_search | ✅ Functionally present, but Hermes-managed, not a repo file |
| `init.sh` | — | ❌ Not present — no bootstrap script; Hermes starts from the desktop app |
| `session-handoff.md` | session compaction summary | ✅ Functionally present |
| `clean-state-checklist.md` | — | ❌ Not present |
| `evaluator-rubric.md` | — | ❌ Not present |

The gaps are intentional or incidental:

- **No feature_list.json:** Serendipity work is small enough and tracked via git that a formal feature list hasn't been needed. Work items surface as user requests in-session and as local commits.
- **No init.sh:** Hermes starts from the desktop app; there is no "bootstrap this repo for coding agents" step. The repo is already configured for Hermes ( .hermes.md, .knowledge/, .continuerc, skills).
- **No clean-state-checklist / evaluator rubric:** Not yet needed. The tutorial's guidance is that these become valuable when the repo grows into a longer-running system with multiple domains, active plans, quality scoring, and reliability policies — the `openai-advanced/` pack. Serendipity has not reached that point.

## How a typical session flows

1. **Start:** Hermes (Solar Pro 4) is already running in the Serendipity desktop project. The `.hermes.md` and `.knowledge/` layers are in context.
2. **User request arrives:** Solar Pro 4 reads the request, checks `.knowledge/` for relevant project facts, and decides whether a skill applies.
3. **Skill load (if applicable):** A skill is loaded if the task matches a specialised workflow (e.g. systematic debugging, TDD, code review). The skill carries the user's preferred approach for that task type.
4. **Version-specific work:** Solar Pro 4 handles version-specific correctness (Spring Boot 4, Angular v22, Java 25) from training. No RAG needed for the primary model.
5. **Supplementary review (optional):** If a code task benefits from a second opinion, Solar Pro 4 calls the Mac Mini's Ollama endpoint via HTTP. The Mini's model reads `.continue/rules/serendipity-versions.md` first for version hints, then responds. Its recommendations are treated as opinions to weigh, not as authoritative — Solar Pro 4 validates against the actual project files and `.knowledge/`.
6. **Changes:** Edits are applied to files, verified with reads and terminal commands (git, builds, tests), and committed locally when the user asks. Pushing to GitHub is the user's decision — the assistant does not push.
7. **Session end / compaction:** When the session grows long, Hermes compacts the context. The summary becomes background reference; detail is recoverable via session_search.

## What the tutorial's harness-engineering lens highlights

The tutorial's core idea: make a coding agent work across multiple sessions without constantly re-deriving setup, status, and scope. Serendipity's current approach addresses this through:

- **`.hermes.md` + `.knowledge/`:** setup and project facts are documented once, in canonical layers, and read at session start. The agent doesn't re-derive the security model, the role tiers, the sample org structure, or the DIT layout from scratch.
- **Skills:** recurring task types (debugging, testing, review, documentation consistency) have defined approaches that load on demand, so the agent doesn't rediscover the preferred method each time.
- **`.continuerc` + `.continue/rules/`:** the local models get version hints so they don't silently give version-invalid advice.
- **Memory:** cross-session facts (user identity, preferences, sample org details, credential policy) persist without re-derivation.
- **Session compaction + session_search:** long sessions stay tractable, and earlier detail is recoverable rather than lost.

The main thing the tutorial's lens surfaces as a gap: Serendipity does not have an explicit, repo-file-based "current state" artifact (the tutorial's `feature_list.json` / `claude-progress.md`). Work state lives in git (commits) and in-session (context), not in a tracked file that a future agent could read to reconstruct where things stand. Whether that gap matters depends on whether multi-session work becomes numerous enough that "where did we get to?" becomes a recurring friction.

## Open items

- Whether to add a lightweight `docs/harness-engineering/feature-state.json` (or similar) to make in-progress work reconstructable across sessions — the tutorial's `feature_list.json` equivalent. Currently unused; the user has not asked for it.
- Whether to add a `docs/harness-engineering/clean-state-checklist.md` — the tutorial's checklist for clean exits. Currently unused.
- Whether to add an `docs/harness-engineering/evaluator-rubric.md` — the tutorial's quality-scoring rubric. Currently unused.
- The `openai-advanced/` pack (system-of-record docs, agent-first governance templates) is the tutorial's recommendation for when the repo grows into a longer-running system with multiple domains, active plans, quality scoring, and reliability policies. Serendipity has not reached that point; the minimal pack's gaps above are consistent with that.

## Files referenced

- `/Users/rob/workspace/Hermes/serendipity/.hermes.md` — repo-level instructions (root)
- `/Users/rob/workspace/Hermes/serendipity/.knowledge/` — canonical project knowledge (Open Knowledge Format monorepo)
- `/Users/rob/workspace/Hermes/serendipity/.continuerc` — Ollama model config for the Mac Mini
- `/Users/rob/workspace/Hermes/serendipity/.continue/rules/serendipity-versions.md` — version guidance for local models
- Hermes memory — persistent cross-session facts (profile-level, not repo files)
- Hermes skills — on-demand specialised workflows (app-level, not repo files)
- `https://walkinglabs.github.io/learn-harness-engineering/en/resources/` — the tutorial this document is framed against
