import { CATEGORIES, COMPANY, PRODUCTS, type Product } from "../data";

/* ------------------------------------------------------------------
   Catalog / technical datasheet generator
   - Used in the browser for custom (CMS-created) products.
   - Also used by scripts/generate-catalogs.ts to write the permanent
     files inside /public/downloads (committed to this repository).
------------------------------------------------------------------- */

export const STATIC_DOWNLOAD_DIR = "/downloads";

/** Full catalog shipped with the repository. */
export const STATIC_CATALOG_PDF = `${STATIC_DOWNLOAD_DIR}/ARKA-Product-Catalog.pdf`;
export const STATIC_CATALOG_HTML = `${STATIC_DOWNLOAD_DIR}/ARKA-Product-Catalog.html`;

/** Per-product datasheet shipped with the repository. */
export const staticDatasheetPdf = (slug: string) => `${STATIC_DOWNLOAD_DIR}/ARKA-${slug}-datasheet.pdf`;
export const staticDatasheetHtml = (slug: string) => `${STATIC_DOWNLOAD_DIR}/ARKA-${slug}-datasheet.html`;

/** Slugs that have permanently generated files in /public/downloads. */
export const STATIC_DATASHEET_SLUGS = new Set(PRODUCTS.map((p) => p.slug));

export const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

type CatalogOptions = {
  imageBase?: string;
  fontHref?: string;
};

const categoryTitle = (id: string) => CATEGORIES.find((c) => c.id === id)?.title ?? id;

export function buildCatalogHtml(products: Product[], single?: Product, options: CatalogOptions = {}) {
  const imageBase = options.imageBase ?? "/images/";
  const fontHref = options.fontHref ?? "/fonts/fonts.css";
  const list = single ? [single] : products;
  const title = single ? `برگهٔ مشخصات فنی — ${single.name}` : "کاتالوگ محصولات — آرکا صنعت قهوه";
  const date = new Date().toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric" });

  const image = (src: string) => `${imageBase}${src.replace(/^.*\//, "")}`;

  const cards = list
    .map((p, index) => {
      const category = categoryTitle(p.category);
      return `
      <section class="card">
        <div class="card-media">
          <img src="${escapeHtml(image(p.image))}" alt="${escapeHtml(p.name)}" />
          <span class="code">${escapeHtml(p.latin.split("/")[0].trim())}</span>
        </div>
        <div class="card-body">
          <div class="card-head">
            <div>
              <p class="latin">${escapeHtml(p.latin)}</p>
              <h2>${escapeHtml(p.name)}</h2>
              <p class="cat">${escapeHtml(category)} ${p.badge ? `· ${escapeHtml(p.badge)}` : ""}</p>
            </div>
            <div class="cap">
              <span>ظرفیت</span>
              <strong>${escapeHtml(p.capacity)}</strong>
            </div>
          </div>
          <p class="desc">${escapeHtml(p.description)}</p>
          <div class="cols">
            <div>
              <h3>مشخصات فنی</h3>
              <table>
                ${p.specs.map((s) => `<tr><td>${escapeHtml(s.label)}</td><td>${escapeHtml(s.value)}</td></tr>`).join("")}
              </table>
            </div>
            <div>
              <h3>قابلیت‌های کلیدی</h3>
              <ul>${p.highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join("")}</ul>
              <h3>کاربردها</h3>
              <ul>${p.applications.map((a) => `<li>${escapeHtml(a)}</li>`).join("")}</ul>
            </div>
          </div>
          <div class="card-foot">
            <span>کد محصول: ARKA-${String(index + 1).padStart(2, "0")}</span>
            <span>توان الکتریکی: ${escapeHtml(p.power)}</span>
            <span>${escapeHtml(COMPANY.latin)}</span>
          </div>
        </div>
      </section>`;
    })
    .join("");

  const cover = single
    ? ""
    : `
  <section class="cover">
    <div class="cover-grid">
      <div>
        <p class="eyebrow">ARKA COFFEE MACHINERY · PRODUCT CATALOG</p>
        <h1>تجهیزات صنعتی قهوه<br />از دانهٔ سبز تا بستهٔ نهایی</h1>
        <p class="cover-desc">رستور، آسیاب، عصاره‌گیری و بسته‌بندی؛ چهار گروه تجهیزات با مشخصات فنی مستند و امکان سفارشی‌سازی برای ظرفیت تولید شما.</p>
        <div class="cover-stats">
          <div><strong>${list.length}</strong><span>مدل تجهیزات</span></div>
          <div><strong>${CATEGORIES.length}</strong><span>گروه محصول</span></div>
          <div><strong>۱۴</strong><span>ماه گارانتی</span></div>
        </div>
      </div>
      <div class="cover-cats">
        ${CATEGORIES.map(
          (c, i) => `<div class="cover-cat"><span class="num">${String(i + 1).padStart(2, "0")}</span><div><strong>${escapeHtml(c.title)}</strong><em>${escapeHtml(c.latin)}</em></div></div>`,
        ).join("")}
      </div>
    </div>
    <img class="cover-img" src="${escapeHtml(image(products[0]?.image ?? "/images/hero-roastery.jpg"))}" alt="" />
  </section>`
  ;

  return `<!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(title)}</title>
<meta name="description" content="کاتالوگ فنی تجهیزات صنعتی قهوه آرکا: رستور، آسیاب، اسپرسو، استخراج و بسته‌بندی." />
<link rel="stylesheet" href="${escapeHtml(fontHref)}" />
<style>
  :root{--ink:#171009;--coal:#211710;--copper:#a46933;--copper-light:#c2874c;--paper:#f8f3ea;--paper2:#f1e8da;--line:#ddcdb8;--muted:#7a6652}
  *{box-sizing:border-box}
  @page{size:A4;margin:9mm 8mm}
  body{margin:0;background:#e9dfd0;color:var(--ink);font-family:"Vazirmatn",Tahoma,sans-serif;line-height:1.85;padding:26px;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .sheet{max-width:880px;margin:0 auto;background:var(--paper);padding:34px;border-top:6px solid var(--copper)}
  .sheet > .card:last-of-type{margin-bottom:0}
  header.top{display:flex;justify-content:space-between;align-items:flex-start;gap:20px;border-bottom:1px solid var(--line);padding-bottom:18px;margin-bottom:22px}
  .brand{margin:0;font-size:25px;font-weight:800;line-height:1.3}
  .brand span{display:block;font-family:"IBM Plex Mono",monospace;font-size:9px;letter-spacing:.24em;color:var(--copper);font-weight:500;margin-top:5px}
  .meta{margin:0;font-size:10.5px;color:var(--muted);text-align:left;line-height:2}
  .meta a{color:var(--ink);text-decoration:none}
  h1.page-title{font-size:18px;margin:0 0 18px;font-weight:800}
  .eyebrow{font-family:"IBM Plex Mono",monospace;font-size:9px;letter-spacing:.2em;color:var(--copper);margin:0 0 8px;text-transform:uppercase}
  /* cover */
  .cover{margin-bottom:24px;border:1px solid #2b1d13;background:var(--coal);color:var(--paper);overflow:hidden;page-break-inside:avoid}
  .cover-grid{display:grid;grid-template-columns:1.5fr 1fr;gap:26px;padding:26px}
  .cover h1{font-size:24px;line-height:1.6;margin:0 0 10px;font-weight:800}
  .cover-desc{font-size:11px;color:rgba(248,243,234,.6);margin:0;line-height:2}
  .cover-stats{display:flex;gap:22px;margin-top:20px;border-top:1px solid rgba(248,243,234,.15);padding-top:14px}
  .cover-stats div{display:flex;flex-direction:column}
  .cover-stats strong{font-family:"IBM Plex Mono",monospace;font-size:20px;color:var(--copper-light);font-weight:500;line-height:1.2}
  .cover-stats span{font-size:9px;color:rgba(248,243,234,.5);margin-top:3px}
  .cover-cats{display:flex;flex-direction:column;gap:6px}
  .cover-cat{display:flex;align-items:center;gap:8px;border:1px solid rgba(248,243,234,.14);padding:8px 10px;background:rgba(248,243,234,.04)}
  .cover-cat .num{font-family:"IBM Plex Mono",monospace;font-size:9px;color:var(--copper-light)}
  .cover-cat strong{display:block;font-size:10.5px;font-weight:700}
  .cover-cat em{display:block;font-style:normal;font-family:"IBM Plex Mono",monospace;font-size:7px;letter-spacing:.12em;color:rgba(248,243,234,.35);margin-top:1px}
  .cover-img{width:100%;height:190px;object-fit:cover;object-position:center 45%;display:block;border-top:1px solid rgba(248,243,234,.14)}
  /* product card */
  .card{display:grid;grid-template-columns:190px 1fr;background:#fffdf8;border:1px solid var(--line);margin-bottom:14px;page-break-inside:avoid;overflow:hidden}
  .card-media{position:relative;background:#e7dccb;min-height:100%}
  .card-media img{width:100%;height:100%;object-fit:cover;display:block;min-height:190px}
  .card-media .code{position:absolute;bottom:8px;right:8px;background:rgba(23,16,9,.72);color:#f8f3ea;font-family:"IBM Plex Mono",monospace;font-size:7px;letter-spacing:.1em;padding:3px 6px}
  .card-body{padding:16px 18px;min-width:0}
  .card-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;border-bottom:1px dashed var(--line);padding-bottom:9px;margin-bottom:10px}
  .latin{font-family:"IBM Plex Mono",monospace;font-size:8px;letter-spacing:.14em;color:var(--copper);margin:0 0 3px}
  .card h2{font-size:15.5px;margin:0 0 2px;font-weight:800;line-height:1.5}
  .cat{font-size:9.5px;color:var(--muted);margin:0}
  .cap{background:var(--ink);color:var(--paper);padding:6px 10px;text-align:center;min-width:105px;flex-shrink:0}
  .cap span{display:block;font-size:8px;color:var(--copper-light)}
  .cap strong{display:block;font-size:10px;font-weight:700;margin-top:2px}
  .desc{font-size:10px;line-height:1.95;color:#4a382a;margin:0 0 11px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
  .cols{display:grid;grid-template-columns:1.1fr .9fr;gap:18px}
  h3{font-size:9px;margin:0 0 5px;color:var(--copper);font-weight:700}
  table{width:100%;border-collapse:collapse;font-size:9px}
  td{border-bottom:1px solid #efe5d7;padding:3.5px 0;vertical-align:top}
  td:first-child{color:var(--muted);width:43%}
  td:last-child{font-weight:600}
  ul{margin:0 0 9px;padding-right:12px;font-size:9px;color:#4a382a}
  li{margin-bottom:2px;line-height:1.8}
  .card-foot{display:flex;justify-content:space-between;gap:8px;border-top:1px solid #efe5d7;margin-top:10px;padding-top:7px;font-family:"IBM Plex Mono",monospace;font-size:7px;color:#9a8878;letter-spacing:.02em}
  footer.doc{border-top:1px solid var(--line);margin-top:22px;padding-top:12px;font-size:9px;color:var(--muted);display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;line-height:1.9}
  footer.doc strong{color:var(--ink)}
  .print-note{display:none}
  @media print{
    html,body{background:#fff;padding:0;margin:0}
    .sheet{padding:0;border-top-width:0;max-width:none;background:#fff}
    .sheet::before{content:"آرکا صنعت قهوه · ARKA COFFEE MACHINERY · PRODUCT CATALOG";display:block;font-family:"IBM Plex Mono",monospace;font-size:7px;letter-spacing:.18em;color:#a46933;border-bottom:2px solid #171009;padding-bottom:5px;margin-bottom:10px}
    .card{break-inside:avoid;margin-bottom:9px}
    .cover,footer.doc{break-inside:avoid}
    a{color:inherit}
  }
  @media (max-width:640px){
    body{padding:10px}
    .sheet{padding:16px}
    .card{grid-template-columns:1fr}
    .card-media img{height:170px;min-height:0}
    .cover-grid{grid-template-columns:1fr}
    .cols{grid-template-columns:1fr}
    .cover-img{height:110px}
  }
</style>
</head>
<body>
  <div class="sheet">
    <header class="top">
      <div>
        <p class="brand">${escapeHtml(COMPANY.name)}<span>${escapeHtml(COMPANY.latin)}</span></p>
      </div>
      <p class="meta">
        تاریخ صدور: ${escapeHtml(date)}<br />
        <a href="https://arkacoffee.ir">www.arkacoffee.ir</a><br />
        <span dir="rtl">${escapeHtml(COMPANY.phone)}</span>
      </p>
    </header>
    <h1 class="page-title">${escapeHtml(title)}</h1>
    ${cover}
    ${cards}
    <footer class="doc">
      <span><strong>${escapeHtml(COMPANY.name)}</strong> — ${escapeHtml(COMPANY.address)}</span>
      <span dir="rtl">${escapeHtml(COMPANY.email)} · ${escapeHtml(COMPANY.phone)}</span>
    </footer>
  </div>
</body>
</html>`;
}

export function downloadBlob(filename: string, content: string, type = "text/html;charset=utf-8") {
  const blob = new Blob(["\ufeff", content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2500);
}

/** Downloads a file that is committed inside the repository. */
export function downloadStatic(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}
