/* ============================================================
   NAVY HOCKEY — shared site script.
   Every page loads js/data.js (the content) and then this file.
   Each renderer looks for its mount element and quietly skips
   pages that don't have it. Nothing here needs editing to update
   scores, rosters, photos or merch — that's all in js/data.js.
   ============================================================ */

const PAGE = document.body.dataset.page || "home";

/* Old single-page links (#schedule, #player-rudin, …) still land in the right place. */
(function legacyLinks(){
  if(PAGE !== "home" || !location.hash) return;
  const h = location.hash;
  const map = {"#schedule":"schedule.html","#roster":"roster.html","#photos":"photos.html",
               "#merch":"store.html","#support":"support.html","#recruiting":"future-mids.html"};
  if(map[h]) return location.replace(map[h]);
  if(h.startsWith("#player-")) return location.replace("roster.html" + h);
  if(h.startsWith("#item-"))   return location.replace("store.html" + h);
})();

/* ---------- header + footer, shared by every page ---------- */
(function shell(){
  const NAV = [
    ["schedule","schedule.html","Schedule"],
    ["roster","roster.html","Roster"],
    ["future-mids","future-mids.html","Future Mids"],
    ["store","store.html","Store"],
    ["support","support.html","Support"],
    ["photos","photos.html","Photos"]
  ];
  const team = new URLSearchParams(location.search).get("team") || "md1";
  const teamHref = id => {
    if(PAGE==="schedule" || PAGE==="roster") return `${PAGE}.html${id==="md1"?"":"?team="+id}`;
    return id==="md1" ? "index.html" : `schedule.html?team=${id}`;
  };
  const cur = id => (id===team && (PAGE==="home"||PAGE==="schedule"||PAGE==="roster")) ? ' aria-current="true"' : "";

  const head = document.getElementById("site-header");
  if(head) head.outerHTML = `
<div class="progbar">
  <div class="shell">
    <nav aria-label="Navy Hockey teams">
      <a href="${teamHref("md1")}"${cur("md1")}>Men's D1</a>
      <a href="${teamHref("md3")}"${cur("md3")}>Men's D3</a>
      <a href="${teamHref("wd2")}"${cur("wd2")}>Women's D2</a>
    </nav>
    <div class="social">
      <a href="https://www.instagram.com/navymenshockey/">@navymenshockey</a>
      <a href="${LIVESTREAM}">YouTube</a>
    </div>
  </div>
</div>
<header class="topbar">
  <div class="shell">
    <a class="mark" href="index.html" aria-label="Navy Hockey, home">
      <img src="img/navy-n-star.png" alt="" width="41" height="46">
      <span class="mark-text"><b>NAVY HOCKEY</b><small>U.S. NAVAL ACADEMY</small></span>
    </a>
    <button class="navtoggle" aria-expanded="false" aria-controls="topnav">Menu</button>
    <nav class="topnav" id="topnav" aria-label="Main">
      ${NAV.map(([id,href,label])=>`<a href="${href}"${id===PAGE?' aria-current="page"':""}>${label}</a>`).join("")}
    </nav>
    <a class="btn btn-live" href="${LIVESTREAM}">Watch live</a>
  </div>
</header>`;

  const foot = document.getElementById("site-footer");
  if(foot) foot.outerHTML = `
<footer>
  <div class="shell">
    <div class="foot">
      <div>
        <h4>The rink</h4>
        <p>John J. McMullen Hockey Arena</p>
        <p>Brigade Sports Complex</p>
        <p>64 Greenbury Point Road</p>
        <p>Annapolis, MD 21402</p>
      </div>
      <div>
        <h4>Teams</h4>
        <ul>
          <li><a href="schedule.html">Men's Division I — ACHA / ECHA</a></li>
          <li><a href="schedule.html?team=md3">Men's Division III — ACHA / ECA</a></li>
          <li><a href="schedule.html?team=wd2">Women's Division II — ACHA</a></li>
        </ul>
      </div>
      <div>
        <h4>Contact</h4>
        <ul>
          <li><a href="mailto:${OREP_EMAIL}">Capt Dorchuck, O-Rep</a></li>
          <li><a href="future-mids.html">Prospective players</a></li>
          <li><a href="support.html">Support &amp; giving</a></li>
          <li><a href="${orderLink("Navy Hockey merchandise order")}">Order merchandise</a></li>
        </ul>
      </div>
      <div>
        <h4>Follow</h4>
        <ul>
          <li><a href="https://www.instagram.com/navymenshockey/">@navymenshockey — Men's D1</a></li>
          <li><a href="https://www.instagram.com/usnahockey/">@usnahockey — Men's D3</a></li>
          <li><a href="https://www.instagram.com/navywomenshockey/">@navywomenshockey — Women's D2</a></li>
          <li><a href="${LIVESTREAM}">YouTube — game streams</a></li>
        </ul>
      </div>
    </div>
    <p class="colophon">Navy Club Hockey is a midshipman club sport at the United States Naval Academy. This site is maintained by the team and is not an official U.S. Navy or Department of Defense website.</p>
  </div>
</footer>`;
})();

/* give buttons: real link once DONATE_URL is set, else the Support page */
document.querySelectorAll("[data-give]").forEach(a=>{ a.href = DONATE_URL || ("mailto:" + OREP_EMAIL + "?subject=" + encodeURIComponent("Supporting Navy Hockey")); });
document.querySelectorAll("[data-questionnaire]").forEach(a=>{ a.href = QUESTIONNAIRE_URL; });
document.querySelectorAll("[data-order]").forEach(a=>{ a.href = orderLink("Navy Hockey merchandise order"); });
document.querySelectorAll("[data-live]").forEach(a=>{ a.href = LIVESTREAM; });

/* ---------- game-time helpers (home page + anywhere else) ---------- */
function faceoff(g){
  const d = new Date(g.date + "T12:00:00");
  const m = /(\d{1,2}):(\d{2})\s*(AM|PM)/i.exec(g.time || "");
  if(!m){ d.setHours(19,0,0,0); return d; }            // TBD -> assume evening
  let hr = parseInt(m[1],10) % 12;
  if(/PM/i.test(m[3])) hr += 12;
  d.setHours(hr, parseInt(m[2],10), 0, 0);
  return d;
}
const isOver = g => !!g.result || Date.now() > faceoff(g).getTime() + GAME_HOURS*3600e3;
const isLive = g => !g.result && Date.now() >= faceoff(g).getTime() - PREGAME_HOURS*3600e3 && !isOver(g);
const mapsLink = loc => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(loc);
function gcalLink(g, teamName){
  const s = faceoff(g), e = new Date(s.getTime() + 2.5*3600e3);
  const p = d => `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}T${String(d.getHours()).padStart(2,"0")}${String(d.getMinutes()).padStart(2,"0")}00`;
  const title = `Navy Hockey ${teamName}: ${g.home ? "vs." : "at"} ${g.opp}`;
  return "https://calendar.google.com/calendar/render?action=TEMPLATE"
    + "&text=" + encodeURIComponent(title)
    + "&dates=" + p(s) + "/" + p(e) + "&ctz=America/New_York"
    + "&location=" + encodeURIComponent(g.loc)
    + "&details=" + encodeURIComponent("Livestream: " + LIVESTREAM);
}
const esc = s => String(s).replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const el = (t,c,h)=>{const n=document.createElement(t); if(c)n.className=c; if(h!=null)n.innerHTML=h; return n;};
const fmt = iso => {
  const d = new Date(iso+"T12:00:00");
  return {
    day: d.getDate(),
    mon: d.toLocaleDateString("en-US",{month:"short"}).toUpperCase(),
    wd:  d.toLocaleDateString("en-US",{weekday:"short"}),
    d
  };
};

/* team switchers */

/* team switchers — ?team=md3 deep-links straight to a team */
function buildSwitcher(mountId, onPick){
  const mount = document.getElementById(mountId);
  if(!mount) return;
  const want = new URLSearchParams(location.search).get("team");
  const start = TEAMS.find(t=>t.id===want) ? want : TEAMS[0].id;
  TEAMS.forEach(t=>{
    const b = el("button",null,t.name);
    b.setAttribute("aria-pressed", t.id===start ? "true":"false");
    b.addEventListener("click",()=>{
      [...mount.children].forEach(c=>c.setAttribute("aria-pressed","false"));
      b.setAttribute("aria-pressed","true");
      const u = new URL(location.href);
      if(t.id===TEAMS[0].id) u.searchParams.delete("team"); else u.searchParams.set("team", t.id);
      history.replaceState(null, "", u.pathname + u.search + u.hash);
      onPick(t.id);
    });
    mount.appendChild(b);
  });
  onPick(start);
}


/* schedule */
function renderSchedule(teamId){
  const mount = document.getElementById("ledger");
  if(!mount) return;
  mount.innerHTML = "";
  const games = SCHEDULE[teamId] || [];
  if(!games.length){
    mount.appendChild(el("p","g-loc","Schedule for this team hasn't been posted yet."));
    return;
  }
  games.forEach(g=>{
    const f = fmt(g.date);
    const row = el("div","game");
    row.appendChild(el("div","g-date", `${f.mon} ${f.day}<small>${f.wd}</small>`));

    if(g.marquee) row.classList.add("marquee");

    const mid = el("div");
    if(g.tag) mid.appendChild(el("div","g-tag", g.tag));
    mid.appendChild(el("div","g-opp",
      `<span class="g-ha ${g.home?'home':'away'}">${g.home?'H':'A'}</span>${g.opp}`));
    mid.appendChild(el("div","g-loc", g.loc));
    row.appendChild(mid);

    const right = g.result
      ? el("div","g-right", `<span class="${g.result.w?'w':'l'}">${g.result.w?'W':'L'} ${g.result.score}</span>`)
      : el("div","g-right", `<span class="time">${g.time||"TBD"}</span>`);
    row.appendChild(right);
    mount.appendChild(row);
  });
}


/* roster */
function renderRoster(teamId){
  const mount = document.getElementById("wall");
  if(!mount) return;
  mount.innerHTML = "";
  (ROSTER[teamId]||[]).forEach(p=>{
    const card = el("a","player");
    card.href = "#player-" + slugify(p.name);
    card.setAttribute("aria-label", `${p.name}, number ${p.num}`);
    const img = el("img");
    img.loading = "lazy"; img.decoding = "async";
    img.src = p.photo || "";
    img.alt = `${p.name}, #${p.num}`;
    img.loading = "lazy";
    img.addEventListener("error", ()=>card.classList.add("no-photo"));
    if(!p.photo) card.classList.add("no-photo");
    card.appendChild(img);
    card.appendChild(el("div","p-num", String(p.num)));
    if(p.letter) card.appendChild(el("div","p-letter", p.letter));
    const info = el("div","p-info");
    info.appendChild(el("div","p-name", p.name));
    info.appendChild(el("div","p-meta", `${p.pos} · Class of ${p.yr}`));
    if(p.home) info.appendChild(el("div","p-home", p.home));
    if(p.ht)   info.appendChild(el("div","p-stats", `${p.ht}${p.wt ? " · " + p.wt : ""}`));
    card.appendChild(info);
    mount.appendChild(card);
  });
}

/* staff */
(function renderStaff(){
  const mount = document.getElementById("staff");
  if(!mount) return;
  STAFF.forEach(s=>{
    const d = el("div");
    d.appendChild(el("div","role", s.role));
    d.appendChild(el("h3",null,s.name));
    d.appendChild(el("p",null,`<a href="mailto:${s.detail}">${s.detail}</a>`));
    mount.appendChild(d);
  });
})();

/* gallery — rotating carousel.
   Only photos that actually load appear, so a missing file is skipped
   instead of leaving a blank slide. */
(function renderGallery(){
  const mount = document.getElementById("gallery");
  if(!mount) return;

  /* Render right away and fetch slides on demand — waiting on every
     full photo before showing anything made the section sit blank. */
  const thumb = src => src.replace("img/gallery/", "img/gallery/thumbs/");
  const shots = GALLERY.slice();
  {
    if(!shots.length){
      mount.className = "gallery-empty";
      mount.innerHTML = "<h3>Photos coming soon</h3>" +
        "<p>Game and team photos will be posted here through the season.</p>";
      return;
    }

    mount.className = "carousel";
    mount.innerHTML =
      '<div class="stage">' +
        shots.map((g,i)=>`<img ${i?"data-src":"src"}="${g.src}" alt="${g.cap || "Navy Hockey"}" decoding="async" class="${i?"":"on"}">`).join("") +
        '<div class="cap"><div class="cap-text"></div><div class="cap-count"></div></div>' +
        '<button class="arrow prev" aria-label="Previous photo">&#10094;</button>' +
        '<button class="arrow next" aria-label="Next photo">&#10095;</button>' +
      '</div>' +
      '<div class="thumbs">' +
        shots.map((g,i)=>`<button aria-label="Photo ${i+1}"><img src="${thumb(g.src)}" loading="lazy" decoding="async" alt="" onerror="if(this.src.indexOf('/thumbs/')>-1)this.src='${g.src}'"></button>`).join("") +
      '</div>';

    const imgs   = [...mount.querySelectorAll(".stage img")];
    const thumbs = [...mount.querySelectorAll(".thumbs button")];
    const text   = mount.querySelector(".cap-text");
    const count  = mount.querySelector(".cap-count");
    let i = 0, timer = null;

    function show(n){
      i = (n + shots.length) % shots.length;
      [i, (i+1) % shots.length].forEach(k=>{
        const im = imgs[k];
        if(im && im.dataset.src){ im.src = im.dataset.src; delete im.dataset.src; }
      });
      imgs.forEach((im,k)=>im.classList.toggle("on", k===i));
      thumbs.forEach((t,k)=>t.setAttribute("aria-current", k===i ? "true" : "false"));
      text.textContent  = shots[i].cap || "";
      count.textContent = (i+1) + " / " + shots.length;
    }

    mount.querySelector(".next").addEventListener("click", ()=>{ show(i+1); rest(); });
    mount.querySelector(".prev").addEventListener("click", ()=>{ show(i-1); rest(); });
    thumbs.forEach((t,k)=>t.addEventListener("click", ()=>{ show(k); rest(); }));

    mount.tabIndex = 0;
    mount.addEventListener("keydown", e=>{
      if(e.key==="ArrowRight"){ show(i+1); rest(); }
      if(e.key==="ArrowLeft"){  show(i-1); rest(); }
    });

    let x0 = null;
    mount.addEventListener("touchstart", e=>{ x0 = e.touches[0].clientX; }, {passive:true});
    mount.addEventListener("touchend", e=>{
      if(x0===null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if(Math.abs(dx) > 40) { show(i + (dx<0 ? 1 : -1)); rest(); }
      x0 = null;
    });

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const DWELL = 6000;   // ms each photo stays on screen
    function start(){
      if(timer) return;   // guard: mouseleave and focusout both call this,
                          // and stacking intervals makes it race
      if(!still && shots.length > 1) timer = setInterval(()=>show(i+1), DWELL);
    }
    function stop(){ clearInterval(timer); timer = null; }
    function rest(){ stop(); start(); }   // restart the clock after a manual move
    mount.addEventListener("mouseenter", stop);
    mount.addEventListener("mouseleave", start);
    mount.addEventListener("focusin", stop);
    mount.addEventListener("focusout", start);

    show(0); start();
  }
})();

const STATUS = {
  soldout: {label:"Sold out", note:"Sold out — more in stock soon"},
  soon:    {label:"Coming soon", note:"Coming soon"}
};

/* "How to order" panel — wording follows whichever route is configured */
(function orderPanel(){
  const copy = document.getElementById("order-copy");
  const cta  = document.getElementById("order-cta");
  if(!copy || !cta) return;
  if(ORDER_FORM_URL){
    copy.textContent = "Fill out the order form with the items, sizes, and quantities "
      + "you want. Kelly Teuschl will confirm availability and arrange payment and pickup.";
    cta.innerHTML = `<a class="btn" href="${ORDER_FORM_URL}">Open the order form</a>`;
  } else {
    copy.textContent = "Email Kelly Teuschl with the item, size, color, and quantity "
      + "you want, and she'll confirm availability and arrange payment and pickup.";
    cta.innerHTML = `<a class="btn" href="${orderLink("Navy Hockey merchandise order")}">Email Kelly to order</a>`;
  }
})();

/* merch */
(function renderMerch(){
  const mount = document.getElementById("merch-grid");
  if(!mount) return;   // NOT "merch" — that id belongs to the <section>
  MERCH.forEach(m=>{
    const card = el("a","item");
    card.href = "#item-" + slugify(m.name);
    const shot = el("div","shot");
    const img  = el("img");
    img.loading = "lazy"; img.decoding = "async";
    img.src = m.photo || "";
    img.alt = m.name;
    img.loading = "lazy";
    img.addEventListener("error", ()=>card.classList.add("no-photo"));
    if(!m.photo) card.classList.add("no-photo");
    shot.appendChild(img);
    if(m.status && STATUS[m.status]){
      card.classList.add("unavailable");
      shot.appendChild(el("div","ribbon", STATUS[m.status].label));
    }
    card.appendChild(shot);
    const body = el("div","item-body");
    body.appendChild(el("div","item-name", m.name));
    if(m.price) body.appendChild(el("div","item-price", m.price));
    card.appendChild(body);
    mount.appendChild(card);
  });
})();

/* contacts */
(function renderContacts(){
  const mount = document.getElementById("contacts");
  if(!mount) return;
  CONTACTS.forEach(c=>{
    const d = el("div","contact");
    d.appendChild(el("div","role", c.role));
    d.appendChild(el("div","who", c.who));
    const link = c.detail.startsWith("http")
      ? `<a href="${c.detail}">${c.detail}</a>`
      : `<a href="mailto:${c.detail}">${c.detail}</a>`;
    d.appendChild(el("div","detail", link));
    d.appendChild(el("div","p-home", c.note));
    mount.appendChild(d);
  });
})();


/* ---------- detail sheets (players and merch) ----------
   Driven by the URL hash, so #player-rudin is a real shareable link and the
   browser back button closes the panel. */
function slugify(s){
  return s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
}

(function sheets(){
  const sheet = document.getElementById("sheet");
  if(!sheet) return;
  const body  = document.getElementById("sheet-body");
  const closeBtn = sheet.querySelector(".sheet-close");
  let lastFocus = null;

  const allPlayers = () => Object.values(ROSTER).flat();

  function fact(dl, label, value){
    if(!value) return;
    const row = el("div","fact");
    row.appendChild(el("dt",null,label));
    row.appendChild(el("dd",null,value));
    dl.appendChild(row);
  }

  function renderPlayer(p){
    const left = el("div");
    const shot = el("div","sheet-shot portrait");
    const img = el("img");
    img.loading = "lazy"; img.decoding = "async";
    img.src = p.photo || ""; img.alt = p.name;
    img.addEventListener("error", ()=>shot.classList.add("empty"));
    if(!p.photo) shot.classList.add("empty");
    shot.appendChild(img);
    shot.appendChild(el("div","ghost", String(p.num)));
    left.appendChild(shot);

    const right = el("div");
    const teamOf = Object.keys(ROSTER).find(k => ROSTER[k].includes(p));
    const teamName = (TEAMS.find(t=>t.id===teamOf)||{}).name || "";
    right.appendChild(el("div","sheet-eyebrow",
      `#${p.num} · ${p.pos==="G"?"Goaltender":p.pos==="D"?"Defense":"Forward"}${teamName ? " · " + teamName : ""}`));
    const t = el("h2","sheet-title", p.name); t.id = "sheet-title";
    right.appendChild(t);
    right.appendChild(el("div","sheet-sub", `Class of ${p.yr}${p.home ? " · " + p.home : ""}`));

    const dl = el("dl","facts");
    fact(dl,"Position", p.pos==="G"?"Goaltender":p.pos==="D"?"Defense":"Forward");
    fact(dl,"Role", p.letter==="C" ? "Captain" : p.letter==="A" ? "Alternate captain" : "");
    fact(dl,"Height", p.ht);
    fact(dl,"Weight", p.wt);
    fact(dl,"Shoots", p.shoots);
    fact(dl,"Hometown", p.home);
    fact(dl,"Class", "20"+String(p.yr).replace("'",""));
    fact(dl,"Company", p.co);
    fact(dl,"Major", p.major);
    fact(dl,"Previous team", p.prev);
    right.appendChild(dl);

    if(p.bio) right.appendChild(el("p","sheet-note", p.bio));
    else right.appendChild(el("p","sheet-empty","More on this player coming soon."));

    body.innerHTML = "";
    body.appendChild(left); body.appendChild(right);
  }

  function renderItem(m){
    const left = el("div");
    const shot = el("div","sheet-shot square");
    const img = el("img");
    img.loading = "lazy"; img.decoding = "async";
    img.src = m.photo || ""; img.alt = m.name;
    img.addEventListener("error", ()=>shot.classList.add("empty"));
    if(!m.photo) shot.classList.add("empty");
    shot.appendChild(img);
    shot.appendChild(el("div","ghost","N"));
    left.appendChild(shot);

    const right = el("div");
    right.appendChild(el("div","sheet-eyebrow","Team store"));
    const t = el("h2","sheet-title", m.name); t.id = "sheet-title";
    right.appendChild(t);
    if(m.price) right.appendChild(el("div","sheet-sub", m.price));

    const dl = el("dl","facts");
    fact(dl,"Sizes", m.sizes);
    fact(dl,"Colors", m.colors);
    fact(dl,"Material", m.material);
    right.appendChild(dl);

    if(m.status && STATUS[m.status])
      right.appendChild(el("p","stock-note", STATUS[m.status].note));

    if(m.desc) right.appendChild(el("p","sheet-note", m.desc));
    else right.appendChild(el("p","sheet-empty","Sizes and details available on request."));

    const waiting = !!m.status;
    const href = orderLink((waiting ? "Navy Hockey restock: " : "Navy Hockey order: ") + m.name);
    const label = ORDER_FORM_URL
      ? (waiting ? "Join the waitlist" : "Order this")
      : (waiting ? "Ask Kelly to let you know" : "Email Kelly to order");
    right.appendChild(el("p",null,
      `<a class="btn${waiting ? " btn-ghost" : ""}" href="${href}">${label}</a>`));

    body.innerHTML = "";
    body.appendChild(left); body.appendChild(right);
  }

  function open(){
    lastFocus = document.activeElement;
    sheet.setAttribute("open","");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }
  function close(){
    sheet.removeAttribute("open");
    document.body.style.overflow = "";
    if(lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function dismiss(){
    if(location.hash.startsWith("#player-") || location.hash.startsWith("#item-")){
      history.pushState("", document.title, location.pathname + location.search);
    }
    close();
  }

  function route(){
    const hash = location.hash;
    if(hash.startsWith("#player-")){
      const p = allPlayers().find(x=>slugify(x.name) === hash.slice(8));
      if(p){ renderPlayer(p); open(); return; }
    }
    if(hash.startsWith("#item-")){
      const m = MERCH.find(x=>slugify(x.name) === hash.slice(6));
      if(m){ renderItem(m); open(); return; }
    }
    close();
  }

  closeBtn.addEventListener("click", dismiss);
  sheet.querySelector("[data-close]").addEventListener("click", dismiss);
  document.addEventListener("keydown", e=>{
    if(e.key === "Escape" && sheet.hasAttribute("open")) dismiss();
    if(e.key === "Tab" && sheet.hasAttribute("open")){
      const f = sheet.querySelectorAll("button, a[href]");
      if(!f.length) return;
      const first = f[0], last = f[f.length-1];
      if(e.shiftKey && document.activeElement === first){ last.focus(); e.preventDefault(); }
      else if(!e.shiftKey && document.activeElement === last){ first.focus(); e.preventDefault(); }
    }
  });
  window.addEventListener("hashchange", route);
  window.__routeSheet = route;   // called once the roster/merch have rendered
})();


/* mobile nav */
(function nav(){
  const btn = document.querySelector(".navtoggle");
  const menu = document.getElementById("topnav");
  const sync = ()=>{ if(window.innerWidth>780){ menu.hidden=false; btn.setAttribute("aria-expanded","false"); } else { menu.hidden=true; } };
  btn.addEventListener("click", ()=>{
    const open = !menu.hidden;
    menu.hidden = open;
    btn.setAttribute("aria-expanded", String(!open));
  });
  menu.addEventListener("click", e=>{ if(e.target.tagName==="A" && window.innerWidth<=780) menu.hidden = true; });
  window.addEventListener("resize", sync);
  sync();
})();

/* ============================================================
   HOME — everything below is computed from js/data.js, so the
   page updates itself as scores and schedule change.
   ============================================================ */
(function home(){
  if(PAGE !== "home") return;
  const D1 = SCHEDULE.md1 || [];
  const d1name = (TEAMS.find(t=>t.id==="md1")||{}).name || "Men's D1";
  const dayFmt = d => d.toLocaleDateString("en-US",{weekday:"short", month:"short", day:"numeric"});

  /* next game card */
  function paintNext(){
    const card = document.getElementById("ng-card");
    if(!card) return;
    const next = D1.filter(g=>!isOver(g)).sort((a,b)=>faceoff(a)-faceoff(b));
    if(!next.length){
      card.innerHTML = `<div class="ng-top"><div class="kicker">Season complete</div></div>
        <div class="ng-vs" style="margin-top:.8rem">Thanks for a great season</div>
        <div class="btn-row"><a class="btn btn-lg" href="schedule.html">Final results</a></div>`;
      return;
    }
    const g = next[0], then = next[1], live = isLive(g);
    card.innerHTML = `
      <div class="ng-top">
        <div class="kicker">${live ? 'Live now <span class="live-dot"></span>' : "Next game"}</div>
        <div class="badge ${g.home?"home":"away"}">${g.home?"HOME":"AWAY"}</div>
      </div>
      <div class="ng-when">${dayFmt(faceoff(g))} · ${esc(g.time||"TBD")}</div>
      <div class="ng-vs">Navy <span>${g.home?"vs":"at"}</span> ${esc(g.opp)}</div>
      <div class="ng-where">${esc(g.loc)}</div>
      <div class="btn-row">
        ${live
          ? `<a class="btn btn-lg" href="${LIVESTREAM}">Watch live</a>`
          : `<a class="btn btn-lg" href="${gcalLink(g, d1name)}">Add to calendar</a>`}
        <a class="btn btn-ghost btn-lg" href="${mapsLink(g.loc)}">Directions</a>
      </div>
      ${then ? `<div class="ng-then"><span>Then: ${dayFmt(faceoff(then))} · ${esc(then.time||"TBD")}</span><span><b>${then.home?"vs":"at"} ${esc(then.opp)}</b></span></div>` : ""}`;
  }

  /* record, streak, last four */
  (function results(){
    const box = document.getElementById("h-results");
    if(!box) return;
    const done = D1.filter(g=>g.result).sort((a,b)=>a.date<b.date?-1:1);
    if(!done.length){ box.hidden = true; return; }
    const w = done.filter(g=>g.result.w).length, l = done.length - w;
    let n = 0; const last = done[done.length-1].result.w;
    for(let i=done.length-1;i>=0 && done[i].result.w===last;i--) n++;
    const streak = n>1 ? `${last?"Won":"Lost"} last ${n}` : `${last?"Won":"Lost"} last game`;
    document.getElementById("rec-big").textContent = `${w}–${l}`;
    document.getElementById("rec-streak").textContent = streak;
    document.getElementById("lastn").innerHTML = done.slice(-4).reverse().map(g=>`
      <div class="res">
        <div class="chip ${g.result.w?"w":"l"}" aria-label="${g.result.w?"Win":"Loss"}">${g.result.w?"W":"L"}</div>
        <div style="min-width:0"><b>${esc(g.result.score.replace("-","–"))} ${g.home?"vs":"at"} ${esc(g.opp)}</b>
        <small>${dayFmt(new Date(g.date+"T12:00:00"))}</small></div>
      </div>`).join("");
  })();

  /* rivalry spotlight: the next marquee:true game, with a live countdown */
  (function rivalry(){
    const sec = document.getElementById("h-rival");
    if(!sec) return;
    const g = D1.filter(x=>x.marquee && !isOver(x)).sort((a,b)=>faceoff(a)-faceoff(b))[0];
    if(!g){ sec.hidden = true; return; }
    document.getElementById("rv-title").textContent = g.tag || `Navy vs ${g.opp}`;
    document.getElementById("rv-when").textContent =
      `${dayFmt(faceoff(g))} · ${g.time||"TBD"} · ${g.loc.replace(/, [A-Z]{2}$/,"")}`;
    const tick = ()=>{
      const ms = Math.max(0, faceoff(g) - Date.now());
      const d = Math.floor(ms/864e5), h = Math.floor(ms%864e5/36e5), m = Math.floor(ms%36e5/6e4);
      document.getElementById("cd").innerHTML = isLive(g)
        ? `<div><b>LIVE</b><small>WATCH NOW</small></div>`
        : `<div><b>${d}</b><small>DAYS</small></div><div><b>${String(h).padStart(2,"0")}</b><small>HOURS</small></div><div><b>${String(m).padStart(2,"0")}</b><small>MIN</small></div>`;
    };
    tick(); setInterval(tick, 30000);
  })();

  /* upcoming home games */
  (function upcoming(){
    const box = document.getElementById("upc");
    if(!box) return;
    const list = D1.filter(g=>g.home && !isOver(g)).sort((a,b)=>faceoff(a)-faceoff(b)).slice(0,6);
    if(!list.length){ box.innerHTML = `<p class="g-loc" style="padding:1rem 0">No more home games this season.</p>`; return; }
    box.innerHTML = list.map(g=>{ const f = fmt(g.date); return `
      <div class="upc-row">
        <div class="upc-date"><small>${f.mon}</small><b>${String(f.day).padStart(2,"0")}</b></div>
        <div class="upc-mid"><b>${esc(g.opp)}</b><small>${f.wd} · ${esc(g.loc)}</small></div>
        <div class="upc-time">${esc(g.time||"TBD")}</div>
      </div>`; }).join("");
  })();

  /* four D1 players — random each visit, only ones whose headshot actually loads */
  (function spotlight(){
    const box = document.getElementById("spot");
    if(!box) return;
    const pool = (ROSTER.md1||[]).filter(p=>p.photo).sort(()=>Math.random()-.5).slice(0,10);
    Promise.all(pool.map(p=>new Promise(res=>{
      const im = new Image(); im.onload = ()=>res(p); im.onerror = ()=>res(null); im.src = p.photo;
    }))).then(ok=>{
      const four = ok.filter(Boolean).slice(0,4);
      if(!four.length){ box.closest("section").hidden = true; return; }
      const pos = x => x==="G"?"G":x==="D"?"D":"F";
      box.innerHTML = four.map(p=>`
        <a class="pcard" href="roster.html#player-${slugify(p.name)}">
          <div class="ph"><img src="${p.photo}" alt="${esc(p.name)}" loading="lazy"><div class="num">${p.num}</div></div>
          <div class="tx"><b>${esc(p.name)}</b><small>${pos(p.pos)} · Class of ${p.yr}${p.home ? " · " + esc(p.home) : ""}</small></div>
        </a>`).join("");
    });
  })();

  /* four orderable store items */
  (function shop(){
    const box = document.getElementById("shop");
    if(!box) return;
    box.innerHTML = MERCH.filter(m=>m.photo && m.price && !m.status).slice(0,4).map(m=>`
      <a class="mcard" href="store.html#item-${slugify(m.name)}">
        <div class="ph"><img src="${m.photo}" alt="${esc(m.name)}" loading="lazy"></div>
        <div class="tx"><span>${esc(m.name)}</span><span>${esc(m.price)}</span></div>
      </a>`).join("");
  })();

  paintNext();
  setInterval(paintNext, 60000);
})();

buildSwitcher("sched-teams", renderSchedule);
buildSwitcher("roster-teams", renderRoster);

/* honour a deep link like roster.html#player-rudin on first load */
if(window.__routeSheet) window.__routeSheet();
