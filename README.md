# 🍜 Pin-Reel

A simple Next.js app to visualize saved food places from Instagram Reels using Google Maps.

## 🚀 Features

- See food places you've saved on a map
- Click markers to open their Instagram Reel
- Add/edit locations using a JSON file (`data/places.json`)

## 🧑‍💻 Getting Started

1. Clone the repo:
   ```bash
   git clone https://github.com/yourusername/insta-map.git
   cd insta-map
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

   Add your Google Maps API Key to it.

4. Run the dev server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## ✍️ Data Format

Update your saved places in `data/places.json`:

```json
[
  {
    "name": "Joe's Pizza NYC",
    "lat": 40.73061,
    "lng": -73.935242,
    "reel": "https://www.instagram.com/reel/XYZ123/"
  }
]
```

## 📦 Build & Deploy

```bash
npm run build
npm start
```

## ✅ Coming Soon

- Paste in a Reel URL → auto-extract location
- Move data to a database

---

MIT License
