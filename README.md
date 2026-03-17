# 🌍 WorldPulse — Real-Time Global Statistics Dashboard

> **⚠ Disclaimer:** This project is a replica of [Worldometer](https://www.worldometer.info), built solely for academic and educational purposes. It is not affiliated with, endorsed by, or connected to Worldometer.info in any way. All data rates are approximations based on publicly available figures from the UN, WHO, and World Bank.

---

## 📖 Overview

WorldPulse is a full-stack web application that displays real-time global statistics — population, health, environment, energy, economics, and more — with live-updating counters that animate every second in the browser. It is modelled after the Worldometer website and was developed as a student project to demonstrate real-time data rendering, REST API design, and modern frontend UI techniques.

---

## ✨ Features

- **44 live counters** across 8 global categories, updating every second
- **Left sidebar navigation** for filtering stats by category
- **Light theme, professional UI** built with Inter font and a clean card-based layout
- **Custom animated cursor** — glowing dot, outer ring, and motion trail
- **World Population hero counter** displayed prominently in both the sidebar and main header card
- **UTC live clock** in the top navigation bar
- **Disclaimer banner** clearly identifying the site as a student project replica
- **Responsive design** — sidebar collapses on mobile screens
- **JSON file-based database** — no external database required; runs out of the box
- **REST API** with endpoints for all stats, individual stats by key, and categories

---

## 🗂 Project Structure

```
worldpulse/
│
├── backend/
│   ├── server.js          # Express server — API routes and value computation
│   ├── database.js        # JSON file database initialiser and read/write helpers
│   ├── worldometer.json   # Auto-generated data store (44 stats, 8 categories)
│   └── package.json       # Node.js dependencies
│
└── frontend/
    └── index.html         # Single-file frontend — UI, styles, and JS tick engine
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v14 or higher
- npm (bundled with Node.js)

### Installation

**1. Clone or download the repository**

```bash
git clone https://github.com/your-username/worldpulse.git
cd worldpulse
```

**2. Install backend dependencies**

```bash
cd backend
npm install
```

**3. Start the server**

```bash
npm start
```

Or, for development with auto-restart on file changes:

```bash
npm run dev
```

> This requires `nodemon` installed globally: `npm install -g nodemon`

**4. Open the app**

Visit [http://localhost:3001](http://localhost:3001) in your browser.

The `worldometer.json` database file is created automatically on first run if it does not already exist.

---

## 🔌 API Reference

The backend exposes the following REST endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/stats` | Returns all categories with their stats and computed current values |
| `GET` | `/api/stats/:key` | Returns a single stat by its key (e.g. `world_population`) |
| `GET` | `/api/categories` | Returns all category metadata (id, name, icon, color) |
| `PUT` | `/api/stats/:key` | Updates `base_value` or `rate_per_second` for a given stat |

### Example response — `GET /api/stats/births_today`

```json
{
  "success": true,
  "server_time": 1710000000000,
  "data": {
    "id": 3,
    "category_id": 1,
    "key": "births_today",
    "label": "Births Today",
    "base_value": 0,
    "rate_per_second": 4.44,
    "direction": "up",
    "unit": "",
    "decimals": 0,
    "current_value": 192614
  }
}
```

---

## ⚙️ How the Live Counter Works

WorldPulse uses a two-layer approach to keep counters feeling live without overloading the server:

**Server side** — when an API request comes in, each stat's current value is computed on the fly:

```
current_value = base_value + (rate_per_second × seconds_elapsed_since_anchor)
```

The anchor point depends on the stat type:
- Stats labelled `_today` reset at **UTC midnight**
- Stats labelled `_this_year` reset at **1 January UTC**
- Static totals (e.g. world population) use a fixed reference date

**Client side** — the browser fetches fresh data every **30 seconds**, but runs a local tick loop every **1 second** that adds `rate_per_second` to each counter. This gives smooth, continuous animation between server syncs.

---

## 📊 Data Categories

| # | Category | Stats included |
|---|----------|----------------|
| 1 | 🌍 World Population | Total population, births, deaths, net growth |
| 2 | 💰 Government & Economics | Healthcare spend, education spend, military spend, cars/bikes/computers produced |
| 3 | 📱 Society & Media | Internet users, emails, tweets, Google searches, YouTube views, blog posts |
| 4 | 🌿 Environment | CO₂ emissions, forest loss, toxic chemicals released |
| 5 | 🌾 Food | Food produced, undernourished, overweight, obese populations |
| 6 | 💧 Water | Water consumed, water-related deaths, people without safe water |
| 7 | ⚡ Energy | Total energy used, solar energy, oil pumped, oil reserves remaining |
| 8 | ❤️ Health | Disease deaths, flu, cancer, HIV/AIDS, malaria, smoking, alcohol, suicide, malnutrition |

---

## 🎨 UI Design Notes

- **Theme:** Light, professional — white cards on a soft `#f0f4f8` page background
- **Font:** [Inter](https://fonts.google.com/specimen/Inter) (Google Fonts)
- **Accent colours:** Blue `#1a56db` for primary actions and values, Teal `#0694a2` for animated tick flashes
- **Layout:** Fixed header + disclaimer banner + 240px sidebar + fluid main content area
- **Cursor:** Custom animated cursor with a glowing dot, lagged outer ring, and radial gradient trail
- **Responsive:** Sidebar hides on screens narrower than 768px

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Server framework | Express.js |
| CORS | `cors` npm package |
| Database | JSON flat file (`worldometer.json`) |
| Frontend | Vanilla HTML, CSS, JavaScript (no framework) |
| Fonts | Google Fonts — Inter |

---

## 📝 Notes & Limitations

- All rate values are **estimates** derived from publicly available annual statistics and divided to a per-second rate. They are not sourced from a live data feed.
- The `worldometer.json` file is regenerated with default values if deleted.
- The `PUT /api/stats/:key` endpoint allows runtime adjustments to `base_value` and `rate_per_second` — changes persist to the JSON file.
- This project does **not** use a traditional database (SQLite, PostgreSQL, etc.) — it was intentionally built without native compilation dependencies for ease of setup.

---

## 📄 License

This project is for **educational and non-commercial use only**. All statistical data is sourced from publicly available reports by the United Nations, World Health Organization, and World Bank.

---

*Built as a student project · Not affiliated with Worldometer.info*
