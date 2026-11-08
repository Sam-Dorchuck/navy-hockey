#!/usr/bin/env python3
"""
check-merch.py — make the merch photos actually show up.

Each item in index.html points at one exact filename. If the file in
img/merch/ is named anything else, the tile falls back to the navy
placeholder. This script compares the two and tells you what to do.

USAGE
    python check-merch.py           # report only, changes nothing
    python check-merch.py --fix     # repoint index.html at the files you have

--fix uses fuzzy matching (so "Trucker Hat.JPG" matches the Trucker Hat item)
and prints every change it makes. It edits index.html, never your photos.
Anything it is not confident about is left alone and reported.
"""

import os, re, sys, difflib

HTML = "index.html"
MERCH_DIR = "img/merch"
EXTS = (".jpg", ".jpeg", ".png", ".webp")


def norm(s):
    """Loose key for matching: lowercase alphanumerics only."""
    s = os.path.splitext(s)[0].lower()
    for junk in ("navy", "hockey", "usna", "img", "photo", "final", "copy"):
        s = s.replace(junk, "")
    return re.sub(r"[^a-z0-9]", "", s)


def main():
    if not os.path.exists(HTML):
        sys.exit("Run this from the folder that contains index.html.")
    if not os.path.isdir(MERCH_DIR):
        sys.exit(f"No {MERCH_DIR}/ folder found.")

    html = open(HTML, encoding="utf-8").read()
    block = re.search(r"const MERCH = \[.*?\n\];", html, re.S)
    if not block:
        sys.exit("Could not find the MERCH block in index.html.")

    items = re.findall(r'name:"([^"]+)"[^}]*?photo:"([^"]+)"', block.group(0))
    # case-insensitive: .JPG from a phone is just as valid as .jpg
    on_disk = [f for f in sorted(os.listdir(MERCH_DIR))
               if f.lower().endswith(EXTS)]

    used, missing = set(), []
    print(f"{len(items)} items in index.html, {len(on_disk)} files in {MERCH_DIR}/\n")

    for name, path in items:
        want = os.path.basename(path)
        if want in on_disk:
            print(f"  OK       {name:24} {want}")
            used.add(want)
        else:
            missing.append((name, path, want))

    fixes = []
    if missing:
        print()
        for name, path, want in missing:
            pool = [f for f in on_disk if f not in used]
            # try matching on the item name first, then on the expected filename
            cand = difflib.get_close_matches(norm(name), [norm(f) for f in pool], 1, 0.55) \
                or difflib.get_close_matches(norm(want), [norm(f) for f in pool], 1, 0.55)
            if cand:
                actual = next(f for f in pool if norm(f) == cand[0])
                print(f"  RENAMED? {name:24} expects {want}  ->  found {actual}")
                fixes.append((path, f"{MERCH_DIR}/{actual}"))
                used.add(actual)
            else:
                print(f"  MISSING  {name:24} needs {want}")

    extra = [f for f in on_disk if f not in used]
    if extra:
        print("\nFiles in the folder that no item points at:")
        for f in extra:
            print("   ", f)

    if not fixes:
        print("\nNothing to repoint." if not missing else
              "\nNo confident matches — rename the files to the names above, or tell me the filenames.")
        return

    if "--fix" not in sys.argv:
        print(f"\n{len(fixes)} item(s) could be repointed. Re-run with --fix to apply.")
        return

    new_block = block.group(0)
    for old, new in fixes:
        new_block = new_block.replace(f'photo:"{old}"', f'photo:"{new}"')
    html = html.replace(block.group(0), new_block)
    open(HTML, "w", encoding="utf-8").write(html)
    print(f"\nindex.html updated — {len(fixes)} item(s) repointed. Reload the page.")


if __name__ == "__main__":
    main()
