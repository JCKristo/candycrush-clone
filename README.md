# Sugar Rush

A sweet match-3 puzzle game inspired by Candy Crush, built as an installable progressive web app (PWA). Swap candies, build striped, wrapped and rainbow specials, chain combos, and clear 10 levels of jelly, frosting and taffy.

It's a single static page with no build step and no dependencies, so it deploys to Vercel as-is.

## Features

- 10 hand-tuned levels with four goal types: reach a score, clear the jelly, collect candies, and break blockers
- Special candies: striped (match 4), wrapped (L or T shape) and the Rainbow Drop (match 5), plus combos when you swap two specials together
- Swipe or tap-tap controls, sized for phones
- Sound effects (Web Audio), vibration on Android, hints, automatic reshuffle
- Progress, stars and best scores saved on the device
- Installs to the home screen and plays offline

## Project layout

```
index.html              the whole game (HTML, CSS and JS in one file)
manifest.webmanifest    app name, colours and icons for installing
sw.js                   service worker: offline play and fast loading
icons/                  app icons (any, maskable, Apple touch icon, favicons)
vercel.json             headers for the service worker, manifest and icons
```

## Deploy to Vercel

1. In Vercel, choose **Add New → Project** and import this GitHub repo.
2. Leave **Framework Preset** as **Other**, with no build command and no output directory.
3. Click **Deploy**. Every push to `main` redeploys automatically.

Or from the command line: `npx vercel --prod` in this folder.

## Install it on your phone

PWAs need HTTPS, which your Vercel URL already has.

- **Android (Chrome):** open the site and tap **Install** on the level map, or use the browser menu → **Install app**.
- **iPhone / iPad (Safari):** tap **Install** on the level map for the steps: Share → **Add to Home Screen** → **Add**.

Once installed, it opens full-screen like a native app and works without a connection. Open it online once first, so the fonts get cached too.

## Run locally

Service workers need a real server (not `file://`):

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Updating the game

Edit `index.html` and push. The service worker fetches the page fresh whenever there's a connection, so installed copies update on their next launch. If you change the icons or the manifest, bump `VERSION` at the top of `sw.js` too.
