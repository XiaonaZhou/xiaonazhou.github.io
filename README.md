# Xiaona Zhou — personal research website

A simple, responsive static website with large, high-contrast text and time-series artwork woven into the page. Content is based on `CV_Zhou.tex` (September 2026). The publication list includes six published works and the user-requested VisAnom preprint as its first entry. Other under-review submissions are excluded.

Public site: [xiaonazhou.github.io](https://xiaonazhou.github.io/)

## Preview

Open `index.html` directly, or run `python3 -m http.server 8000` from this directory and visit http://localhost:8000.

## Edit

- `index.html`: biography, research, experience, contact links.
- `script.js`: publications. Five entries appear initially; two more expand below.
- `signal.js`: one generative time-series pattern shared by the edge-to-edge hero illustration, the animated “time series” underline, and the section dividers. Hover or focus the inline research link or highlighted anomaly to emphasize the signal; activate either link to reach the time-series research section. The artwork is illustrative, not real telemetry or model output.
- `styles.css`: colors, typography, responsive layout. The page width follows the window, with side margins that scale from 20px to 96px. The introduction retains a readable text width. Body text is 20px; smaller text is at least 16px.
- `CV_Zhou.pdf`: the current downloadable CV. Replace it with future updates using the same filename.

Google Fonts are optional; system fallbacks work offline. Motion respects reduced-motion preferences and can be paused. Publication titles link to project pages or official publication records. See `FACT_CHECK.md` for the September 4, 2026 content audit and source-by-source verification limits.

## Publish

The site is published from the root of `XiaonaZhou/XiaonaZhou.github.io`. Keep `.nojekyll`, `index.html`, `styles.css`, `script.js`, `signal.js`, `favicon.svg`, and `CV_Zhou.pdf` together. No build step or backend is required. The LaTeX source and fact-check notes do not need to be published.
