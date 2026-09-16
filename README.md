# Navy Hockey site — maintenance guide

Everything lives in `index.html`. There is no build step, no framework, and no
database. To update the site you edit one block of data near the bottom of that
file and re-upload it.

## Files

```
index.html        the entire site
prep-photos.py    batch photo processor (run it, don't edit it)
img/
  navy-n-star.png the logo (also embedded in index.html)
  raw/roster/     ORIGINAL headshots — archive, do not upload to the host
  raw/gallery/    ORIGINAL action photos — archive, do not upload
  roster/         processed headshots (generated)
  gallery/        processed action photos (generated)
```

## Adding photos

1. Collect originals. Put headshots in `img/raw/roster/`, one per player,
   **named by last name**: `merrick.jpg`, `brolund.jpg`. For two players with
   the same last name use `smith-j.jpg` and `smith-r.jpg`. Action photos go in
   `img/raw/gallery/` with any filename.
2. Run `python3 prep-photos.py` (needs `pip install pillow`).
3. Paste the printed paths into the `ROSTER` and `GALLERY` blocks in
   `index.html`.

The script crops headshots to the 3:4 tile shape, resizes gallery images down
to a web-appropriate size, and **strips EXIF metadata** — phone photos embed GPS
coordinates, and those should not go on a public site.

Any player without a photo shows a gold sweater number on navy, which looks
deliberate. You can ship with a partial set and fill in the rest.

### Getting decent headshots

The cheapest good version: one session, all three teams, players in game
sweaters, shot against the boards or a blank wall with the same framing for
everyone. Consistency matters far more than camera quality — thirty phone
photos taken in one spot will look better as a wall than a mix of pro shots
from different years. Shoot head-and-shoulders, player centered, some room
above the head.

### Action photos

Six slots, first one large. Aim for variety over quality: a wide rink shot with
the Brigade in the stands, a bench moment, a road trip, senior night. Ask the
Public Affairs shop and the team's parent photographers — most programs already
have a shared drive full of usable images.

## Updating the schedule

In `index.html`, find `const SCHEDULE`. Each game:

```js
{date:"2026-10-17", opp:"Lehigh", home:true,
 loc:"McMullen Arena, Annapolis", time:"7:30 PM"},
```

Add `result:{w:true, score:"5-2"}` once a game is played, and the row switches
from a start time to a W/L line automatically. The "next home game" banner at
the top recalculates itself from this data — no separate edit needed.

## Updating the roster

Find `const ROSTER`. Each player:

```js
{num:7, name:"Cal Ferraro", pos:"F", yr:"'26", co:"21st Co.",
 home:"Buffalo, NY", photo:"img/roster/ferraro.jpg"},
```

## Before it goes live

- Replace every `_HERE` placeholder: `OREP_EMAIL_HERE`, `COACH_EMAIL_HERE`,
  `DONATE_URL_HERE`, `INSTAGRAM_URL_HERE`, `NAME HERE`.
- Confirm the giving link and the check-mailing instructions with whoever
  handles the club's funds.
- Have the O-Rep and PAO review the roster fields. Publishing midshipman names
  with hometowns and company assignments is normal for a roster, but it is a
  call for the chain of command, not the webmaster. Ask whether photo releases
  are on file for anyone pictured.
- Confirm the D3 vs D2 naming for the second men's team.

## Hosting

Static files, so GitHub Pages, Netlify, or Cloudflare Pages all work free.
Drag the folder in and point `usnahockey.com` at it. Keep `img/raw/` out of
what you upload.

## Handing this off

This site should outlive whoever built it. When you turn it over, hand off:
this README, the domain registrar login, the host login, and the raw photo
archive. The next person needs to be able to edit one file and re-upload it —
that is the whole job.
