# The Current — News & Digital Magazine

A responsive news/magazine website built for the Devloria Frontend Internship (Project 9).
Reference used for structure only: nytimes.com — all visual design (colors, type, layout) is original.

## Tech Stack
- HTML5
- CSS3 (Flexbox + Grid, CSS custom properties)
- Vanilla JavaScript (no frameworks, no build step)
- Data: local JSON dataset (`assets/data.json`), fetched at runtime — not hardcoded into the HTML

## Project Structure
```
the-current/
├── index.html          # Homepage — hero story, trending ticker, category grid, newsletter
├── article.html         # Article reading page — full content, pull quotes, related stories
├── README.md
└── assets/
    ├── style.css         # All styling and design tokens
    ├── script.js         # Fetches data.json and renders both pages
    └── data.json         # Article dataset (12 articles across 5 categories)
```

## Features
- Featured hero story on homepage
- Auto-scrolling trending ticker (signature "wire service" element)
- Category filter navigation (All / Politics / Tech / Sports / Business / Culture)
- Trending stories list
- Full article reading page with pull-quotes and related-article suggestions
- Newsletter sign-up with client-side email validation
- Fully responsive (mobile, tablet, desktop)
- Respects `prefers-reduced-motion`, visible keyboard focus states

## How to Run Locally
No build step or dependencies required.

1. Clone/download this folder.
2. Because the site fetches `assets/data.json` via `fetch()`, opening `index.html` directly as a `file://` URL will fail in some browsers due to CORS. Run a simple local server instead:
   ```bash
   # Python
   python3 -m http.server 8000

   # or Node
   npx serve .
   ```
3. Open `http://localhost:8000` in your browser.

## Deployment
Deployed as a static site on Netlify — no server-side code required, since all data is client-side JSON.

**Live URL:** https://jolly-bombolone-c938f6.netlify.app/

## Notes
- All 12 articles are original written content, not scraped or copied from any real publication.
- Design direction: ink-navy background, amber accent, color-coded category tags, serif display type paired with a monospace "wire service" byline treatment.
