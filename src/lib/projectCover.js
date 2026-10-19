// Generates a clean cover card for a project until a real screenshot is uploaded.
const wrap = (text, max = 16) => {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  words.forEach((w) => {
    if ((line + ' ' + w).trim().length > max && line) { lines.push(line); line = w; }
    else line = (line + ' ' + w).trim();
  });
  if (line) lines.push(line);
  return lines.slice(0, 3);
};
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

export function projectCover(project) {
  if (project.image) return project.image;
  const lines = wrap(project.name);
  const text = lines
    .map((l, i) => `<text x="44" y="${400 + i * 62}" font-family="Georgia, serif" font-style="italic" font-size="52" fill="#FAF9F6">${esc(l)}</text>`)
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
<rect width="600" height="600" fill="#141210"/>
<rect x="0" y="0" width="600" height="6" fill="#C2622D"/>
<text x="44" y="190" font-family="Georgia, serif" font-style="italic" font-size="150" fill="#C2622D">${esc(project.index)}</text>
${text}
<text x="44" y="556" font-family="monospace" font-size="20" letter-spacing="3" fill="#A8A49E">${esc((project.badge || '').toUpperCase())}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
