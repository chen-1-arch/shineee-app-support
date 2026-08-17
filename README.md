# Shineee! Support Site

Public App Store support and privacy-policy pages for the Shineee! iPhone app.

- `/`, `/privacy.html`, `/terms.html`, and `/community.html`: Simplified Chinese support, privacy, terms, and community standards
- `/en/`, `/en/privacy.html`, `/en/terms.html`, and `/en/community.html`: English support, privacy, terms, and community standards

`content/` is the source of truth. `npm run build` generates both the worker bundle and the root static HTML used by GitHub Pages; do not edit the generated root pages independently.
