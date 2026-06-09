# Local Loop Bengaluru

A local-first prototype for discovering cafés, restaurants, bakeries, street food, and neighborhood institutions around Bengaluru. It now closely follows the warm, map-first Lovable reference design while keeping fully local sample data.

## What is included

- Vite + React + TypeScript app
- Leaflet map centered on Bengaluru
- Lovable-style fixed left sidebar with Map and Discover sections
- Warm translucent map filter chips for Local Gems, Institutions, Budget Eats, Cafes, Bakeries, Late Night, Vegetarian, and Street Food
- Preference toggles for laptop-friendly places and vegetarian-friendly options
- Lovable-inspired place sheet with hours, ambiance, price, tags, and best-for notes
- Neighborhood history snippets loaded from local JSON
- Sample place data stored locally with coordinates and personalization attributes

## Run locally

This project expects Node.js and npm to be installed.

```bash
cd "/Users/1903339/Library/Application Support/Clicky/projects/local-loop-bengaluru"
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal, usually `http://127.0.0.1:5173`.

## Build

```bash
npm run build
npm run preview
```

## Offline and local data notes

The app uses local JSON files for place and history content:

- `data/places.json` contains name, neighborhood, coordinates, category tags, price, hours, ambiance, vegetarian options, and coworking suitability.
- `data/history.json` contains short neighborhood context snippets.

The place data and app logic are local. The current map tiles load from OpenStreetMap while running. To make the map tiles fully offline too, replace the `TileLayer` in `src/main.tsx` with a locally hosted MBTiles/vector tile setup or a static raster tile folder.

## Where to add real data later

1. Add real places to `data/places.json` using the same fields.
2. Add neighborhood blurbs to `data/history.json`.
3. If using Google Maps, Zomato, Instagram curation pages, or manually curated sheets later, normalize the imported records into the same JSON shape before rendering.
4. Add richer personalization fields such as cuisine, crowd level, opening days, distance from metro, pet-friendly, alcohol, outdoor seating, and must-order items.

## Suggested next product steps

- Add search by place, neighborhood, cuisine, or mood.
- Add saved loops such as “Church Street coffee walk” or “Jayanagar budget crawl”.
- Add user notes and visit status stored in localStorage.
- Replace sample data with a curated Bengaluru dataset.
- Add optional clustering if the dataset grows beyond a few dozen places.
