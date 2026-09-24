/* Every screen of the rebuilt storefront, drawn from the same tokens the Flutter app uses and
   filled with what the backend actually returned. Nothing here is a mock-up of the data: the
   products, the prices, the rails and the reasons under each card all came off /store/*. */

const money = n => "KWD " + Number(n).toFixed(3);
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* Shopify's CDN resizes on request — the app asks for the width it will actually draw, and so does this. */
const img = (url, w) => {
  if (!url) return "";
  try { const u = new URL(url); u.searchParams.set("width", String(w)); return u.toString(); }
  catch { return url; }
};

const ico = {
  search: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
  bag: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7h12l-1 13H7L6 7z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/></svg>',
  bagFill: '<svg width="21" height="21" viewBox="0 0 24 24"><path d="M6 7h12l-1 13H7L6 7z" fill="currentColor"/><path d="M9 7V5a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  heart: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.6-7 9-7 9z"/></svg>',
  heartFill: '<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.6-7 9-7 9z"/></svg>',
  plus: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  minus: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14"/></svg>',
  spark: '<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.2 6.1L20 10l-5.8 1.9L12 18l-2.2-6.1L4 10l5.8-1.9z"/></svg>',
  bolt: '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L4 14h6l-1 8 9-12h-6z"/></svg>',
  tune: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/></svg>',
  back: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
  fwd: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  close: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  chev: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
  chevR: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
  truck: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h10v9H3zM13 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/></svg>',
  home: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/></svg>',
  grid: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/></svg>',
  user: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c1.2-3.6 4-5.2 7-5.2s5.8 1.6 7 5.2"/></svg>',
  check: '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
  phone: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1.1 1A16 16 0 0 1 4 5.1 1 1 0 0 1 5 4z"/></svg>',
  mail: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
  chat: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>',
  pin: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-6-5.3-6-10a6 6 0 1 1 12 0c0 4.7-6 10-6 10z"/><circle cx="12" cy="11" r="2"/></svg>',
  none: '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5M8 11h6"/></svg>',
};


/* The five navigation marks, verbatim from apps/mobile/assets/icons — the Women'secret sprite
   the rest of the app already draws. Kept as the same paths the Flutter bar loads, so the bar
   here and the bar there cannot drift apart. */
const mark = {
  home: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4.25 10.6 12 4.25l7.75 6.35V19a.75.75 0 0 1-.75.75h-4.25v-5.5h-5.5v5.5H5A.75.75 0 0 1 4.25 19v-8.4Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  tag: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.412c0 .331.132.649.366.883l8.01 8.01a1.25 1.25 0 0 0 1.768 0l6.411-6.411a1.25 1.25 0 0 0 0-1.768l-8.01-8.01a1.25 1.25 0 0 0-.883-.366H4.75ZM2 4.75A2.75 2.75 0 0 1 4.75 2h6.412c.729 0 1.428.29 1.944.805l8.01 8.01a2.75 2.75 0 0 1 0 3.89l-6.412 6.411a2.75 2.75 0 0 1-3.889 0l-8.01-8.01A2.75 2.75 0 0 1 2 11.162V4.75ZM6 7.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" fill="currentColor"/></svg>',
  heart: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.925 4.6c-1.37-.306-2.977.06-4.39 1.498a.75.75 0 0 1-1.07 0C10.052 4.66 8.445 4.294 7.075 4.6c-1.39.311-2.61 1.328-3.2 2.803-1.128 2.82-.011 7.786 8.125 12.484 8.136-4.698 9.253-9.663 8.125-12.484-.59-1.475-1.81-2.492-3.2-2.803Zm4.592 2.246c1.57 3.92-.43 9.658-9.15 14.558a.75.75 0 0 1-.734 0c-8.72-4.9-10.72-10.637-9.15-14.558.767-1.918 2.374-3.287 4.264-3.71C8.466 2.753 10.36 3.164 12 4.55c1.64-1.386 3.534-1.797 5.253-1.412 1.89.422 3.497 1.791 4.264 3.709Z" fill="currentColor"/></svg>',
  heartFilled: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12.367 21.404c8.72-4.9 10.719-10.637 9.15-14.558-.767-1.918-2.375-3.287-4.265-3.71-1.718-.383-3.613.027-5.252 1.414-1.64-1.387-3.535-1.797-5.253-1.413-1.89.422-3.498 1.791-4.265 3.709-1.569 3.921.43 9.659 9.15 14.558a.75.75 0 0 0 .735 0Z" fill="currentColor"/></svg>',
  bag: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2C9.8 2 8 3.8 8 6v1h-.025a2.757 2.757 0 0 0-2.72 2.348l-1.407 9.5C3.604 20.495 4.903 22 6.568 22h10.864c1.665 0 2.965-1.505 2.72-3.152l-1.408-9.5A2.76 2.76 0 0 0 16.024 7H16V6c0-2.2-1.8-4-4-4Zm0 1.5c1.39 0 2.5 1.11 2.5 2.5v1h-5V6c0-1.39 1.11-2.5 2.5-2.5Zm-4.025 5h8.048c.625 0 1.147.448 1.239 1.066l1.406 9.5a1.236 1.236 0 0 1-1.236 1.434H6.568c-.777 0-1.35-.665-1.236-1.434l1.406-9.5A1.241 1.241 0 0 1 7.975 8.5Z" fill="currentColor"/></svg>',
  user: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 3.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-4.5 3a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM12 14c-3.06 0-5.364 1.803-6.314 4.373a.715.715 0 0 0 .133.74c.186.223.504.387.878.387h10.606c.373 0 .692-.164.878-.386a.714.714 0 0 0 .133-.741C17.364 15.803 15.06 14 12 14Zm-7.721 3.853c1.156-3.127 4-5.353 7.72-5.353 3.723 0 6.565 2.226 7.722 5.353a2.213 2.213 0 0 1-.391 2.225 2.648 2.648 0 0 1-2.027.922H6.697a2.648 2.648 0 0 1-2.027-.922 2.213 2.213 0 0 1-.391-2.225Z" fill="currentColor"/></svg>',
};

/* ---------- shared pieces ---------- */

const card = (p, reason, opts = {}) => {
  const off = p.original > p.price;
  const pct = off ? Math.round((p.original - p.price) / p.original * 100) : 0;
  return `<div class="card">
    <div class="shot">
      <img loading="lazy" src="${esc(img(p.thumbnail || p.images[0], 340))}" alt="${esc(p.title)}">
      ${off ? `<span class="pill sale">-${pct}%</span>` : (p.isNew ? `<span class="pill">new</span>` : "")}
      ${p.soldOut ? `<span class="sold"><span class="pill flat">Sold out</span></span>` : ""}
      <span class="heart${opts.saved ? " on" : ""}">${opts.saved ? ico.heartFill : ico.heart}</span>
      ${p.soldOut ? "" : `<span class="quick">${ico.plus}</span>`}
    </div>
    <div class="brand">${esc(p.brand)}</div>
    <div class="name">${esc(p.title)}</div>
    <div class="money${off ? " off" : ""}"><b class="price">${money(p.price)}</b>${off ? `<s class="price">${money(p.original)}</s>` : ""}</div>
    ${reason ? `<div class="why">${ico.spark}<span>${esc(reason)}</span></div>` : ""}
  </div>`;
};

const rail = (key, opts = {}) => {
  const s = (opts.from || D.rails)[key];
  if (!s || !s.products.length) return "";
  const title = opts.title !== undefined ? opts.title : s.title;
  return `${title ? `<div class="head"><h3>${esc(title)}</h3></div>` : ""}
    ${s.subtitle ? `<div class="pad" style="margin:-10px 0 14px;font-size:12.5px;color:var(--ink40)">${esc(s.subtitle)}</div>` : ""}
    <div class="rail">${s.products.map(p => card(p, p.reason)).join("")}</div>`;
};

const topbar = (bag = 2) => `<div class="bar">
  <span class="wordmark">LABESNY</span>
  <button class="lang">ع</button>
  <button class="icon-btn">${ico.search}</button>
  <button class="icon-btn bag-dot">${ico.bag}${bag ? `<em>${bag}</em>` : ""}</button>
</div>`;

const titlebar = (title, bag = 2) => `<div class="bar">
  <h3>${esc(title)}</h3>
  <button class="icon-btn">${ico.search}</button>
  <button class="icon-btn bag-dot">${ico.bag}${bag ? `<em>${bag}</em>` : ""}</button>
</div>`;

const pagebar = (title, rtl) => `<div class="page-bar">
  <span>${rtl ? ico.fwd : ico.back}</span><h3>${esc(title)}</h3>
</div>`;

const tabbar = (active, rtl) => {
  const L = rtl
    ? { home: "الرئيسية", shop: "تسوقي", saved: "المفضلة", bag: "السلة", account: "حسابي" }
    : { home: "Home", shop: "Shop", saved: "Saved", bag: "Bag", account: "Account" };
  const items = [
    ["home", mark.home, mark.home, 0],
    ["shop", mark.tag, mark.tag, 0],
    ["saved", mark.heart, mark.heartFilled, 4],
    ["bag", mark.bag, mark.bag, 2],
    ["account", mark.user, mark.user, 0],
  ];
  const item = ([k, off, on, badge]) => {
    const is = k === active;
    return `<span class="nav-item${is ? " on" : ""}"><span class="mark">${is ? on : off}${badge ? `<em>${badge}</em>` : ""}</span><b>${L[k]}</b><i></i></span>`;
  };
  return `<nav class="navbar">${items.map(item).join("")}</nav>`;
};

const meter = (subtotal, threshold = 20) => {
  const left = threshold - subtotal, done = left <= 0;
  return `<div class="meter${done ? " done" : ""}">
    <div class="r">${ico.truck}<span>${done ? "Delivery is on us" : money(left) + " away from free delivery"}</span></div>
    <div class="track"><i style="width:${Math.min(100, subtotal / threshold * 100).toFixed(0)}%"></i></div>
  </div>`;
};

const bagLine = (p, qty = 1, size = "M") => `<div class="line">
  <div class="t"><img loading="lazy" src="${esc(img(p.thumbnail, 190))}" alt=""></div>
  <div class="m">
    <div class="n">${esc(p.title)}</div>
    <div class="s">Size ${size}</div>
    <div style="display:flex;align-items:center">
      <span class="stepper"><button>${qty <= 1 ? ico.minus : ico.minus}</button><b class="price">${qty}</b><button>${ico.plus}</button></span>
      <b class="price" style="margin-inline-start:auto;font-size:14px">${money(p.price * qty)}</b>
    </div>
  </div>
</div>`;

/* The two products standing in for a filled bag, and what they come to. */
const inBag = () => [D.plp.products[2], D.plp.products[5]];
const bagSubtotal = () => inBag().reduce((s, p) => s + p.price, 0);

/* ---------- screens ---------- */

const home = (rtl) => {
  const t = rtl
    ? { kick: "خريف / شتاء 2026", head: "البسي\nبثقة.", body: "ويمن سيكريت وإيتام وتوم تيلور وسيليو وأربعة عشر غيرها — توصيل لكل الكويت خلال 48 ساعة.", a: "تسوقي الجديد", b: "شوفي التخفيضات", by: "تسوقي حسب", dep: "الأقسام", saleK: "التخفيضات", saleH: "خصم يصل إلى 70٪ لفترة محدودة", saleP: "تخفيضات على كل الأقسام من الماركات اللي تعرفينها.", saleB: "تسوقي التخفيضات", hK: "الماركات", hT: "كل الماركات", all: "عرض الكل", rooms: ["نساء", "رجال", "أطفال", "لانجيري"], promises: ["توصيل خلال 48 ساعة", "مجاني فوق 20 د.ك", "استبدال خلال 14 يوم", "كي نت والبطاقات", "18 ماركة عالمية"] }
    : { kick: "Autumn / Winter 2026", head: "Dress like\nyou mean it.", body: "Women'secret, Etam, Tom Tailor, Celio and fourteen more — delivered anywhere in Kuwait in 48 hours.", a: "Shop new in", b: "See the sale", by: "Shop by", dep: "Departments", saleK: "The sale", saleH: "Up to 70% off, while it lasts", saleP: "Marked down across the board, from the brands you know.", saleB: "Shop the sale", hK: "The houses", hT: "Every brand", all: "View all", rooms: ["Women", "Men", "Kids", "Lingerie"], promises: ["48-hour delivery", "Free over KWD 20", "14-day exchanges", "KNET and cards", "18 international houses"] };
  const rails = rtl ? D.railsAr : D.rails;

  return `${topbar()}
<div class="ticker"><div class="run">${[...t.promises, ...t.promises].map(s => `<b>${esc(s)}</b><i></i>`).join("")}</div></div>
<div class="hero">
  <img src="hero.jpg" alt="">
  <div class="scrim"></div>
  <div class="copy">
    <span class="lbl">${esc(t.kick)}</span>
    <h2 class="display">${esc(t.head)}</h2>
    <p>${esc(t.body)}</p>
    <div class="cta"><button class="btn paper">${esc(t.a)}</button><button class="btn clay">${esc(t.b)}</button></div>
    <div class="dots"><i class="on"></i><i></i></div>
  </div>
</div>
<div style="height:34px"></div>
<div class="head"><span><span class="lbl">${esc(t.by)}</span><h3 style="margin-top:7px">${esc(t.dep)}</h3></span></div>
<div class="rooms">${["cat_women.jpg", "cat_men.jpg", "cat_kids.jpg", "cat_lingerie.jpg"]
    .map((f, i) => `<a><img loading="lazy" src="${f}" alt=""><span class="g"></span><b>${esc(t.rooms[i])}</b></a>`).join("")}</div>
${rail("home_new", { from: rails })}
<div class="sale-block">
  <span class="lbl">${esc(t.saleK)}</span>
  <h3>${esc(t.saleH)}</h3>
  <p>${esc(t.saleP)}</p>
  <button class="btn clay">${esc(t.saleB)}</button>
</div>
${rail("home_sale", { from: rails })}
<div class="head"><span><span class="lbl">${esc(t.hK)}</span><h3 style="margin-top:7px">${esc(t.hT)}</h3></span><span class="link">${esc(t.all)} ${rtl ? "‹" : "›"}</span></div>
<div class="brands">${D.brands.slice(0, 14).map(b => `<span>${esc(b)}</span>`).join("")}</div>
${rail("home_trending", { from: rails })}
${footer(rtl)}
${tabbar("home", rtl)}`;
};

const footer = (rtl) => {
  const t = rtl
    ? { tag: "ثمانية عشر ماركة. سلة واحدة. الكويت.", cs: "خدمة العملاء", legal: "الشؤون القانونية", links: ["الأسئلة الشائعة", "التوصيل", "الاستبدال والإرجاع", "دليل المقاسات", "تواصلي معنا"], legals: ["عن لبسني", "شروط الخدمة", "الخصوصية"], hours: "يومياً من 9 صباحاً حتى 9 مساءً" }
    : { tag: "Eighteen houses. One bag. Kuwait.", cs: "Customer service", legal: "Legal", links: ["Common questions", "Delivery", "Returns & exchanges", "Size guide", "Contact us"], legals: ["About Labesny", "Terms of service", "Privacy"], hours: "Every day, 9am to 9pm" };
  return `<footer>
  <div class="mark">LABESNY</div>
  <div class="tag">${esc(t.tag)}</div>
  <span class="lbl">${esc(t.cs)}</span>
  ${t.links.map(l => `<a>${esc(l)}</a>`).join("")}
  <span class="lbl" style="margin-top:20px">${esc(t.legal)}</span>
  ${t.legals.map(l => `<a>${esc(l)}</a>`).join("")}
  <div class="fine">+965 696 12 272 · online@dagher-hinnawi.com</div>
  <div class="fine" style="margin-top:6px">${esc(t.hours)}</div>
  <div class="fine" style="color:var(--ink60);margin-top:22px">© 2026 Labesny</div>
</footer>`;
};

const collectionBody = (n = 14) => `
<div class="chips">${["All", "Women", "Men", "Kids", "Lingerie", "Sale"].map((c, i) => `<span class="${i === 1 ? "on" : ""}">${c}</span>`).join("")}</div>
<div class="filterbar">
  <div><h3>Women</h3><small>${D.plp.count.toLocaleString()} products</small></div>
  <button class="refine">${ico.tune} Refine</button>
</div>
<div class="grid">${D.plp.products.slice(0, n).map(p => card(p)).join("")}</div>`;

const collection = () => `${topbar()}${collectionBody()}${tabbar("shop")}`;

const filters = () => `${topbar()}${collectionBody(4)}${tabbar("shop")}
<div class="over">
  <div class="sheet" style="height:88%">
    <div class="grip"></div>
    <div class="drawer-head"><h3>Filter and sort</h3><span style="color:var(--ink60)">${ico.close}</span></div>
    <div class="body">
      <div class="facet">
        <div class="t">Sort by ${ico.chev}</div>
        <div style="margin-top:8px">
          ${[["Newest", true], ["Lowest price", false], ["Highest price", false]]
    .map(([l, on]) => `<div class="sortopt${on ? " on" : ""}"><span class="dot"></span>${l}</div>`).join("")}
        </div>
      </div>
      <div class="facet">
        <div class="t">Size ${ico.chev}</div>
        <div class="opts">${D.plp.facets.sizes.slice(0, 12).map((s, i) => `<span class="${i === 2 ? "on" : ""}">${esc(s)}</span>`).join("")}</div>
      </div>
      <div class="facet">
        <div class="t">Brand ${ico.chev}</div>
        <div class="opts">${D.plp.facets.brands.slice(0, 8).map(b => `<span>${esc(b.title)} <small style="color:var(--ink40)">${b.count}</small></span>`).join("")}</div>
      </div>
      <div class="facet">
        <div class="t">Colour ${ico.chev}</div>
        <div class="opts">${D.plp.facets.colours.slice(0, 10).map(c => `<span>${esc(c)}</span>`).join("")}</div>
      </div>
      <div class="facet" style="border:0">
        <div class="t">Price ${ico.chev}</div>
        <div style="display:flex;gap:10px;margin-top:14px">
          <div class="field" style="flex:1;margin:0"><label>From</label><div class="inp ph">KWD 0</div></div>
          <div class="field" style="flex:1;margin:0"><label>To</label><div class="inp ph">KWD ${Math.ceil(D.plp.facets.maxPrice)}</div></div>
        </div>
      </div>
    </div>
    <div class="foot" style="display:flex;gap:10px">
      <button class="btn ghost" style="flex:1">Clear filters</button>
      <button class="btn ink" style="flex:2">View 412 results</button>
    </div>
  </div>
</div>`;

const product = (withSheet) => {
  const p = D.pdp;
  const off = p.original > p.price;
  const look = D.rails.pdp_complete_look;
  const partners = look ? look.products.slice(0, 2) : [];
  const total = p.price + partners.reduce((s, x) => s + x.price, 0);
  return `
<div class="gallery">
  <div class="strip">${p.images.map(u => `<img loading="lazy" src="${esc(img(u, 820))}" alt="">`).join("")}</div>
  <span class="back">${ico.back}</span>
  <span class="count price">1 / ${p.images.length}</span>
</div>
<div class="pdp-head">
  <div style="display:flex;align-items:flex-start;gap:8px">
    <div style="flex:1">
      <div class="brand">${esc(p.brand)}</div>
      <h2>${esc(p.title)}</h2>
    </div>
    <span style="color:var(--clay)">${ico.heartFill}</span>
  </div>
  <div style="display:flex;align-items:center;gap:10px">
    <b class="price" style="font-size:22px;color:${off ? "var(--sale)" : "var(--ink)"}">${money(p.price)}</b>
    ${off ? `<s class="price" style="font-size:17.6px;color:var(--ink40);font-weight:400">${money(p.original)}</s>
             <span class="pill sale flat">-${Math.round((p.original - p.price) / p.original * 100)}%</span>` : ""}
  </div>
  ${p.colour ? `<div style="margin-top:14px;font-size:13px;color:var(--ink60)">Colour: ${esc(p.colour)}</div>` : ""}
  <div style="display:flex;align-items:center;margin-top:24px">
    <span class="lbl" style="color:var(--ink)">Size</span>
    <span style="margin-inline-start:auto;font-size:12.5px;font-weight:600;color:var(--clay)">Size guide</span>
  </div>
  <div class="sizes">${p.variants.map((v, i) => `<b class="${v.stock <= 0 ? "out" : (i === 0 ? "on" : "")}">${esc(v.title)}</b>`).join("")}</div>
  ${p.variants.some(v => v.stock > 0 && v.stock <= 8) ? `<div class="low">${ico.bolt} Only a few left</div>` : ""}
  <div style="height:26px"></div>
</div>
<div class="bundle">
  <h4>${ico.spark} Buy it together</h4>
  ${[{ title: p.title, brand: "This piece", thumbnail: p.images[0], price: p.price, sizes: p.variants.map(v => v.title) }]
      .concat(partners.map(x => ({ title: x.title, brand: x.brand, thumbnail: x.thumbnail, price: x.price, sizes: ["S", "M", "L"] })))
      .map((x, i, all) => `
      <div class="brow">
        <div class="t"><img loading="lazy" src="${esc(img(x.thumbnail, 170))}" alt=""></div>
        <div class="meta">
          <div class="k">${esc(x.brand)}</div>
          <div class="n">${esc(x.title)}</div>
          <b class="price" style="font-size:13px">${money(x.price)}</b>
          <div class="mini">${x.sizes.slice(0, 4).map((s, j) => `<b class="${j === 0 ? "on" : ""}">${esc(s)}</b>`).join("")}</div>
        </div>
      </div>
      ${i < all.length - 1 ? `<div class="plus"><hr>${ico.plus}<hr></div>` : ""}`).join("")}
  <div class="total"><span>Together</span><b class="price">${money(total)}</b>
    <button class="btn ink sm" style="margin-inline-start:auto">Add all ${partners.length + 1}</button></div>
</div>
${rail("pdp_complete_look")}
<div class="pad" style="padding-bottom:30px">
  <div class="fold"><div class="t">Description ${ico.chev}</div><p>${esc(p.description || "Cut to sit flat, from the brand's own line.")}</p></div>
  <div class="fold"><div class="t">Shipping ${ico.chev}</div>
    <ul><li>· We deliver everywhere in Kuwait.</li><li>· Orders arrive within 48 hours on working days, and within 72 hours over a weekend.</li><li>· There is no delivery on Fridays.</li></ul></div>
  <div class="fold"><div class="t">Returns ${ico.chev}</div>
    <ul><li>· You have 14 days from the date of purchase to exchange or take a full refund.</li><li>· Bring the purchase invoice.</li></ul></div>
</div>
${rail("pdp_related")}
${rail("pdp_upgrade")}
<div class="buybar">
  <b class="price" style="font-size:17px;color:${off ? "var(--sale)" : "var(--ink)"}">${money(p.price)}</b>
  <button class="btn ink" style="flex:1">Add to bag</button>
</div>
${withSheet ? sizeSheet() : ""}`;
};

const sizeSheet = () => {
  const p = D.plp.products[0];
  return `<div class="over">
  <div class="sheet">
    <div class="grip"></div>
    <div class="pad" style="padding-top:14px">
      <div style="display:flex;gap:13px">
        <div class="t" style="width:62px;aspect-ratio:3/4;border-radius:var(--r-sm);overflow:hidden;flex:none">
          <img src="${esc(img(p.thumbnail, 170))}" alt="" style="width:100%;height:100%;object-fit:cover">
        </div>
        <div style="flex:1;min-width:0">
          <div class="lbl" style="font-size:10px">${esc(p.brand)}</div>
          <div style="font-size:14px;font-weight:600;margin:5px 0 7px">${esc(p.title)}</div>
          <b class="price" style="font-size:15px">${money(p.price)}</b>
        </div>
      </div>
      <div class="lbl" style="color:var(--ink);margin-top:20px">Choose a size</div>
      <div class="sizes">${["XS", "S", "M", "L", "XL"].map((s, i) => `<b class="${i === 2 ? "on" : ""}${i === 4 ? " out" : ""}">${s}</b>`).join("")}</div>
      <div style="height:20px"></div>
      <button class="btn ink block">Add to bag</button>
    </div>
  </div>
</div>`;
};

const quickAdd = () => `${topbar()}${collectionBody(4)}${tabbar("shop")}${sizeSheet()}`;

const bagDrawer = () => {
  const items = inBag(), sub = bagSubtotal();
  return `${topbar()}${collectionBody(4)}${tabbar("shop")}
<div class="over">
  <div class="sheet" style="height:80%">
    <div class="grip"></div>
    <div class="drawer-head"><h3>In your bag (${items.length})</h3><span style="color:var(--ink60)">${ico.close}</span></div>
    <div class="body">
      ${meter(sub)}
      ${items.map(p => bagLine(p)).join("")}
      <div style="height:22px"></div>
      ${rail("cart_upsell")}
    </div>
    <div class="foot">
      <div class="sum"><span>Subtotal</span><b class="price">${money(sub)}</b></div>
      <div style="display:flex;gap:10px">
        <button class="btn outline" style="flex:1">View bag</button>
        <button class="btn ink" style="flex:2">Go to checkout</button>
      </div>
    </div>
  </div>
</div>`;
};

const bagPage = () => {
  const items = inBag(), sub = bagSubtotal();
  const delivery = sub >= 20 ? 0 : 2;
  return `${titlebar("Your bag")}
${meter(sub)}
${items.map(p => bagLine(p)).join("")}
<div style="height:14px"></div>
${rail("cart_filler")}
${rail("cart_upsell")}
<div class="box">
  <span class="lbl" style="color:var(--ink)">Order summary</span>
  <div style="height:10px"></div>
  <div class="row"><span>Subtotal</span><b class="price">${money(sub)}</b></div>
  <div class="row${delivery ? "" : " free"}"><span>Delivery</span>${delivery ? `<b class="price">${money(delivery)}</b>` : `<b>Free</b>`}</div>
  <hr class="rule">
  <div class="row big"><span>Total</span><b class="price">${money(sub + delivery)}</b></div>
</div>
<div style="height:24px"></div>
<div class="buybar"><button class="btn ink block">Go to checkout <b class="price" style="color:var(--paper)">${money(sub + delivery)}</b></button></div>
${tabbar("bag")}`;
};

const bagEmpty = () => `${titlebar("Your bag", 0)}
<div class="empty">
  <span style="color:var(--ink20)">${ico.bag}</span>
  <p>Your bag is empty.</p>
  <button class="btn ink sm">Start shopping</button>
</div>
<div style="height:20px"></div>
${rail("bag_empty")}
${tabbar("bag")}`;

const checkout = () => {
  const sub = bagSubtotal(), delivery = sub >= 20 ? 0 : 2;
  return `${pagebar("Checkout")}
<div class="pad"><span class="lbl" style="color:var(--ink)">Contact</span></div>
<div style="height:12px"></div>
<div class="field"><label>Full name</label><div class="inp">Dana Al-Sabah</div></div>
<div class="field"><label>Mobile number</label><div class="inp">555 12345</div></div>
<div class="field"><label>Email</label><div class="inp">dana@example.com</div></div>
<div style="height:14px"></div>
<div class="pad"><span class="lbl" style="color:var(--ink)">Deliver to</span></div>
<div style="height:12px"></div>
<div class="field"><label>Governorate</label><div class="inp">Hawalli</div></div>
<div class="field"><label>Area</label><div class="inp">Salmiya</div></div>
<div style="display:flex;gap:10px;padding:0 var(--gutter)">
  <div class="field" style="flex:1;margin:0 0 12px"><label>Block</label><div class="inp">3</div></div>
  <div class="field" style="flex:1;margin:0 0 12px"><label>Street</label><div class="inp">12</div></div>
  <div class="field" style="flex:1;margin:0 0 12px"><label>Building</label><div class="inp">7</div></div>
</div>
<div class="field"><label>Floor / flat (optional)</label><div class="inp ph">Flat 4</div></div>
<div style="height:14px"></div>
<div class="pad"><span class="lbl" style="color:var(--ink)">Payment</span></div>
<div style="height:12px"></div>
<div class="pay on"><span class="dot"></span><div><b>KNET or card</b><small>You pay securely on MyFatoorah's own page.</small></div></div>
<div class="pay"><span class="dot"></span><div><b>Cash on delivery</b><small>Pay the courier when your order arrives.</small></div></div>
<div class="box">
  <div class="row"><span>Subtotal</span><b class="price">${money(sub)}</b></div>
  <div class="row${delivery ? "" : " free"}"><span>Delivery</span>${delivery ? `<b class="price">${money(delivery)}</b>` : `<b>Free</b>`}</div>
  <hr class="rule">
  <div class="row big"><span>Total</span><b class="price">${money(sub + delivery)}</b></div>
</div>
<div style="height:24px"></div>
<div class="buybar"><button class="btn ink block">Place order</button></div>`;
};

const placed = () => {
  const sub = bagSubtotal(), delivery = sub >= 20 ? 0 : 2;
  return `<div style="padding:60px var(--gutter) 0;text-align:center">
  <span style="color:var(--good)">${ico.check}</span>
  <div class="lbl" style="margin-top:18px">Thank you</div>
  <h2 class="display" style="font-size:30px;margin-top:10px">Your order is placed</h2>
  <p style="font-size:14px;color:var(--ink60);margin-top:12px;line-height:1.55">
    Order <b class="price">#1042</b> — ${money(sub + delivery)}. We will call you to confirm, and deliver within 48 hours.</p>
</div>
<div style="height:38px"></div>
${rail("post_purchase")}
<div class="pad"><button class="btn outline block">Keep shopping</button></div>
<div style="height:30px"></div>`;
};

const saved = () => {
  const items = D.plp.products.slice(1, 5);
  return `${titlebar("Saved")}
<div class="grid">${items.map(p => card(p, null, { saved: true })).join("")}</div>
<div style="height:20px"></div>
${rail("saved_similar")}
${tabbar("saved")}`;
};

const searchScreen = () => `<div class="page-bar">
  <span>${ico.back}</span>
  <div style="flex:1;background:var(--paper-deep);border-radius:var(--r-pill);padding:11px 14px;display:flex;align-items:center;gap:9px">
    <span style="color:var(--ink40)">${ico.search}</span>
    <span style="font-size:15px;font-weight:500">lace</span>
    <span style="margin-inline-start:auto;color:var(--ink60)">${ico.close}</span>
  </div>
</div>
<div class="pad" style="padding-top:8px;padding-bottom:14px"><span class="lbl">${D.search.count.toLocaleString()} products</span></div>
<div class="grid">${D.search.products.slice(0, 8).map(p => card(p)).join("")}</div>`;

const searchZero = () => `<div class="page-bar">
  <span>${ico.back}</span>
  <div style="flex:1;background:var(--paper-deep);border-radius:var(--r-pill);padding:11px 14px;display:flex;align-items:center;gap:9px">
    <span style="color:var(--ink40)">${ico.search}</span>
    <span style="font-size:15px;font-weight:500">cashmere poncho</span>
    <span style="margin-inline-start:auto;color:var(--ink60)">${ico.close}</span>
  </div>
</div>
<div class="pad" style="padding:30px var(--gutter)">
  <h2 class="display" style="font-size:22px">Nothing found for "cashmere poncho"</h2>
</div>
${rail("search_zero")}
${rail("home_trending")}`;

const account = () => `${titlebar("Account")}
<div style="padding:8px var(--gutter) 22px">
  <div class="lbl">Hello</div>
  <h2 class="display" style="font-size:28px;margin-top:8px">Dana Al-Sabah</h2>
</div>
<div class="clubcard">
  <span class="lbl">${esc(D.club.name)}</span>
  <div class="pts">1,240</div>
  <div class="worth">Worth about ${money(1240 * D.club.perUnit)}</div>
  <div class="track"><i style="width:24.8%"></i></div>
  <div class="next">3,760 points to reach Silver</div>
</div>
${[["My orders", "3 orders"], ["Saved items", "4 pieces"], ["Delivery", "Kuwait, 48 hours"], ["Returns & exchanges", "14 days"],
  ["Common questions", ""], ["Size guide", ""], ["Contact us", "+965 696 12 272"], ["About Labesny", ""], ["Terms of service", ""], ["Privacy", ""]]
    .map(([l, s]) => `<div class="rowlink"><div class="tx"><b>${l}</b>${s ? `<small>${s}</small>` : ""}</div><span style="color:var(--ink20)">${ico.chevR}</span></div>`).join("")}
<div style="padding:24px var(--gutter) 30px"><button class="btn outline block">Sign out</button></div>
${tabbar("account")}`;

const club = () => `${pagebar(D.club.name)}
<div class="clubcard">
  <span class="lbl">Your balance</span>
  <div class="pts">1,240</div>
  <div class="worth">Worth about ${money(1240 * D.club.perUnit)}</div>
  <div class="track"><i style="width:24.8%"></i></div>
  <div class="next">3,760 points to reach Silver</div>
</div>
<div class="pad"><span class="lbl" style="color:var(--ink)">Rewards</span></div>
${D.club.rewards.map(r => `<div class="reward">
  <div class="tx"><b>${esc(r.title)}</b><small>${esc(r.desc || "")}</small></div>
  <button class="btn ${r.cost <= 1240 ? "ink" : "outline"} sm" ${r.cost <= 1240 ? "" : "disabled"}>${r.cost} pts</button>
</div>`).join("")}
<div style="height:26px"></div>
<div class="pad"><span class="lbl" style="color:var(--ink)">Levels</span></div>
${D.club.tiers.map(t => `<div class="tier">
  <span class="dot"></span>
  <div><b>${esc(t.name)}</b><small>From ${t.at.toLocaleString()} points${t.mult > 1 ? ` · earns ${t.mult}×` : ""}</small></div>
</div>`).join("")}
<div style="height:40px"></div>`;

const brands = () => `${pagebar("Every brand")}
${D.brands.map(b => `<div class="rowlink"><div class="tx"><b class="display" style="font-size:22px;font-weight:700">${esc(b)}</b></div><span style="color:var(--ink20)">${ico.chevR}</span></div>`).join("")}
<div style="height:40px"></div>`;

const returnsPage = () => `${pagebar("Returns and exchanges")}
<div class="doc">
  <p class="lead">Fourteen days, at the brand's store, with the invoice.</p>
  <h4>The rules</h4>
  <ul>${["You have 14 days from the date of purchase to exchange or take a full refund.",
    "Items must be unused and in their original condition, with labels, tags and instructions still attached.",
    "Bring the purchase invoice.",
    "Underwear and lingerie — bras and briefs — cannot be exchanged or refunded.",
    "Returns are accepted only at the brand's own stores in the major malls across Kuwait.",
    "The money goes back the way it came. Cash refunds are given in person at the store; a card refund can take up to 7 working days to reach your account."]
    .map(s => `<li><i></i><span>${s}</span></li>`).join("")}</ul>
  <h4>Cancelling an order</h4>
  <ul>${["Call customer service on +965 696 12 272 during working hours, or email online@dagher-hinnawi.com.",
    "Outside working hours, send a WhatsApp to the same number; customer service will call you back to complete the cancellation form."]
    .map(s => `<li><i></i><span>${s}</span></li>`).join("")}</ul>
</div>`;

const faq = () => `${pagebar("Common questions")}
<div class="pad" style="padding-bottom:50px">
  ${[["When will my order arrive?", "Within 48 hours on a working day, and within 72 hours over a weekend. There is no delivery on Fridays.", true],
    ["How much is delivery?", "Free over KWD 20. Under that it is KWD 2.", false],
    ["How can I pay?", "KNET, or a Visa or Mastercard. There is no cash on delivery — the same as in the brands' own stores.", false],
    ["Can I change or return something?", "", false],
    ["Do you deliver outside Kuwait?", "", false],
    ["Is my size going to fit?", "", false],
    ["How do I cancel an order?", "", false],
    ["What is Labesny Club?", "", false]]
    .map(([q, a, open]) => `<div class="qa">
      <div class="q">${q}<span>${open ? ico.close : ico.plus}</span></div>
      ${open && a ? `<div class="a">${a}</div>` : ""}
    </div>`).join("")}
</div>`;

const contact = () => `${pagebar("Contact us")}
<div class="pad" style="padding-top:4px;padding-bottom:22px">
  <h2 class="display" style="font-size:24px">Every day, 9am to 9pm</h2>
</div>
${[[ico.phone, "Call", "+965 696 12 272"], [ico.chat, "WhatsApp", "+965 696 12 272"],
  [ico.mail, "Email", "online@dagher-hinnawi.com"], [ico.mail, "Customer service", "customer-service@labesny.com"],
  [ico.pin, "Address", "10th Floor, Al Bahar Center, Hawally, Kuwait"]]
    .map(([i, l, s]) => `<div class="rowlink"><span style="color:var(--ink60)">${i}</span><div class="tx"><b>${l}</b><small>${s}</small></div><span style="color:var(--ink20)">${ico.chevR}</span></div>`).join("")}
<div class="pad" style="padding-top:26px">
  <p style="font-size:13.5px;color:var(--ink40);line-height:1.6">Fourteen days, at the brand's store, with the invoice.</p>
</div>`;

const popupOf = (key, behind) => {
  const c = D.popups.find(x => x.key === key) || D.popups[0];
  return `${behind}
<div class="over">
  <div class="sheet">
    <div class="grip"></div>
    <div class="pad">
      <div class="accent" style="background:${esc(c.accent || "#C2654F")}"></div>
      <h3 style="font-size:27px">${esc(c.title)}</h3>
      <p style="font-size:14.5px;color:var(--ink60);line-height:1.5;margin-top:10px">${esc(c.body)}</p>
    </div>
    ${c.reco_slot ? rail(c.reco_slot, { title: "" }) : `<div style="height:26px"></div>`}
    <div class="pad" style="display:flex;gap:8px">
      <button class="btn ghost" style="flex:1">${esc(c.dismiss || "Not now")}</button>
      <button class="btn ink" style="flex:2">${esc(c.cta || "See it")}</button>
    </div>
  </div>
</div>`;
};

const homeBehind = () => `${topbar()}
<div class="ticker"><div class="run">${["48-hour delivery", "Free over KWD 20", "14-day exchanges"].map(s => `<b>${s}</b><i></i>`).join("")}</div></div>
<div class="hero" style="height:430px"><img src="hero.jpg" alt=""><div class="scrim"></div>
  <div class="copy"><span class="lbl">Autumn / Winter 2026</span><h2 class="display">Dress like
you mean it.</h2></div></div>`;

const toastScreen = () => {
  const c = D.popups.find(x => x.key === "still_deciding");
  return `${topbar()}${collectionBody(6)}${tabbar("shop")}
<div class="toast">
  <div class="tx"><b>${esc(c.title)}</b><p>${esc(c.body)}</p></div>
  <a>${esc(c.cta)}</a>
</div>`;
};

/* ---------- the workbench ---------- */

const SCREENS = [
  ["Browse", [
    ["Home", () => home(false), "Hero, departments, then the rails. Every product and the line under it came from the recommendation engine, not from a list in the app."],
    ["Collection", collection, "1,755 products in Women, paged 24 at a time. The bar sticks; the grid loads a screen ahead of your thumb."],
    ["Filter and sort", filters, "The drawer, built from the facets the backend returns for this selection — 127 sizes, 167 colours, 16 brands, all real."],
    ["Search", searchScreen, "420 matches for \"lace\", answered from the catalogue view rather than Medusa's product list."],
    ["Nothing found", searchZero, "A search that finds nothing falls through to a slot instead of a dead end — the words typed are still the best clue anyone has."],
    ["Brands", brands, "All eighteen labels the catalogue actually carries, alphabetical."],
  ]],
  ["Product", [
    ["Product page", () => product(false), "Swipeable gallery, sticky buy bar, and the bundle: this piece plus what the shop thinks completes it, each with its own size, added in one tap."],
    ["Quick add", quickAdd, "The size sheet over the grid. Choosing a size hands straight to the bag drawer, so buying a t-shirt is one screen rather than three."],
  ]],
  ["Buying", [
    ["Bag drawer", bagDrawer, "What comes up on every add. The meter is the real KWD 20 threshold; the rail under it reads the basket."],
    ["Bag", bagPage, "The full page. Same line and meter widgets as the drawer, so the two cannot drift apart."],
    ["Empty bag", bagEmpty, "The one shopper most worth helping: their own history and the brands they keep opening, not a generic best-seller shelf."],
    ["Checkout", checkout, "Kuwaiti addressing — governorate, area, block, street, building. KNET and card first, because that is what the real shop takes."],
    ["Order placed", placed, "And the one rail that excludes what they have already bought."],
  ]],
  ["You", [
    ["Saved", saved, "Kept on the device for now; the backend module and its routes are waiting."],
    ["Account", account, "The club card up top, then everything else as one quiet list."],
    ["Labesny Club", club, "Three levels and four rewards, all seeded in the backend and all editable there."],
  ]],
  ["Pages", [
    ["Returns", returnsPage, "Word for word from labesny.com. Eight pages like this, every one of them in Arabic too."],
    ["Questions", faq, "The eight things people actually ask, opening one at a time."],
    ["Contact", contact, "Every line is a thing you can press — call, WhatsApp, email."],
  ]],
  ["Moments", [
    ["Welcome", () => popupOf("welcome", homeBehind()), "Fires after a delay on a first run, once, then not again. Wording, colour, cap and cooldown are all rows in the admin."],
    ["Free delivery nudge", () => popupOf("free_delivery_nudge", `${topbar()}${collectionBody(4)}${tabbar("shop")}`), "Raised when the basket is within KWD 5 of the line — and it carries the filler rail, so it is help rather than a pitch."],
    ["Still deciding", toastScreen, "A toast after six products in ten minutes. The quietest of the four shapes a campaign can take."],
  ]],
  ["Arabic", [
    ["Home in Arabic", () => home(true), "The whole app mirrors: the bar, the rails, the ticker, the chevrons. Noto Kufi replaces the display face and the tracking comes off."],
  ]],
];

const nav = document.getElementById("nav");
const phone = document.getElementById("phone");
const nameEl = document.getElementById("screen-name");
const noteEl = document.getElementById("screen-note");
const flat = [];

SCREENS.forEach(([group, items]) => {
  const h = document.createElement("div");
  h.className = "grp";
  h.textContent = group;
  nav.appendChild(h);
  items.forEach(([name, render, note]) => {
    const i = flat.length;
    flat.push([name, render, note, group]);
    const b = document.createElement("button");
    b.textContent = name;
    b.onclick = () => show(i);
    nav.appendChild(b);
  });
});

const buttons = () => [...nav.querySelectorAll("button")];


/* The bottom bar, the buy bar and any sheet are not part of the page's scroll in the app — the
   Scaffold keeps them in their own slot and a sheet sits over the navigator. Rendering them
   inside the scroller here meant they scrolled away with the content, so they are lifted out and
   docked to the phone, and the scroller is padded by however tall they came to. */
function dock(view, rtl) {
  // A toast is over the page too, not in it.
  const toast = view.querySelector(":scope > .toast");
  if (toast) phone.appendChild(toast);

  const overlay = view.querySelector(":scope > .over");
  if (overlay) {
    phone.appendChild(overlay);
    if (rtl) overlay.dir = "rtl";
  }

  const bars = [".buybar", ".navbar"]
    .map(sel => view.querySelector(":scope > " + sel))
    .filter(Boolean);
  if (!bars.length) return;

  const docked = document.createElement("div");
  docked.className = "docked";
  if (rtl) docked.dir = "rtl";
  bars.forEach(b => docked.appendChild(b));
  phone.insertBefore(docked, overlay || null);
  view.style.paddingBottom = docked.offsetHeight + "px";
}

function show(i) {
  const [name, render, note, group] = flat[i];
  const rtl = group === "Arabic";
  phone.innerHTML = `<div class="view"${rtl ? ' dir="rtl"' : ""}>${render()}</div>`;
  dock(phone.querySelector(".view"), rtl);
  nameEl.textContent = name;
  noteEl.textContent = note;
  buttons().forEach((b, j) => b.setAttribute("aria-current", String(i === j)));
  location.hash = encodeURIComponent(name);
}

const fromHash = flat.findIndex(([n]) => n === decodeURIComponent(location.hash.slice(1)));
show(fromHash >= 0 ? fromHash : 0);

/* Arrow keys walk the list, which is how anyone actually reviews twenty screens. */
addEventListener("keydown", e => {
  const at = buttons().findIndex(b => b.getAttribute("aria-current") === "true");
  if (e.key === "ArrowDown" || e.key === "ArrowRight") { show(Math.min(flat.length - 1, at + 1)); e.preventDefault(); }
  if (e.key === "ArrowUp" || e.key === "ArrowLeft") { show(Math.max(0, at - 1)); e.preventDefault(); }
});
