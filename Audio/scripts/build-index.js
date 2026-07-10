#!/usr/bin/env node
/**
 * Scans the Audio folder and writes manifest.json + index.html file list.
 * Run from repo root: node Audio/scripts/build-index.js
 */

const fs = require('fs');
const path = require('path');

const AUDIO_DIR = path.join(__dirname, '..');
const MANIFEST_PATH = path.join(AUDIO_DIR, 'manifest.json');
const INDEX_PATH = path.join(AUDIO_DIR, 'index.html');

const AUDIO_EXT = new Set(['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac', '.webm']);
const TEXT_EXT = new Set(['.txt', '.vtt', '.srt']);

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(ms) {
  return new Date(ms).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function scanFiles(dir, relativeDir = '') {
  const audio = [];
  const transcripts = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'scripts') continue;

    const fullPath = path.join(dir, entry.name);
    const relPath = relativeDir ? `${relativeDir}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      const nested = scanFiles(fullPath, relPath);
      audio.push(...nested.audio);
      transcripts.push(...nested.transcripts);
      continue;
    }

    if (!entry.isFile()) continue;

    const ext = path.extname(entry.name).toLowerCase();
    const stat = fs.statSync(fullPath);
    const meta = {
      name: relPath,
      size: stat.size,
      sizeLabel: formatSize(stat.size),
      modified: stat.mtimeMs,
      modifiedLabel: formatDate(stat.mtimeMs),
    };

    if (AUDIO_EXT.has(ext)) audio.push(meta);
    else if (TEXT_EXT.has(ext)) transcripts.push(meta);
  }

  return { audio, transcripts };
}

function buildManifest() {
  const { audio, transcripts } = scanFiles(AUDIO_DIR);
  const byName = (a, b) => a.name.localeCompare(b.name);
  audio.sort(byName);
  transcripts.sort(byName);
  return { audio, transcripts, generatedAt: new Date().toISOString() };
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderIndex(manifest) {
  const audioItems =
    manifest.audio.length === 0
      ? '<p class="empty">No audio files yet. Add .mp3, .wav, .ogg, or .m4a files to this folder, then run <code>node Audio/scripts/build-index.js</code>.</p>'
      : manifest.audio
          .map(
            (file) => `
        <li class="file-card" data-type="audio">
          <div class="file-info">
            <strong>${escapeHtml(file.name)}</strong>
            <span class="meta">${file.sizeLabel} · ${file.modifiedLabel}</span>
          </div>
          <audio controls preload="metadata" src="${escapeHtml(file.name)}"></audio>
          <a class="download" href="${escapeHtml(file.name)}" download>Download</a>
        </li>`
          )
          .join('');

  const transcriptItems =
    manifest.transcripts.length === 0
      ? ''
      : manifest.transcripts
          .map(
            (file) => `
        <li class="file-card" data-type="transcript">
          <div class="file-info">
            <strong>${escapeHtml(file.name)}</strong>
            <span class="meta">${file.sizeLabel} · ${file.modifiedLabel}</span>
          </div>
          <a class="view" href="${escapeHtml(file.name)}" target="_blank" rel="noopener">View transcript</a>
          <a class="download" href="${escapeHtml(file.name)}" download>Download</a>
        </li>`
          )
          .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Audio Library</title>
  <style>
    :root {
      color-scheme: light dark;
      --bg: #0f1419;
      --surface: #1a2332;
      --border: #2d3a4f;
      --text: #e7ecf3;
      --muted: #8b9cb3;
      --accent: #5b9fd4;
      --accent-hover: #7ab8e8;
    }
    @media (prefers-color-scheme: light) {
      :root {
        --bg: #f4f6f9;
        --surface: #fff;
        --border: #d8dee9;
        --text: #1a2332;
        --muted: #5c6b7f;
        --accent: #2563eb;
        --accent-hover: #1d4ed8;
      }
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: system-ui, -apple-system, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.5;
      min-height: 100vh;
    }
    .wrap {
      max-width: 720px;
      margin: 0 auto;
      padding: 2rem 1.25rem 3rem;
    }
    h1 { margin: 0 0 0.35rem; font-size: 1.75rem; }
    .lead { color: var(--muted); margin: 0 0 2rem; }
    h2 {
      font-size: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--muted);
      margin: 0 0 1rem;
    }
    ul { list-style: none; padding: 0; margin: 0 0 2.5rem; display: grid; gap: 1rem; }
    .file-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1rem 1.15rem;
    }
    .file-info { margin-bottom: 0.75rem; }
    .file-info strong { display: block; word-break: break-all; }
    .meta { font-size: 0.85rem; color: var(--muted); }
    audio { width: 100%; margin-bottom: 0.5rem; }
    .download, .view {
      display: inline-block;
      font-size: 0.875rem;
      color: var(--accent);
      text-decoration: none;
      margin-right: 1rem;
    }
    .download:hover, .view:hover { color: var(--accent-hover); text-decoration: underline; }
    .empty { color: var(--muted); }
    .back { margin-top: 2rem; font-size: 0.9rem; }
    .back a { color: var(--accent); }
    footer { margin-top: 2rem; font-size: 0.8rem; color: var(--muted); }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>Audio Library</h1>
    <p class="lead">Files in this folder are served over HTTPS on GitHub Pages.</p>

    <h2>Audio</h2>
    <ul>${audioItems}</ul>

    ${
      manifest.transcripts.length
        ? `<h2>Transcripts</h2><ul>${transcriptItems}</ul>`
        : ''
    }

    <p class="back"><a href="../">← Back to projects</a></p>
    <footer>Updated ${escapeHtml(manifest.generatedAt)}</footer>
  </div>
</body>
</html>`;
}

const manifest = buildManifest();
fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
fs.writeFileSync(INDEX_PATH, renderIndex(manifest));

console.log(
  `Audio index built: ${manifest.audio.length} audio, ${manifest.transcripts.length} transcript(s)`
);
