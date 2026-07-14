# ClipForge

> Local-first AI video clipping — turn long videos into vertical social-ready clips. 100% local, no cloud, no API keys.

![ClipForge](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## What it does

ClipForge is an Opus Clip clone that runs entirely on your machine:

- **Upload** videos (MP4, MOV, MKV, WebM) or **paste a YouTube/Vimeo link** (yt-dlp)
- **Transcribe** with faster-whisper (5 model sizes, word-level timestamps)
- **Detect highlights** — 6 categories (hook, emotional, story, funny, educational, viral) with heuristic scoring
- **Generate clips** — FFmpeg cuts each highlight into a separate file
- **Burn subtitles** — 4 styles (bold-white, karaoke, neon-amber, minimal) with word-level timing
- **Crop vertical** — 1080×1920 for TikTok/Reels/Shorts
- **Download** — social-ready clips, all processed locally

## ⚠️ Important: This is a LOCAL app

ClipForge requires **FFmpeg**, **Python 3**, **faster-whisper**, and **yt-dlp** — none of which are available on serverless platforms like Vercel. **You must run it on your own machine.**

## Prerequisites

1. **Node.js 18+** and **Bun** (`curl -fsSL https://bun.sh/install | bash`)
2. **FFmpeg** — `brew install ffmpeg` (macOS) or `sudo apt install ffmpeg` (Linux)
3. **Python 3.10+** — `python3 --version`
4. **faster-whisper** — `pip install faster-whisper`
5. **yt-dlp** (optional, for URL downloads) — `pip install yt-dlp`

## Quick start

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/clipforge.git
cd clipforge

# Install dependencies
bun install

# Set up the database
bun run db:push

# Start the dev server
bun run dev
```

Open `http://localhost:3000` in your browser.

## Usage

1. **Upload** — drag a video file, or paste a YouTube link on the dashboard
2. **Transcribe** — open the video, click "Transcribe" (or enable auto-transcribe in Settings)
3. **Process All** — one click runs: transcribe → detect highlights → generate clips
4. **Burn All** — burn subtitles on all clips at once
5. **Crop All** — crop all clips to 1080×1920
6. **Download** — grab your social-ready clips

### Keyboard shortcuts

- `⌘K` / `Ctrl+K` — command palette
- `Esc` — close palette / modals

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui |
| State | Zustand (client), TanStack Query (server) |
| Database | Prisma + SQLite |
| Video | FFmpeg 7.1 (cut, burn, crop, probe) |
| AI | faster-whisper (transcription), heuristic scoring (highlights) |
| Download | yt-dlp (YouTube/Vimeo) |
| Storage | Local filesystem (`uploads/`, `outputs/`) |

## Project structure

```
clipforge/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API routes (health, videos, clips, files)
│   │   ├── layout.tsx
│   │   └── page.tsx            # Single SPA route
│   ├── components/clipforge/   # App shell, sidebar, views, command palette
│   ├── hooks/                  # React Query hooks
│   ├── lib/clipforge/          # Paths, constants, format, server utils
│   ├── server/                 # Services (upload, transcribe, highlight, clip, subtitle, crop)
│   └── stores/                 # Zustand stores (view-state, settings)
├── scripts/                    # Python scripts (transcribe.py, download_url.py)
├── prisma/                     # Schema
├── uploads/                    # Source videos (gitignored)
├── outputs/                    # Clips, thumbnails (gitignored)
└── models/                     # Whisper model cache (gitignored)
```

## Settings

Open **Settings** in the app to configure:

- Default Whisper model (tiny / base / small / medium / large-v3)
- Auto-transcribe after upload
- Auto-detect highlights after transcription
- Default subtitle style
- Clip padding (seconds)
- Max highlights per video
- Minimum highlight score

All settings persist to localStorage.

## License

MIT — do whatever you want.
