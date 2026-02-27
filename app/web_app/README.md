# Tasty Bytes - Web Application (Frontend)

React Single Page Application (SPA) for the Tasty Bytes recipe traffic predictor. 
Users submit recipe details; the app calls the ML backend API and displays **High** or **Low** traffic with a confidence chart.

## Tech Stack

- React 19, Create React App  
- Bootstrap 5, Bootstrap Icons, Lucide React  
- Chart.js (react-chartjs-2), AOS (animate on scroll)

> Note: Check package.json for more of the dependencies.

## Requirements

- **Node.js 18+** and npm (or yarn/pnpm)

## Setup

```bash
cd app/web_app
npm install
```

## Run (development)

```bash
npm start
```

- App: **http://localhost:3000**
- Expects API at **http://127.0.0.1:8000** (start the backend first).

## Build (production)

```bash
npm run build
```

Output: `build/`. Serve with any static host or reverse proxy. Configure the API base URL for production (e.g. env variable and `fetch` in `src/App.js`).

## Scripts

| Command | Description |
|--------|-------------|
| `npm start` | Dev server (port 3000) |
| `npm run build` | Production build |
| `npm test` | Run tests |
