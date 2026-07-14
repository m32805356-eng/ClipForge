#!/usr/bin/env python3
"""
ClipForge — URL video downloader (yt-dlp wrapper).

Reads JSON from CLIPFORGE_PYTHON_PAYLOAD env var:
    { "url": "https://youtube.com/watch?v=...", "output_dir": "/abs/path" }

Downloads the best quality MP4 (≤720p for speed) to output_dir, then prints
JSON to stdout:
    { "filePath": "/abs/path/video.mp4", "filename": "Video Title.mp4",
      "title": "Video Title", "duration": 123.4, "uploader": "Channel",
      "viewCount": 1000, "description": "..." }

On error, writes JSON to stderr and exits non-zero.
"""
from __future__ import annotations

import json
import os
import sys
import traceback
from pathlib import Path


def emit_error(message: str) -> None:
    payload = {"error": message, "traceback": traceback.format_exc()}
    sys.stderr.write(json.dumps(payload) + "\n")
    sys.exit(1)


def main() -> None:
    try:
        raw = os.environ.get("CLIPFORGE_PYTHON_PAYLOAD")
        if not raw:
            emit_error("Missing CLIPFORGE_PYTHON_PAYLOAD env var")
        config = json.loads(raw)

        url = config["url"]
        output_dir = config.get("output_dir", "/tmp/clipforge-downloads")

        Path(output_dir).mkdir(parents=True, exist_ok=True)

        from yt_dlp import YoutubeDL

        # Use a safe filename template.
        outtmpl = str(Path(output_dir) / "%(title).80s.%(ext)s")

        ydl_opts = {
            "outtmpl": outtmpl,
            "format": "best[height<=720][ext=mp4]/best[height<=720]/best",
            "merge_output_format": "mp4",
            "quiet": True,
            "no_warnings": True,
            "noprogress": True,
            "restrictfilenames": True,
        }

        with YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            if info is None:
                emit_error("yt-dlp returned no info for the URL")

            # Find the actual downloaded file.
            filename = ydl.prepare_filename(info)
            # If merged, the extension may differ.
            if not Path(filename).exists():
                # Try mp4 variant.
                base = Path(filename).stem
                candidate = Path(output_dir) / f"{base}.mp4"
                if candidate.exists():
                    filename = str(candidate)
                else:
                    # List files in output_dir matching the base.
                    for f in Path(output_dir).iterdir():
                        if f.stem == base:
                            filename = str(f)
                            break

            if not Path(filename).exists():
                emit_error(f"Downloaded file not found: {filename}")

            result = {
                "filePath": filename,
                "filename": Path(filename).name,
                "title": info.get("title", Path(filename).stem),
                "duration": float(info.get("duration", 0) or 0),
                "uploader": info.get("uploader", "Unknown"),
                "viewCount": int(info.get("view_count", 0) or 0),
                "description": (info.get("description") or "")[:500],
            }
            sys.stdout.write(json.dumps(result) + "\n")

    except Exception as exc:  # noqa: BLE001
        emit_error(str(exc))


if __name__ == "__main__":
    main()
