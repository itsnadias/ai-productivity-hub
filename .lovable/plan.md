# AI Workplace Productivity Assistant

A frontend-only SaaS-style app with three AI tools. No login, no database — everything lives in the current browser session only.

## Pages

- **Dashboard** (`/`) — welcome header, overview cards for the three tools (with quick-launch links), a session activity summary (counts of items generated this session), and the responsible-AI disclaimer.
- **Email Generator** (`/email`) — purpose field, key details textarea, tone selector (Formal / Friendly / Persuasive), optional recipient/sender fields. Output appears in an editable textarea with Copy and Regenerate.
- **Meeting Summarizer** (`/meetings`) — paste raw notes, get a structured summary: key discussion points, decisions, action items with owners, deadlines. Editable output with Copy and Regenerate.
- **Task Planner** (`/planner`) — task list input, daily/weekly toggle, working-hours preference. Output: prioritized schedule with time blocks plus productivity tips. Editable with Copy and Regenerate.

## Layout & design

- Collapsible sidebar navigation (dashboard + three tools) with icons, mobile drawer behavior, and always-visible trigger.
- Light blue gradient theme defined as semantic tokens in `src/styles.css` (soft sky-to-white gradients, glassy cards, subtle shadows) — no hardcoded colors in components.
- Responsive: single column on mobile, two-column form/output split on desktop.
- Persistent disclaimer footer: "AI-generated content may be inaccurate — review before use."

## AI

Each tool calls Lovable AI through a server route/function with a structured, feature-specific system prompt and streaming output so results appear progressively. Rate-limit and credit errors surface as clear toasts. Nothing is persisted server-side.

## Technical notes

- TanStack Start routes under `src/routes`; shared `AppLayout` with shadcn sidebar in a pathless layout route.
- Session-only state via React context (`SessionProvider`) holding generation history in memory; cleared on reload.
- Shared `ToolWorkbench` component for the form/output/Copy/Regenerate pattern to keep the three tools consistent.
- Server side: `src/routes/api/generate.ts` streaming route using the Lovable AI Gateway; prompt templates in `src/lib/prompts.ts`.
- Per-route head() metadata with unique titles/descriptions.
