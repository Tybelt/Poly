# Copyflow Dashboard

Deployable frontend package for your public Polymarket Copyflow dashboard.

## What is included
- Clean React/Vite dashboard UI
- Your llama logo in the header
- Refresh button + last updated timestamp
- Top 10 wallet table and trust trend lines
- Market mix, ingestion volume, freshness, recent trades, and core table views
- Dockerfile for Coolify deployment

## Local development
```bash
npm install
npm run dev
```

The dev server will run on:
```text
http://localhost:3000
```

## Production build
```bash
npm install
npm run build
npm run preview
```

## Coolify deployment
### Recommended first deployment
Use this as a frontend-only app with mock data first.

### In Coolify
- Create a new Application from a Git repo
- Build method: Dockerfile
- Internal port: `80`
- Leave domain blank
- Add a host port mapping like `8080:80`

Then visit:
```text
http://YOUR_SERVER_IP:8080
```

For your VPS, that would be:
```text
http://45.77.111.121:8080
```

## Suggested repo structure
```text
copyflow-dashboard/
  public/logo.png
  src/App.jsx
  src/main.jsx
  src/styles.css
  Dockerfile
  nginx.conf
  package.json
  vite.config.js
```

## Next step after UI deployment
Wire the frontend to a read-only API and replace the demo arrays in `src/App.jsx` with live fetches.

A clean pattern is:
- `/api/summary`
- `/api/top-wallets`
- `/api/trust-trends`
- `/api/recent-trades`
- `/api/market-mix`

## Notes
This package currently uses demo data. The refresh button updates the timestamp now and can later trigger a real API reload.
