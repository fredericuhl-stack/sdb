// Zeigt ein PDF direkt im Browser an (pdf.js rendert jede Seite als Bild).
// Funktioniert auf iPhone und Android, ohne dass etwas heruntergeladen wird.
(function () {
  const root = document.getElementById('pages');
  const status = document.getElementById('status');
  const url = root.dataset.pdf;
  const lib = window.pdfjsLib;
  lib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  let doc = null;
  let lastWidth = 0;

  async function render() {
    const width = root.clientWidth;
    if (!doc || Math.abs(width - lastWidth) < 20) return;
    lastWidth = width;
    // etwas höher als Bildschirmauflösung, damit Text beim Reinzoomen scharf bleibt
    const dpr = Math.min((window.devicePixelRatio || 1) * 1.5, 4);
    root.innerHTML = '';
    for (let n = 1; n <= doc.numPages; n++) {
      const page = await doc.getPage(n);
      const base = page.getViewport({ scale: 1 });
      const scale = width / base.width;
      const vp = page.getViewport({ scale: scale * dpr });
      const canvas = document.createElement('canvas');
      canvas.width = Math.floor(vp.width);
      canvas.height = Math.floor(vp.height);
      canvas.style.width = width + 'px';
      canvas.style.height = Math.floor(base.height * scale) + 'px';
      canvas.setAttribute('aria-label', 'Seite ' + n + ' von ' + doc.numPages);
      root.appendChild(canvas);
      await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
    }
  }

  lib.getDocument(url).promise.then(d => {
    doc = d;
    status.remove();
    render();
    let t;
    window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(render, 250); });
  }).catch(() => {
    status.innerHTML = 'Das Datenblatt konnte nicht angezeigt werden. <a href="' + url + '">PDF direkt öffnen</a>';
  });
})();
