# 🌙 SleepSense AI

> AI-powered sleep quality analysis — enter your habits, get your score.

![SleepSense AI](https://img.shields.io/badge/SleepSense-AI-7c3aed?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![Flask](https://img.shields.io/badge/Flask-3.0-blue?style=flat-square&logo=flask)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat-square&logo=tailwindcss)

---

## 📁 Folder Structure

```
sleepsense-ai/
├── frontend/          # Next.js + Tailwind CSS
│   ├── app/
│   │   ├── page.tsx          # Landing page (hero + how-it-works)
│   │   ├── analyze/page.tsx  # Sleep analysis form (5 fields)
│   │   ├── results/page.tsx  # Score + insights results page
│   │   ├── layout.tsx        # Root layout with ambient background
│   │   └── globals.css       # Global styles + glass morphism
│   ├── package.json
│   ├── tailwind.config.js
│   ├── next.config.js
│   └── vercel.json
│
└── backend/           # Flask REST API
    ├── app.py              # POST /predict endpoint + scoring logic
    ├── requirements.txt
    └── render.yaml         # Render deployment config
```

---

## 🚀 Quick Start

### Backend (Flask)

```bash
cd backend
pip install -r requirements.txt
python app.py
# Runs at http://localhost:5000
```

**Test the API:**
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "sleep_duration": "5",
    "bedtime": "01:00",
    "screen_time": "90",
    "stress_level": "high",
    "caffeine_intake": "4"
  }'
```

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
# Runs at http://localhost:3000
```

> **Note:** The frontend has a built-in client-side fallback. Even if the Flask backend is not running, the app will compute the score locally — perfect for development!

---

## 🌐 Deployment

### Frontend → Vercel

1. Push the `frontend/` folder to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Set **Root Directory** to `frontend`
4. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL` = `https://your-app.onrender.com`
5. Deploy!

### Backend → Render

1. Push the `backend/` folder to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Select the repo, set **Root Directory** to `backend`
4. Build command: `pip install -r requirements.txt`
5. Start command: `gunicorn app:app`
6. Deploy!

---

## 🧠 Sleep Score Logic

| Factor | Condition | Points Deducted |
|--------|-----------|----------------|
| Sleep Duration | < 5 hours | -30 |
| Sleep Duration | 5–6 hours | -20 |
| Sleep Duration | 6–7 hours | -10 |
| Bedtime | After midnight (00:00–05:00) | -20 |
| Bedtime | After 23:00 | -10 |
| Screen Time | > 120 minutes | -20 |
| Screen Time | 60–120 minutes | -12 |
| Screen Time | 30–60 minutes | -6 |
| Stress Level | High | -20 |
| Stress Level | Medium | -10 |
| Caffeine | > 5 cups | -15 |
| Caffeine | 3–5 cups | -10 |
| Caffeine | 1–3 cups | -3 |

### Risk Levels

| Score | Level | Emoji |
|-------|-------|-------|
| 80–100 | Excellent Sleep | 😴 |
| 55–79 | Moderate Sleep | ⚠️ |
| 0–54 | Poor Sleep | 🚨 |

---

## 🎨 Features

- **Dark theme** with deep navy/purple palette
- **Glassmorphism** cards with blur effects
- **Animated score ring** (SVG-based, CSS animated)
- **Starfield background** via CSS radial gradients
- **Fully responsive** (mobile-first)
- **Client-side fallback** — works without backend
- **Score breakdown** panel showing deduction reasons
- **Syne + DM Sans** font pairing for premium feel

---

## 📡 API Reference

### `POST /predict`

**Request body:**
```json
{
  "sleep_duration": "7",       // float, hours
  "bedtime": "22:30",          // string, HH:MM
  "screen_time": "45",         // int, minutes
  "stress_level": "medium",    // "low" | "medium" | "high"
  "caffeine_intake": "2"       // int, cups per day
}
```

**Response:**
```json
{
  "score": 78,
  "risk_level": "Moderate Sleep",
  "risk_emoji": "⚠️",
  "risk_color": "yellow",
  "suggestions": [
    "📱 Reduce screen exposure before bed.",
    "🌿 Keep a consistent sleep-wake schedule."
  ],
  "deductions": [
    ["Screen Time", -12],
    ["Moderate Stress", -10]
  ]
}
```

### `GET /health`
Returns `{ "status": "ok", "service": "SleepSense AI API" }`

---

Built with ❤️ using Next.js, Tailwind CSS, and Flask.
