# ClipForge — Architecture

> Local-first AI video clipping. Turn long videos into vertical social-ready clips
> using Whisper, FFmpeg, and on-device ML. No cloud, no API keys.

## 1. Environment adaptation

The original master prompt specified **Vite + FastAPI + Python AI libs**.
This sandbox is a **Next.js 16** environment (only port 3000 exposed, only the
`/` route is user-visible). The stack was adapted while preserving every
feature and the "100% local, free, open-source" principle:

| Spec | Adapted | Rationale |
|---|---|---|
| React + Vite + Tailwind + TS | Next.js 16 + React 19 + Tailwind 4 + TS | Same DX; App Router replaces Vite |
| Python FastAPI | Next.js API Routes (TS) | Orchestrates jobs; spawns Python/FFmpeg via `child_process` |
| faster-whisper | `scripts/transcribe.py` via subprocess | Python 3.12 + pip available in sandbox |
| FFmpeg | FFmpeg 7.1.5 (preinstalled) | Called via `fluent-ffmpeg` / `child_process` |
| MediaPipe / OpenCV | Python scripts via subprocess | Decided per-phase |
| SQLite | Prisma + SQLite (`db/custom.db`) | Typed access, migrations |
| Local folders | `uploads/`, `outputs/`, `models/` | Unchanged |
| Multi-page app | Single `/` route + Zustand view-state | Sandbox constraint |

## 2. Folder layout

```
clipforge/  (project root)
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root layout + ThemeProvider
│   │   ├── page.tsx              # The single `/` route → AppShell
│   │   └── globals.css           # Forge-amber palette, dark-first
│   ├── components/
│   │   ├── ui/                   # shadcn/ui primitives (preinstalled)
│   │   └── clipforge/
│   │       ├── app-shell.tsx     # Sidebar + Header + main + footer
│   │       ├── sidebar.tsx       # Nav + roadmap card
│   │       ├── header.tsx        # Title + theme toggle + mobile menu
│   │       ├── logo.tsx          # SVG wordmark
│   │       ├── theme-provider.tsx
│   │       └── views/            # One file per "page"
│   │           ├── dashboard-view.tsx
│   │           └── placeholder-view.tsx
│   ├── lib/
│   │   ├── db.ts                 # Prisma client
│   │   ├── utils.ts              # cn() etc.
│   │   └── clipforge/
│   │       ├── paths.ts          # Project-relative path helpers
│   │       ├── constants.ts      # Resolutions, mime types, styles
│   │       └── format.ts         # Duration / bytes / relative time
│   ├── stores/
│   │   └── clipforge-store.ts    # Zustand view-state
│   └── hooks/
├── prisma/
│   └── schema.prisma             # Video, Transcript, Highlight, Clip
├── uploads/                      # Source videos (gitignored)
├── outputs/                      # Clips, thumbnails, audio (gitignored)
├── models/                       # AI model cache (gitignored)
├── scripts/                      # Python automation (Whisper, etc.)
├── db/
│   └── custom.db                 # SQLite database
└── docs/                         # This folder
```

## 3. Data model

Four core entities, designed up-front for all 8 phases:

- **Video** — source upload. Lifecycle via `VideoStatus` enum:
  `UPLOADED → PROBING → EXTRACTING_AUDIO → TRANSCRIBING → ANALYZING → READY`
  (or `FAILED`). `progress` (0–100) drives UI bars.
- **Transcript** — one per video. Full text + JSON segments (start/end/text/words).
- **Highlight** — detected engaging moment. `category` enum
  (`hook|emotional|story|funny|educational|viral`), `score` 0–1, time range.
- **Clip** — produced vertical output. `ClipStatus` lifecycle, optional
  `subtitleStyle`, links back to source Video and (optionally) Highlight.

Cascade deletes: deleting a Video removes its Transcript, Highlights, Clips.

## 4. Processing pipeline (planned)

```
Upload → ffprobe → extract audio → faster-whisper → segment store
       → highlight detection (heuristics + LLM) → Highlight rows
       → FFmpeg cut → optional subtitle burn-in → MediaPipe crop → 1080×1920
       → enhance (zoom/transitions/thumbnail) → Clip row → download
```

Each stage updates `Video.status` / `Video.progress` so the UI can poll.
Future phases may add a WebSocket mini-service for push progress.

## 5. UI design

- **Palette**: forge-amber primary (oklch ~0.75 0.17 58) on near-black canvas.
  Avoids blue/indigo per project guidelines. Light mode available via toggle.
- **Inspiration**: Linear (nav), Vercel (cards/spacing), Raycast (command hint),
  Notion (calm typography).
- **Layout**: sticky sidebar (desktop) / slide-over (mobile), sticky header,
  sticky footer (`mt-auto`), max-w-7xl content.
- **A11y**: semantic landmarks, keyboard-focusable controls, ARIA labels on
  icon-only buttons, `sr-only` where needed.

## 6. Development process

Features are built one at a time per the master prompt's 14-step order.
After each step the worklog (`/home/z/my-project/worklog.md`) is updated and
the user approves before the next step begins.
