// server.js — Worldometer clone backend (JSON database version)
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const { initDB, getDB, saveDB } = require('./database');

const app  = express();
const PORT = process.env.PORT || 3001;

// Initialize DB on startup
initDB();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ── Helper: compute current value ─────────────────────────────────
function computeCurrentValue(stat) {
  const now = Date.now() / 1000;
  const d   = new Date();
  let anchorSec;

  if (stat.key.includes('today')) {
    const midnight = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    anchorSec = midnight.getTime() / 1000;
  } else if (stat.key.includes('this_year') || stat.key.includes('year')) {
    const jan1 = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    anchorSec = jan1.getTime() / 1000;
  } else {
    anchorSec = new Date('2024-01-01T00:00:00Z').getTime() / 1000;
  }

  const elapsed = now - anchorSec;
  return Math.max(0, stat.base_value + stat.rate_per_second * elapsed);
}

// ── GET /api/stats ─────────────────────────────────────────────────
app.get('/api/stats', (req, res) => {
  const db = getDB();

  const result = db.categories
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(cat => ({
      ...cat,
      stats: db.stats
        .filter(s => s.category_id === cat.id)
        .map(stat => ({ ...stat, current_value: computeCurrentValue(stat) }))
    }));

  res.json({ success: true, server_time: Date.now(), data: result });
});

// ── GET /api/stats/:key ────────────────────────────────────────────
app.get('/api/stats/:key', (req, res) => {
  const db   = getDB();
  const stat = db.stats.find(s => s.key === req.params.key);
  if (!stat) return res.status(404).json({ success: false, error: 'Stat not found' });
  res.json({ success: true, server_time: Date.now(), data: { ...stat, current_value: computeCurrentValue(stat) } });
});

// ── GET /api/categories ────────────────────────────────────────────
app.get('/api/categories', (req, res) => {
  const db = getDB();
  res.json({ success: true, data: db.categories });
});

// ── PUT /api/stats/:key ────────────────────────────────────────────
app.put('/api/stats/:key', (req, res) => {
  const db   = getDB();
  const idx  = db.stats.findIndex(s => s.key === req.params.key);
  if (idx === -1) return res.status(404).json({ success: false, error: 'Stat not found' });

  const { base_value, rate_per_second } = req.body;
  if (base_value       !== undefined) db.stats[idx].base_value       = base_value;
  if (rate_per_second  !== undefined) db.stats[idx].rate_per_second  = rate_per_second;

  saveDB(db);
  res.json({ success: true, message: 'Updated' });
});

// Fallback to frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🌍 WorldPulse running on http://localhost:${PORT}`);
  console.log(`   Open this URL in your browser!\n`);
});