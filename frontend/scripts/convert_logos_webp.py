"""Convert large logo PNGs to reasonably-sized WebP (quality ~72)."""
from pathlib import Path

from PIL import Image

BASE = Path(__file__).resolve().parent.parent / "public"
QUALITY = 72

# (relative path, max_width for display*retina)
JOBS = [
    # MixFade wordmark (~224px display) — ~2.5x
    ("lovable-uploads/bda6aa94-5aa8-4405-a6f9-86145e9c48bc.png", 560),
    ("lovable-uploads/5e7e6db8-fe51-4ed4-a8c3-fd1959d5015e.png", 560),
    # Nav / favicon icon (~32px display) — 4x
    ("lovable-uploads/2b4957a6-9739-4776-bf94-3ac1d6439ccc.png", 128),
    ("lovable-uploads/a6dcb986-37f8-47dc-b994-bf04e1a6a0bc.png", 128),
    # OpaqueSound logos
    ("OS_Full_Logo_transparent.png", 400),
    ("OS_Initials_Icon_transparent.png", 128),
]


def main() -> None:
    for rel, max_w in JOBS:
        src = BASE / rel
        out = src.with_suffix(".webp")
        im = Image.open(src)
        if im.mode not in ("RGB", "RGBA"):
            im = im.convert("RGBA")
        w, h = im.size
        if w > max_w:
            nh = int(round(h * (max_w / w)))
            im = im.resize((max_w, nh), Image.Resampling.LANCZOS)
        im.save(out, "WEBP", quality=QUALITY, method=6)
        print(
            f"{src.name}: {w}x{h} -> {im.size[0]}x{im.size[1]}  "
            f"{out.stat().st_size} bytes -> {out.name}"
        )


if __name__ == "__main__":
    main()
