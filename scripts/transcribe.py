#!/usr/bin/env python3
"""
ClipForge — Whisper transcription script.

Reads a JSON payload from the CLIPFORGE_PYTHON_PAYLOAD env var:
    {
        "audio_path": "/abs/path/to/audio.wav",
        "model_size": "base",          # tiny|base|small|medium|large-v3
        "language": null,              # null = auto-detect, or "en", "es", ...
        "output_dir": "/abs/path",     # for caching the model
        "word_timestamps": true
    }

Writes JSON to stdout:
    {
        "text": "full transcript",
        "language": "en",
        "language_probability": 0.98,
        "duration": 123.45,
        "segments": [
            {
                "id": 0,
                "start": 0.0,
                "end": 3.2,
                "text": "...",
                "words": [{"word": "...", "start": 0.0, "end": 0.5, "probability": 0.95}, ...]
            },
            ...
        ]
    }

On error, writes JSON to stderr and exits non-zero:
    {"error": "message", "traceback": "..."}
"""
from __future__ import annotations

import json
import os
import sys
import traceback
from pathlib import Path


def emit_error(message: str) -> None:
    """Emit a JSON error object to stderr and exit non-zero."""
    payload = {"error": message, "traceback": traceback.format_exc()}
    sys.stderr.write(json.dumps(payload) + "\n")
    sys.exit(1)


def main() -> None:
    try:
        raw = os.environ.get("CLIPFORGE_PYTHON_PAYLOAD")
        if not raw:
            emit_error("Missing CLIPFORGE_PYTHON_PAYLOAD env var")
        config = json.loads(raw)

        audio_path = config["audio_path"]
        model_size = config.get("model_size", "base")
        language = config.get("language")  # None = auto-detect
        output_dir = config.get("output_dir", str(Path.home() / ".cache" / "whisper"))
        word_timestamps = config.get("word_timestamps", True)

        if not Path(audio_path).is_file():
            emit_error(f"Audio file not found: {audio_path}")

        # Defer the heavy import so error paths above are fast.
        from faster_whisper import WhisperModel

        # Use int8 on CPU for speed/memory; switch to float16 if a GPU is present.
        compute_type = "int8"
        try:
            import torch  # noqa: F401
            # If torch sees a CUDA device, prefer float16.
            import subprocess
            nvidia = subprocess.run(
                ["nvidia-smi"],
                capture_output=True,
                text=True,
            )
            if nvidia.returncode == 0:
                compute_type = "float16"
                device = "cuda"
            else:
                device = "cpu"
        except Exception:
            device = "cpu"

        model = WhisperModel(
            model_size,
            device=device,
            compute_type=compute_type,
            download_root=output_dir,
        )

        # Transcribe. segments is a generator; iterate to materialize.
        segments_iter, info = model.transcribe(
            audio_path,
            language=language,
            word_timestamps=word_timestamps,
            vad_filter=True,
            vad_parameters=dict(min_silence_duration_ms=500),
        )

        segments = []
        full_text_parts = []
        for seg in segments_iter:
            words = []
            if word_timestamps and seg.words:
                for w in seg.words:
                    words.append(
                        {
                            "word": w.word,
                            "start": round(w.start, 3),
                            "end": round(w.end, 3),
                            "probability": round(float(w.probability), 3),
                        }
                    )
            segments.append(
                {
                    "id": seg.id,
                    "start": round(seg.start, 3),
                    "end": round(seg.end, 3),
                    "text": seg.text.strip(),
                    "words": words,
                }
            )
            full_text_parts.append(seg.text.strip())

        result = {
            "text": " ".join(full_text_parts),
            "language": info.language,
            "language_probability": round(float(info.language_probability), 3),
            "duration": round(float(info.duration), 3),
            "segments": segments,
        }
        sys.stdout.write(json.dumps(result) + "\n")
    except Exception as exc:  # noqa: BLE001
        emit_error(str(exc))


if __name__ == "__main__":
    main()
