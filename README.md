# Shineee! Support Site

Public App Store support and privacy-policy pages for the Shineee! iPhone app.

- `/`, `/privacy.html`, `/terms.html`, and `/community.html`: Simplified Chinese support, privacy, terms, and community standards
- `/en/`, `/en/privacy.html`, `/en/terms.html`, and `/en/community.html`: English support, privacy, terms, and community standards
- `/apple-app-site-association` and `/.well-known/apple-app-site-association`: legacy-compatible Universal Link association for `TDTSZ5CHYS.com.chenhaijia.CalorieTracker`; the current client no longer ships the former WeChat Associated Domains entitlement
- `/wechat/`: legacy WeChat fallback route kept to avoid breaking old links; WeChat login is abandoned and this route is not an active sign-in path

`content/` is the source of truth. `npm run build` generates both the worker bundle and the root static HTML used by GitHub Pages; do not edit the generated root pages independently.
