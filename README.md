# Navy Hockey site — maintenance guide

The site is plain HTML/CSS/JS on GitHub Pages: no build step, no framework, no
database. **All content lives in `js/data.js`** (schedule and results, rosters,
staff, gallery, merch, contacts, links). Every page reads from it, so updating
the site means editing that one file and pushing.

## Files

```
index.html        home page (Men's D1 first) — fills itself in from data.js
schedule.html     schedule & results (?team=md3 / ?team=wd2 for the other teams)
roster.html       rosters + staff (player pages: roster.html#player-<name>)
photos.html       gallery slideshow
store.html        team store (item pages: store.html#item-<name>)
support.html      Friends of Navy Hockey giving
future-mids.html  prospective players
rink.html         McMullen Arena / Brigade Sports Complex
js/data.js        ALL CONTENT — the only file you normally edit
js/site.js        shared header/footer + rendering (no need to edit)
css/site.css      shared styles
prep-photos.py    batch photo processor (run it, don't edit it)
notify-orders.gs  emails Sammy + Kelly on every merch order (setup steps in the file)
img/
  navy-n-star.png the logo (header, favicon)
  raw/roster/     ORIGINAL headshots — archive, do not upload to the host
  raw/gallery/    ORIGINAL action photos — archive, do not upload
  roster/         processed headshots (generated)
  gallery/        processed action photos (generated, <=1920px)
  gallery/thumbs/ small copies for the slideshow strip (same filenames)
```

## Adding photos

1. Collect originals. Put headshots in `img/raw/roster/`, one per player,
   **named by last name**: `merrick.jpg`, `brolund.jpg`. For two players with
   the same last name use `smith-j.jpg` and `smith-r.jpg`. Action photos go in
   `img/raw/gallery/` with any filename.
2. Run `python3 prep-photos.py` (needs `pip install pillow`).
3. Paste the printed paths into the `ROSTER` and `GALLERY` blocks in
   `js/data.js`.

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

In `js/data.js`, find `const SCHEDULE`. Each game:

```js
{date:"2026-10-17", opp:"Lehigh", home:true,
 loc:"McMullen Arena, Annapolis", time:"7:30 PM"},
```

Add `result:{w:true, score:"5-2"}` once a game is played, and the row switches
from a start time to a W/L line automatically. The home page's next-game card,
record, last-four results, Army–Navy countdown (any game with `marquee:true`)
and upcoming home games all recalculate from this data — no separate edit.

## Updating the roster

Find `const ROSTER`. Each player:

```js
{num:7, name:"Cal Ferraro", pos:"F", yr:"'26", co:"21st Co.",
 home:"Buffalo, NY", photo:"img/roster/ferraro.jpg"},
```

## Still to fill in

- Homepage headline: edit `HERO_SAYINGS` in `js/data.js` (it rotates).
- Per-game livestream: add `stream:"https://…"` to a game (used for away games).
- `DONATE_URL` in `js/data.js` (until it's set, Give buttons email the O-Rep).
- `NAME HERE` / `COACH_EMAIL_HERE` for the D3 and Women's D2 coaches in `js/data.js`.
- Confirm the check-mailing instructions on the Support page with whoever
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

## Keep photos web-sized (this is what made the site slow)

Never drop camera originals straight into `img/gallery/`, `img/roster/` or
`img/merch/`. A single phone/DSLR photo is 10-25 MB; the site once shipped
~317 MB of them. Originals go in `img/raw/`, then run `prep-photos.py`.
Rule of thumb: nothing outside `img/raw/` should be over ~500 KB. Every
gallery photo also needs a copy in `img/gallery/thumbs/` (~360px).

## Headshots go in `img/roster/`

The site only reads headshots from `img/roster/<lastname>.jpg` (the `photo:`
path in `js/data.js`). The old `players/` folder is not used by the site —
a photo dropped there won't show up. Best size: portrait, at least 600×800.
