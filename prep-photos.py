#!/usr/bin/env python3
"""
prep-photos.py — batch-prepare photos for the Navy Hockey site.

WHAT IT DOES
  Roster headshots : center-crops to 3:4, resizes to 600x800, strips EXIF,
                     saves optimized JPEG to img/roster/
  Gallery photos   : resizes long edge to 1600px, strips EXIF,
                     saves optimized JPEG to img/gallery/
  Then prints the exact lines to paste into index.html.

HOW TO USE
  1. pip install pillow
  2. Drop originals into:
        img/raw/roster/     <- one file per player, named lastname.jpg
                               (use lastname-firstinitial.jpg for duplicates)
        img/raw/gallery/    <- any filenames; captions are set in index.html
  3. python3 prep-photos.py
  4. Paste the printed photo paths into the ROSTER block in index.html.

NOTES
  - Headshots are cropped from the CENTER TOP (faces sit high in a 3:4 crop),
    so a photo with the player centered horizontally works best.
  - EXIF is stripped on purpose: phone photos carry GPS coordinates, and
    those should not ship to a public site.
  - Originals in img/raw/ are never modified. Keep raw/ out of what you
    upload to the web host; it is the archive, not the deliverable.
"""

import os, re, sys

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Pillow not installed. Run: pip install pillow")

RAW_ROSTER  = "img/raw/roster"
RAW_GALLERY = "img/raw/gallery"
OUT_ROSTER  = "img/roster"
OUT_GALLERY = "img/gallery"

HEADSHOT   = (600, 800)   # 3:4, matches the roster tile aspect ratio
GALLERY_LONG_EDGE = 1600
QUALITY    = 82
EXTS = (".jpg", ".jpeg", ".png", ".webp", ".JPG", ".JPEG", ".PNG")


def slug(name):
    base = os.path.splitext(os.path.basename(name))[0].lower()
    base = re.sub(r"[^a-z0-9]+", "-", base).strip("-")
    return base


def clean(im):
    """Apply EXIF rotation, then drop all metadata."""
    im = ImageOps.exif_transpose(im)
    return im.convert("RGB")


def do_headshot(path, out_dir):
    im = clean(Image.open(path))
    tw, th = HEADSHOT
    target = tw / th
    w, h = im.size
    current = w / h

    if current > target:                      # too wide -> trim sides
        new_w = int(h * target)
        left = (w - new_w) // 2
        im = im.crop((left, 0, left + new_w, h))
    else:                                     # too tall -> trim from bottom
        new_h = int(w / target)
        top = int((h - new_h) * 0.12)         # bias upward to keep the face
        im = im.crop((0, top, w, top + new_h))

    im = im.resize(HEADSHOT, Image.LANCZOS)
    out = os.path.join(out_dir, slug(path) + ".jpg")
    im.save(out, "JPEG", quality=QUALITY, optimize=True, progressive=True)
    return out


def do_gallery(path, out_dir):
    im = clean(Image.open(path))
    w, h = im.size
    scale = GALLERY_LONG_EDGE / max(w, h)
    if scale < 1:
        im = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
    out = os.path.join(out_dir, slug(path) + ".jpg")
    im.save(out, "JPEG", quality=QUALITY, optimize=True, progressive=True)
    return out


def run(src, dst, fn, label):
    if not os.path.isdir(src):
        print(f"  (no {src}/ folder — skipping {label})")
        return []
    os.makedirs(dst, exist_ok=True)
    files = sorted(f for f in os.listdir(src) if f.endswith(EXTS))
    made = []
    for f in files:
        try:
            made.append(fn(os.path.join(src, f), dst))
        except Exception as e:
            print(f"  !! {f}: {e}")
    print(f"  {len(made)} {label} written to {dst}/")
    return made


if __name__ == "__main__":
    print("Preparing photos...\n")
    shots = run(RAW_ROSTER, OUT_ROSTER, do_headshot, "headshots")
    gal   = run(RAW_GALLERY, OUT_GALLERY, do_gallery, "gallery photos")

    if shots:
        print("\nRoster photo paths — match these to players in index.html:")
        for p in shots:
            print(f'    photo:"{p}"')

    if gal:
        print("\nGallery block — paste into index.html, then write real captions:")
        print("const GALLERY = [")
        for p in gal:
            print(f'  {{src:"{p}", cap:"CAPTION HERE"}},')
        print("];")
        print("\n(The first entry is the large lead image. Six slots total.)")
