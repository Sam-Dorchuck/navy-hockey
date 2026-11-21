/* ============================================================
   NAVY HOCKEY — SITE DATA
   This is the one file you edit to update the site. Every page
   (home, schedule, roster, photos, store, support, future mids)
   reads from it. Schedule results, roster, gallery, merch, contacts.
   ============================================================ */

const TEAMS = [
  { id:"md1",   name:"Men's D1" },
  { id:"md3",   name:"Men's D3 ECA" },
  { id:"wd2",   name:"Women's D2" }
];

/* --- SCHEDULE ------------------------------------------------
   date: ISO "YYYY-MM-DD".  home: true/false.
   result: omit for upcoming games; otherwise {w:true, score:"4-2"}
   stream: optional livestream link for that game (e.g. the home team's
           channel for an away game). Home games default to our LIVESTREAM;
           away games without one show no Watch link.
   marquee:true + tag:"…": rivalry treatment + homepage countdown.
   photo: optional picture for that game's homepage card, e.g.
          photo:"img/gallery/cards/fish_shooting.jpg". Without one, each game
          gets one of CARD_PHOTOS below (same photo every visit). */
const SCHEDULE = {
  /* 2026-27 season. Add result:{w:true, score:"4-2"} to a game once played
     and the row switches from a start time to a W/L line automatically. */
  md1:[
    {date:"2026-09-25", opp:"Pittsburgh", home:true, loc:"McMullen Arena, Annapolis", time:"7:00 PM", result:{w:false, score:"2-3"}},
    {date:"2026-09-26", opp:"Pittsburgh", home:true, loc:"McMullen Arena, Annapolis", time:"5:30 PM", result:{w:false, score:"1-7"}},
    {date:"2026-10-02", opp:"Delaware", home:true, loc:"McMullen Arena, Annapolis", time:"7:00 PM", result:{w:false, score:"1-2"}},
    {date:"2026-10-03", opp:"Delaware", home:false, loc:"Fred Rust Arena, Newark, DE", time:"8:00 PM", result:{w:true, score:"6-3"}},
    {date:"2026-10-09", opp:"NYU", home:false, loc:"Sky Rink at Chelsea Piers, New York, NY", time:"9:00 PM", result:{w:true, score:"6-4"}},
    {date:"2026-10-10", opp:"NYU", home:false, loc:"Sky Rink at Chelsea Piers, New York, NY", time:"6:00 PM", result:{w:false, score:"4-8"}},
    {date:"2026-10-17", opp:"Towson", home:false, loc:"Ice World, Abingdon, MD", time:"8:00 PM", result:{w:true, score:"3-1"}},
    {date:"2026-10-23", opp:"Rhode Island", home:true, loc:"McMullen Arena, Annapolis", time:"7:00 PM", result:{w:true, score:"3-0"}},
    {date:"2026-10-24", opp:"Rhode Island", home:true, loc:"McMullen Arena, Annapolis", time:"5:30 PM", result:{w:false, score:"3-5"}},
    {date:"2026-10-30", opp:"Lehigh", home:false, loc:"Steel Ice Center, Bethlehem, PA", time:"7:45 PM", result:{w:false, score:"1-5"}},
    {date:"2026-10-31", opp:"William Paterson", home:false, loc:"Ice Vault Arena, Wayne, NJ", time:"2:40 PM", result:{w:false, score:"2-6"}},
    {date:"2026-11-06", opp:"Drexel", home:true, loc:"McMullen Arena, Annapolis", time:"7:00 PM", result:{w:false, score:"1-5"}},
    {date:"2026-11-07", opp:"Drexel", home:false, loc:"Class of 1923 Arena, Philadelphia, PA", time:"7:40 PM", result:{w:false, score:"0-5"}},
    {date:"2026-11-13", opp:"Villanova", home:true, loc:"McMullen Arena, Annapolis", time:"7:00 PM", result:{w:true, score:"2-1"}},
    {date:"2026-11-14", opp:"Alabama", home:true, loc:"McMullen Arena, Annapolis", time:"5:30 PM", result:{w:true, score:"3-1"}},
    {date:"2026-11-20", opp:"North Carolina", home:true, loc:"McMullen Arena, Annapolis", time:"7:00 PM", result:{w:true, score:"3-0"}},
    {date:"2026-11-21", opp:"NC State", home:true, loc:"McMullen Arena, Annapolis", time:"5:30 PM"},
    {date:"2026-12-04", opp:"Temple", home:true, loc:"McMullen Arena, Annapolis", time:"7:00 PM"},
    {date:"2026-12-05", opp:"West Chester", home:true, loc:"McMullen Arena, Annapolis", time:"5:30 PM"},
    /* marquee:true gives a game the gold rivalry treatment in the ledger */
    {date:"2026-12-11", opp:"Army", home:false, loc:"Tate Rink, West Point, NY", time:"5:30 PM",
     marquee:true, tag:"Army\u2013Navy", stream:"https://www.youtube.com/@armyclubhockey1840/streams"},
    {date:"2027-01-22", opp:"Temple", home:false, loc:"Northeast Skate Zone, Philadelphia, PA", time:"9:00 PM"},
    {date:"2027-01-23", opp:"West Chester", home:false, loc:"Ice Line Quad Rinks, West Chester, PA", time:"6:00 PM"},
    {date:"2027-01-29", opp:"George Mason", home:true, loc:"McMullen Arena, Annapolis", time:"7:00 PM"},
    {date:"2027-01-30", opp:"Lehigh", home:true, loc:"McMullen Arena, Annapolis", time:"5:30 PM"},
    {date:"2027-02-05", opp:"George Mason", home:false, loc:"Prince William Ice Center, Dale City, VA", time:"TBD"},
    {date:"2027-02-12", opp:"Towson", home:true, loc:"McMullen Arena, Annapolis", time:"8:30 PM"},
    {date:"2027-02-19", opp:"William Paterson", home:true, loc:"McMullen Arena, Annapolis", time:"7:00 PM"},
    {date:"2027-02-20", opp:"Villanova", home:false, loc:"Hatfield Ice Arena, Hatfield, PA", time:"6:00 PM"},
  ],
  /* Men's D3 (B team), 2026-27. */
  md3:[
    {date:"2026-10-03", opp:"High Point", home:true, loc:"McMullen Arena, Annapolis", time:"6:00 PM"},
    {date:"2026-10-04", opp:"High Point", home:true, loc:"McMullen Arena, Annapolis", time:"2:00 PM"},
    {date:"2026-10-09", opp:"Loyola", home:true, loc:"McMullen Arena, Annapolis", time:"7:00 PM"},
    {date:"2026-10-16", opp:"Stevenson", home:true, loc:"McMullen Arena, Annapolis", time:"8:30 PM"},
    {date:"2026-10-17", opp:"Johns Hopkins", home:true, loc:"McMullen Arena, Annapolis", time:"6:00 PM"},
    {date:"2026-10-23", opp:"George Mason", home:false, loc:"Williams Ice Center, Fairfax, VA", time:"8:10 PM"},
    {date:"2026-10-25", opp:"UMBC", home:true, loc:"McMullen Arena, Annapolis", time:"11:00 AM"},
    {date:"2026-11-06", opp:"UMBC", home:false, loc:"Gardens Ice House, Laurel, MD", time:"8:40 PM"},
    {date:"2026-11-13", opp:"Catholic", home:false, loc:"Wheaton Ice Arena, Wheaton, MD", time:"9:10 PM"},
    {date:"2026-11-14", opp:"Catholic", home:true, loc:"McMullen Arena, Annapolis", time:"8:30 PM"},
    {date:"2026-11-20", opp:"Stevenson", home:false, loc:"Reisterstown Sportsplex, Reisterstown, MD", time:"8:00 PM"},
    {date:"2026-12-05", opp:"Maryland", home:false, loc:"Bowie Ice Arena, Bowie, MD", time:"9:20 PM"},
    {date:"2027-01-15", opp:"George Mason", home:true, loc:"McMullen Arena, Annapolis", time:"7:00 PM"},
    {date:"2027-01-22", opp:"West Chester", home:true, loc:"McMullen Arena, Annapolis", time:"7:00 PM"},
    {date:"2027-01-23", opp:"George Washington", home:true, loc:"McMullen Arena, Annapolis", time:"5:30 PM"},
    {date:"2027-01-30", opp:"Maryland", home:true, loc:"McMullen Arena, Annapolis", time:"8:30 PM"},
    {date:"2027-02-05", opp:"JMU", home:false, loc:"Haymarket Ice Plex, Haymarket, VA", time:"10:30 PM"},
    {date:"2027-02-06", opp:"JMU", home:false, loc:"Haymarket Ice Plex, Haymarket, VA", time:"6:00 PM"},
  ],
  /* Women's D2 schedule not yet posted. */
  wd2:[]
};

/* --- ROSTER --------------------------------------------------
   photo: file in /img/roster/. Leave blank or wrong and the tile
   falls back to a gold sweater number, which looks intentional. */
const ROSTER = {
  /* Men's D1, 2026-27. photo: file in img/roster/ — a missing file falls back
     to a gold sweater number, so you can add headshots as they come in.

     OPTIONAL FIELDS — add any of these to a player and they appear on their
     detail page. Leave them out and the page just shows less:
       co:"14th Co."          company on the Yard
       major:"Cyber Ops"      course of study
       prev:"Boston Jr. Bruins"   junior/high school team
       shoots:"L"             shoots left or right
       bio:"Two sentences about the player."
     Example:
       {num:3, name:"Mason Rudin", ..., co:"9th Co.", major:"Systems Engineering",
        prev:"Minnesota Blue Ox", shoots:"R", bio:"Back-to-back hat tricks..."},  */
  md1:[
    {num:1, name:"Aiden Surran", pos:"G", yr:"'30", home:"Hampden, ME", ht:"5'10\"", wt:"170 lb", photo:"img/roster/surran.jpg"},
    {num:2, name:"Doug Carr", pos:"F", yr:"'28", home:"Barnstable, MA", ht:"5'9\"", wt:"165 lb", photo:"img/roster/carr.jpg"},
    {num:3, name:"Mason Rudin", pos:"F", yr:"'28", home:"Woodbury, MN", ht:"5'10\"", wt:"200 lb", photo:"img/roster/rudin.jpg"},
    {num:5,  name:"Beau Blomme", pos:"D", yr:"'30", home:"Kansas City, MO", ht:"5'9\"", wt:"185 lb", photo:"img/roster/blomme.jpg"},
    {num:6, name:"Gavin Nethercott", pos:"D", yr:"'30", home:"Milford, CT", ht:"5'10\"", wt:"170 lb", photo:"img/roster/nethercott.jpg"},
    {num:8, name:"Ray Sun", pos:"F", yr:"'29", home:"Cincinnati, OH", ht:"5'10\"", wt:"163 lb", photo:"img/roster/sun.jpg"},
    {num:9, name:"Mac Murphy", pos:"F", yr:"'29", home:"Robbinsdale, MN", ht:"5'11\"", wt:"162 lb", photo:"img/roster/murphy.jpg"},
    {num:10, name:"Jason Fisher", pos:"D", yr:"'27", home:"Southington, CT", ht:"5'10\"", wt:"175 lb", photo:"img/roster/fisher.jpg"},
    {num:11, name:"Butler Chessen", pos:"F", yr:"'28", home:"Winnetka, IL", ht:"5'10\"", wt:"170 lb", photo:"img/roster/chessen.jpg"},
    {num:12, name:"Renby Fernald", pos:"F", yr:"'28", home:"Bedford, MA", ht:"5'11\"", wt:"195 lb", photo:"img/roster/fernald.jpg"},
    {num:13, name:"Will Thompson", pos:"F", yr:"'30", home:"Boston, MA", ht:"5'11\"", wt:"160 lb", photo:"img/roster/thompson.jpg"},
    {num:14, name:"Riley Beirs", pos:"F", yr:"'29", home:"Winchester, TN", ht:"5'8\"", wt:"167 lb", photo:"img/roster/beirs.jpg"},
    {num:15, name:"Otto Bafus", pos:"F", yr:"'29", home:"Shaker Heights, OH", ht:"5'11\"", wt:"200 lb", photo:"img/roster/bafus.jpg"},
    {num:17, name:"Caleb Pider", pos:"F", yr:"'30", home:"Midland, MI", ht:"6'0\"", wt:"175 lb", photo:"img/roster/pider.jpg"},
    {num:18, name:"Benny Waud", pos:"D", yr:"'28", home:"Saint Paul, MN", ht:"6'0\"", wt:"205 lb", photo:"img/roster/waud.jpg"},
    {num:19, name:"Dylan Nauhaus", pos:"D", yr:"'28", home:"Pittsburgh, PA", ht:"5'10\"", wt:"180 lb", photo:"img/roster/nauhaus.jpg"},
    {num:21, name:"Jack Teuschl", pos:"F", yr:"'27", home:"Vienna, VA", ht:"5'10\"", wt:"180 lb", photo:"img/roster/teuschl.jpg"},
    {num:22, name:"Sam Riddle", pos:"D", yr:"'28", home:"Dallas, TX", ht:"6'0\"", wt:"190 lb", photo:"img/roster/riddle.jpg"},
    {num:24, name:"Ian Cady", pos:"F", yr:"'28", home:"Oswego, NY", ht:"5'9\"", wt:"170 lb", photo:"img/roster/cady.jpg"},
    {num:26, name:"Patrick Cunningham", pos:"D", yr:"'28", home:"Emerald, WI", ht:"6'1\"", wt:"188 lb", photo:"img/roster/cunningham.jpg"},
    {num:27, name:"Johnny Wineland", pos:"F", yr:"'30", home:"Pittsburgh, PA", ht:"5'11\"", wt:"195 lb", photo:"img/roster/wineland.jpg"},
    {num:28, name:"Charlie Peak", pos:"F", yr:"'30", home:"Hingham, MA", ht:"5'8\"", wt:"170 lb", photo:"img/roster/peak.jpg"},
    {num:29, name:"Evan Mager", pos:"D", yr:"'29", home:"St. Louis, MO", ht:"6'2\"", wt:"210 lb", photo:"img/roster/mager.jpg"},
    {num:30, name:"Bailen Smargiassi", pos:"G", yr:"'28", home:"Breinigsville, PA", ht:"5'10\"", wt:"170 lb", photo:"img/roster/smargiassi.jpg"},
    {num:31, name:"Gavin Biehl", pos:"G", yr:"'29", home:"Point Mugu, CA", ht:"6'2\"", wt:"195 lb", photo:"img/roster/biehl.jpg"},
  ],
  /* Men's D3 (B team), 2026-27. letter:"C" or "A" marks captains.
     Hometown, height and weight not supplied — those rows simply don't render. */
  md3:[
    {num:1, name:"Luke Anderson", pos:"G", yr:"'28", photo:"img/roster/anderson.jpg"},
    {num:2, name:"Michael Huntington", pos:"F", yr:"'27", photo:"img/roster/huntington.jpg"},
    {num:3, name:"Luke Pucel", pos:"D", yr:"'27", letter:"C", photo:"img/roster/pucel.jpg"},
    {num:4, name:"Angel Kariff Gomez", pos:"D", yr:"'30", photo:"img/roster/gomez.jpg"},
    {num:5, name:"Nicholas Simons", pos:"D", yr:"'29", photo:"img/roster/simons.jpg"},
    {num:6, name:"Brennan Johnson", pos:"D", yr:"'28", photo:"img/roster/johnson.jpg"},
    {num:7, name:"Richard Dyke", pos:"F", yr:"'30", photo:"img/roster/dyke.jpg"},
    {num:8, name:"Logan Burger", pos:"D", yr:"'27", photo:"img/roster/burger.jpg"},
    {num:9, name:"Harrison Kennedy", pos:"F", yr:"'28", photo:"img/roster/kennedy.jpg"},
    {num:10, name:"Jack Miller", pos:"F", yr:"'30", photo:"img/roster/miller.jpg"},
    {num:11, name:"Jack Grace", pos:"F", yr:"'29", photo:"img/roster/grace.jpg"},
    {num:12, name:"Luke Eward", pos:"F", yr:"'29", photo:"img/roster/eward.jpg"},
    {num:13, name:"Gavin McCain", pos:"F", yr:"'30", photo:"img/roster/mccain.jpg"},
    {num:14, name:"Connor Haines", pos:"D", yr:"'30", photo:"img/roster/haines.jpg"},
    {num:15, name:"Robert Morris", pos:"F", yr:"'27", letter:"A", photo:"img/roster/morris.jpg"},
    {num:16, name:"Matthew Kim", pos:"D", yr:"'28", photo:"img/roster/kim.jpg"},
    {num:17, name:"Eliot Martin", pos:"F", yr:"'30", photo:"img/roster/martin.jpg"},
    {num:21, name:"Chad Graham", pos:"F", yr:"'27", letter:"A", photo:"img/roster/graham.jpg"},
    {num:23, name:"Samuel Gerber", pos:"F", yr:"'28", photo:"img/roster/gerber.jpg"},
    {num:25, name:"Alexander Piil", pos:"F", yr:"'27", photo:"img/roster/piil.jpg"},
    {num:27, name:"Matthew Marinello", pos:"F", yr:"'27", letter:"A", photo:"img/roster/marinello.jpg"},
    {num:31, name:"Eric Gorski", pos:"G", yr:"'27", photo:"img/roster/gorski.jpg"},
  ],
  wd2:[]
};

const STAFF = [
  {name:"Kevin Rooney",               role:"Head Coach, Men's D1",   detail:"kevinbrooney@aol.com"},
  {name:"NAME HERE",                  role:"Head Coach, Men's D3",   detail:"COACH_EMAIL_HERE"},
  {name:"NAME HERE",                  role:"Head Coach, Women's D2", detail:"COACH_EMAIL_HERE"},
  {name:"Capt Samuel Dorchuck, USMC", role:"Officer Representative", detail:"dorchuck@usna.edu"}
];

/* --- GALLERY -------------------------------------------------
   Any number of photos, shown in this order. Missing files are skipped
   automatically, so you can list them before they exist. Landscape
   (16:9-ish) photos work best. */
const GALLERY = [
  /* Captions are intentionally blank. Fill any cap:"" with text and it
     appears over the photo; leave it empty and only the counter shows.
     update-gallery.py keys captions to the FILENAME, so re-running it
     preserves whatever you write here. */
  {src:"img/gallery/cady_with_plebes.jpg", cap:""},
    {src:"img/gallery/blue_and_gold.jpg", cap:""},
  {src:"img/gallery/beef_scoring.jpg", cap:""},
  {src:"img/gallery/renby_big_hit.jpg", cap:""},
  {src:"img/gallery/cheese_action_2.jpg", cap:""},
  {src:"img/gallery/fish_shooting.jpg", cap:""},
  {src:"img/gallery/beef_mac_step_bros.jpg", cap:""},
  {src:"img/gallery/mac_beef.jpg", cap:""},
  {src:"img/gallery/murphy_breaks_stick.jpg", cap:""},
  {src:"img/gallery/youngters.jpg", cap:""},
  {src:"img/gallery/mager_flag.jpg", cap:""},


  {src:"img/gallery/2024-09-20-nmih-vs-umd-31-x2-large.jpg", cap:""},
  {src:"img/gallery/2024-09-20-nmih-vs-umd-34-x2-large.jpg", cap:""},
  {src:"img/gallery/2024-09-20-nmih-vs-umd-73-x2-large.jpg", cap:""},
  {src:"img/gallery/2024-09-20-nmih-vs-umd-8-x2-large.jpg", cap:""},
  {src:"img/gallery/2024-09-20-nmih-vs-umd-87-x2-large.jpg", cap:""},
  {src:"img/gallery/2024-09-20-nmih-vs-umd-9-x2-large.jpg", cap:""},
  {src:"img/gallery/2024-09-27-nmih-vs-uri-112-x2-large.jpg", cap:""},
  {src:"img/gallery/2024-09-27-nmih-vs-uri-35-x2-large.jpg", cap:""},
  {src:"img/gallery/2024-09-27-nmih-vs-uri-68-x2-large.jpg", cap:""},
  {src:"img/gallery/2024-11-02-nmih-temple-10-x2-large.jpg", cap:""},
  {src:"img/gallery/2024-11-02-nmih-temple-11-large.jpg", cap:""},
  {src:"img/gallery/2024-11-02-nmih-temple-4-x3-large-1.jpg", cap:""},
  {src:"img/gallery/2024-11-02-nmih-temple-4-x3-large.jpg", cap:""},
  {src:"img/gallery/2024-11-02-nmih-temple-7-x2-large.jpg", cap:""},
  {src:"img/gallery/big-crowd-navy-hockey-large.jpg", cap:""},
  {src:"img/gallery/crab-pot-large.jpg", cap:""},
  {src:"img/gallery/crabpot2024.jpg", cap:""},
  {src:"img/gallery/cunningham-brothers-large.jpg", cap:""},
  {src:"img/gallery/navy-hockey-2023-2024-large.jpg", cap:""},
];

/* --- MERCH ---------------------------------------------------
   photo is optional: drop a square image in img/merch/ and point to it.
   Items without a photo show a plain navy tile, which looks deliberate. */
/* OPTIONAL per item: desc:"..." , sizes:"S-XXL", colors:"Navy, gray",
   material:"80/20 cotton-poly". Anything you add shows on the item page.
   status: "soldout"  -> "Sold out — more in stock soon"
           "soon"     -> "Coming soon"
   Remove the status line when an item is orderable again. */
const MERCH = [
  {name:"Full-Zip Sweatshirt",      price:"$55", photo:"img/merch/full-zip.jpg"},
  {name:"UA Lightweight Hoodie",    price:"$50", photo:"img/merch/ua-lightweight-hoodie.jpg"},
  {name:"UA Quarter-Zip",           price:"$50", photo:"img/merch/ua-quarter-zip.jpg"},
  {name:"Champion Crewneck",        price:"$40", photo:"img/merch/champion-crewneck.jpg"},
  {name:"UA Long Sleeve T-Shirt",   price:"$35", photo:"img/merch/ua-long-sleeve.jpg"},
  {name:"UA Short Sleeve T-Shirt",  price:"$30", photo:"img/merch/ua-short-sleeve.jpg"},
  {name:"Blanket",                  price:"$75", photo:"img/merch/blanket.jpg"},
  {name:"Trucker Hat",              price:"$25", photo:"img/merch/trucker-hat.jpg"},
  {name:"Classic Hat",              price:"$25", photo:"img/merch/classic-hat.jpg"},
  {name:"Beanie",                   price:"$25", photo:"img/merch/beanie.jpg"},
  {name:"Mittens",                  price:"$20", photo:"img/merch/mittens.jpg"},
  /* price not set yet — the tile and item page simply omit it until you add one */
  {name:"White Jersey",                          photo:"img/merch/white-jersey.jpg"},
  {name:"Replica Jersey",                        photo:"img/merch/replica-jersey.jpg",
   sizes:"Youth and adult sizes",
   desc:"The script-crest replica, in both youth and adult sizes. Lighter material "
        + "than a game sweater \u2014 cut for wearing in the stands rather than on the ice."}
];

const CONTACTS = [
  {role:"Officer Representative", who:"Capt Samuel Dorchuck, USMC", detail:"dorchuck@usna.edu", note:"First stop for prospective players and parents. Send game film here."},
  {role:"Head Coach, Men's D1",   who:"Kevin Rooney", detail:"kevinbrooney@aol.com", note:"On-ice questions and tryout information."},
  {role:"Head Coach, Women's D2", who:"NAME HERE", detail:"COACH_EMAIL_HERE", note:"Women's program recruiting."},
  {role:"Admissions",             who:"USNA Admissions", detail:"http://www.usna.edu/Admissions/Steps-for-Admission/index.php", note:"Start your candidate file here. Admissions decides; hockey does not."}
];

/* Merchandise order form. Paste the Google Form link between the quotes and
   every "order" button on the page switches to it. Left empty, the buttons
   fall back to emailing Kelly, so the store always works. */
const ORDER_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSf-pbpobTS1cByJRtbtkE9jzpPQcCU7a8setTHOnjSmWgrxEA/viewform";
const ORDER_EMAIL    = "kellyteuschl@gmail.com";

/* Where an order button should point. subject is used only by the mailto. */
function orderLink(subject){
  return ORDER_FORM_URL
    ? ORDER_FORM_URL
    : "mailto:" + ORDER_EMAIL + "?subject=" + encodeURIComponent(subject);
}

const LIVESTREAM = "https://www.youtube.com/@navyicehockey5717/streams";
const PREGAME_HOURS = 4;    // stream link goes live this long before faceoff
const GAME_HOURS    = 3;    // a game is considered over this long after faceoff

/* Player questionnaire for prospective Mids (Future Mids page + home). */
const QUESTIONNAIRE_URL = "https://docs.google.com/forms/d/e/1FAIpQLScSPgu6CQGKRSx2eJ7vW8SPgFjrA7MGF13YuzMT2U0wfr9VUg/viewform?usp=sf_link";

/* Officer Representative — prospect emails go here with the subject prefilled. */
const OREP_EMAIL = "dorchuck@usna.edu";

/* Giving link for Friends of Navy Hockey. Leave "" until it's confirmed;
   the Give buttons then point to the Support page instead of a dead link. */
const DONATE_URL = "";

/* Homepage headline. The hero rotates through these every few seconds
   (first one shows on load). Add, remove or reorder freely. */
const HERO_SAYINGS = [
  "Don't give up the ship.",
  "Beat Army.",
  "Anchors aweigh.",
  "Fly Navy.",
  "Semper Fidelis.",
  "The Frozen Chosen.",
  "Damn the torpedoes."
];

/* Action shots used on the homepage "Coming up" cards (card-sized copies in
   img/gallery/cards/). Each game is matched to one by its date, so a game keeps
   the same photo every visit. Marquee games (Army–Navy) use the flag photo. */
const CARD_PHOTOS = [
  "img/gallery/cards/renby_big_hit.jpg",
  "img/gallery/cards/cheese_action_2.jpg",
  "img/gallery/cards/fish_shooting.jpg",
  "img/gallery/cards/2024-09-20-nmih-vs-umd-34-x2-large.jpg",
  "img/gallery/cards/2024-09-20-nmih-vs-umd-8-x2-large.jpg",
  "img/gallery/cards/2024-09-20-nmih-vs-umd-9-x2-large.jpg",
  "img/gallery/cards/2024-09-27-nmih-vs-uri-35-x2-large.jpg",
  "img/gallery/cards/2024-09-27-nmih-vs-uri-68-x2-large.jpg",
  "img/gallery/cards/2024-11-02-nmih-temple-7-x2-large.jpg",
  "img/gallery/cards/2024-09-20-nmih-vs-umd-73-x2-large.jpg"
];
