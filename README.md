# Rabindranath Mahato — Portfolio

Source for the personal portfolio published with GitHub Pages.

## Contents

- `index.html` — portfolio sections and metadata
- `styles.css` — responsive layout and light/dark themes
- `script.js` — navigation, theme preference, and section behavior
- `404.html` — not-found page served by GitHub Pages
- `favicon.svg` — site icon
- `robots.txt` and `sitemap.xml` — crawler discovery files

The stylesheet, script, and favicon links use a small version query so browsers fetch refreshed assets after a deploy. Bump the version when those assets change.

## Preview locally

Open `index.html` in a browser or serve this directory with a local static web server.

## Quality checks

Run the repository checks before publishing a change:

~~~sh
python3 scripts/validate.py
~~~

GitHub Actions runs those structural/link checks and Lighthouse CI on pull requests and pushes to main. The automated checks cover the one-page structure, internal anchors, local asset references, accessible image alternatives, and safe new-tab links. Lighthouse adds accessibility, SEO, performance, and best-practices checks against the generated static page.

## Release checklist

- Verify factual claims, dates, role descriptions, and metrics are current.
- Link only sanitized, public work samples; do not publish employer, client, infrastructure, or credential secrets.
- Update sitemap.xml's lastmod date when page content changes.
- Bump the asset version query for any changed CSS, JavaScript, icon, or social image asset.
- Run the quality checks locally and confirm the GitHub Actions run is green before merging.
