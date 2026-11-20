// Erzeugt für jedes Produkt aus produkte.json eine Anzeigeseite unter <slug>/index.html
// und eine Übersicht index.html.   Aufruf:  node build.js
const fs = require('fs');
const path = require('path');
const here = __dirname;
const produkte = JSON.parse(fs.readFileSync(path.join(here, 'produkte.json'), 'utf8'));

// Jede PDF im Ordner pdf/, die noch nicht in produkte.json steht, bekommt automatisch
// eine Seite: Adresse = Dateiname ohne .pdf, Name = Dateiname. In produkte.json kann man
// sie danach jederzeit schöner benennen (Marke, Name, Stand, kürzere Adresse).
const bekannt = new Set(produkte.map(p => p.pdf));
for (const f of fs.readdirSync(path.join(here, 'pdf')).filter(f => /\.pdf$/i.test(f)).sort()) {
  if (bekannt.has(f)) continue;
  const slug = f.replace(/\.pdf$/i, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  produkte.push({ slug, marke: '', name: f.replace(/\.pdf$/i, '').replace(/[-_]+/g, ' '), pdf: f, stand: '' });
  console.log('neu (automatisch):', f, '->', slug + '/');
}
for (const p of produkte) {
  if (!fs.existsSync(path.join(here, 'pdf', p.pdf))) throw new Error('PDF fehlt: pdf/' + p.pdf);
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const CSS = `
:root{--bg:#f4f3f1;--fg:#111;--muted:#666;--card:#fff;--line:#ddd}
@media (prefers-color-scheme:dark){:root{--bg:#161616;--fg:#f2f2f2;--muted:#9a9a9a;--card:#222;--line:#333}}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--fg);font:16px/1.4 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
header{position:sticky;top:0;z-index:1;background:var(--card);border-bottom:1px solid var(--line);padding:12px 16px;display:flex;gap:12px;align-items:center}
header .t{flex:1;min-width:0}
.brand{font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}
h1{font-size:18px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sub{font-size:12px;color:var(--muted)}
.btn{flex:none;font-size:14px;font-weight:600;color:var(--fg);text-decoration:none;border:1px solid var(--line);border-radius:8px;padding:8px 12px;background:var(--bg)}
main{max-width:900px;margin:0 auto;padding:12px}
#pages canvas{display:block;background:#fff;margin:0 auto 12px;box-shadow:0 1px 4px rgba(0,0,0,.2)}
#status{padding:40px 16px;text-align:center;color:var(--muted)}
#status a{color:inherit}
ul{list-style:none}
li a{display:block;background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px 16px;margin-bottom:10px;color:var(--fg);text-decoration:none}
`;

const PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';

function seite(p) {
  const pdf = `../pdf/${p.pdf}`;
  return `<!doctype html>
<html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>SDB ${esc(p.name)}</title>
<style>${CSS}</style></head>
<body>
<header>
  <div class="t">
    <div class="brand">${esc(p.marke)}</div>
    <h1>${esc(p.name)}</h1>
    <div class="sub">Sicherheitsdatenblatt${p.stand ? ' · Stand ' + esc(p.stand) : ''}</div>
  </div>
  <a class="btn" href="${pdf}" download>PDF</a>
</header>
<main>
  <div id="status">Datenblatt wird geladen …</div>
  <div id="pages" data-pdf="${pdf}"></div>
</main>
<script src="${PDFJS}"></script>
<script src="../viewer.js"></script>
</body></html>
`;
}

for (const p of produkte) {
  fs.mkdirSync(path.join(here, p.slug), { recursive: true });
  fs.writeFileSync(path.join(here, p.slug, 'index.html'), seite(p));
}

const liste = produkte.map(p =>
  `<li><a href="${p.slug}/"><div class="brand">${esc(p.marke)}</div><b>${esc(p.name)}</b></a></li>`).join('\n');
fs.writeFileSync(path.join(here, 'index.html'), `<!doctype html>
<html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Sicherheitsdatenblätter</title>
<style>${CSS}</style></head>
<body>
<header><div class="t"><h1>Sicherheitsdatenblätter</h1></div></header>
<main><ul>
${liste}
</ul></main>
</body></html>
`);
fs.writeFileSync(path.join(here, '.nojekyll'), '');
console.log('ok:', produkte.map(p => p.slug).join(', '));
