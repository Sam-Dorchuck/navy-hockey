#!/usr/bin/env python3
"""
update-gallery.py — point the carousel at whatever is actually in img/gallery/.

The site is a static file, so it cannot look inside a folder by itself. This
script does it for you: it scans img/gallery/, rewrites the GALLERY list inside
index.html, and KEEPS any captions you have already written.

USAGE
    python3 update-gallery.py            # rewrite index.html
    python3 update-gallery.py --print    # just show the block, change nothing

WORKFLOW
    1. Put photos in img/gallery/ (or run prep-photos.py first to resize them).
    2. Run this.
    3. Open index.html, find the GALLERY block, and replace "CAPTION HERE"
       with real captions. Re-running later will not overwrite them.

Photos appear in filename order, so if you want a specific sequence, prefix
them: 01-drexel.jpg, 02-crabpot.jpg, and so on.
"""

import os, re, sys

GALLERY_DIR = "img/gallery"
HTML = "index.html"
EXTS = (".jpg", ".jpeg", ".png", ".webp", ".JPG", ".JPEG", ".PNG", ".WEBP")


def pretty(filename):
    """Turn a filename into a first-draft caption you can edit."""
    base = os.path.splitext(filename)[0]
    base = re.sub(r"^\d+[-_ ]+", "", base)          # drop ordering prefixes
    base = re.sub(r"[-_]+", " ", base).strip()
    if re.fullmatch(r"(?i)(img|dsc|photo)\s*\d+", base) or not base:
        return "CAPTION HERE"
    return base[0].upper() + base[1:]


def existing_captions(html):
    """Preserve captions already written, keyed by filename."""
    block = re.search(r"const GALLERY = \[(.*?)\n\];", html, re.S)
    caps = {}
    if not block:
        return caps
    for src, cap in re.findall(r'src:"([^"]+)"\s*,\s*cap:"([^"]*)"', block.group(1)):
        caps[os.path.basename(src)] = cap
    return caps


def main():
    if not os.path.isdir(GALLERY_DIR):
        sys.exit(f"No {GALLERY_DIR}/ folder found. Run this from the folder that contains index.html.")

    files = sorted(f for f in os.listdir(GALLERY_DIR) if f.endswith(EXTS))
    if not files:
        sys.exit(f"{GALLERY_DIR}/ is empty. Add photos, then run this again.")

    html = open(HTML, encoding="utf-8").read() if os.path.exists(HTML) else ""
    kept = existing_captions(html)

    rows = []
    for f in files:
        cap = kept.get(f) or pretty(f)
        cap = cap.replace('"', "'")
        rows.append(f'  {{src:"{GALLERY_DIR}/{f}", cap:"{cap}"}},')

    block = ("const GALLERY = [\n"
             "  /* Rewritten by update-gallery.py. Captions are preserved when\n"
             "     you re-run it, so edit them freely below. */\n"
             + "\n".join(rows) + "\n];")

    if "--print" in sys.argv or not html:
        print(block)
        return

    if "const GALLERY = [" not in html:
        sys.exit("Could not find the GALLERY block in index.html.")

    html = re.sub(r"const GALLERY = \[.*?\n\];", block, html, flags=re.S)
    open(HTML, "w", encoding="utf-8").write(html)

    reused = sum(1 for f in files if f in kept)
    todo = sum(1 for r in rows if "CAPTION HERE" in r)
    print(f"{len(files)} photos wired into the carousel.")
    if reused:
        print(f"  {reused} existing captions kept.")
    if todo:
        print(f"  {todo} still say CAPTION HERE — edit those in index.html.")


if __name__ == "__main__":
    main()
